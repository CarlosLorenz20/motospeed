const logger = require('../utils/logger');

/**
 * Middleware para manejar errores 404 (ruta no encontrada)
 */
const notFound = (req, res, next) => {
  const error = new Error(`Ruta no encontrada - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Middleware global para manejar errores
 */
const errorHandler = (err, req, res, next) => {
  // Log del error
  logger.error('Error capturado:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method
  });

  // Determinar código de estado
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Respuesta de error
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack
    })
  });
};

/**
 * Middleware para manejar errores de validación de Sequelize
 */
const sequelizeErrorHandler = (err, req, res, next) => {
  // Error de validación de Sequelize
  if (err.name === 'SequelizeValidationError') {
    const messages = err.errors.map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors: messages
    });
  }

  // Error de constraint único de Sequelize
  if (err.name === 'SequelizeUniqueConstraintError') {
    const field = err.errors[0]?.path || 'campo';
    return res.status(400).json({
      success: false,
      message: `El ${field} ya está en uso`
    });
  }

  // Error de foreign key de Sequelize
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      success: false,
      message: 'Referencia a un registro que no existe'
    });
  }

  // Error de conexión a base de datos
  if (err.name === 'SequelizeConnectionError') {
    return res.status(503).json({
      success: false,
      message: 'Error de conexión a la base de datos'
    });
  }

  // Pasar al siguiente handler si no es error de Sequelize
  next(err);
};

module.exports = {
  notFound,
  errorHandler,
  sequelizeErrorHandler
};

/**
 * Utilidades para respuestas HTTP estandarizadas
 */

/**
 * Respuesta exitosa
 */
const successResponse = (res, data = null, message = 'Operación exitosa', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

/**
 * Respuesta de error
 */
const errorResponse = (res, message = 'Error interno del servidor', statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

/**
 * Respuesta paginada
 */
const paginatedResponse = (res, result, message = 'Datos obtenidos exitosamente') => {
  return res.status(200).json({
    success: true,
    message,
    data: result.data,
    pagination: result.pagination
  });
};

/**
 * Respuesta de creación exitosa
 */
const createdResponse = (res, data, message = 'Recurso creado exitosamente') => {
  return successResponse(res, data, message, 201);
};

/**
 * Respuesta sin contenido (para DELETE)
 */
const noContentResponse = (res) => {
  return res.status(204).send();
};

/**
 * Respuesta de validación fallida
 */
const validationErrorResponse = (res, errors) => {
  return errorResponse(res, 'Error de validación', 400, errors);
};

/**
 * Respuesta no autorizado
 */
const unauthorizedResponse = (res, message = 'No autorizado') => {
  return errorResponse(res, message, 401);
};

/**
 * Respuesta prohibido
 */
const forbiddenResponse = (res, message = 'Acceso denegado') => {
  return errorResponse(res, message, 403);
};

/**
 * Respuesta no encontrado
 */
const notFoundResponse = (res, message = 'Recurso no encontrado') => {
  return errorResponse(res, message, 404);
};

module.exports = {
  successResponse,
  errorResponse,
  paginatedResponse,
  createdResponse,
  noContentResponse,
  validationErrorResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse
};

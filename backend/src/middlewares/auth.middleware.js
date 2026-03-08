const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { errorResponse } = require('../utils/response');

/**
 * Middleware para verificar autenticación JWT
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Token de acceso no proporcionado', 401);
    }

    const token = authHeader.split(' ')[1];
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
    
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return errorResponse(res, 'Usuario no encontrado', 401);
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Token expirado', 401);
    }
    if (error.name === 'JsonWebTokenError') {
      return errorResponse(res, 'Token inválido', 401);
    }
    return errorResponse(res, 'Error de autenticación', 500);
  }
};

/**
 * Middleware opcional de autenticación
 * No falla si no hay token, pero agrega el usuario si existe
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }

    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
      const user = await User.findByPk(decoded.id);
      
      if (user) {
        req.user = {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name
        };
      } else {
        req.user = null;
      }
    } catch (tokenError) {
      req.user = null;
    }
    
    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

/**
 * Middleware para verificar rol de administrador
 */
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return errorResponse(res, 'Autenticación requerida', 401);
  }
  
  if (req.user.role !== 'admin') {
    return errorResponse(res, 'Acceso denegado. Se requiere rol de administrador', 403);
  }
  
  next();
};

/**
 * Middleware para verificar rol de cliente
 */
const isClient = (req, res, next) => {
  if (!req.user) {
    return errorResponse(res, 'Autenticación requerida', 401);
  }
  
  if (req.user.role !== 'cliente' && req.user.role !== 'admin') {
    return errorResponse(res, 'Acceso denegado', 403);
  }
  
  next();
};

module.exports = {
  authenticate,
  optionalAuth,
  isAdmin,
  isClient
};

const authService = require('../services/auth.service');
const emailService = require('../services/email.service');
const logger = require('../utils/logger');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * Registro de usuario
 */
const register = async (req, res) => {
  try {
    const { name, email, password, telefono } = req.body;

    if (!name || !email || !password) {
      return errorResponse(res, 'Nombre, email y contraseña son requeridos', 400);
    }

    const result = await authService.register({ name, email, password, telefono });
    
    // Enviar email de bienvenida (no bloqueante)
    emailService.sendWelcomeEmail(email, {
      userName: name,
      userEmail: email
    }).then(emailResult => {
      if (emailResult.success) {
        logger.success(`Email de bienvenida enviado a ${email}`);
      } else {
        logger.warn(`No se pudo enviar email de bienvenida a ${email}: ${emailResult.error}`);
      }
    }).catch(err => {
      logger.warn(`Error enviando email de bienvenida: ${err.message}`);
    });
    
    return successResponse(res, result, 'Usuario registrado exitosamente', 201);
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

/**
 * Login de usuario
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 'Email y contraseña son requeridos', 400);
    }

    const result = await authService.login(email, password);
    
    return successResponse(res, result, 'Login exitoso');
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

/**
 * Obtener perfil del usuario autenticado
 */
const getProfile = async (req, res) => {
  try {
    const user = await authService.getProfile(req.user.id);
    
    return successResponse(res, { user }, 'Perfil obtenido exitosamente');
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

/**
 * Actualizar perfil del usuario
 */
const updateProfile = async (req, res) => {
  try {
    const { name, telefono, avatar } = req.body;
    
    const user = await authService.updateProfile(req.user.id, { name, telefono, avatar });
    
    return successResponse(res, { user }, 'Perfil actualizado exitosamente');
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

/**
 * Cambiar contraseña
 */
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return errorResponse(res, 'Contraseña actual y nueva son requeridas', 400);
    }

    await authService.changePassword(req.user.id, currentPassword, newPassword);
    
    return successResponse(res, null, 'Contraseña actualizada exitosamente');
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

/**
 * Login / registro con Google
 */
const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return errorResponse(res, 'Token de Google requerido', 400);
    }
    const result = await authService.googleLogin(token);
    return successResponse(res, result, 'Login con Google exitoso');
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

/**
 * Promover usuario a admin con clave secreta
 */
const makeAdmin = async (req, res) => {
  try {
    const { email, secret } = req.body;
    const ADMIN_SECRET = process.env.ADMIN_SECRET || 'MotoSpeed@Admin2026';

    if (!email || !secret) {
      return errorResponse(res, 'Email y clave secreta son requeridos', 400);
    }
    if (secret !== ADMIN_SECRET) {
      return errorResponse(res, 'Clave de activación inválida', 403);
    }

    const User = require('../models/User');
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return errorResponse(res, 'Usuario no encontrado', 404);
    }
    await user.update({ role: 'admin' });
    return successResponse(res, { email: user.email, role: 'admin' }, 'Usuario promovido a administrador');
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  makeAdmin,
  googleAuth
};

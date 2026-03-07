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

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword
};

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User } = require('../models');

class AuthService {
  /**
   * Registrar nuevo usuario
   */
  async register({ name, email, password, telefono }) {
    // Verificar si el email ya existe
    const existingUser = await User.findOne({ where: { email } });
    
    if (existingUser) {
      const error = new Error('El email ya está registrado');
      error.statusCode = 400;
      throw error;
    }

    // Crear usuario
    const user = await User.create({
      name,
      email,
      password,
      telefono,
      role: 'cliente'
    });

    // Generar token
    const token = this.generateToken(user);

    return {
      user: user.toPublicJSON(),
      token
    };
  }

  /**
   * Login de usuario
   */
  async login(email, password) {
    // Buscar usuario por email
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      const error = new Error('Credenciales inválidas');
      error.statusCode = 401;
      throw error;
    }

    // Verificar contraseña
    const isValidPassword = await user.comparePassword(password);
    
    if (!isValidPassword) {
      const error = new Error('Credenciales inválidas');
      error.statusCode = 401;
      throw error;
    }

    // Generar token
    const token = this.generateToken(user);

    return {
      user: user.toPublicJSON(),
      token
    };
  }

  /**
   * Obtener perfil de usuario
   */
  async getProfile(userId) {
    const user = await User.findByPk(userId);
    
    if (!user) {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    }

    return user.toPublicJSON();
  }

  /**
   * Actualizar perfil de usuario
   */
  async updateProfile(userId, data) {
    const user = await User.findByPk(userId);
    
    if (!user) {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    }

    // Solo actualizar campos permitidos
    const allowedFields = ['name', 'telefono', 'avatar'];
    const updateData = {};
    
    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updateData[field] = data[field];
      }
    }

    await user.update(updateData);

    return user.toPublicJSON();
  }

  /**
   * Cambiar contraseña
   */
  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findByPk(userId);
    
    if (!user) {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    }

    // Verificar contraseña actual
    const isValidPassword = await user.comparePassword(currentPassword);
    
    if (!isValidPassword) {
      const error = new Error('Contraseña actual incorrecta');
      error.statusCode = 400;
      throw error;
    }

    // Actualizar contraseña
    user.password = newPassword;
    await user.save();

    return true;
  }

  /**
   * Login / registro con Google
   */
  async googleLogin(accessToken) {
    // Verificar el access_token llamando al endpoint userinfo de Google
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!response.ok) {
      const error = new Error('Token de Google inválido o expirado');
      error.statusCode = 401;
      throw error;
    }

    const { email, name, picture } = await response.json();

    if (!email) {
      const error = new Error('No se pudo obtener el email de Google');
      error.statusCode = 400;
      throw error;
    }

    // Buscar o crear usuario
    let user = await User.findOne({ where: { email } });

    if (!user) {
      const randomPassword = crypto.randomBytes(32).toString('hex');
      user = await User.create({
        name: name || email.split('@')[0],
        email,
        password: randomPassword,
        avatar: picture || null,
        role: 'cliente'
      });
    } else if (picture && !user.avatar) {
      await user.update({ avatar: picture });
    }

    const token = this.generateToken(user);
    return { user: user.toPublicJSON(), token };
  }

  /**
   * Generar token JWT
   */
  generateToken(user) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET || 'secret_key',
      {
        expiresIn: '30m' // 30 minutos de sesión
      }
    );
  }
}

module.exports = new AuthService();

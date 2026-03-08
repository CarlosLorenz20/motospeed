const jwt = require('jsonwebtoken');
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

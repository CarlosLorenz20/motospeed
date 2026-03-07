const { sequelize } = require('../config/db');
const User = require('./User');
const Category = require('./Category');
const Product = require('./Product');
const Order = require('./Order');

// Definir relaciones

// Category - Product (1:N)
Category.hasMany(Product, {
  foreignKey: 'category_id',
  as: 'products'
});
Product.belongsTo(Category, {
  foreignKey: 'category_id',
  as: 'category'
});

// User - Order (1:N)
User.hasMany(Order, {
  foreignKey: 'user_id',
  as: 'orders'
});
Order.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

// Product - Order (1:N)
Product.hasMany(Order, {
  foreignKey: 'product_id',
  as: 'orders'
});
Order.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product'
});

// Sincronizar modelos
const syncModels = async (options = {}) => {
  try {
    // alter: true actualiza las tablas sin perder datos
    // force: true elimina y recrea (peligroso - no usar en producción)
    await sequelize.sync(options);
    console.log('✅ Modelos sincronizados correctamente');
  } catch (error) {
    console.error('❌ Error al sincronizar modelos:', error.message);
    // En producción, no fallar si hay error de sync
    if (process.env.NODE_ENV !== 'production') {
      throw error;
    }
  }
};

module.exports = {
  sequelize,
  User,
  Category,
  Product,
  Order,
  syncModels
};

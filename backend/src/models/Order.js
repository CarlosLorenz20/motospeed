const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  product_id: {
    type: DataTypes.BIGINT,
    allowNull: true,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1
    }
  },
  mp_preference_id: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  mp_payment_id: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  mp_merchant_order_id: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  mp_payment_type: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'pending',
    validate: {
      isIn: [['pending', 'approved', 'in_process', 'rejected', 'cancelled', 'refunded']]
    }
  },
  amount: {
    type: DataTypes.BIGINT,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  currency: {
    type: DataTypes.CHAR(3),
    allowNull: false,
    defaultValue: 'CLP'
  },
  buyer_name: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  buyer_email: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  buyer_phone: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true
  },
  email_sent: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'orders',
  timestamps: true
});

// Método para verificar si el pago está completado
Order.prototype.isPaid = function() {
  return this.status === 'approved';
};

// Método para verificar si se puede cancelar
Order.prototype.canCancel = function() {
  return ['pending', 'in_process'].includes(this.status);
};

// Estados de Mercado Pago
Order.MP_STATUSES = {
  PENDING: 'pending',
  APPROVED: 'approved',
  IN_PROCESS: 'in_process',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded'
};

module.exports = Order;

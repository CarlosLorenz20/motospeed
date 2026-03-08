const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  category_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: 'categories',
      key: 'id'
    }
  },
  nombre: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  sku: {
    type: DataTypes.STRING(255),
    allowNull: true,
    unique: true
  },
  precio: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  precio_oferta: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1
    }
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  imagen: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  imagenes_adicionales: {
    type: DataTypes.JSON,
    allowNull: true
  },
  marca: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  modelo_compatible: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  destacado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'products',
  timestamps: true
});

// Método para obtener el precio final (oferta o normal)
Product.prototype.getPrecioFinal = function() {
  return this.precio_oferta || this.precio;
};

// Método para verificar disponibilidad
Product.prototype.isAvailable = function(quantity = 1) {
  return this.activo && this.stock >= quantity;
};

// Método para preparar item para Mercado Pago
Product.prototype.toMercadoPagoItem = function(quantity = 1) {
  return {
    id: this.sku || this.id.toString(),
    title: this.nombre.substring(0, 255),
    description: this.descripcion ? this.descripcion.substring(0, 255) : '',
    picture_url: this.imagen || '',
    quantity: quantity,
    unit_price: this.getPrecioFinal(),
    currency_id: 'CLP'
  };
};

module.exports = Product;

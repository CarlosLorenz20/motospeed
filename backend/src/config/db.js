const { Sequelize } = require('sequelize');
require('dotenv').config();

// Detectar el tipo de base de datos (mysql o postgres)
const dialect = process.env.DB_DIALECT || 'mysql';
const defaultPort = dialect === 'mysql' ? 3306 : 5432;

let sequelize;

if (process.env.DATABASE_URL) {
  // Usar DATABASE_URL si está disponible (Railway, Render, etc.)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: dialect,
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    dialectOptions: dialect === 'postgres' && process.env.NODE_ENV === 'production' ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    } : {},
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  });
} else {
  // Usar variables individuales (desarrollo local o Hostinger)
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || defaultPort,
      dialect: dialect,
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      define: {
        timestamps: true,
        underscored: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
      }
    }
  );
}

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a PostgreSQL establecida correctamente');
  } catch (error) {
    console.error('❌ Error al conectar a PostgreSQL:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };

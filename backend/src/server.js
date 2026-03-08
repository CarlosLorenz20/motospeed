const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const app = require('./app');
const { connectDB } = require('./config/db');
const { syncModels } = require('./models');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    // Conectar a la base de datos
    await connectDB();
    
    // Sincronizar modelos
    // En producción Railway, sincronizar con alter para crear tablas si no existen
    // Sin force para no perder datos
    await syncModels({ alter: true });

    // Iniciar servidor
    app.listen(PORT, '0.0.0.0', () => {
      logger.success(`🚀 Servidor iniciado en puerto ${PORT}`);
      logger.info(`📍 URL: http://localhost:${PORT}`);
      logger.info(`🔧 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    logger.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Manejar errores no capturados
process.on('uncaughtException', (error) => {
  logger.error('Excepción no capturada:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  logger.error('Promesa rechazada no manejada:', error);
  process.exit(1);
});

// Iniciar servidor
startServer();

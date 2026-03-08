const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Importar rutas
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const paymentRoutes = require('./routes/payment.routes');
const mercadopagoRoutes = require('./routes/mercadopago.routes');
const adminRoutes = require('./routes/admin.routes');

// Importar middlewares
const { notFound, errorHandler, sequelizeErrorHandler } = require('./middlewares/error.middleware');
const logger = require('./utils/logger');

// Crear aplicación Express
const app = express();

// Configurar CORS - permitir todos los orígenes
app.use(cors({
  origin: '*',
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With']
}));

// Parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Logger de requests en desarrollo
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    logger.request(req);
    next();
  });
}

// Ruta de health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/mercadopago', mercadopagoRoutes);
app.use('/api/admin', adminRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: 'MotoSpeed API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      orders: '/api/orders',
      payments: '/api/payments',
      mercadopago: '/api/mercadopago',
      admin: '/api/admin'
    }
  });
});

// Middlewares de manejo de errores
app.use(notFound);
app.use(sequelizeErrorHandler);
app.use(errorHandler);

module.exports = app;

/**
 * Rutas de Mercado Pago
 * Integración simplificada
 */
const express = require('express');
const router = express.Router();
const mercadopagoController = require('../controllers/mercadopago.controller');
const { optionalAuth } = require('../middlewares/auth.middleware');

// Crear preferencia simple (para pruebas con Postman)
router.post('/create-preference', mercadopagoController.createPreference);

// Crear orden desde carrito (con productos de la BD)
router.post('/create-order', optionalAuth, mercadopagoController.createOrderFromCart);

// Webhook de Mercado Pago (recibe notificaciones)
router.post('/webhook', mercadopagoController.webhook);

// Consultar información de un pago
router.get('/payment/:id', mercadopagoController.getPaymentInfo);

// Callbacks de redirección desde Mercado Pago
router.get('/success', mercadopagoController.paymentSuccess);
router.get('/failure', mercadopagoController.paymentFailure);
router.get('/pending', mercadopagoController.paymentPending);

module.exports = router;

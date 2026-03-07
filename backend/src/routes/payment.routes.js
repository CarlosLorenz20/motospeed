const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { authenticate, optionalAuth } = require('../middlewares/auth.middleware');

// Crear preferencia de pago (puede ser usuario autenticado o invitado)
router.post('/create-preference', optionalAuth, paymentController.createPreference);

// Webhook de Mercado Pago (público, pero verificado por MP)
router.post('/webhook', paymentController.webhook);

// Consultar estado de pago
router.get('/status/:paymentId', paymentController.getPaymentStatus);

// Verificar estado de órdenes (para polling desde frontend)
router.get('/check-orders', paymentController.checkOrderStatus);

// Callbacks de Mercado Pago (redirecciones después del pago)
router.get('/success', paymentController.paymentSuccess);
router.get('/failure', paymentController.paymentFailure);
router.get('/pending', paymentController.paymentPending);

module.exports = router;

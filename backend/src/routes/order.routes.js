const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { authenticate, isAdmin } = require('../middlewares/auth.middleware');

// Rutas protegidas para usuarios autenticados
router.get('/my-orders', authenticate, orderController.getMyOrders);
router.get('/:id', authenticate, orderController.getOrder);
router.post('/:id/cancel', authenticate, orderController.cancelOrder);

// Rutas de administrador
router.get('/', authenticate, isAdmin, orderController.getAllOrders);
router.put('/:id/status', authenticate, isAdmin, orderController.updateOrderStatus);
router.get('/admin/stats', authenticate, isAdmin, orderController.getOrderStats);

module.exports = router;

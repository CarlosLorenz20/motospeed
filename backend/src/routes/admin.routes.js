const express = require('express');
const router = express.Router();
const { authenticate, isAdmin } = require('../middlewares/auth.middleware');
const { upload } = require('../config/upload');
const {
  getDashboardStats,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  getOrderDetail,
  updateOrderStatus,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/admin.controller');

// Todas las rutas requieren autenticación y rol admin
router.use(authenticate);
router.use(isAdmin);

// Dashboard
router.get('/dashboard', getDashboardStats);

// Productos
router.get('/products', getAllProducts);
router.post('/products', upload.single('imagen'), createProduct);
router.put('/products/:id', upload.single('imagen'), updateProduct);
router.delete('/products/:id', deleteProduct);

// Órdenes
router.get('/orders', getAllOrders);
router.get('/orders/:id', getOrderDetail);
router.patch('/orders/:id/status', updateOrderStatus);

// Categorías
router.get('/categories', getAllCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

module.exports = router;

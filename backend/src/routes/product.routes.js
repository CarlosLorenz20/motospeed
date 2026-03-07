const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { authenticate, isAdmin } = require('../middlewares/auth.middleware');

// Rutas públicas
router.get('/', productController.getProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/categories', productController.getCategories);
router.get('/search', productController.searchProducts);
router.get('/category/:categorySlug', productController.getProductsByCategory);
router.get('/:id', productController.getProduct);

// Rutas protegidas (solo admin)
router.post('/', authenticate, isAdmin, productController.createProduct);
router.put('/:id', authenticate, isAdmin, productController.updateProduct);
router.delete('/:id', authenticate, isAdmin, productController.deleteProduct);

module.exports = router;

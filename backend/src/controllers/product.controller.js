const productService = require('../services/product.service');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');

/**
 * Obtener todos los productos (con filtros y paginación)
 */
const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      search,
      minPrice,
      maxPrice,
      marca,
      destacado,
      orderBy = 'created_at',
      order = 'DESC'
    } = req.query;

    const filters = {
      category,
      search,
      minPrice: minPrice ? parseInt(minPrice) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      marca,
      destacado: destacado === 'true'
    };

    const result = await productService.getProducts(
      parseInt(page),
      parseInt(limit),
      filters,
      orderBy,
      order
    );

    return paginatedResponse(res, result, 'Productos obtenidos exitosamente');
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

/**
 * Obtener un producto por ID o slug
 */
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await productService.getProductByIdOrSlug(id);
    
    return successResponse(res, { product }, 'Producto obtenido exitosamente');
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

/**
 * Obtener productos destacados
 */
const getFeaturedProducts = async (req, res) => {
  try {
    const { limit = 8 } = req.query;
    
    const products = await productService.getFeaturedProducts(parseInt(limit));
    
    return successResponse(res, { products }, 'Productos destacados obtenidos');
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

/**
 * Obtener productos por categoría
 */
const getProductsByCategory = async (req, res) => {
  try {
    const { categorySlug } = req.params;
    const { page = 1, limit = 12 } = req.query;
    
    const result = await productService.getProductsByCategory(
      categorySlug,
      parseInt(page),
      parseInt(limit)
    );
    
    return paginatedResponse(res, result, 'Productos por categoría obtenidos');
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

/**
 * Crear producto (admin)
 */
const createProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body);
    
    return successResponse(res, { product }, 'Producto creado exitosamente', 201);
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

/**
 * Actualizar producto (admin)
 */
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await productService.updateProduct(id, req.body);
    
    return successResponse(res, { product }, 'Producto actualizado exitosamente');
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

/**
 * Eliminar producto (admin)
 */
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    await productService.deleteProduct(id);
    
    return successResponse(res, null, 'Producto eliminado exitosamente');
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

/**
 * Obtener todas las categorías
 */
const getCategories = async (req, res) => {
  try {
    const categories = await productService.getCategories();
    
    return successResponse(res, { categories }, 'Categorías obtenidas exitosamente');
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

/**
 * Buscar productos
 */
const searchProducts = async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;
    
    if (!q || q.length < 2) {
      return errorResponse(res, 'La búsqueda debe tener al menos 2 caracteres', 400);
    }
    
    const products = await productService.searchProducts(q, parseInt(limit));
    
    return successResponse(res, { products }, 'Búsqueda completada');
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

module.exports = {
  getProducts,
  getProduct,
  getFeaturedProducts,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  searchProducts
};

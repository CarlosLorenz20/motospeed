const orderService = require('../services/order.service');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');

/**
 * Obtener órdenes del usuario autenticado
 */
const getMyOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const result = await orderService.getUserOrders(
      req.user.id,
      parseInt(page),
      parseInt(limit),
      status
    );
    
    return paginatedResponse(res, result, 'Órdenes obtenidas exitosamente');
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

/**
 * Obtener detalle de una orden
 */
const getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    
    const order = await orderService.getOrderById(id, req.user.id, req.user.role);
    
    return successResponse(res, { order }, 'Orden obtenida exitosamente');
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

/**
 * Cancelar una orden (solo si está pending)
 */
const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    
    const order = await orderService.cancelOrder(id, req.user.id);
    
    return successResponse(res, { order }, 'Orden cancelada exitosamente');
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

// ========== ADMIN ENDPOINTS ==========

/**
 * Obtener todas las órdenes (admin)
 */
const getAllOrders = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status,
      startDate,
      endDate,
      orderBy = 'created_at',
      order = 'DESC'
    } = req.query;

    const filters = {
      status,
      startDate,
      endDate
    };
    
    const result = await orderService.getAllOrders(
      parseInt(page),
      parseInt(limit),
      filters,
      orderBy,
      order
    );
    
    return paginatedResponse(res, result, 'Órdenes obtenidas exitosamente');
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

/**
 * Actualizar estado de una orden (admin)
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return errorResponse(res, 'El estado es requerido', 400);
    }
    
    const order = await orderService.updateOrderStatus(id, status);
    
    return successResponse(res, { order }, 'Estado de orden actualizado');
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

/**
 * Obtener estadísticas de órdenes (admin)
 */
const getOrderStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const stats = await orderService.getOrderStats(startDate, endDate);
    
    return successResponse(res, { stats }, 'Estadísticas obtenidas exitosamente');
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

module.exports = {
  getMyOrders,
  getOrder,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderStats
};

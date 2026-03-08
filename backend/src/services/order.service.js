const { Op } = require('sequelize');
const { Order, Product, User, sequelize } = require('../models');

class OrderService {
  /**
   * Obtener órdenes de un usuario
   */
  async getUserOrders(userId, page, limit, status) {
    const offset = (page - 1) * limit;
    const where = { user_id: userId };

    if (status) {
      where.status = status;
    }

    const { rows: orders, count: total } = await Order.findAndCountAll({
      where,
      include: [{
        model: Product,
        as: 'product',
        attributes: ['id', 'nombre', 'slug', 'imagen', 'precio']
      }],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    return {
      data: orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Obtener orden por ID
   */
  async getOrderById(id, userId, userRole) {
    const order = await Order.findByPk(id, {
      include: [
        {
          model: Product,
          as: 'product'
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    if (!order) {
      const error = new Error('Orden no encontrada');
      error.statusCode = 404;
      throw error;
    }

    // Verificar que el usuario tenga acceso
    if (userRole !== 'admin' && order.user_id !== userId) {
      const error = new Error('No tienes acceso a esta orden');
      error.statusCode = 403;
      throw error;
    }

    return order;
  }

  /**
   * Crear nueva orden
   */
  async createOrder(data) {
    return Order.create(data);
  }

  /**
   * Cancelar orden
   */
  async cancelOrder(id, userId) {
    const order = await Order.findByPk(id);

    if (!order) {
      const error = new Error('Orden no encontrada');
      error.statusCode = 404;
      throw error;
    }

    // Verificar que la orden pertenece al usuario
    if (order.user_id !== userId) {
      const error = new Error('No tienes acceso a esta orden');
      error.statusCode = 403;
      throw error;
    }

    // Verificar que la orden se puede cancelar
    if (!order.canCancel()) {
      const error = new Error('Esta orden no se puede cancelar');
      error.statusCode = 400;
      throw error;
    }

    await order.update({ status: 'cancelled' });

    return order;
  }

  /**
   * Obtener todas las órdenes (admin)
   */
  async getAllOrders(page, limit, filters, orderBy, order) {
    const offset = (page - 1) * limit;
    const where = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.startDate) {
      where.created_at = {
        ...where.created_at,
        [Op.gte]: new Date(filters.startDate)
      };
    }

    if (filters.endDate) {
      where.created_at = {
        ...where.created_at,
        [Op.lte]: new Date(filters.endDate)
      };
    }

    const { rows: orders, count: total } = await Order.findAndCountAll({
      where,
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'nombre', 'slug', 'imagen']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [[orderBy, order]],
      limit,
      offset
    });

    return {
      data: orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Actualizar estado de orden
   */
  async updateOrderStatus(id, status) {
    const validStatuses = ['pending', 'approved', 'in_process', 'rejected', 'cancelled', 'refunded'];

    if (!validStatuses.includes(status)) {
      const error = new Error('Estado inválido');
      error.statusCode = 400;
      throw error;
    }

    const order = await Order.findByPk(id);

    if (!order) {
      const error = new Error('Orden no encontrada');
      error.statusCode = 404;
      throw error;
    }

    await order.update({ status });

    return order;
  }

  /**
   * Obtener estadísticas de órdenes
   */
  async getOrderStats(startDate, endDate) {
    const where = {};

    if (startDate) {
      where.created_at = {
        ...where.created_at,
        [Op.gte]: new Date(startDate)
      };
    }

    if (endDate) {
      where.created_at = {
        ...where.created_at,
        [Op.lte]: new Date(endDate)
      };
    }

    // Total de órdenes
    const totalOrders = await Order.count({ where });

    // Órdenes por estado
    const ordersByStatus = await Order.findAll({
      where,
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'total']
      ],
      group: ['status'],
      raw: true
    });

    // Total de ventas aprobadas
    const approvedOrders = await Order.findAll({
      where: {
        ...where,
        status: 'approved'
      },
      attributes: [
        [sequelize.fn('SUM', sequelize.col('amount')), 'totalRevenue'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      raw: true
    });

    // Ventas por día (últimos 30 días)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const salesByDay = await Order.findAll({
      where: {
        status: 'approved',
        created_at: { [Op.gte]: thirtyDaysAgo }
      },
      attributes: [
        [sequelize.fn('DATE', sequelize.col('created_at')), 'date'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'total'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: [sequelize.fn('DATE', sequelize.col('created_at'))],
      order: [[sequelize.fn('DATE', sequelize.col('created_at')), 'ASC']],
      raw: true
    });

    return {
      totalOrders,
      ordersByStatus,
      revenue: approvedOrders[0]?.totalRevenue || 0,
      approvedCount: approvedOrders[0]?.count || 0,
      salesByDay
    };
  }

  /**
   * Buscar orden por preference_id de Mercado Pago
   */
  async findByPreferenceId(preferenceId) {
    return Order.findOne({
      where: { mp_preference_id: preferenceId }
    });
  }

  /**
   * Buscar orden por payment_id de Mercado Pago
   */
  async findByPaymentId(paymentId) {
    return Order.findOne({
      where: { mp_payment_id: paymentId }
    });
  }

  /**
   * Actualizar datos de pago de Mercado Pago
   */
  async updatePaymentData(orderId, paymentData) {
    const order = await Order.findByPk(orderId);

    if (!order) {
      const error = new Error('Orden no encontrada');
      error.statusCode = 404;
      throw error;
    }

    await order.update(paymentData);

    return order;
  }
}

module.exports = new OrderService();

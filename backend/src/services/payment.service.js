const { preference, payment, backUrls, notificationUrl } = require('../config/mercadoPago');
const { Product, Order } = require('../models');
const orderService = require('./order.service');
const productService = require('./product.service');
const logger = require('../utils/logger');

class PaymentService {
  /**
   * Crear preferencia de pago en Mercado Pago
   */
  async createPreference(items, payer, userId, metadata = {}) {
    // Verificar stock y obtener información de productos
    const stockCheck = await productService.checkStock(items);
    const unavailable = stockCheck.filter(item => !item.available);

    if (unavailable.length > 0) {
      const error = new Error('Algunos productos no están disponibles');
      error.statusCode = 400;
      error.details = unavailable;
      throw error;
    }

    // Preparar items para Mercado Pago
    const mpItems = [];
    let totalAmount = 0;

    for (const item of stockCheck) {
      const mpItem = item.product.toMercadoPagoItem(
        items.find(i => i.productId == item.productId).quantity
      );
      mpItems.push(mpItem);
      totalAmount += mpItem.unit_price * mpItem.quantity;
    }

    // Crear órdenes en la base de datos
    const orders = [];
    for (const item of stockCheck) {
      const quantity = items.find(i => i.productId == item.productId).quantity;
      const order = await orderService.createOrder({
        user_id: userId,
        product_id: item.productId,
        quantity,
        amount: item.product.getPrecioFinal() * quantity,
        status: 'pending',
        buyer_name: payer?.name || null,
        buyer_email: payer?.email || null,
        buyer_phone: payer?.phone || null,
        metadata: {
          ...metadata,
          original_price: item.product.precio,
          offer_price: item.product.precio_oferta
        }
      });
      orders.push(order);
    }

    // Crear referencia externa (IDs de órdenes separados por coma)
    const externalReference = orders.map(o => o.id).join(',');

    // Detectar si estamos en localhost (desarrollo)
    const isLocalhost = backUrls.success?.includes('localhost');

    // Configurar preferencia de Mercado Pago
    const preferenceData = {
      items: mpItems,
      payer: payer ? {
        name: payer.name || '',
        email: payer.email || ''
      } : undefined,
      back_urls: backUrls,
      external_reference: externalReference,
      statement_descriptor: 'MOTOSPEED'
    };

    // Solo agregar notification_url si NO es localhost (MP no puede enviar webhooks a localhost)
    if (!isLocalhost && notificationUrl) {
      preferenceData.notification_url = notificationUrl;
    }

    // Solo agregar auto_return si NO son URLs de localhost (MP no lo permite con localhost)
    if (!isLocalhost) {
      preferenceData.auto_return = 'approved';
    }

    // Crear preferencia en Mercado Pago
    const mpPreference = await preference.create({ body: preferenceData });

    // Actualizar órdenes con el ID de preferencia
    for (const order of orders) {
      await order.update({ mp_preference_id: mpPreference.id });
    }

    logger.info('Preferencia creada:', {
      preferenceId: mpPreference.id,
      orderIds: orders.map(o => o.id),
      totalAmount
    });

    return {
      preferenceId: mpPreference.id,
      initPoint: mpPreference.init_point,
      sandboxInitPoint: mpPreference.sandbox_init_point,
      orderIds: orders.map(o => o.id),
      totalAmount
    };
  }

  /**
   * Procesar notificación de pago (webhook)
   */
  async processPaymentNotification(paymentId) {
    try {
      // Obtener información del pago desde Mercado Pago
      const paymentInfo = await payment.get({ id: paymentId });

      if (!paymentInfo) {
        logger.error('Pago no encontrado en MP:', paymentId);
        return;
      }

      logger.info('Información de pago recibida:', {
        paymentId,
        status: paymentInfo.status,
        externalReference: paymentInfo.external_reference
      });

      // Obtener las órdenes relacionadas
      const orderIds = paymentInfo.external_reference?.split(',') || [];

      for (const orderId of orderIds) {
        const order = await Order.findByPk(orderId);
        
        if (!order) {
          logger.warn('Orden no encontrada:', orderId);
          continue;
        }

        // Actualizar orden con información del pago
        await order.update({
          mp_payment_id: paymentId.toString(),
          mp_merchant_order_id: paymentInfo.order?.id?.toString() || null,
          mp_payment_type: paymentInfo.payment_type_id,
          status: paymentInfo.status
        });

        // Si el pago fue aprobado, decrementar stock
        if (paymentInfo.status === 'approved') {
          await productService.decrementStock(order.product_id, order.quantity);
          logger.info('Stock decrementado para producto:', order.product_id);
        }
      }

      return paymentInfo;
    } catch (error) {
      logger.error('Error procesando notificación de pago:', error);
      throw error;
    }
  }

  /**
   * Obtener estado de un pago
   */
  async getPaymentStatus(paymentId) {
    try {
      const paymentInfo = await payment.get({ id: paymentId });
      
      return {
        id: paymentInfo.id,
        status: paymentInfo.status,
        statusDetail: paymentInfo.status_detail,
        paymentType: paymentInfo.payment_type_id,
        amount: paymentInfo.transaction_amount,
        currency: paymentInfo.currency_id,
        dateApproved: paymentInfo.date_approved,
        dateCreated: paymentInfo.date_created
      };
    } catch (error) {
      const err = new Error('Error al obtener estado del pago');
      err.statusCode = 500;
      throw err;
    }
  }

  /**
   * Confirmar pago exitoso
   */
  async confirmPayment(externalReference, paymentData) {
    const orderIds = externalReference.split(',');

    for (const orderId of orderIds) {
      const order = await Order.findByPk(orderId);
      
      if (!order) {
        logger.warn('Orden no encontrada en confirmación:', orderId);
        continue;
      }

      await order.update({
        mp_payment_id: paymentData.mp_payment_id,
        mp_merchant_order_id: paymentData.mp_merchant_order_id,
        mp_payment_type: paymentData.mp_payment_type,
        status: 'approved'
      });

      // Decrementar stock
      try {
        await productService.decrementStock(order.product_id, order.quantity);
      } catch (stockError) {
        logger.error('Error decrementando stock:', stockError);
      }
    }

    return true;
  }

  /**
   * Marcar pago como fallido
   */
  async markPaymentFailed(externalReference, paymentId) {
    const orderIds = externalReference.split(',');

    for (const orderId of orderIds) {
      const order = await Order.findByPk(orderId);
      
      if (order) {
        await order.update({
          mp_payment_id: paymentId,
          status: 'rejected'
        });
      }
    }

    return true;
  }

  /**
   * Marcar pago como pendiente
   */
  async markPaymentPending(externalReference, paymentId) {
    const orderIds = externalReference.split(',');

    for (const orderId of orderIds) {
      const order = await Order.findByPk(orderId);
      
      if (order) {
        await order.update({
          mp_payment_id: paymentId,
          status: 'in_process'
        });
      }
    }

    return true;
  }
}

module.exports = new PaymentService();

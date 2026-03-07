const paymentService = require('../services/payment.service');
const emailService = require('../services/email.service');
const productService = require('../services/product.service');
const { Order, Product } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');
const logger = require('../utils/logger');
const { payment } = require('../config/mercadoPago');

/**
 * Crear preferencia de pago en Mercado Pago
 * Este endpoint inicia el proceso de checkout
 */
const createPreference = async (req, res) => {
  try {
    const { items, payer, metadata } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return errorResponse(res, 'Los items son requeridos', 400);
    }

    // Validar estructura de items
    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity < 1) {
        return errorResponse(res, 'Cada item debe tener productId y quantity válidos', 400);
      }
    }

    const userId = req.user?.id || null;
    
    const result = await paymentService.createPreference(items, payer, userId, metadata);
    
    return successResponse(res, result, 'Preferencia de pago creada exitosamente', 201);
  } catch (error) {
    logger.error('Error al crear preferencia:', error);
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

/**
 * Webhook de Mercado Pago
 * Recibe notificaciones de cambios de estado de pagos
 */
const webhook = async (req, res) => {
  try {
    const { type, data } = req.body;
    
    logger.info('Webhook recibido:', { type, data });

    // Mercado Pago envía el ID en data.id
    if (type === 'payment' && data?.id) {
      await paymentService.processPaymentNotification(data.id);
    }
    
    // Siempre responder 200 para que MP no reintente
    return res.status(200).send('OK');
  } catch (error) {
    logger.error('Error en webhook:', error);
    // Incluso con error, responder 200 para evitar reintentos infinitos
    return res.status(200).send('OK');
  }
};

/**
 * Consultar estado de un pago por su ID de Mercado Pago
 */
const getPaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    const payment = await paymentService.getPaymentStatus(paymentId);
    
    return successResponse(res, { payment }, 'Estado de pago obtenido');
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

/**
 * Callback después de pago exitoso
 * Mercado Pago redirige aquí cuando el pago es exitoso
 */
const paymentSuccess = async (req, res) => {
  try {
    const { 
      collection_id,     // ID del pago
      collection_status, // Estado
      payment_id,        // ID del pago (igual a collection_id)
      status,            // Estado
      external_reference, // Referencia externa (order_id)
      payment_type,      // Tipo de pago
      merchant_order_id, // ID de orden en MP
      preference_id      // ID de la preferencia
    } = req.query;

    logger.info('Pago exitoso:', req.query);

    const paymentStatus = collection_status || status;
    const mpPaymentId = payment_id || collection_id;
    let orderDetails = null;

    // Actualizar orden si tenemos la referencia externa y el pago fue aprobado
    if (external_reference && paymentStatus === 'approved') {
      await paymentService.confirmPayment(external_reference, {
        mp_payment_id: mpPaymentId,
        mp_merchant_order_id: merchant_order_id,
        mp_payment_type: payment_type,
        status: paymentStatus
      });

      // Obtener detalles de las órdenes para el email y respuesta
      const orderIds = external_reference.split(',');
      const orders = await Order.findAll({
        where: { id: orderIds },
        include: [{ model: Product, as: 'product' }]
      });

      if (orders.length > 0) {
        const products = orders.map(order => ({
          name: order.product?.nombre || 'Producto',
          title: order.product?.nombre || 'Producto',
          quantity: order.quantity,
          price: order.amount,
          unit_price: order.amount / order.quantity
        }));

        const total = orders.reduce((sum, order) => sum + parseFloat(order.amount), 0);
        const buyerEmail = orders[0].buyer_email;
        const buyerName = orders[0].buyer_name;

        orderDetails = {
          products,
          total,
          buyerEmail
        };

        // Enviar email de confirmación si tenemos email
        if (buyerEmail) {
          try {
            await emailService.sendPurchaseSuccessEmail(buyerEmail, {
              customerName: buyerName || 'Cliente',
              customerEmail: buyerEmail,
              orderId: external_reference,
              paymentId: mpPaymentId,
              items: products,
              total: total,
              paymentMethod: payment_type || 'Mercado Pago',
              date: new Date()
            });
            logger.info('Email de confirmación enviado a:', buyerEmail);
          } catch (emailError) {
            logger.error('Error enviando email de confirmación:', emailError);
            // No fallar el request si el email falla
          }
        }
      }
    }

    return successResponse(res, {
      paymentId: mpPaymentId,
      status: paymentStatus,
      orderId: external_reference,
      orderDetails
    }, 'Pago procesado exitosamente');
  } catch (error) {
    logger.error('Error en callback de éxito:', error);
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

/**
 * Callback después de pago fallido
 */
const paymentFailure = async (req, res) => {
  try {
    const { external_reference, collection_status, payment_id } = req.query;

    logger.info('Pago fallido:', req.query);

    if (external_reference) {
      await paymentService.markPaymentFailed(external_reference, payment_id);
    }

    return successResponse(res, {
      paymentId: payment_id,
      status: collection_status || 'rejected',
      orderId: external_reference
    }, 'Pago rechazado');
  } catch (error) {
    logger.error('Error en callback de fallo:', error);
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

/**
 * Callback cuando el pago está pendiente
 */
const paymentPending = async (req, res) => {
  try {
    const { external_reference, collection_status, payment_id } = req.query;

    logger.info('Pago pendiente:', req.query);

    if (external_reference) {
      await paymentService.markPaymentPending(external_reference, payment_id);
    }

    return successResponse(res, {
      paymentId: payment_id,
      status: collection_status || 'pending',
      orderId: external_reference
    }, 'Pago pendiente de procesamiento');
  } catch (error) {
    logger.error('Error en callback pendiente:', error);
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

/**
 * Verificar estado de órdenes (para polling desde frontend)
 * Busca directamente en MP si las órdenes están pendientes
 */
const checkOrderStatus = async (req, res) => {
  try {
    const { orderIds } = req.query;

    if (!orderIds) {
      return errorResponse(res, 'orderIds es requerido', 400);
    }

    const ids = orderIds.split(',');
    const orders = await Order.findAll({
      where: { id: ids },
      include: [{ model: Product, as: 'product' }]
    });

    if (orders.length === 0) {
      return errorResponse(res, 'Órdenes no encontradas', 404);
    }

    // Si las órdenes están pendientes, buscar en Mercado Pago directamente
    const anyPendingInDB = orders.some(o => o.status === 'pending' || o.status === 'in_process');
    
    if (anyPendingInDB) {
      // Buscar pagos en MP usando el external_reference (que es el orderIds)
      const externalReference = orderIds;
      
      try {
        logger.info('Buscando pagos en MP para external_reference:', externalReference);
        
        // Buscar pagos por external_reference
        const searchResult = await payment.search({
          options: {
            external_reference: externalReference
          }
        });

        logger.info('Resultado búsqueda MP:', JSON.stringify(searchResult?.results?.length || 0) + ' pagos encontrados');

        if (searchResult.results && searchResult.results.length > 0) {
          // Tomar el pago más reciente
          const latestPayment = searchResult.results.sort((a, b) => 
            new Date(b.date_created) - new Date(a.date_created)
          )[0];

          logger.info('Pago encontrado en MP:', {
            id: latestPayment.id,
            status: latestPayment.status,
            status_detail: latestPayment.status_detail
          });

          // Si el pago está aprobado, actualizar nuestras órdenes
          if (latestPayment.status === 'approved') {
            for (const order of orders) {
              if (order.status !== 'approved') {
                await order.update({
                  status: 'approved',
                  mp_payment_id: latestPayment.id.toString(),
                  mp_payment_type: latestPayment.payment_type_id
                });
                
                // Decrementar stock
                try {
                  await productService.decrementStock(order.product_id, order.quantity);
                  logger.info('Stock decrementado para producto:', order.product_id);
                } catch (stockError) {
                  logger.error('Error decrementando stock:', stockError);
                }
              }
            }
            // Recargar órdenes con datos actualizados
            await Promise.all(orders.map(o => o.reload()));
          } else if (latestPayment.status === 'rejected') {
            for (const order of orders) {
              await order.update({
                status: 'rejected',
                mp_payment_id: latestPayment.id.toString()
              });
            }
            await Promise.all(orders.map(o => o.reload()));
          }
        }
      } catch (mpError) {
        logger.error('Error buscando en MP:', mpError.message);
        // Continuar con el estado de la BD si falla la búsqueda en MP
      }
    }

    // Verificar estado final después de posible actualización desde MP
    const allApproved = orders.every(o => o.status === 'approved');
    const anyRejected = orders.some(o => o.status === 'rejected');

    let overallStatus = 'pending';
    if (allApproved) {
      overallStatus = 'approved';
    } else if (anyRejected) {
      overallStatus = 'rejected';
    }

    const products = orders.map(order => ({
      name: order.product?.nombre || 'Producto',
      quantity: order.quantity,
      price: parseFloat(order.amount)
    }));

    const total = orders.reduce((sum, order) => sum + parseFloat(order.amount), 0);
    const buyerEmail = orders[0].buyer_email;
    const buyerName = orders[0].buyer_name;
    const paymentId = orders[0].mp_payment_id;

    // Si el pago fue aprobado y hay email, enviar comprobante (solo una vez)
    if (overallStatus === 'approved' && buyerEmail && !orders[0].email_sent) {
      try {
        await emailService.sendPurchaseSuccessEmail(buyerEmail, {
          customerName: buyerName || 'Cliente',
          customerEmail: buyerEmail,
          orderId: orderIds,
          paymentId: paymentId || 'N/A',
          items: products.map(p => ({
            title: p.name,
            quantity: p.quantity,
            unit_price: p.price / p.quantity
          })),
          total: total,
          paymentMethod: orders[0].mp_payment_type || 'Mercado Pago',
          date: new Date()
        });
        
        // Marcar que ya se envió el email
        for (const order of orders) {
          await order.update({ email_sent: true });
        }
        
        logger.info('Email de confirmación enviado a:', buyerEmail);
      } catch (emailError) {
        logger.error('Error enviando email:', emailError);
      }
    }

    return successResponse(res, {
      status: overallStatus,
      paymentId,
      orderDetails: {
        products,
        total,
        buyerEmail,
        buyerName
      }
    }, 'Estado de órdenes obtenido');
  } catch (error) {
    logger.error('Error verificando estado de órdenes:', error);
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

module.exports = {
  createPreference,
  webhook,
  getPaymentStatus,
  paymentSuccess,
  paymentFailure,
  paymentPending,
  checkOrderStatus
};

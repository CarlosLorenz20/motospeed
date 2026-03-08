/**
 * Controlador de Mercado Pago
 * Integración simplificada siguiendo el patrón de tutoriales oficiales
 */
const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');
const { Order, Product } = require('../models');
const logger = require('../utils/logger');
const emailService = require('../services/email.service');

// Configurar cliente de Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
});

const preference = new Preference(client);
const payment = new Payment(client);

/**
 * POST /api/mercadopago/create-preference
 * Crear preferencia de pago - Endpoint principal para checkout
 * 
 * Body esperado:
 * {
 *   "items": [
 *     { "title": "Producto 1", "unit_price": 10000, "quantity": 1 }
 *   ],
 *   "payer": { "email": "test@test.com" }
 * }
 */
const createPreference = async (req, res) => {
  try {
    const { items, payer } = req.body;

    // Validar que hay items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Los items son requeridos'
      });
    }

    // Validar estructura de items
    for (const item of items) {
      if (!item.title || !item.unit_price || !item.quantity) {
        return res.status(400).json({
          success: false,
          error: 'Cada item debe tener title, unit_price y quantity'
        });
      }
    }

    // Crear preferencia con items formateados para MP
    const preferenceData = {
      items: items.map(item => ({
        id: item.id || String(Date.now()),
        title: item.title,
        description: item.description || item.title,
        picture_url: item.picture_url || '',
        category_id: item.category_id || 'others',
        quantity: Number(item.quantity),
        currency_id: 'CLP',
        unit_price: Number(item.unit_price)
      })),
      payer: payer ? {
        name: payer.name || '',
        surname: payer.surname || '',
        email: payer.email || '',
        phone: payer.phone ? {
          area_code: payer.phone.area_code || '',
          number: payer.phone.number || ''
        } : undefined,
        identification: payer.identification ? {
          type: payer.identification.type || 'RUT',
          number: payer.identification.number || ''
        } : undefined
      } : undefined,
      statement_descriptor: 'MOTOSPEED',
      external_reference: `order_${Date.now()}`
    };

    // Solo agregar back_urls y auto_return si NO son URLs de localhost
    const successUrl = process.env.MP_SUCCESS_URL || '';
    if (successUrl && !successUrl.includes('localhost')) {
      preferenceData.back_urls = {
        success: process.env.MP_SUCCESS_URL,
        failure: process.env.MP_FAILURE_URL,
        pending: process.env.MP_PENDING_URL
      };
      preferenceData.auto_return = 'approved';
    }

    // Solo agregar notification_url si no es localhost (MP no puede acceder a localhost)
    const webhookUrl = process.env.MP_WEBHOOK_URL || '';
    if (webhookUrl && !webhookUrl.includes('localhost')) {
      preferenceData.notification_url = webhookUrl;
    }

    logger.info('Creando preferencia en MP:', JSON.stringify(preferenceData, null, 2));

    // Crear la preferencia en Mercado Pago
    const response = await preference.create({ body: preferenceData });

    logger.success('Preferencia creada exitosamente:', {
      id: response.id,
      init_point: response.init_point
    });

    // Responder con los datos necesarios para el frontend
    return res.status(201).json({
      success: true,
      data: {
        id: response.id,
        init_point: response.init_point,
        sandbox_init_point: response.sandbox_init_point
      }
    });

  } catch (error) {
    logger.error('Error al crear preferencia:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Error al crear la preferencia de pago'
    });
  }
};

/**
 * POST /api/mercadopago/create-order
 * Crear orden desde carrito con productos de la BD
 * 
 * Body esperado:
 * {
 *   "cart": [
 *     { "productId": 1, "quantity": 2 }
 *   ],
 *   "payer": { "email": "test@test.com", "name": "Test User" }
 * }
 */
const createOrderFromCart = async (req, res) => {
  try {
    const { cart, payer } = req.body;
    const userId = req.user?.id || null;

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'El carrito es requerido'
      });
    }

    // Obtener productos de la BD
    const productIds = cart.map(item => item.productId);
    const products = await Product.findAll({
      where: { id: productIds, activo: true }
    });

    if (products.length !== cart.length) {
      return res.status(400).json({
        success: false,
        error: 'Algunos productos no están disponibles'
      });
    }

    // Verificar stock y preparar items
    const items = [];
    let totalAmount = 0;

    for (const cartItem of cart) {
      const product = products.find(p => p.id == cartItem.productId);
      
      if (!product) {
        return res.status(400).json({
          success: false,
          error: `Producto ${cartItem.productId} no encontrado`
        });
      }

      if (product.stock < cartItem.quantity) {
        return res.status(400).json({
          success: false,
          error: `Stock insuficiente para ${product.nombre}`
        });
      }

      const unitPrice = product.precio_oferta || product.precio;
      
      items.push({
        id: String(product.id),
        title: product.nombre,
        description: product.descripcion?.substring(0, 256) || product.nombre,
        picture_url: product.imagen || '',
        category_id: 'others',
        quantity: Number(cartItem.quantity),
        currency_id: 'CLP',
        unit_price: Number(unitPrice)
      });

      totalAmount += unitPrice * cartItem.quantity;
    }

    // Crear referencia externa única
    const externalReference = `cart_${userId || 'guest'}_${Date.now()}`;

    // Crear preferencia en MP
    const preferenceData = {
      items,
      payer: payer ? {
        name: payer.name || '',
        surname: payer.surname || '',
        email: payer.email || '',
        phone: payer.phone ? {
          area_code: '',
          number: String(payer.phone)
        } : undefined
      } : undefined,
      back_urls: {
        success: process.env.MP_SUCCESS_URL,
        failure: process.env.MP_FAILURE_URL,
        pending: process.env.MP_PENDING_URL
      },
      auto_return: 'approved',
      notification_url: process.env.MP_WEBHOOK_URL,
      statement_descriptor: 'MOTOSPEED',
      external_reference: externalReference
    };

    const response = await preference.create({ body: preferenceData });

    // Crear órdenes en la BD (una por producto)
    const orders = [];
    for (const cartItem of cart) {
      const product = products.find(p => p.id == cartItem.productId);
      const unitPrice = product.precio_oferta || product.precio;

      const order = await Order.create({
        user_id: userId,
        product_id: product.id,
        quantity: cartItem.quantity,
        amount: unitPrice * cartItem.quantity,
        status: 'pending',
        mp_preference_id: response.id,
        buyer_email: payer?.email || null,
        buyer_name: payer?.name || null,
        buyer_phone: payer?.phone || null,
        metadata: { external_reference: externalReference }
      });
      orders.push(order);
    }

    logger.success('Orden creada:', {
      preferenceId: response.id,
      orderIds: orders.map(o => o.id),
      totalAmount
    });

    return res.status(201).json({
      success: true,
      data: {
        preferenceId: response.id,
        init_point: response.init_point,
        sandbox_init_point: response.sandbox_init_point,
        orderIds: orders.map(o => o.id),
        totalAmount,
        externalReference
      }
    });

  } catch (error) {
    logger.error('Error al crear orden:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Error al crear la orden'
    });
  }
};

/**
 * POST /api/mercadopago/webhook
 * Recibir notificaciones de Mercado Pago
 * MP envía notificaciones cuando el estado del pago cambia
 */
const webhook = async (req, res) => {
  try {
    const { type, data } = req.body;
    
    logger.info('Webhook MP recibido:', { type, data, query: req.query });

    // También puede venir en query params
    const paymentId = data?.id || req.query['data.id'];
    const notificationType = type || req.query.type;

    if (notificationType === 'payment' && paymentId) {
      // Obtener información del pago desde MP
      const paymentInfo = await payment.get({ id: paymentId });

      logger.info('Info del pago:', {
        id: paymentInfo.id,
        status: paymentInfo.status,
        external_reference: paymentInfo.external_reference
      });

      // Buscar órdenes por preferencia o external_reference
      const ordersToUpdate = await Order.findAll({
        where: { mp_preference_id: paymentInfo.preference_id },
        include: [{ model: Product, as: 'product' }]
      });

      // Preparar datos para el email
      let customerEmail = null;
      let customerName = null;
      const emailItems = [];
      let totalAmount = 0;

      // Actualizar estado de las órdenes
      for (const order of ordersToUpdate) {
        await order.update({
          mp_payment_id: String(paymentInfo.id),
          mp_payment_type: paymentInfo.payment_type_id,
          status: paymentInfo.status
        });

        // Guardar datos para el email
        if (!customerEmail && order.buyer_email) customerEmail = order.buyer_email;
        if (!customerName && order.buyer_name) customerName = order.buyer_name;
        
        emailItems.push({
          title: order.product?.nombre || 'Producto',
          quantity: order.quantity,
          unit_price: order.amount / order.quantity
        });
        totalAmount += order.amount;

        // Si el pago fue aprobado, decrementar stock
        if (paymentInfo.status === 'approved') {
          await Product.decrement('stock', {
            by: order.quantity,
            where: { id: order.product_id }
          });
          logger.success(`Stock decrementado para producto ${order.product_id}`);
        }
      }

      logger.success(`Órdenes actualizadas: ${ordersToUpdate.length}`);

      // Enviar email según el estado del pago
      if (customerEmail && ordersToUpdate.length > 0) {
        const emailData = {
          customerName: customerName || paymentInfo.payer?.first_name || 'Cliente',
          customerEmail,
          orderId: ordersToUpdate[0].id,
          paymentId: paymentInfo.id,
          items: emailItems,
          total: totalAmount,
          paymentMethod: paymentInfo.payment_method_id,
          date: new Date()
        };

        if (paymentInfo.status === 'approved') {
          await emailService.sendPurchaseSuccessEmail(customerEmail, emailData);
          logger.success(`Email de compra exitosa enviado a ${customerEmail}`);
        } else if (paymentInfo.status === 'rejected') {
          emailData.reason = getPaymentRejectionReason(paymentInfo.status_detail);
          await emailService.sendPurchaseFailedEmail(customerEmail, emailData);
          logger.info(`Email de pago rechazado enviado a ${customerEmail}`);
        } else if (paymentInfo.status === 'pending' || paymentInfo.status === 'in_process') {
          await emailService.sendPurchasePendingEmail(customerEmail, emailData);
          logger.info(`Email de pago pendiente enviado a ${customerEmail}`);
        }
      }
    }

    // Siempre responder 200 OK a Mercado Pago
    return res.status(200).send('OK');

  } catch (error) {
    logger.error('Error en webhook:', error);
    // Siempre responder 200 para evitar reintentos infinitos
    return res.status(200).send('OK');
  }
};

/**
 * Obtener razón de rechazo del pago
 */
const getPaymentRejectionReason = (statusDetail) => {
  const reasons = {
    'cc_rejected_bad_filled_card_number': 'Número de tarjeta incorrecto',
    'cc_rejected_bad_filled_date': 'Fecha de vencimiento incorrecta',
    'cc_rejected_bad_filled_other': 'Datos de tarjeta incorrectos',
    'cc_rejected_bad_filled_security_code': 'Código de seguridad incorrecto',
    'cc_rejected_blacklist': 'Tarjeta no permitida',
    'cc_rejected_call_for_authorize': 'Debe autorizar el pago con su banco',
    'cc_rejected_card_disabled': 'Tarjeta deshabilitada',
    'cc_rejected_card_error': 'Error en la tarjeta',
    'cc_rejected_duplicated_payment': 'Pago duplicado',
    'cc_rejected_high_risk': 'Pago rechazado por seguridad',
    'cc_rejected_insufficient_amount': 'Saldo insuficiente',
    'cc_rejected_invalid_installments': 'Cuotas no válidas',
    'cc_rejected_max_attempts': 'Máximo de intentos alcanzado',
    'cc_rejected_other_reason': 'Pago rechazado'
  };
  return reasons[statusDetail] || 'Pago rechazado por el banco';
};

/**
 * GET /api/mercadopago/payment/:id
 * Consultar estado de un pago
 */
const getPaymentInfo = async (req, res) => {
  try {
    const { id } = req.params;

    const paymentInfo = await payment.get({ id });

    return res.json({
      success: true,
      data: {
        id: paymentInfo.id,
        status: paymentInfo.status,
        status_detail: paymentInfo.status_detail,
        payment_type_id: paymentInfo.payment_type_id,
        payment_method_id: paymentInfo.payment_method_id,
        transaction_amount: paymentInfo.transaction_amount,
        currency_id: paymentInfo.currency_id,
        date_created: paymentInfo.date_created,
        date_approved: paymentInfo.date_approved,
        external_reference: paymentInfo.external_reference,
        payer: paymentInfo.payer
      }
    });

  } catch (error) {
    logger.error('Error al consultar pago:', error);
    return res.status(404).json({
      success: false,
      error: 'Pago no encontrado'
    });
  }
};

/**
 * GET /api/mercadopago/success
 * Callback cuando el pago fue exitoso
 */
const paymentSuccess = async (req, res) => {
  const { collection_id, collection_status, payment_id, status, external_reference, preference_id } = req.query;

  logger.success('Pago exitoso:', { payment_id, status, external_reference, preference_id });

  // Redirigir al frontend con los datos
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const redirectUrl = `${frontendUrl}/checkout/success?payment_id=${payment_id}&status=${status}&external_reference=${external_reference}`;
  
  return res.redirect(redirectUrl);
};

/**
 * GET /api/mercadopago/failure
 * Callback cuando el pago falló
 */
const paymentFailure = async (req, res) => {
  const { payment_id, status, external_reference } = req.query;

  logger.warn('Pago fallido:', { payment_id, status, external_reference });

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const redirectUrl = `${frontendUrl}/checkout/failure?payment_id=${payment_id}&status=${status}`;
  
  return res.redirect(redirectUrl);
};

/**
 * GET /api/mercadopago/pending
 * Callback cuando el pago está pendiente
 */
const paymentPending = async (req, res) => {
  const { payment_id, status, external_reference } = req.query;

  logger.info('Pago pendiente:', { payment_id, status, external_reference });

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const redirectUrl = `${frontendUrl}/checkout/pending?payment_id=${payment_id}&status=${status}`;
  
  return res.redirect(redirectUrl);
};

module.exports = {
  createPreference,
  createOrderFromCart,
  webhook,
  getPaymentInfo,
  paymentSuccess,
  paymentFailure,
  paymentPending
};

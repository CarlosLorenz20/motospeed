/**
 * Servicio de Email con Nodemailer
 * Configurado para Gmail SMTP
 */
const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

// Crear transporter de nodemailer
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false, // true para 465, false para otros puertos
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

// Formatear precio en CLP
const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(price);
};

// Formatear fecha
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Plantilla base de email
 */
const baseTemplate = (content, title) => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
      color: white;
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
    }
    .header p {
      margin: 10px 0 0;
      opacity: 0.9;
    }
    .content {
      padding: 30px;
    }
    .status-badge {
      display: inline-block;
      padding: 8px 20px;
      border-radius: 20px;
      font-weight: 600;
      font-size: 14px;
      margin-bottom: 20px;
    }
    .status-success {
      background-color: #dcfce7;
      color: #166534;
    }
    .status-failed {
      background-color: #fee2e2;
      color: #991b1b;
    }
    .status-pending {
      background-color: #fef3c7;
      color: #92400e;
    }
    .order-details {
      background-color: #f8fafc;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .order-details h3 {
      margin: 0 0 15px;
      color: #1e40af;
      font-size: 16px;
    }
    .order-item {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #e2e8f0;
    }
    .order-item:last-child {
      border-bottom: none;
    }
    .order-total {
      display: flex;
      justify-content: space-between;
      padding: 15px 0 0;
      margin-top: 10px;
      border-top: 2px solid #1e40af;
      font-weight: 700;
      font-size: 18px;
    }
    .info-box {
      background-color: #eff6ff;
      border-left: 4px solid #3b82f6;
      padding: 15px;
      margin: 20px 0;
      border-radius: 0 8px 8px 0;
    }
    .footer {
      background-color: #1e293b;
      color: #94a3b8;
      padding: 25px;
      text-align: center;
    }
    .footer a {
      color: #60a5fa;
      text-decoration: none;
    }
    .btn {
      display: inline-block;
      padding: 12px 30px;
      background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
      color: white;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin: 15px 0;
    }
    .social-links {
      margin-top: 15px;
    }
    .social-links a {
      margin: 0 10px;
      color: #94a3b8;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🏍️ MotoSpeed</h1>
      <p>Tu tienda de accesorios para moto</p>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p><strong>MotoSpeed Chile</strong></p>
      <p>¿Tienes preguntas? Contáctanos:</p>
      <p><a href="mailto:soporte@motospeed.cl">soporte@motospeed.cl</a></p>
      <div class="social-links">
        <a href="#">Facebook</a> |
        <a href="#">Instagram</a> |
        <a href="#">WhatsApp</a>
      </div>
      <p style="margin-top: 20px; font-size: 12px;">
        © ${new Date().getFullYear()} MotoSpeed Chile. Todos los derechos reservados.
      </p>
    </div>
  </div>
</body>
</html>
`;

/**
 * Email de compra exitosa
 */
const purchaseSuccessTemplate = (data) => {
  const { customerName, customerEmail, orderId, paymentId, items, total, paymentMethod, date } = data;
  
  const itemsHtml = items.map(item => `
    <div class="order-item">
      <span>${item.title} x${item.quantity}</span>
      <span>${formatPrice(item.unit_price * item.quantity)}</span>
    </div>
  `).join('');

  const content = `
    <span class="status-badge status-success">✓ Pago Aprobado</span>
    
    <h2>¡Gracias por tu compra, ${customerName || 'Cliente'}!</h2>
    <p>Hemos recibido tu pago correctamente. Aquí tienes los detalles de tu pedido:</p>
    
    <div class="order-details">
      <h3>📦 Resumen del Pedido</h3>
      <div class="order-item">
        <span><strong>N° de Orden:</strong></span>
        <span>#${orderId}</span>
      </div>
      <div class="order-item">
        <span><strong>ID de Pago MP:</strong></span>
        <span>${paymentId}</span>
      </div>
      <div class="order-item">
        <span><strong>Fecha:</strong></span>
        <span>${formatDate(date || new Date())}</span>
      </div>
      <div class="order-item">
        <span><strong>Método de Pago:</strong></span>
        <span>${paymentMethod || 'Mercado Pago'}</span>
      </div>
    </div>
    
    <div class="order-details">
      <h3>🛒 Productos</h3>
      ${itemsHtml}
      <div class="order-total">
        <span>Total Pagado:</span>
        <span>${formatPrice(total)}</span>
      </div>
    </div>
    
    <div class="info-box">
      <strong>📬 Próximos pasos:</strong>
      <p style="margin: 10px 0 0;">
        Prepararemos tu pedido y te notificaremos cuando esté listo para envío o retiro.
        Puedes seguir el estado de tu pedido en nuestra tienda.
      </p>
    </div>
    
    <p style="text-align: center;">
      <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/orders" class="btn">
        Ver mis pedidos
      </a>
    </p>
    
    <p style="color: #64748b; font-size: 14px;">
      Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos.
    </p>
  `;

  return baseTemplate(content, 'Compra Exitosa - MotoSpeed');
};

/**
 * Email de compra fallida
 */
const purchaseFailedTemplate = (data) => {
  const { customerName, customerEmail, orderId, items, total, reason, date } = data;
  
  const itemsHtml = items.map(item => `
    <div class="order-item">
      <span>${item.title} x${item.quantity}</span>
      <span>${formatPrice(item.unit_price * item.quantity)}</span>
    </div>
  `).join('');

  const content = `
    <span class="status-badge status-failed">✗ Pago Rechazado</span>
    
    <h2>Lo sentimos, ${customerName || 'Cliente'}</h2>
    <p>Tu pago no pudo ser procesado. No te preocupes, no se realizó ningún cargo a tu cuenta.</p>
    
    <div class="order-details">
      <h3>📋 Detalles del intento</h3>
      <div class="order-item">
        <span><strong>N° de Orden:</strong></span>
        <span>#${orderId}</span>
      </div>
      <div class="order-item">
        <span><strong>Fecha:</strong></span>
        <span>${formatDate(date || new Date())}</span>
      </div>
      <div class="order-item">
        <span><strong>Motivo:</strong></span>
        <span style="color: #dc2626;">${reason || 'Pago rechazado'}</span>
      </div>
    </div>
    
    <div class="order-details">
      <h3>🛒 Productos</h3>
      ${itemsHtml}
      <div class="order-total">
        <span>Total:</span>
        <span>${formatPrice(total)}</span>
      </div>
    </div>
    
    <div class="info-box">
      <strong>💡 ¿Qué puedo hacer?</strong>
      <ul style="margin: 10px 0 0; padding-left: 20px;">
        <li>Verifica que los datos de tu tarjeta sean correctos</li>
        <li>Asegúrate de tener saldo disponible</li>
        <li>Intenta con otro medio de pago</li>
        <li>Contacta a tu banco si el problema persiste</li>
      </ul>
    </div>
    
    <p style="text-align: center;">
      <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/cart" class="btn">
        Intentar de nuevo
      </a>
    </p>
    
    <p style="color: #64748b; font-size: 14px;">
      Tus productos siguen guardados en el carrito. Si necesitas ayuda, estamos aquí para ti.
    </p>
  `;

  return baseTemplate(content, 'Pago Rechazado - MotoSpeed');
};

/**
 * Email de pago pendiente
 */
const purchasePendingTemplate = (data) => {
  const { customerName, orderId, items, total, date } = data;
  
  const itemsHtml = items.map(item => `
    <div class="order-item">
      <span>${item.title} x${item.quantity}</span>
      <span>${formatPrice(item.unit_price * item.quantity)}</span>
    </div>
  `).join('');

  const content = `
    <span class="status-badge status-pending">⏳ Pago Pendiente</span>
    
    <h2>Hola ${customerName || 'Cliente'}</h2>
    <p>Tu pago está siendo procesado. Te notificaremos cuando se confirme.</p>
    
    <div class="order-details">
      <h3>📋 Detalles</h3>
      <div class="order-item">
        <span><strong>N° de Orden:</strong></span>
        <span>#${orderId}</span>
      </div>
      <div class="order-item">
        <span><strong>Fecha:</strong></span>
        <span>${formatDate(date || new Date())}</span>
      </div>
      <div class="order-item">
        <span><strong>Estado:</strong></span>
        <span style="color: #d97706;">Pendiente de confirmación</span>
      </div>
    </div>
    
    <div class="order-details">
      <h3>🛒 Productos</h3>
      ${itemsHtml}
      <div class="order-total">
        <span>Total:</span>
        <span>${formatPrice(total)}</span>
      </div>
    </div>
    
    <div class="info-box">
      <strong>⏱️ ¿Cuánto tarda?</strong>
      <p style="margin: 10px 0 0;">
        Los pagos pendientes suelen confirmarse en minutos, pero pueden tomar hasta 24-48 horas
        dependiendo del método de pago seleccionado.
      </p>
    </div>
    
    <p style="text-align: center;">
      <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/orders" class="btn">
        Ver estado del pedido
      </a>
    </p>
  `;

  return baseTemplate(content, 'Pago Pendiente - MotoSpeed');
};

/**
 * Email de bienvenida para nuevos usuarios
 */
const welcomeTemplate = (data) => {
  const { userName, userEmail } = data;

  const content = `
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="font-size: 60px; margin-bottom: 10px;">🎉</div>
      <span class="status-badge status-success">¡Bienvenido a la familia!</span>
    </div>
    
    <h2 style="text-align: center;">¡Hola ${userName}!</h2>
    <p style="text-align: center; font-size: 16px;">
      Tu cuenta ha sido creada exitosamente. Ya eres parte de la comunidad MotoSpeed.
    </p>
    
    <div class="order-details">
      <h3>📋 Datos de tu cuenta</h3>
      <div class="order-item">
        <span><strong>Nombre:</strong></span>
        <span>${userName}</span>
      </div>
      <div class="order-item">
        <span><strong>Email:</strong></span>
        <span>${userEmail}</span>
      </div>
      <div class="order-item">
        <span><strong>Fecha de registro:</strong></span>
        <span>${formatDate(new Date())}</span>
      </div>
    </div>
    
    <div class="info-box">
      <strong>🏍️ ¿Qué puedes hacer ahora?</strong>
      <ul style="margin: 10px 0 0; padding-left: 20px;">
        <li>Explorar nuestro catálogo de accesorios para moto</li>
        <li>Agregar productos a tu lista de favoritos</li>
        <li>Realizar pedidos con envío a todo Chile</li>
        <li>Acceder a ofertas exclusivas para miembros</li>
      </ul>
    </div>
    
    <p style="text-align: center;">
      <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/tienda" class="btn">
        Explorar tienda
      </a>
    </p>
    
    <p style="color: #64748b; font-size: 14px; text-align: center;">
      Si tienes alguna pregunta, nuestro equipo está aquí para ayudarte.
    </p>
  `;

  return baseTemplate(content, 'Bienvenido a MotoSpeed');
};

/**
 * Enviar email
 */
const sendEmail = async (to, subject, html) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME || 'MotoSpeed'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
      to,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    logger.success(`Email enviado a ${to}:`, info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error(`Error enviando email a ${to}:`, error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Enviar email de compra exitosa
 */
const sendPurchaseSuccessEmail = async (email, data) => {
  const html = purchaseSuccessTemplate(data);
  return sendEmail(email, '✅ ¡Compra exitosa! - MotoSpeed', html);
};

/**
 * Enviar email de compra fallida
 */
const sendPurchaseFailedEmail = async (email, data) => {
  const html = purchaseFailedTemplate(data);
  return sendEmail(email, '❌ Pago rechazado - MotoSpeed', html);
};

/**
 * Enviar email de pago pendiente
 */
const sendPurchasePendingEmail = async (email, data) => {
  const html = purchasePendingTemplate(data);
  return sendEmail(email, '⏳ Pago pendiente - MotoSpeed', html);
};

/**
 * Enviar email de bienvenida
 */
const sendWelcomeEmail = async (email, data) => {
  const html = welcomeTemplate(data);
  return sendEmail(email, '🎉 ¡Bienvenido a MotoSpeed!', html);
};

module.exports = {
  sendEmail,
  sendPurchaseSuccessEmail,
  sendPurchaseFailedEmail,
  sendPurchasePendingEmail,
  sendWelcomeEmail,
  purchaseSuccessTemplate,
  purchaseFailedTemplate,
  purchasePendingTemplate,
  welcomeTemplate
};

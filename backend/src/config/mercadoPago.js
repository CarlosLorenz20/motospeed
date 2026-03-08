const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');
require('dotenv').config();

// Configuración del cliente de Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
  options: { timeout: 5000 }
});

// Instancias para crear preferencias y consultar pagos
const preference = new Preference(client);
const payment = new Payment(client);

// URLs de redirección
const backUrls = {
  success: process.env.MP_SUCCESS_URL || 'http://localhost:5173/checkout/success',
  failure: process.env.MP_FAILURE_URL || 'http://localhost:5173/checkout/failure',
  pending: process.env.MP_PENDING_URL || 'http://localhost:5173/checkout/pending'
};

// URL del webhook
const notificationUrl = process.env.MP_WEBHOOK_URL || 'http://localhost:3001/api/payments/webhook';

module.exports = {
  client,
  preference,
  payment,
  backUrls,
  notificationUrl
};

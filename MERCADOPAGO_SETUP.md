# MotoSpeed - Integración Mercado Pago

## 🚀 Configuración Rápida

### 1. Obtener Credenciales de Mercado Pago

1. Ir a [Panel de Desarrolladores de Mercado Pago Chile](https://www.mercadopago.cl/developers/panel/app)
2. Crear una aplicación nueva o usar una existente
3. Copiar el **Access Token de prueba** (TEST-xxxxxxxxxxxx)

### 2. Configurar Variables de Entorno

Editar `backend/.env`:

```env
MP_ACCESS_TOKEN=TEST-tu-access-token-aqui
```

### 3. Iniciar el Backend

```bash
cd backend
npm run dev
```

El servidor estará en: `http://localhost:3001`

---

## 📡 Endpoints de Mercado Pago

### POST `/api/mercadopago/create-preference`

Crea una preferencia de pago simple. Ideal para pruebas rápidas.

**Request:**
```json
{
  "items": [
    {
      "title": "Casco Moto AGV K1",
      "unit_price": 150000,
      "quantity": 1
    }
  ],
  "payer": {
    "email": "test_user_123456@testuser.com"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1234567890-xxxx",
    "init_point": "https://www.mercadopago.cl/checkout/v1/redirect?pref_id=xxx",
    "sandbox_init_point": "https://sandbox.mercadopago.cl/checkout/v1/redirect?pref_id=xxx"
  }
}
```

### POST `/api/mercadopago/create-order`

Crea una orden usando productos de la base de datos.

**Request:**
```json
{
  "cart": [
    { "productId": 1, "quantity": 2 },
    { "productId": 3, "quantity": 1 }
  ],
  "payer": {
    "name": "Juan Perez",
    "email": "test_user_123456@testuser.com",
    "phone": "912345678"
  }
}
```

### POST `/api/mercadopago/webhook`

Recibe notificaciones de Mercado Pago cuando el estado del pago cambia.

**Nota:** En desarrollo, puedes usar [ngrok](https://ngrok.com/) para exponer tu localhost y recibir webhooks reales.

### GET `/api/mercadopago/payment/:id`

Consulta el estado de un pago específico.

---

## 🧪 Probar con Postman

1. Importar `postman_collection.json` en Postman
2. Configurar la variable `baseUrl` si es necesario
3. Ejecutar las requests en orden

---

## 🔑 Flujo de Pago

1. **Frontend** envía items al endpoint `/api/mercadopago/create-preference`
2. **Backend** crea preferencia en MP y devuelve `init_point`
3. **Frontend** redirige al usuario a `init_point` (o usa SDK de MP React)
4. **Usuario** completa el pago en la página de MP
5. **MP** redirige al usuario a las URLs de `success/failure/pending`
6. **MP** envía webhook con el estado del pago
7. **Backend** actualiza el estado de la orden en la BD

---

## 🛒 Usuarios de Prueba

Para probar pagos, Mercado Pago proporciona usuarios de prueba:

- Email: `test_user_123456789@testuser.com`
- Tarjeta: `5416 7526 0258 2580` (Mastercard aprobada)
- CVV: `123`
- Vencimiento: cualquier fecha futura

Más info: [Tarjetas de prueba MP Chile](https://www.mercadopago.cl/developers/es/docs/checkout-api/additional-content/your-integrations/test/cards)

---

## 🔧 Troubleshooting

### Error 403: UNAUTHORIZED
- Verifica que `MP_ACCESS_TOKEN` sea válido
- Asegúrate de usar las credenciales de Chile (MLC)

### Error 400: Items inválidos
- `unit_price` debe ser un número entero (CLP no tiene decimales)
- `quantity` debe ser mayor a 0

### Webhook no recibe notificaciones
- Usa ngrok para exponer localhost
- Configura `MP_WEBHOOK_URL` con la URL de ngrok

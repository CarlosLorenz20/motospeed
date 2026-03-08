# 🚀 Guía de Despliegue MotoSpeed en Hostinger

## 📋 Resumen de la Arquitectura

| Componente | Plataforma | URL Final |
|------------|------------|-----------|
| Frontend (React) | Hostinger | https://motosspeed.cl |
| Backend (Node.js) | Hostinger Node.js | https://api.motosspeed.cl (o subdominio) |
| Base de Datos | Hostinger MySQL | (interno) |

> **Ventaja:** TODO en Hostinger - sin servicios externos.

---

## 🔧 PARTE 1: Crear Base de Datos MySQL en Hostinger

### 1.1 Acceder al Panel de MySQL

1. En Hostinger, ve a **Sitios web** → **motosspeed.cl** → **Panel**
2. Busca **"Bases de datos"** → **"MySQL"**
3. Clic en **"Crear nueva base de datos"**

### 1.2 Crear la Base de Datos

Completa con estos datos:
- **Nombre de la BD:** `motospeed`
- **Usuario:** `motospeed_user`
- **Contraseña:** (genera una segura y guárdala)

4. Clic en **Crear**
5. **GUARDA estos datos:**
   - Host: `localhost` (o el que te dé Hostinger)
   - Base de datos: `u123456789_motospeed` (Hostinger le pone prefijo)
   - Usuario: `u123456789_motospeed_user`
   - Contraseña: (la que pusiste)

---

## 🟢 PARTE 2: Desplegar Backend Node.js

### 2.1 Crear Aplicación Node.js

1. En el Panel de Hostinger, clic en **"+ Añadir sitio web"**
2. Selecciona **"Aplicación web Node.js"**
3. Configura:
   - **Repositorio:** Conecta GitHub → `CarlosLorenz20/motospeed`
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Comando de inicio:** `npm start`

### 2.2 Configurar Variables de Entorno

En la sección de variables de entorno, agrega:

```env
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://motosspeed.cl

# MySQL (ajusta con tus datos de Hostinger)
DB_DIALECT=mysql
DB_HOST=localhost
DB_NAME=u123456789_motospeed
DB_USER=u123456789_motospeed_user
DB_PASSWORD=TU_PASSWORD_AQUI
DB_PORT=3306

# JWT
JWT_SECRET=MotoSpeed_Super_Secure_JWT_Key_2026_Production_XyZ123!@#
JWT_EXPIRES_IN=7d

# Mercado Pago
MP_ACCESS_TOKEN=APP_USR-483439952749370-030714-eff56d65476699bf92f231a358a424d4-3249985880
MP_PUBLIC_KEY=APP_USR-10b487b2-d552-441b-aade-0d42942d41a0
MP_WEBHOOK_URL=https://api.motosspeed.cl/api/payments/webhook
MP_SUCCESS_URL=https://motosspeed.cl/checkout/success
MP_FAILURE_URL=https://motosspeed.cl/checkout/failure
MP_PENDING_URL=https://motosspeed.cl/checkout/pending

# Email SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=la2967163@gmail.com
SMTP_PASS=dkks delr wmgf oulq
SMTP_FROM_NAME=MotoSpeed Chile
```

### 2.3 Desplegar

1. Clic en **"Desplegar"** o **"Deploy"**
2. Espera a que termine (2-5 minutos)
3. Verifica que esté corriendo

### 2.4 Configurar Subdominio para API (Opcional)

Si quieres usar `api.motosspeed.cl`:
1. Ve a **Dominios** → **Subdominios**
2. Crea el subdominio `api`
3. Apúntalo a la aplicación Node.js

---

## 🌐 PARTE 3: Desplegar Frontend

### 3.1 Actualizar URL del Backend

Edita `frontend/.env.production` con la URL de tu API:

```env
VITE_API_URL=https://api.motosspeed.cl/api
```

(O la URL que te haya dado Hostinger para Node.js)

### 3.2 Compilar el Frontend

```powershell
cd "C:\Users\carlo\Desktop\MotoSpeed\frontend"
npm install
npm run build
```

### 3.3 Subir a Hostinger

1. En Hostinger → **motosspeed.cl** → **Administrador de archivos**
2. Ve a `public_html`
3. **Elimina** todo el contenido existente
4. Sube todo el contenido de `frontend/dist/`:
   - `index.html`
   - `assets/` (carpeta)
5. Sube también `frontend/public/.htaccess` a `public_html/`

---

## 💳 PARTE 4: Configurar Mercado Pago

### 4.1 Configurar Webhook

1. Ve a https://www.mercadopago.cl/developers/panel/app
2. Selecciona tu aplicación
3. En **Webhooks**, configura:
   ```
   URL: https://api.motosspeed.cl/api/payments/webhook
   Eventos: Pagos
   ```

---

## ✅ PARTE 5: Verificación

### Checklist:
- [ ] **API:** https://api.motosspeed.cl/api/products responde
- [ ] **Frontend:** https://motosspeed.cl carga
- [ ] **Login:** Funciona
- [ ] **Carrito:** Funciona
- [ ] **Checkout:** Abre Mercado Pago
- [ ] **Pago:** Completa correctamente

### Credenciales de Prueba MP:
```
Usuario: TESTUSER1746028556
Contraseña: N4Wt4CuHJj

Tarjeta: 4509 9535 6623 3704
Vencimiento: 11/30
CVV: 123
Nombre: APRO
```

---

## 🐛 Solución de Problemas

### Error de conexión a BD
- Verifica las credenciales de MySQL en las variables de entorno
- El host suele ser `localhost` en Hostinger

### CORS Error
- Verifica que `FRONTEND_URL` tenga la URL correcta sin / al final

### 404 en rutas del frontend
- Asegúrate de que `.htaccess` esté en `public_html/`

---

## 📁 Estructura Final

```
Hostinger:
├── motosspeed.cl (Web Hosting)
│   └── public_html/     ← Frontend React
│       ├── index.html
│       ├── assets/
│       └── .htaccess
├── api.motosspeed.cl (Node.js App)
│   └── backend/         ← Backend Node.js  
└── MySQL
    └── motospeed        ← Base de datos
```

---

¡Buena suerte! 🚀


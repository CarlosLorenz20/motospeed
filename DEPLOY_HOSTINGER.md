# 🚀 Guía de Despliegue MotoSpeed en Hostinger + Render

## 📋 Resumen de la Arquitectura

| Componente | Plataforma | URL Final |
|------------|------------|-----------|
| Frontend (React) | Hostinger | https://motosspeed.com |
| Backend (Node.js) | Render.com (GRATIS) | https://motospeed-api.onrender.com |
| Base de Datos | Render PostgreSQL (GRATIS) | (interno) |

> **Nota:** Hostinger Business es hosting compartido (solo PHP). El backend Node.js va en Render.com que es 100% gratis.

---

## 🔧 PARTE 1: Preparar el Proyecto para Producción

### 1.1 Archivos Ya Creados

Los siguientes archivos ya están listos en tu proyecto:

- ✅ `frontend/.env.production` - Variables de entorno del frontend
- ✅ `frontend/public/.htaccess` - Configuración Apache para React Router
- ✅ `backend/src/config/db.js` - Soporte para DATABASE_URL
- ✅ `.gitignore` - Archivos a ignorar en Git

### 1.2 Variables de Entorno para Render (Backend)

Estas son las variables que configurarás en Render:

```env
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://motosspeed.com

# PostgreSQL - Render genera DATABASE_URL automáticamente

# JWT
JWT_SECRET=MotoSpeed_Super_Secure_JWT_Key_2026_Production_XyZ123!@#
JWT_EXPIRES_IN=7d

# Mercado Pago (credenciales de prueba)
MP_ACCESS_TOKEN=APP_USR-483439952749370-030714-eff56d65476699bf92f231a358a424d4-3249985880
MP_PUBLIC_KEY=APP_USR-10b487b2-d552-441b-aade-0d42942d41a0
MP_WEBHOOK_URL=https://motospeed-api.onrender.com/api/payments/webhook
MP_SUCCESS_URL=https://motosspeed.com/checkout/success
MP_FAILURE_URL=https://motosspeed.com/checkout/failure
MP_PENDING_URL=https://motosspeed.com/checkout/pending

# Email SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=la2967163@gmail.com
SMTP_PASS=dkks delr wmgf oulq
SMTP_FROM_NAME=MotoSpeed Chile
```

---

## 🚂 PARTE 2: Desplegar Backend en Render.com (GRATIS)

### 2.1 Crear Cuenta en Render

1. Ve a **https://render.com**
2. Clic en **"Get Started for Free"**
3. Selecciona **"GitHub"** para registrarte
4. Autoriza Render a acceder a tu GitHub

### 2.2 Crear Base de Datos PostgreSQL

**PRIMERO creamos la base de datos:**

1. En el Dashboard de Render, clic en **"New +"** → **"PostgreSQL"**
2. Completa:
   - **Name:** `motospeed-db`
   - **Database:** `motospeed`
   - **User:** dejar por defecto
   - **Region:** Oregon (US West) - es el más rápido
   - **Plan:** **Free** ✅
3. Clic en **"Create Database"**
4. Espera ~2 minutos a que se cree
5. **COPIA** el valor de **"Internal Database URL"** (lo necesitarás)

### 2.3 Crear Web Service (Backend)

1. Clic en **"New +"** → **"Web Service"**
2. Selecciona **"Build and deploy from a Git repository"** → **Next**
3. Conecta tu repositorio **CarlosLorenz20/motospeed**
4. Configura:
   - **Name:** `motospeed-api`
   - **Region:** Oregon (US West) - igual que la BD
   - **Branch:** `main`
   - **Root Directory:** `backend`  ⚠️ **MUY IMPORTANTE**
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** **Free** ✅

5. Clic en **"Advanced"** para agregar variables de entorno

### 2.4 Configurar Variables de Entorno

En la sección "Environment Variables", agrega estas (una por una):

```
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://motosspeed.com
DATABASE_URL=[PEGAR LA URL DE LA BD QUE COPIASTE]
JWT_SECRET=MotoSpeed_Super_Secure_JWT_Key_2026_Production_XyZ123!@#
JWT_EXPIRES_IN=7d
MP_ACCESS_TOKEN=APP_USR-483439952749370-030714-eff56d65476699bf92f231a358a424d4-3249985880
MP_PUBLIC_KEY=APP_USR-10b487b2-d552-441b-aade-0d42942d41a0
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=la2967163@gmail.com
SMTP_PASS=dkks delr wmgf oulq
SMTP_FROM_NAME=MotoSpeed Chile
```

**NOTA:** Las URLs de MP (webhook, success, etc.) las agregarás DESPUÉS de obtener la URL del servicio.

6. Clic en **"Create Web Service"**

### 2.5 Esperar el Deploy

- Render tardará ~3-5 minutos en hacer el primer deploy
- Verás los logs en tiempo real
- Cuando termine, verás **"Live"** en verde

### 2.6 Obtener URL del Backend

Tu URL será algo como:
```
https://motospeed-api.onrender.com
```

### 2.7 Completar Variables de Mercado Pago

1. Ve a tu servicio → **"Environment"**
2. Agrega las variables faltantes:

```
MP_WEBHOOK_URL=https://motospeed-api.onrender.com/api/payments/webhook
MP_SUCCESS_URL=https://motosspeed.com/checkout/success
MP_FAILURE_URL=https://motosspeed.com/checkout/failure
MP_PENDING_URL=https://motosspeed.com/checkout/pending
```

3. Render hará redeploy automático

### 2.8 Verificar que Funciona

Abre en el navegador:
```
https://motospeed-api.onrender.com/api/products
```

Deberías ver `[]` (array vacío) o lista de productos.

### 2.9 Poblar Base de Datos

Para cargar datos iniciales:

1. En Render, ve a tu Web Service
2. Clic en **"Shell"** (pestaña arriba)
3. Ejecuta: `npm run seed`

O temporalmente cambia el Start Command a:
```
npm run seed && npm start
```
Y después de un deploy exitoso, vuelve a `npm start`

---

## 🌐 PARTE 3: Desplegar Frontend en Hostinger

### 3.1 Actualizar URL del Backend en Frontend

**ANTES de compilar**, edita `frontend/.env.production`:

```env
VITE_API_URL=https://motospeed-api.onrender.com/api
```

### 3.2 Compilar el Frontend

**Opción A: Usando el script (recomendado)**

Haz doble clic en `build-frontend.bat` en la carpeta del proyecto.

**Opción B: Manual en PowerShell**

```powershell
cd "C:\Users\carlo\Desktop\MotoSpeed\frontend"
npm install
npm run build
```

Esto crea la carpeta `dist/` con los archivos listos para producción.

### 3.3 Subir a Hostinger

**Paso 1:** Entra a tu panel de Hostinger
**Paso 2:** Ve a **Sitios web** → **motosspeed.cl** → **Panel**
**Paso 3:** Clic en **"Administrador de archivos"**
**Paso 4:** Navega a `public_html`
**Paso 5:** **ELIMINA TODO** el contenido existente (seleccionar todo → eliminar)
**Paso 6:** Sube los archivos:

Desde tu computador, sube TODO el contenido de:
```
C:\Users\carlo\Desktop\MotoSpeed\frontend\dist\
```

Deberías subir:
- `index.html`
- `assets/` (carpeta completa con JS, CSS, imágenes)
- Cualquier otro archivo que haya en dist

**Paso 7:** Sube el archivo `.htaccess`

Este archivo está en:
```
C:\Users\carlo\Desktop\MotoSpeed\frontend\public\.htaccess
```

Súbelo directamente a `public_html/` (al mismo nivel que index.html)

### 3.4 Verificar Frontend

Abre https://motosspeed.cl - deberías ver la tienda.

Si ves error 404 al navegar, verifica que el `.htaccess` esté subido.

---

## 💳 PARTE 4: Configurar Mercado Pago

### 4.1 Configurar Webhook en Panel de Mercado Pago

1. Ve a https://www.mercadopago.cl/developers/panel/app
2. Selecciona tu aplicación (o crea una nueva)
3. Ve a **"Webhooks"** o **"Notificaciones IPN"**
4. En **"URL de producción"** ingresa:
   ```
   https://motospeed-api.onrender.com/api/payments/webhook
   ```
5. Selecciona eventos: **Pagos**
6. Guarda cambios

### 4.2 Probar Webhook (Opcional)

```powershell
# Desde PowerShell, prueba que el webhook responda
Invoke-RestMethod -Method POST -Uri "https://motospeed-api.onrender.com/api/payments/webhook" -ContentType "application/json" -Body '{"type":"test"}'
```

Debería responder "OK".

---

## ✅ PARTE 5: Verificación Final

### 5.1 Checklist Rápido

- [ ] **Backend:** https://motospeed-api.onrender.com/api/products devuelve JSON
- [ ] **Frontend:** https://motosspeed.cl carga la tienda
- [ ] **Registro:** Crear cuenta funciona y envía email de bienvenida
- [ ] **Login:** Iniciar sesión funciona
- [ ] **Carrito:** Agregar productos al carrito funciona
- [ ] **Checkout:** Clic en "Pagar" abre Mercado Pago
- [ ] **Pago:** Completar pago de prueba → vuelve a la tienda con éxito

### 5.2 Credenciales de Prueba

**Usuario comprador de prueba:**
```
Email: TESTUSER1746028556
Contraseña: N4Wt4CuHJj
```

**Tarjeta de prueba (Chile):**
```
Número: 4509 9535 6623 3704  
Vencimiento: 11/30  
CVV: 123  
Nombre: APRO
DNI/RUT: 11111111-1
```

---

## 🐛 PARTE 6: Solución de Problemas

### Error: CORS (blocked by CORS policy)
**Causa:** El backend no permite requests del frontend.
**Solución:** Verifica que `FRONTEND_URL=https://motosspeed.cl` esté en Render.

### Error: Mixed Content
**Causa:** Frontend HTTPS llama a backend HTTP.
**Solución:** Asegúrate de usar HTTPS en todas las URLs.

### Error: 404 en rutas (al refrescar página)
**Causa:** Falta el archivo .htaccess.
**Solución:** Sube `.htaccess` a `public_html/`.

### Error: "Cannot connect to database"
**Causa:** PostgreSQL no está vinculado.
**Solución:** Verifica que `DATABASE_URL` esté en las variables de Render.

### Error: Webhook no funciona
**Causa:** URL incorrecta o servicio dormido.
**Solución:** 
1. Verifica la URL en el panel de MP
2. Revisa logs en Render (pestaña "Logs")
3. El servicio gratuito de Render "duerme" después de 15 min de inactividad

### El servicio está dormido (tarda en responder)
**Causa:** Render Free duerme servicios inactivos.
**Solución:** La primera request tarda ~30 segundos en "despertar". Es normal en el plan gratuito.

### El pago se acredita pero no vuelve a la tienda
**Causa:** Las URLs de retorno están mal configuradas.
**Solución:** Verifica en Render:
```
MP_SUCCESS_URL=https://motosspeed.cl/checkout/success
MP_FAILURE_URL=https://motosspeed.cl/checkout/failure
MP_PENDING_URL=https://motosspeed.cl/checkout/pending
```

---

## 📁 Estructura de Archivos para Referencia

```
MotoSpeed/
├── backend/                    ← Despliega en Render.com
│   ├── src/
│   ├── uploads/
│   ├── package.json
│   └── .env (solo local)
├── frontend/                   
│   ├── src/
│   ├── public/
│   │   └── .htaccess          ← Subir a Hostinger
│   ├── dist/                  ← Subir contenido a Hostinger
│   ├── package.json
│   └── .env.production
├── .gitignore
├── build-frontend.bat         ← Script para compilar
└── DEPLOY_HOSTINGER.md        ← Esta guía
```

---

## 🎯 URLs Finales

| Recurso | URL |
|---------|-----|
| Frontend | https://motosspeed.cl |
| API Backend | https://motospeed-api.onrender.com/api |
| Webhook MP | https://motospeed-api.onrender.com/api/payments/webhook |
| Success | https://motosspeed.cl/checkout/success |
| Failure | https://motosspeed.cl/checkout/failure |
| Pending | https://motosspeed.cl/checkout/pending |

---

## ⚠️ Notas sobre Render Free

1. **El servicio duerme** después de 15 minutos de inactividad
2. **La primera visita** puede tardar 30-60 segundos en "despertar"
3. **750 horas gratis/mes** - suficiente para un sitio pequeño
4. Para un sitio de producción real, considera el plan Starter ($7/mes)

---

## 🆘 Soporte

Si tienes problemas:
1. **Backend:** Revisa logs en Render → Tu servicio → Logs
2. **Frontend:** Abre DevTools (F12) → Console para ver errores
3. **MP:** Revisa el panel de desarrolladores de Mercado Pago

¡Buena suerte con el despliegue! 🚀


# 🚀 Guía de Despliegue MotoSpeed en Hostinger

## 📋 Resumen de la Arquitectura

| Componente | Plataforma | URL Final |
|------------|------------|-----------|
| Frontend (React) | Hostinger | https://motosspeed.com |
| Backend (Node.js) | Railway (gratis) | https://motospeed-backend-production.up.railway.app |
| Base de Datos | Railway PostgreSQL | (interno) |

> **Nota:** Hostinger hosting compartido NO soporta Node.js backend. Usaremos Railway (gratuito) para el backend y Hostinger para el frontend estático.

---

## 🔧 PARTE 1: Preparar el Proyecto para Producción

### 1.1 Archivos Ya Creados

Los siguientes archivos ya están listos en tu proyecto:

- ✅ `frontend/.env.production` - Variables de entorno del frontend
- ✅ `frontend/public/.htaccess` - Configuración Apache para React Router
- ✅ `backend/railway.toml` - Configuración de Railway
- ✅ `backend/src/config/db.js` - Soporte para DATABASE_URL
- ✅ `.gitignore` - Archivos a ignorar en Git

### 1.2 Variables de Entorno para Railway (Backend)

Estas son las variables que configurarás en Railway:

```env
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://motosspeed.com

# PostgreSQL (Railway auto-configura DATABASE_URL)
# DATABASE_URL se genera automáticamente al vincular PostgreSQL

# JWT
JWT_SECRET=MotoSpeed_Super_Secure_JWT_Key_2026_Production_XyZ123!@#
JWT_EXPIRES_IN=7d

# Mercado Pago (credenciales de prueba)
MP_ACCESS_TOKEN=APP_USR-483439952749370-030714-eff56d65476699bf92f231a358a424d4-3249985880
MP_PUBLIC_KEY=APP_USR-10b487b2-d552-441b-aade-0d42942d41a0
MP_WEBHOOK_URL=https://TU-APP.up.railway.app/api/payments/webhook
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

## 🚂 PARTE 2: Desplegar Backend en Railway (Gratis)

### 2.1 Crear Cuenta en Railway

1. Ve a **https://railway.app**
2. Clic en **"Login"** → **"Login with GitHub"**
3. Autoriza Railway

### 2.2 Subir Proyecto a GitHub (si no lo tienes)

Abre PowerShell en la carpeta del proyecto:

```powershell
cd "C:\Users\carlo\Desktop\MotoSpeed"

# Inicializar repositorio
git init

# Agregar archivos
git add .

# Primer commit
git commit -m "MotoSpeed E-commerce inicial"

# Crear repositorio en GitHub y conectar
# Opción 1: Ir a github.com, crear repo "motospeed", luego:
git remote add origin https://github.com/TU_USUARIO/motospeed.git
git branch -M main
git push -u origin main
```

### 2.3 Crear Proyecto en Railway

1. En Railway, clic **"New Project"**
2. Selecciona **"Deploy from GitHub repo"**
3. Busca y selecciona tu repositorio **motospeed**
4. **MUY IMPORTANTE:** Ve a **Settings** del servicio creado
5. En **"Root Directory"** escribe: `backend`
6. Clic en **Save** y espera que redeploy

### 2.4 Agregar Base de Datos PostgreSQL

1. En tu proyecto Railway, clic **"+ New"** (botón morado)
2. Selecciona **"Database"** → **"Add PostgreSQL"**
3. Espera que se cree (toma ~30 segundos)
4. Railway vinculará automáticamente la variable `DATABASE_URL`

### 2.5 Configurar Variables de Entorno

1. Clic en tu servicio **backend** (no la BD)
2. Ve a la pestaña **"Variables"**
3. Clic **"+ New Variable"** y agrega UNA POR UNA:

```
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://motosspeed.com
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

4. **IMPORTANTE:** Las URLs de MP las agregarás DESPUÉS de obtener el dominio

### 2.6 Obtener Dominio del Backend

1. Ve a **Settings** → **Networking** → **Generate Domain**
2. Railway generará algo como: `motospeed-backend-production.up.railway.app`
3. **Copia este dominio**

### 2.7 Completar Variables de Mercado Pago

Vuelve a **Variables** y agrega (reemplaza TU-DOMINIO):

```
MP_WEBHOOK_URL=https://TU-DOMINIO.up.railway.app/api/payments/webhook
MP_SUCCESS_URL=https://motosspeed.com/checkout/success
MP_FAILURE_URL=https://motosspeed.com/checkout/failure
MP_PENDING_URL=https://motosspeed.com/checkout/pending
```

### 2.8 Verificar que Funciona

Abre en el navegador:
```
https://TU-DOMINIO.up.railway.app/api/products
```

Deberías ver un JSON con productos (o array vacío si no hay datos).

### 2.9 Poblar Base de Datos (Opcional)

Para cargar datos de prueba, en Railway:

1. Ve a tu servicio backend
2. Clic en **"Settings"** → **"Deploy"**
3. En **Start Command** cambia temporalmente a:
   ```
   npm run seed && npm start
   ```
4. Clic **Save** → Espera deploy
5. **IMPORTANTE:** Después del primer deploy exitoso, vuelve a cambiar a:
   ```
   npm start
   ```

---

## 🌐 PARTE 3: Desplegar Frontend en Hostinger

### 3.1 Actualizar URL del Backend en Frontend

**ANTES de compilar**, edita `frontend/.env.production`:

```env
VITE_API_URL=https://TU-DOMINIO-RAILWAY.up.railway.app/api
```

Reemplaza `TU-DOMINIO-RAILWAY` con el dominio real de Railway.

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
**Paso 2:** Ve a **Sitios web** → **motosspeed.com** → **Panel**
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

Abre https://motosspeed.com - deberías ver la tienda.

Si ves error 404 al navegar, verifica que el `.htaccess` esté subido.

---

## 💳 PARTE 4: Configurar Mercado Pago

### 4.1 Configurar Webhook en Panel de Mercado Pago

1. Ve a https://www.mercadopago.cl/developers/panel/app
2. Selecciona tu aplicación (o crea una nueva)
3. Ve a **"Webhooks"** o **"Notificaciones IPN"**
4. En **"URL de producción"** ingresa:
   ```
   https://TU-DOMINIO-RAILWAY.up.railway.app/api/payments/webhook
   ```
5. Selecciona eventos: **Pagos**
6. Guarda cambios

### 4.2 Probar Webhook (Opcional)

```powershell
# Desde PowerShell, prueba que el webhook responda
Invoke-RestMethod -Method POST -Uri "https://TU-DOMINIO-RAILWAY.up.railway.app/api/payments/webhook" -ContentType "application/json" -Body '{"type":"test"}'
```

Debería responder "OK".

---

## ✅ PARTE 5: Verificación Final

### 5.1 Checklist Rápido

- [ ] **Backend:** https://TU-DOMINIO.up.railway.app/api/products devuelve JSON
- [ ] **Frontend:** https://motosspeed.com carga la tienda
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
**Solución:** Verifica que `FRONTEND_URL=https://motosspeed.com` esté en Railway.

### Error: Mixed Content
**Causa:** Frontend HTTPS llama a backend HTTP.
**Solución:** Asegúrate de usar HTTPS en todas las URLs.

### Error: 404 en rutas (al refrescar página)
**Causa:** Falta el archivo .htaccess.
**Solución:** Sube `.htaccess` a `public_html/`.

### Error: "Cannot connect to database"
**Causa:** PostgreSQL no está vinculado.
**Solución:** En Railway, verifica que la BD esté conectada y `DATABASE_URL` exista en variables.

### Error: Webhook no funciona
**Causa:** URL incorrecta o servicio caído.
**Solución:** 
1. Verifica la URL en el panel de MP
2. Revisa logs en Railway (pestaña "Deployments" → clic en deploy → "View Logs")

### El pago se acredita pero no vuelve a la tienda
**Causa:** Las URLs de retorno están mal configuradas.
**Solución:** Verifica en Railway:
```
MP_SUCCESS_URL=https://motosspeed.com/checkout/success
MP_FAILURE_URL=https://motosspeed.com/checkout/failure
MP_PENDING_URL=https://motosspeed.com/checkout/pending
```

---

## 📁 Estructura de Archivos para Referencia

```
MotoSpeed/
├── backend/                    ← Despliega en Railway
│   ├── src/
│   ├── uploads/
│   ├── package.json
│   ├── railway.toml
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

## 🎯 URLs Finales (ejemplo)

| Recurso | URL |
|---------|-----|
| Frontend | https://motosspeed.com |
| API Backend | https://motospeed-backend-production.up.railway.app/api |
| Webhook MP | https://motospeed-backend-production.up.railway.app/api/payments/webhook |
| Success | https://motosspeed.com/checkout/success |
| Failure | https://motosspeed.com/checkout/failure |
| Pending | https://motosspeed.com/checkout/pending |

---

## 🆘 Soporte

Si tienes problemas:
1. **Backend:** Revisa logs en Railway → Deployments → View Logs
2. **Frontend:** Abre DevTools (F12) → Console para ver errores
3. **MP:** Revisa el panel de desarrolladores de Mercado Pago

¡Buena suerte con el despliegue! 🚀


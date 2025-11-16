# 🚀 Guía de Configuración para Producción

Esta guía te llevará paso a paso para configurar tu aplicación en producción con un dominio real.

---

## 📋 Checklist de Servicios Necesarios

- [ ] **Dominio** (GoDaddy)
- [ ] **Hosting** (Vercel - Gratis)
- [ ] **Base de Datos** (Supabase - Gratis)
- [ ] **Pagos** (Stripe)
- [ ] **Emails** (Resend - Gratis)

---

## 1. 🌐 DOMINIO (GoDaddy)

### Comprar el Dominio

1. Ve a: https://www.godaddy.com
2. Busca tu dominio (ejemplo: `beautysalon.com`)
3. Cómpralo (costo aprox: $12-15/año)

### ⚠️ IMPORTANTE:
**NO necesitas** hosting de GoDaddy. Solo el dominio.
Declina todas las ofertas de hosting, email, etc.

---

## 2. 🚀 HOSTING (Vercel - GRATIS)

### Crear Cuenta en Vercel

1. Ve a: https://vercel.com/signup
2. **Regístrate con GitHub** (recomendado)
3. Es **100% GRATIS** para proyectos personales

### Subir tu Proyecto a GitHub

```bash
# En tu proyecto
cd /Users/caballerorandy/Desktop/Freelance\ Projects/my-app

# Inicializar git (si no lo hiciste)
git add .
git commit -m "Initial commit"

# Crear repositorio en GitHub.com
# Luego conectarlo:
git remote add origin https://github.com/TU_USUARIO/beauty-salon.git
git push -u origin main
```

### Deploy en Vercel

1. Ve a: https://vercel.com/new
2. Importa tu repositorio de GitHub
3. **Framework Preset:** Next.js (se detecta automáticamente)
4. **No configures variables de entorno aún**
5. Click en **Deploy**

Espera 2-3 minutos. Te dará una URL temporal:
```
https://beauty-salon-xyz.vercel.app
```

---

## 3. 🗄️ BASE DE DATOS (Supabase - GRATIS)

### Crear Cuenta

1. Ve a: https://supabase.com
2. **Sign up** con GitHub
3. Click en **"New project"**

### Configurar Proyecto

```
Organization: Tu nombre
Project name: beauty-salon
Database Password: [GENERA UNA FUERTE - GUÁRDALA]
Region: East US (o el más cercano)
Pricing Plan: FREE
```

Click **Create new project** (tarda 1-2 minutos)

### Obtener la Connection String

1. En Supabase, ve a **Settings** → **Database**
2. Busca **"Connection string"**
3. Selecciona **"URI"**
4. Copia la URL (se ve así):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxx.supabase.co:5432/postgres
   ```
5. Reemplaza `[YOUR-PASSWORD]` con tu password

### Configurar en Vercel

1. Ve a tu proyecto en Vercel
2. **Settings** → **Environment Variables**
3. Agrega:
   ```
   DATABASE_URL = postgresql://postgres:TU_PASSWORD@db.xxxxx.supabase.co:5432/postgres
   ```

---

## 4. 💳 STRIPE (Pagos)

### Crear Cuenta

1. Ve a: https://dashboard.stripe.com/register
2. Regístrate con tu email
3. Completa la verificación

### Obtener API Keys (MODO TEST)

1. Ve a: https://dashboard.stripe.com/test/apikeys
2. Copia las keys:
   ```
   Publishable key: pk_test_xxxxx
   Secret key: sk_test_xxxxx
   ```

### Configurar Webhook

1. Ve a: https://dashboard.stripe.com/test/webhooks
2. Click **"Add endpoint"**
3. **Endpoint URL:**
   ```
   https://TU-DOMINIO.vercel.app/api/webhooks/stripe
   ```
4. **Events to send:**
   - ✅ `checkout.session.completed`
   - ✅ `payment_intent.succeeded`
5. Click **Add endpoint**
6. Copia el **Signing secret** (empieza con `whsec_`)

### Variables de Entorno en Vercel

```
STRIPE_SECRET_KEY = sk_test_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_test_xxxxx
STRIPE_WEBHOOK_SECRET = whsec_xxxxx
```

### ⚠️ Activar Modo Producción (Cuando estés listo)

1. Completa la activación de cuenta en Stripe
2. Cambia a **Live mode** (switch arriba a la derecha)
3. Obtén las keys de producción (empiezan con `pk_live_` y `sk_live_`)
4. Actualiza las variables en Vercel

---

## 5. 📧 RESEND (Emails - GRATIS)

### Crear Cuenta

1. Ve a: https://resend.com/signup
2. Regístrate con GitHub
3. **Plan FREE:** 3,000 emails/mes GRATIS

### Obtener API Key

1. Ve a: https://resend.com/api-keys
2. Click **"Create API Key"**
3. **Name:** `beauty-salon-production`
4. **Permission:** Full Access
5. Copia la key (empieza con `re_`)

### Configurar Dominio (Importante para emails profesionales)

1. En Resend, ve a **Domains**
2. Click **"Add Domain"**
3. Ingresa tu dominio: `beautysalon.com`
4. Copia los **DNS records** que te da

5. Ve a GoDaddy:
   - **My Products** → **DNS** (de tu dominio)
   - Agrega los registros DNS de Resend:
     ```
     Tipo: TXT
     Nombre: @
     Valor: [lo que te dio Resend]

     Tipo: CNAME
     Nombre: resend._domainkey
     Valor: [lo que te dio Resend]
     ```

6. Espera 15-30 minutos para verificación

### Variables de Entorno en Vercel

```
RESEND_API_KEY = re_xxxxx
RESEND_FROM_EMAIL = noreply@beautysalon.com
```

---

## 6. 🌐 CONECTAR DOMINIO REAL

### En GoDaddy (Configurar DNS)

1. Ve a **My Products** → Click en **DNS** de tu dominio
2. Busca los registros **A** y **CNAME**
3. **ELIMINA** los registros A existentes
4. **Agrega estos registros:**

```
Tipo: A
Nombre: @
Valor: 76.76.21.21
TTL: 600

Tipo: CNAME
Nombre: www
Valor: cname.vercel-dns.com
TTL: 600
```

### En Vercel (Agregar Dominio)

1. Ve a tu proyecto en Vercel
2. **Settings** → **Domains**
3. **Add Domain:**
   ```
   beautysalon.com
   www.beautysalon.com
   ```
4. Vercel verificará automáticamente (5-10 minutos)

### Actualizar Variables de Entorno

En Vercel, actualiza:

```
NEXTAUTH_URL = https://beautysalon.com
NEXT_PUBLIC_APP_URL = https://beautysalon.com
```

---

## 7. ✅ CONFIGURACIÓN FINAL

### Archivo .env.production (Crear)

```env
# Base de Datos (Supabase)
DATABASE_URL="postgresql://postgres:PASSWORD@db.xxxxx.supabase.co:5432/postgres"

# Next Auth
NEXTAUTH_URL="https://beautysalon.com"
NEXTAUTH_SECRET="iVSLL5p7T4vCI8ETmOUNApYognpTxtd+cy0khBijZmo="

# Stripe (PRODUCCIÓN)
STRIPE_SECRET_KEY="sk_live_xxxxx"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_xxxxx"
STRIPE_WEBHOOK_SECRET="whsec_xxxxx"

# Resend
RESEND_API_KEY="re_xxxxx"
RESEND_FROM_EMAIL="noreply@beautysalon.com"

# App
NEXT_PUBLIC_APP_URL="https://beautysalon.com"
```

### Crear Tablas en Supabase

Una vez que tengas la base de datos de Supabase configurada:

```bash
# Actualiza tu .env local con la URL de Supabase
# Luego ejecuta:
pnpm db:push
```

O en Vercel, después del deploy, ejecuta las migraciones desde tu local:

```bash
# Con DATABASE_URL de Supabase en tu .env
pnpm db:migrate
```

---

## 💰 COSTOS TOTALES

| Servicio | Costo |
|----------|-------|
| **Dominio** (GoDaddy) | $12-15/año |
| **Hosting** (Vercel) | GRATIS |
| **Base de Datos** (Supabase) | GRATIS (hasta 500MB) |
| **Emails** (Resend) | GRATIS (3,000/mes) |
| **Stripe** | GRATIS (comisión 2.9% + $0.30 por transacción) |
| **TOTAL** | ~$15/año |

---

## 🎯 ORDEN DE CONFIGURACIÓN RECOMENDADO

1. ✅ Comprar dominio en GoDaddy
2. ✅ Crear cuenta en Vercel
3. ✅ Subir código a GitHub
4. ✅ Deploy en Vercel
5. ✅ Crear base de datos en Supabase
6. ✅ Configurar Stripe (modo test)
7. ✅ Configurar Resend
8. ✅ Conectar dominio a Vercel
9. ✅ Configurar DNS en Resend
10. ✅ Probar todo en modo test
11. ✅ Activar Stripe en modo producción

---

## 🆘 SOPORTE

Si tienes problemas en algún paso, avísame en qué servicio y te ayudo específicamente.

---

## 📝 NOTAS IMPORTANTES

- **Desarrollo:** Usa `.env` (con localhost y Docker)
- **Producción:** Usa variables en Vercel
- **Nunca** subas `.env` a GitHub (ya está en `.gitignore`)
- Guarda tus passwords y keys en un lugar seguro (1Password, etc.)

---

¡Buena suerte! 🚀

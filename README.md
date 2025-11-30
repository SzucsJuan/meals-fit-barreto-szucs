# Meals&Fit

Meals&Fit es una plataforma web y mobile para planificación de comidas, recetas y seguimiento nutricional.  
Incluye:

- **Backend**: API REST en Laravel (PHP)
- **Frontend Web**: Next.js + React + TypeScript
- **App Mobile**: React Native (Expo) consumiendo la misma API

---

## 📦 Requisitos previos

### Backend (Laravel)

- PHP >= 8.1
- Composer 2+
- Extensiones PHP comunes (pdo, mbstring, openssl, etc.)
- Base de datos: MySQL
- Node.js >= 18
- NPM

### Frontend (Next.js)

- Node.js >= 18
- NPM

### Mobile (React Native / Expo)

- Node.js >= 18
- PNPM
- Expo CLI (`npx expo`)
- Android Studio / Xcode (para emulador) o Celular Android

---

## 🧱 Estructura del proyecto

```bash
.
├─ backend/           # API Laravel (Meals&Fit backend)
├─ frontend/          # Frontend web (Next.js)
-Git Mobile
└─ MealsFitMobile/            # App mobile (React Native / Expo)

-------------------------------------------------------------------------------------

💾 Instalación de dependencias (backend/laravel)

cd backend\laravel

# Instalar dependencias PHP
composer install

# Copiar archivo de entorno
cp .env.example .env

# Generar APP_KEY
php artisan key:generate


-------------------------------------------------------------------------------------

💾 Instalación de dependencias (frontend)

cd frontend

# Instalar dependencias
npm install

# Crear archivo de entorno
cp .env.example .env.local

-------------------------------------------------------------------------------------

▶️ Correr proyecto en local
--Generar BD en MySQL => nombre: meals_fit_db

--Levantar back (API Laravel)

cd backend\laravel

# Ejecutar migraciones
php artisan migrate
# Ejecutar seeders
php artisan db:seed

# Enlazar storage
php artisan storage:link

# Levantar servidor de desarrollo
php artisan serve --host=0.0.0.0 --port=8000
# Back disponible en:
# 👉 http://localhost:8000

--Levantar front (Next.js)

cd frontend

npm run dev

# Front disponible en:
# 👉 http://localhost:3000

-------------------------------------------------------------------------------------

🏛 Arquitectura técnica

## Backend (API)
Framework: Laravel
Patrón: API REST
Autenticación: Laravel Sanctum (cookies / tokens)
BD relacional (MySQL)
Entidades principales: Users, Recipes, Ingredients, MealLogs, MealDetails, Favorites, Votes, Achievements, NutritionPlans, Goals.

### Servicios:
Generación de objetivos nutricionales (IA o reglas determinísticas)
Manejo de imágenes de recetas (storage local, thumbnails, WebP)

## Frontend Web
Framework: Next.js (React + TypeScript)
UI: componentes propios + librerías UI
Comunicación con API vía fetch/axios y hooks custom (useRecipes, useMealLog, etc.)
Gestión de estado ligera (React Query / hooks / context, según tu implementación)
SSR/CSR híbrido

## 📱 App Mobile
Framework: React Native (Expo)
Navegación: React Navigation
Consumo de la misma API Laravel
Flujo de login, registro, CRUD de recetas, listado de recetas y detalle.

-------------------------------------------------------------------------------------

## 📚 Librerías Principales Utilizadas

🧰 Backend – Laravel
Dependencias principales
laravel/framework — Framework principal
laravel/sanctum — Autenticación API segura
guzzlehttp/guzzle — Cliente HTTP para integraciones externas
fruitcake/laravel-cors — CORS para permitir acceso desde web y mobile
intervention/image — Procesamiento y optimización de imágenes
laravel/tinker — Consola interactiva para debugging
Dependencias de desarrollo
doctrine/dbal — Modificaciones avanzadas de BD
laravel/telescope — Herramienta de debugging avanzado
barryvdh/laravel-ide-helper — Autocompletado para IDE
fakerphp/faker — Datos falsos para seeders
phpunit/phpunit — Testing
mockery/mockery — Mocking para tests
nunomaduro/collision — Mejor manejo de errores en consola

🎨 Frontend – Next.js
$Framework & Core
next 15.x
react 19
react-dom 19
typescript
UI / Componentes
Radix UI (@radix-ui/react-*) — base de componentes accesibles
shadcn/ui — sistema de componentes estilado
lucide-react — iconos
cmdk — Command Palette
sonner — notificaciones
vaul — drawers modernos
Estilos
tailwindcss
postcss
autoprefixer
tailwindcss-animate
tailwind-merge
geist
clsx
class-variance-authority
tw-animate-css

$Formularios / Validación
react-hook-form
@hookform/resolvers
zod

$Utilidades
date-fns — fechas
embla-carousel-react — carouseles
react-resizable-panels
react-day-picker
recharts — gráficos
@vercel/analytics

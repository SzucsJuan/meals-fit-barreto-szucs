#Imagen base de PHP con CLI (funciona para el "artisan serve" de este caso, pero se recomienda FPM para producción)
FROM php:8.2-cli

#Instalar dependencias del sistema y extensiones PDO para MySQL y PostgreSQL
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    libpq-dev \
    # Dependencias para PostgreSQL (libpq-dev) y compresión (libzip-dev)
    && docker-php-ext-install pdo_mysql pdo_pgsql zip \
    # Limpieza del cache
    && rm -rf /var/lib/apt/lists/*

#Instalar Composer desde la imagen oficial
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

#Directorio de trabajo dentro del contenedor
WORKDIR /var/www/html

#Copiar código de la app
COPY . .

#Instalar dependencias de Laravel (incluyendo require-dev, útil para testing en CI)
RUN composer install --optimize-autoloader --no-interaction --prefer-dist

#IMPORTANTE: Usamos no-dev para producción y optimizar la instalación.
#Si necesitas librerías de desarrollo (ej. Faker para seeding),
#quita la bandera "--no-dev" y asegúrate de que Cloudinary se instale (composer require cloudinary-labs/cloudinary-laravel)
#PORT por defecto (Render inyecta su propio PORT en runtime)
ENV PORT=10000

#Comando de arranque:
#Ejecutar migraciones (obligatorio)
#Ejecutar seeding (si es necesario)
#Levantar el servidor de desarrollo de Laravel
CMD ["sh", "-c", "php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=$PORT"]
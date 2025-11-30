# Imagen base de PHP con CLI
FROM php:8.2-cli

# Instalar dependencias del sistema y extensiones para PostgreSQL (Render) y/o MySQL
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql zip \
    && rm -rf /var/lib/apt/lists/*

# Instalar Composer desde la imagen oficial
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Directorio de trabajo dentro del contenedor
WORKDIR /var/www/html

# Copiamos el código de la app dentro del contenedor
COPY . .

# Instalar dependencias de Laravel y optimizar autoloader
RUN composer install --optimize-autoloader --no-interaction --prefer-dist

# Opcional: cachear config y rutas (si tus env vars ya están listas)
# RUN php artisan config:cache && php artisan route:cache

# Render usa la variable PORT para enrutar tráfico al contenedor
ENV PORT=10000

# Comando de arranque: correr migraciones y luego levantar el servidor
CMD php artisan migrate --force && php artisan serve --host 0.0.0.0 --port=${PORT}

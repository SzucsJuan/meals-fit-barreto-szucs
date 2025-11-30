# Imagen base de PHP con CLI
FROM php:8.2-cli

# Instalar dependencias del sistema y extensiones PDO para MySQL y PostgreSQL
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    libpq-dev \
    && docker-php-ext-install pdo_mysql pdo_pgsql zip \
    && rm -rf /var/lib/apt/lists/*

# Instalar Composer desde la imagen oficial
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Directorio de trabajo dentro del contenedor
WORKDIR /var/www/html

# Copiar código de la app
COPY . .

# Instalar dependencias de Laravel (incluyendo require-dev)
RUN composer install --optimize-autoloader --no-interaction --prefer-dist

ENV PORT=10000

# Comando de arranque: migrar y levantar servidor
CMD php artisan migrate --force && php artisan serve --host 0.0.0.0 --port=${PORT}
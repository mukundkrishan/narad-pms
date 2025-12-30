# Narad PMS - Deployment Guide

## Overview

This guide covers the deployment process for Narad PMS in production environments.

## Prerequisites

### Server Requirements
- **OS**: Ubuntu 20.04+ / CentOS 8+ / Windows Server 2019+
- **Web Server**: Nginx 1.18+ or Apache 2.4+
- **PHP**: 8.2+
- **Database**: MySQL 8.0+ or MariaDB 10.6+
- **Node.js**: 18.0+ (for build process)
- **SSL Certificate**: Required for HTTPS

### Domain Setup
- Main domain: `https://naradpms.com`
- API subdomain: `https://api.naradpms.com`
- Admin panel: `https://admin.naradpms.com`

## Backend Deployment

### 1. Server Setup

#### Install Dependencies (Ubuntu)
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install PHP 8.2
sudo apt install software-properties-common
sudo add-apt-repository ppa:ondrej/php
sudo apt update
sudo apt install php8.2 php8.2-fpm php8.2-mysql php8.2-xml php8.2-curl php8.2-zip php8.2-mbstring php8.2-gd

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Install MySQL
sudo apt install mysql-server
sudo mysql_secure_installation
```

#### Install Nginx
```bash
sudo apt install nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

### 2. Application Deployment

#### Clone Repository
```bash
cd /var/www
sudo git clone https://github.com/your-repo/narad-pms.git
sudo chown -R www-data:www-data narad-pms
cd narad-pms/backend
```

#### Install Dependencies
```bash
composer install --optimize-autoloader --no-dev
```

#### Environment Configuration
```bash
cp .env.example .env
nano .env
```

**Production .env:**
```env
APP_NAME="Narad PMS"
APP_ENV=production
APP_KEY=base64:your-generated-key
APP_DEBUG=false
APP_URL=https://api.naradpms.com

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=narad_pms_prod
DB_USERNAME=narad_user
DB_PASSWORD=secure_password_here

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

JWT_SECRET=your-jwt-secret-key
JWT_TTL=60
JWT_REFRESH_TTL=20160

CORS_ALLOWED_ORIGINS=https://naradpms.com,https://admin.naradpms.com
```

#### Generate Keys and Cache
```bash
php artisan key:generate
php artisan jwt:secret
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

#### Database Setup
```bash
# Create database
mysql -u root -p
CREATE DATABASE narad_pms_prod CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'narad_user'@'localhost' IDENTIFIED BY 'secure_password_here';
GRANT ALL PRIVILEGES ON narad_pms_prod.* TO 'narad_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Run migrations
php artisan migrate --force
php artisan db:seed --force
```

#### Set Permissions
```bash
sudo chown -R www-data:www-data /var/www/narad-pms
sudo chmod -R 755 /var/www/narad-pms
sudo chmod -R 775 /var/www/narad-pms/backend/storage
sudo chmod -R 775 /var/www/narad-pms/backend/bootstrap/cache
```

### 3. Nginx Configuration

#### Create Nginx Config
```bash
sudo nano /etc/nginx/sites-available/narad-pms-api
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name api.naradpms.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.naradpms.com;
    root /var/www/narad-pms/backend/public;
    index index.php;

    # SSL Configuration
    ssl_certificate /path/to/ssl/certificate.crt;
    ssl_certificate_key /path/to/ssl/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # CORS Headers
    add_header Access-Control-Allow-Origin "https://naradpms.com, https://admin.naradpms.com" always;
    add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
    add_header Access-Control-Allow-Headers "Authorization, Content-Type, Accept" always;
    add_header Access-Control-Allow-Credentials "true" always;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_hide_header X-Powered-By;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Cache static files
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Enable Site
```bash
sudo ln -s /etc/nginx/sites-available/narad-pms-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Frontend Deployment

### 1. Build Process

#### Install Dependencies
```bash
cd /var/www/narad-pms/frontend
npm install
```

#### Environment Configuration
```bash
nano .env.production
```

**.env.production:**
```env
VITE_API_BASE_URL=https://api.naradpms.com/api/v1
VITE_API_URL=https://api.naradpms.com
```

#### Build Application
```bash
npm run build
```

### 2. Frontend Nginx Configuration

#### Main Application
```bash
sudo nano /etc/nginx/sites-available/narad-pms-frontend
```

```nginx
server {
    listen 80;
    server_name naradpms.com www.naradpms.com;
    return 301 https://naradpms.com$request_uri;
}

server {
    listen 443 ssl http2;
    server_name www.naradpms.com;
    return 301 https://naradpms.com$request_uri;
}

server {
    listen 443 ssl http2;
    server_name naradpms.com;
    root /var/www/narad-pms/frontend/dist;
    index index.html;

    # SSL Configuration
    ssl_certificate /path/to/ssl/certificate.crt;
    ssl_certificate_key /path/to/ssl/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Handle React Router
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

#### Enable Frontend Site
```bash
sudo ln -s /etc/nginx/sites-available/narad-pms-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## SSL Certificate Setup

### Using Let's Encrypt (Certbot)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Generate certificates
sudo certbot --nginx -d naradpms.com -d www.naradpms.com -d api.naradpms.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Database Optimization

### MySQL Configuration
```bash
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
```

**Add optimizations:**
```ini
[mysqld]
innodb_buffer_pool_size = 1G
innodb_log_file_size = 256M
innodb_flush_log_at_trx_commit = 2
query_cache_type = 1
query_cache_size = 128M
max_connections = 200
```

```bash
sudo systemctl restart mysql
```

## Monitoring & Logging

### Log Rotation
```bash
sudo nano /etc/logrotate.d/narad-pms
```

```
/var/www/narad-pms/backend/storage/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    notifempty
    create 0644 www-data www-data
}
```

### System Monitoring
```bash
# Install monitoring tools
sudo apt install htop iotop nethogs

# Monitor logs
tail -f /var/www/narad-pms/backend/storage/logs/laravel.log
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

## Backup Strategy

### Database Backup Script
```bash
sudo nano /usr/local/bin/backup-narad-pms.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/narad-pms"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="narad_pms_prod"
DB_USER="narad_user"
DB_PASS="secure_password_here"

mkdir -p $BACKUP_DIR

# Database backup
mysqldump -u$DB_USER -p$DB_PASS $DB_NAME > $BACKUP_DIR/db_backup_$DATE.sql

# Application backup
tar -czf $BACKUP_DIR/app_backup_$DATE.tar.gz /var/www/narad-pms

# Keep only last 7 days
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
```

```bash
sudo chmod +x /usr/local/bin/backup-narad-pms.sh

# Schedule daily backup
sudo crontab -e
# Add: 0 2 * * * /usr/local/bin/backup-narad-pms.sh
```

## Performance Optimization

### PHP-FPM Optimization
```bash
sudo nano /etc/php/8.2/fpm/pool.d/www.conf
```

```ini
pm = dynamic
pm.max_children = 50
pm.start_servers = 5
pm.min_spare_servers = 5
pm.max_spare_servers = 35
pm.max_requests = 500
```

### Enable OPcache
```bash
sudo nano /etc/php/8.2/fpm/php.ini
```

```ini
opcache.enable=1
opcache.memory_consumption=128
opcache.interned_strings_buffer=8
opcache.max_accelerated_files=4000
opcache.revalidate_freq=2
opcache.fast_shutdown=1
```

```bash
sudo systemctl restart php8.2-fpm
```

## Security Hardening

### Firewall Setup
```bash
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw allow mysql
```

### Fail2Ban
```bash
sudo apt install fail2ban
sudo nano /etc/fail2ban/jail.local
```

```ini
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[nginx-http-auth]
enabled = true

[nginx-limit-req]
enabled = true
```

## Deployment Checklist

- [ ] Server dependencies installed
- [ ] SSL certificates configured
- [ ] Database created and migrated
- [ ] Environment variables set
- [ ] File permissions configured
- [ ] Nginx configuration tested
- [ ] Application builds successfully
- [ ] API endpoints responding
- [ ] Authentication working
- [ ] Backup system configured
- [ ] Monitoring setup
- [ ] Security hardening applied
- [ ] Performance optimization enabled

## Troubleshooting

### Common Issues

#### 500 Internal Server Error
```bash
# Check Laravel logs
tail -f /var/www/narad-pms/backend/storage/logs/laravel.log

# Check Nginx logs
tail -f /var/log/nginx/error.log

# Check PHP-FPM logs
tail -f /var/log/php8.2-fpm.log
```

#### Database Connection Issues
```bash
# Test database connection
mysql -u narad_user -p narad_pms_prod

# Check MySQL status
sudo systemctl status mysql
```

#### Permission Issues
```bash
# Fix permissions
sudo chown -R www-data:www-data /var/www/narad-pms
sudo chmod -R 755 /var/www/narad-pms
sudo chmod -R 775 /var/www/narad-pms/backend/storage
```

## Maintenance

### Regular Tasks
- Monitor disk space and logs
- Update SSL certificates
- Apply security updates
- Review backup integrity
- Monitor application performance
- Check error logs regularly

### Update Process
1. Backup current version
2. Pull latest code
3. Run `composer install --no-dev`
4. Run migrations: `php artisan migrate --force`
5. Clear caches: `php artisan config:cache`
6. Build frontend: `npm run build`
7. Test functionality
8. Monitor for issues

---

*For support, contact the development team or refer to the troubleshooting section.*
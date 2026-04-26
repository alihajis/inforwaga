# Deployment Guide - Website RT

Panduan untuk deploy Website RT ke production.

## 🚀 Production Deployment

### 1. Server Requirements

**Minimum:**
- CPU: 2 cores
- RAM: 2GB
- Storage: 10GB SSD
- OS: Ubuntu 20.04+ / Debian 11+

**Recommended:**
- CPU: 4 cores
- RAM: 4GB
- Storage: 20GB SSD

### 2. Install Prerequisites

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL 14+
sudo apt install -y postgresql postgresql-contrib

# Install nginx (reverse proxy)
sudo apt install -y nginx

# Install PM2 (process manager)
sudo npm install -g pm2
```

### 3. Setup PostgreSQL

```bash
# Login sebagai postgres user
sudo -u postgres psql

# Di dalam psql:
CREATE DATABASE website_rt;
CREATE USER rt_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE website_rt TO rt_user;
\q

# Import database
sudo -u postgres psql -d website_rt -f /path/to/database/init.sql
```

### 4. Setup Backend

```bash
cd website-rt/backend

# Install dependencies
npm install --production

# Setup environment
cp .env.example .env
nano .env

# Build TypeScript
npm run build

# Start with PM2
pm2 start dist/index.js --name "website-rt-backend"
pm2 save
pm2 startup
```

**Production .env:**
```env
PORT=5000
NODE_ENV=production

DB_HOST=localhost
DB_PORT=5432
DB_NAME=website_rt
DB_USER=rt_user
DB_PASSWORD=your_secure_password

JWT_SECRET=generate_a_very_long_random_secret_here_min_32_chars
JWT_EXPIRES_IN=7d

UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
```

### 5. Setup Frontend

```bash
cd website-rt/frontend

# Install dependencies
npm install

# Setup environment
cp .env.local.example .env.local
nano .env.local

# Build for production
npm run build

# Start with PM2
pm2 start npm --name "website-rt-frontend" -- start
pm2 save
```

**Production .env.local:**
```env
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
```

### 6. Setup Nginx (Reverse Proxy)

```bash
sudo nano /etc/nginx/sites-available/website-rt
```

**Nginx Config:**
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend (Next.js)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static files (uploads)
    location /uploads {
        alias /path/to/website-rt/backend/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

**Enable site:**
```bash
sudo ln -s /etc/nginx/sites-available/website-rt /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 7. Setup SSL (Let's Encrypt)

```bash
# Install certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal test
sudo certbot renew --dry-run
```

### 8. Security Hardening

**Firewall:**
```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

**PostgreSQL:**
```bash
sudo nano /etc/postgresql/14/main/pg_hba.conf
```

Change:
```
# local   all             all                                     peer
local   all             all                                     md5
```

**Restart PostgreSQL:**
```bash
sudo systemctl restart postgresql
```

### 9. Monitoring & Logs

```bash
# PM2 logs
pm2 logs

# PM2 monitoring
pm2 monit

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

### 10. Backup Strategy

**Database Backup (Daily):**
```bash
# Create backup script
nano ~/backup-db.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/user/backups"
mkdir -p $BACKUP_DIR

pg_dump -U rt_user website_rt | gzip > $BACKUP_DIR/website_rt_$DATE.sql.gz

# Keep only last 7 days
find $BACKUP_DIR -name "website_rt_*.sql.gz" -mtime +7 -delete
```

**Make executable:**
```bash
chmod +x ~/backup-db.sh
```

**Add to crontab:**
```bash
crontab -e
```

Add line:
```
0 2 * * * /home/user/backup-db.sh
```

## 🔄 Update Process

```bash
# Pull latest changes
cd website-rt
git pull origin main

# Update backend
cd backend
npm install --production
npm run build
pm2 restart website-rt-backend

# Update frontend
cd ../frontend
npm install
npm run build
pm2 restart website-rt-frontend
```

## 🐳 Docker Deployment (Alternative)

Coming soon...

## 📊 Performance Optimization

1. **Enable Gzip in Nginx:**
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

2. **Database Indexing:** Already included in `init.sql`

3. **PM2 Cluster Mode:**
```bash
pm2 start dist/index.js --name "website-rt-backend" -i max
```

4. **CDN for Static Assets:** Consider using Cloudflare

## 🆘 Troubleshooting

**Backend not starting:**
```bash
pm2 logs website-rt-backend
# Check database connection in logs
```

**Frontend build errors:**
```bash
cd frontend
rm -rf .next node_modules
npm install
npm run build
```

**Database connection issues:**
```bash
# Test connection
psql -U rt_user -d website_rt -h localhost
```

**Nginx errors:**
```bash
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

## 📞 Support

Jika ada masalah deployment, buat issue di repository dengan informasi:
- OS version
- Node.js version
- Error logs
- Steps yang sudah dicoba

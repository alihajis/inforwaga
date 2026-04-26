# Panduan Deploy ke Web Hosting

Panduan lengkap untuk upload Website RT ke berbagai jenis web hosting.

## 🎯 Pilihan Hosting

### 1. **VPS (Recommended)** ⭐
**Contoh:** DigitalOcean, Vultr, Linode, AWS EC2, Google Cloud  
**Kelebihan:** Full control, scalable, bisa install apapun  
**Harga:** ~$5-10/bulan

### 2. **Shared Hosting dengan Node.js**
**Contoh:** Hostinger, Niagahoster (paket Business/Cloud)  
**Kelebihan:** Lebih murah, managed  
**Keterbatasan:** Resource terbatas, tidak semua support Node.js + PostgreSQL

### 3. **Platform as a Service (PaaS)**
**Contoh:** Vercel (Frontend) + Railway/Render (Backend + DB)  
**Kelebihan:** Setup mudah, auto-scaling  
**Harga:** Free tier tersedia

### 4. **Hosting Lokal Indonesia**
**Contoh:** Niagahoster, IDCloudHost, DomaiNesia  
**Catatan:** Pastikan paket mendukung Node.js & PostgreSQL

---

## 🚀 Cara 1: Deploy ke VPS (Paling Fleksibel)

### Prerequisites
- VPS dengan Ubuntu 20.04+ (1GB RAM minimal, 2GB recommended)
- Domain (opsional, bisa pakai IP dulu)
- SSH access ke VPS

### Langkah-langkah:

#### 1. Koneksi ke VPS via SSH

```bash
ssh root@IP_VPS_ANDA
# atau
ssh username@IP_VPS_ANDA
```

#### 2. Install Prerequisites di VPS

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verifikasi
node -v  # harus v18+
npm -v

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install nginx (web server)
sudo apt install -y nginx

# Install PM2 (process manager untuk keep app running)
sudo npm install -g pm2
```

#### 3. Setup Database di VPS

```bash
# Login sebagai postgres user
sudo -u postgres psql

# Di dalam psql, jalankan:
CREATE DATABASE website_rt;
CREATE USER rt_user WITH ENCRYPTED PASSWORD 'password_kuat_anda';
GRANT ALL PRIVILEGES ON DATABASE website_rt TO rt_user;
\q
```

#### 4. Upload Project ke VPS

**Opsi A: Git (Recommended)**
```bash
# Install git
sudo apt install -y git

# Clone repository (jika sudah di GitHub)
cd /var/www/
git clone https://github.com/username/website-rt.git

# atau jika belum di GitHub, buat repo dulu:
# 1. Push project ke GitHub dari komputer lokal
# 2. Clone di VPS seperti di atas
```

**Opsi B: Upload Manual via FTP/SCP**
```bash
# Dari komputer lokal, upload dengan scp:
scp -r website-rt root@IP_VPS:/var/www/

# atau gunakan FileZilla / WinSCP
```

#### 5. Import Database

```bash
cd /var/www/website-rt

# Import schema
sudo -u postgres psql -d website_rt -f database/init.sql

# Verifikasi
sudo -u postgres psql -d website_rt -c "\dt"
```

#### 6. Setup Backend

```bash
cd /var/www/website-rt/backend

# Install dependencies
npm install --production

# Buat file .env
nano .env
```

**Isi file .env untuk production:**
```env
PORT=5000
NODE_ENV=production

DB_HOST=localhost
DB_PORT=5432
DB_NAME=website_rt
DB_USER=rt_user
DB_PASSWORD=password_kuat_anda

JWT_SECRET=buat_random_string_minimal_32_karakter_disini
JWT_EXPIRES_IN=7d

UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
```

```bash
# Build TypeScript
npm run build

# Test run (pastikan tidak ada error)
node dist/index.js

# Jika OK, stop dengan Ctrl+C, lalu start dengan PM2
pm2 start dist/index.js --name website-rt-backend

# Save PM2 config
pm2 save

# Auto-start saat VPS restart
pm2 startup
# Copy-paste command yang muncul, lalu jalankan
```

#### 7. Setup Frontend

```bash
cd /var/www/website-rt/frontend

# Install dependencies
npm install

# Buat .env.local
nano .env.local
```

**Isi .env.local:**
```env
# Ganti dengan domain atau IP VPS Anda
NEXT_PUBLIC_API_URL=http://IP_VPS_ANDA/api
# atau jika sudah pakai domain:
# NEXT_PUBLIC_API_URL=https://yourdomain.com/api
```

```bash
# Build untuk production
npm run build

# Start dengan PM2
pm2 start npm --name website-rt-frontend -- start

# Save
pm2 save
```

#### 8. Setup Nginx (Reverse Proxy)

```bash
sudo nano /etc/nginx/sites-available/website-rt
```

**Copy paste config ini:**
```nginx
server {
    listen 80;
    server_name IP_VPS_ANDA;  # ganti dengan IP atau domain Anda

    # Frontend Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Static uploads
    location /uploads {
        alias /var/www/website-rt/backend/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

**Aktifkan site:**
```bash
# Link ke sites-enabled
sudo ln -s /etc/nginx/sites-available/website-rt /etc/nginx/sites-enabled/

# Test config
sudo nginx -t

# Jika OK, restart nginx
sudo systemctl restart nginx
```

#### 9. Setup Firewall

```bash
# Allow SSH, HTTP, HTTPS
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable
```

#### 10. Setup SSL (HTTPS) - Opsional tapi Recommended

```bash
# Install certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate (ganti dengan domain Anda)
sudo certbot --nginx -d yourdomain.com

# Certbot akan otomatis update config nginx
# Certificate akan auto-renew

# Test renewal
sudo certbot renew --dry-run
```

### ✅ Selesai!

Akses website Anda di:
- **HTTP:** `http://IP_VPS_ANDA` atau `http://yourdomain.com`
- **HTTPS:** `https://yourdomain.com` (jika sudah setup SSL)

**Login admin:**
- Email: admin@rt.local
- Password: admin123

---

## 🚀 Cara 2: Deploy ke Hosting Shared (Niagahoster/Hostinger)

### Catatan Penting:
⚠️ **Shared hosting biasa TIDAK support Node.js + PostgreSQL!**  
Anda perlu paket **Cloud Hosting** atau **VPS** dari Niagahoster.

### Jika Pakai Cloud Hosting Niagahoster:

1. **Order paket Cloud Hosting** (minimal paket Medium)
2. **Login ke control panel** (biasanya CloudLinux)
3. **Setup seperti VPS di atas**, tapi via terminal SSH dari cPanel

### Alternative: Frontend di Shared Hosting, Backend di Service Lain

**Split deployment:**
- Frontend (Next.js) → Export static → Upload ke shared hosting
- Backend + DB → Railway.app atau Render.com (free tier)

**Cara export static Next.js:**
```bash
cd frontend

# Edit next.config.js, tambahkan:
# output: 'export'

# Build static
npm run build

# Upload folder 'out' ke public_html via FTP
```

⚠️ **Limitation:** Tidak bisa pakai server-side features Next.js

---

## 🚀 Cara 3: Deploy ke Platform Modern (Recommended untuk Pemula)

### Option A: Vercel (Frontend) + Railway (Backend + DB)

#### Railway untuk Backend + Database:

1. **Buat akun di Railway.app**
2. **New Project → Deploy from GitHub**
3. **Connect repository website-rt**
4. **Add PostgreSQL database:**
   - Klik "New" → Database → PostgreSQL
   - Copy connection string
5. **Configure backend service:**
   - Root Directory: `/backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
6. **Add environment variables:**
   - PORT: 5000
   - DATABASE_URL: (dari PostgreSQL service)
   - JWT_SECRET: (generate random)
7. **Deploy!**
8. **Import database:**
   ```bash
   railway connect postgres
   # paste isi init.sql
   ```

#### Vercel untuk Frontend:

1. **Buat akun di Vercel.com**
2. **Import Git Repository**
3. **Configure:**
   - Root Directory: `/frontend`
   - Framework: Next.js
   - Environment Variables:
     ```
     NEXT_PUBLIC_API_URL=https://your-railway-backend.up.railway.app/api
     ```
4. **Deploy!**

**Kelebihan cara ini:**
- ✅ Free tier tersedia
- ✅ Auto deploy saat git push
- ✅ HTTPS otomatis
- ✅ Tidak perlu maintenance server

---

## 🔧 Maintenance & Update

### Update Code di VPS:

```bash
# SSH ke VPS
ssh root@IP_VPS

cd /var/www/website-rt

# Pull latest code
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

### Backup Database:

```bash
# Manual backup
pg_dump -U rt_user website_rt > backup_$(date +%Y%m%d).sql

# Auto backup (tambahkan ke crontab)
crontab -e

# Tambahkan line ini (backup setiap hari jam 2 pagi):
0 2 * * * pg_dump -U rt_user website_rt | gzip > /backups/db_$(date +\%Y\%m\%d).sql.gz
```

---

## 📞 Troubleshooting

### Backend tidak jalan:
```bash
pm2 logs website-rt-backend
# Lihat error message
```

### Database connection error:
```bash
# Test koneksi
psql -U rt_user -d website_rt -h localhost
```

### Nginx error:
```bash
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

### Port sudah dipakai:
```bash
# Cek process di port 3000 atau 5000
sudo lsof -i :3000
sudo lsof -i :5000

# Kill process jika perlu
sudo kill -9 PID
```

---

## 💰 Estimasi Biaya

### VPS (Recommended):
- **DigitalOcean Droplet:** $6/bulan (1GB RAM)
- **Vultr:** $6/bulan (1GB RAM)
- **Niagahoster Cloud:** Rp 150.000/bulan
- **Domain:** ~Rp 100.000/tahun

### PaaS (Railway + Vercel):
- **Railway:** Free tier → $5/bulan (jika perlu lebih)
- **Vercel:** Free tier (unlimited untuk personal)
- **Domain:** ~Rp 100.000/tahun

**Total untuk start:**
- VPS: ~Rp 200.000/bulan
- PaaS: FREE (atau ~Rp 50.000/bulan jika upgrade Railway)

---

## 🎯 Rekomendasi ABA

**Untuk Pemula:**
→ Gunakan **Railway + Vercel** (free tier, mudah setup)

**Untuk Production Serius:**
→ Gunakan **VPS** (DigitalOcean/Niagahoster Cloud)

**Untuk Testing Dulu:**
→ Bisa pakai **Railway free tier** dulu, nanti migrate ke VPS

---

## 📚 Resources

- [Railway Docs](https://docs.railway.app)
- [Vercel Docs](https://vercel.com/docs)
- [DigitalOcean Tutorials](https://www.digitalocean.com/community/tutorials)
- [Nginx Docs](https://nginx.org/en/docs/)
- [PM2 Docs](https://pm2.keymetrics.io/docs/)

---

**Butuh bantuan setup? Tanya Albatar! 🦾**

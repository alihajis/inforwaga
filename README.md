# Website RT - Sistem Informasi RT

Website dinamis untuk mengelola informasi dan administrasi RT (Rukun Tetangga). Dibuat dengan Next.js, Node.js, Express, dan PostgreSQL.

## 🚀 Fitur

### Admin Dashboard
- ✅ Kelola pengumuman/berita RT
- ✅ Kelola jadwal kegiatan
- ✅ Kelola data warga
- ✅ Laporan iuran/kas RT
- ✅ Review pengajuan surat (SKTM, domisili, dll)
- ✅ Buat dan kelola polling/voting
- ✅ Upload foto ke galeri
- ✅ Dashboard statistik

### Portal Warga
- ✅ Lihat pengumuman terbaru
- ✅ Lihat jadwal kegiatan
- ✅ Lihat data pribadi
- ✅ Lihat laporan keuangan RT (transparansi)
- ✅ Ajukan surat pengantar online
- ✅ Ikut polling/voting
- ✅ Lihat galeri foto kegiatan

## 🛠️ Tech Stack

### Frontend
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- React Hooks

### Backend
- Node.js
- Express.js
- PostgreSQL
- TypeScript
- JWT Authentication
- bcrypt (password hashing)

## 📦 Instalasi

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- npm atau yarn

### 1. Clone & Setup

```bash
cd website-rt
```

### 2. Setup Database

```bash
# Login ke PostgreSQL
psql -U postgres

# Buat database
CREATE DATABASE website_rt;

# Keluar dari psql
\q

# Import schema
psql -U postgres -d website_rt -f database/init.sql
```

### 3. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env dengan konfigurasi database Anda
nano .env

# Jalankan backend
npm run dev
```

Backend akan berjalan di `http://localhost:5000`

### 4. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local

# Jalankan frontend
npm run dev
```

Frontend akan berjalan di `http://localhost:3000`

## 🔑 Default Login

**Admin:**
- Email: `admin@rt.local`
- Password: `admin123`

**Warga:** Daftar melalui halaman `/register`

## 📁 Struktur Proyek

```
website-rt/
├── frontend/              # Next.js frontend
│   ├── app/              # Pages (App Router)
│   ├── components/       # React components
│   ├── lib/              # API clients & utilities
│   └── types/            # TypeScript types
├── backend/              # Express.js backend
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Auth & validation
│   │   ├── config/       # Configuration
│   │   └── utils/        # Helper functions
│   └── uploads/          # File uploads storage
└── database/             # SQL scripts
    └── init.sql          # Database schema & seed data
```

## 🔐 Authentication

Sistem menggunakan JWT (JSON Web Tokens) untuk autentikasi:

1. User login → Backend generate JWT token
2. Token disimpan di localStorage (frontend)
3. Setiap API request menyertakan token di header:
   ```
   Authorization: Bearer <token>
   ```
4. Backend verify token menggunakan middleware

**Role-based access:**
- `admin` - Full access ke admin dashboard
- `warga` - Access ke portal warga

## 🗄️ Database Schema

### Users
Menyimpan data pengguna (admin & warga)

### Announcements
Pengumuman dari pengurus RT

### Events
Jadwal kegiatan RT

### Residents
Data detail warga (NIK, jumlah anggota keluarga, dll)

### Treasury
Laporan kas/iuran RT

### Form Submissions
Pengajuan surat dari warga

### Polls & Poll Votes
Sistem polling/voting untuk warga

### Gallery
Galeri foto kegiatan RT

## 📝 API Endpoints

### Auth
- `POST /api/auth/register` - Daftar user baru
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get user profile (requires auth)

### Announcements
- `GET /api/announcements` - Get all announcements
- `GET /api/announcements/:id` - Get announcement by ID
- `POST /api/announcements` - Create announcement (admin only)
- `PUT /api/announcements/:id` - Update announcement (admin only)
- `DELETE /api/announcements/:id` - Delete announcement (admin only)

_(Endpoints lain sedang dalam pengembangan)_

## 🚧 Development Status

**✅ Selesai:**
- Backend setup (Express, PostgreSQL, TypeScript)
- Database schema
- Authentication system (register, login, JWT)
- Announcements API (CRUD)
- Frontend setup (Next.js, Tailwind)
- Homepage
- Login page
- Navbar & Footer
- API client & auth utilities

**🔄 Dalam Pengerjaan:**
- Events API & pages
- Residents management
- Treasury reports
- Form submissions
- Polls/voting
- Gallery
- Admin dashboard
- File upload handling

## 🔒 Security

- ✅ Password hashing dengan bcrypt
- ✅ JWT authentication
- ✅ SQL injection prevention (parameterized queries)
- ✅ CORS enabled
- ✅ Input validation dengan express-validator
- ⚠️ HTTPS belum diimplementasikan (gunakan reverse proxy seperti nginx di production)

## 📱 Responsive Design

Website ini fully responsive dan dapat diakses dengan baik di:
- 📱 Mobile
- 💻 Tablet
- 🖥️ Desktop

## 🤝 Kontribusi

Untuk berkontribusi:
1. Fork repository
2. Buat branch baru (`git checkout -b feature/nama-fitur`)
3. Commit changes (`git commit -m 'Add some feature'`)
4. Push to branch (`git push origin feature/nama-fitur`)
5. Buat Pull Request

## 📄 License

MIT License - silakan digunakan dan dimodifikasi sesuai kebutuhan

## 📞 Support

Jika ada pertanyaan atau masalah, silakan buat issue di repository ini.

---

**Dibuat untuk memudahkan administrasi dan komunikasi RT** 🏘️

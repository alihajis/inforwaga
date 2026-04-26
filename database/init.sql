-- Database initialization script for Website RT
-- Run this to create all necessary tables

-- Drop existing tables (be careful in production!)
DROP TABLE IF EXISTS poll_votes CASCADE;
DROP TABLE IF EXISTS polls CASCADE;
DROP TABLE IF EXISTS gallery CASCADE;
DROP TABLE IF EXISTS form_submissions CASCADE;
DROP TABLE IF EXISTS treasury CASCADE;
DROP TABLE IF EXISTS residents CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'warga')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create announcements table
CREATE TABLE announcements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create events table
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date TIMESTAMP NOT NULL,
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create residents table
CREATE TABLE residents (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    nik VARCHAR(20) UNIQUE,
    family_members INTEGER DEFAULT 1,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create treasury table
CREATE TABLE treasury (
    id SERIAL PRIMARY KEY,
    month INTEGER NOT NULL,
    year INTEGER NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
    amount DECIMAL(12, 2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create form_submissions table
CREATE TABLE form_submissions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    form_type VARCHAR(50) NOT NULL,
    data_json JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    files TEXT[], -- Array of file paths
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    reviewed_by INTEGER REFERENCES users(id)
);

-- Create polls table
CREATE TABLE polls (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    options_json JSONB NOT NULL, -- Array of poll options
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

-- Create poll_votes table
CREATE TABLE poll_votes (
    id SERIAL PRIMARY KEY,
    poll_id INTEGER REFERENCES polls(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    option VARCHAR(255) NOT NULL,
    voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(poll_id, user_id) -- One vote per user per poll
);

-- Create gallery table
CREATE TABLE gallery (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    uploaded_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_announcements_created_at ON announcements(created_at DESC);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_treasury_year_month ON treasury(year, month);
CREATE INDEX idx_form_submissions_status ON form_submissions(status);
CREATE INDEX idx_poll_votes_poll_id ON poll_votes(poll_id);

-- Insert default admin user
-- Password: admin123 (hashed with bcrypt)
INSERT INTO users (email, password_hash, full_name, address, phone, role)
VALUES (
    'admin@rt.local',
    '$2b$10$C8Pd1sF0y68hmWysSJ.5mOZqc1v0BKWrhplmN1RkwFiGeCQCoTzwe',
    'Administrator',
    'RT Office',
    '08123456789',
    'admin'
);

-- Insert sample data for testing
INSERT INTO announcements (title, content, author_id) VALUES
('Selamat Datang di Website RT', 'Website RT kini telah online! Anda dapat melihat pengumuman, jadwal kegiatan, dan mengajukan surat secara online.', 1),
('Gotong Royong Minggu Depan', 'Dihimbau kepada seluruh warga untuk mengikuti kegiatan gotong royong yang akan dilaksanakan pada hari Minggu, 5 Mei 2026 pukul 07.00 WIB.', 1);

INSERT INTO events (title, description, event_date, location) VALUES
('Gotong Royong Bulanan', 'Kegiatan bersih-bersih lingkungan RT', '2026-05-05 07:00:00', 'Balai RT'),
('Rapat Warga', 'Rapat koordinasi bulanan pengurus dan warga', '2026-05-10 19:00:00', 'Balai RT');

INSERT INTO treasury (month, year, type, amount, description) VALUES
(4, 2026, 'income', 5000000, 'Iuran warga bulan April 2026'),
(4, 2026, 'expense', 500000, 'Pembelian perlengkapan kebersihan');

COMMENT ON TABLE users IS 'Menyimpan data pengguna (admin dan warga)';
COMMENT ON TABLE announcements IS 'Pengumuman dari admin RT';
COMMENT ON TABLE events IS 'Jadwal kegiatan RT';
COMMENT ON TABLE residents IS 'Data detail warga yang terhubung dengan user';
COMMENT ON TABLE treasury IS 'Laporan kas/iuran RT';
COMMENT ON TABLE form_submissions IS 'Pengajuan surat dari warga';
COMMENT ON TABLE polls IS 'Polling/voting untuk warga';
COMMENT ON TABLE poll_votes IS 'Suara/vote dari warga';
COMMENT ON TABLE gallery IS 'Galeri foto kegiatan RT';

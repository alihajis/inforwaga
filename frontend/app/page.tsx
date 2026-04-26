'use client';

import { useEffect, useState } from 'react';
import { announcementsApi } from '@/lib/api/announcements';
import { Announcement } from '@/types';
import Link from 'next/link';

export default function HomePage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await announcementsApi.getAll(5, 0);
        setAnnouncements(data.announcements);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-8 md:p-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Selamat Datang di Website RT
        </h1>
        <p className="text-xl mb-6">
          Sistem informasi terpadu untuk memudahkan komunikasi dan administrasi RT
        </p>
        <div className="flex gap-4">
          <Link
            href="/login"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Login Warga
          </Link>
          <Link
            href="/announcements"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-400 transition"
          >
            Lihat Pengumuman
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section>
        <h2 className="text-3xl font-bold mb-6">Fitur Website RT</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="text-4xl mb-4">📢</div>
            <h3 className="text-xl font-bold mb-2">Pengumuman</h3>
            <p className="text-gray-600">
              Informasi terkini dan pengumuman penting dari pengurus RT
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-xl font-bold mb-2">Jadwal Kegiatan</h3>
            <p className="text-gray-600">
              Lihat jadwal kegiatan RT seperti ronda, gotong royong, dan rapat
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-xl font-bold mb-2">Pengajuan Surat</h3>
            <p className="text-gray-600">
              Ajukan surat pengantar SKTM, domisili, dan lainnya secara online
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-bold mb-2">Laporan Kas</h3>
            <p className="text-gray-600">
              Transparansi laporan keuangan dan iuran RT
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="text-4xl mb-4">🗳️</div>
            <h3 className="text-xl font-bold mb-2">Voting/Polling</h3>
            <p className="text-gray-600">
              Berpartisipasi dalam polling dan pengambilan keputusan bersama
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="text-4xl mb-4">📸</div>
            <h3 className="text-xl font-bold mb-2">Galeri Foto</h3>
            <p className="text-gray-600">
              Dokumentasi kegiatan dan momen-momen bersama warga RT
            </p>
          </div>
        </div>
      </section>

      {/* Latest Announcements */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Pengumuman Terbaru</h2>
          <Link
            href="/announcements"
            className="text-blue-600 hover:underline font-semibold"
          >
            Lihat Semua →
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat pengumuman...</p>
          </div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Belum ada pengumuman</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition"
              >
                <h3 className="text-xl font-bold mb-2">{announcement.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {announcement.content}
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{announcement.author_name || 'Admin'}</span>
                  <span>
                    {new Date(announcement.created_at).toLocaleDateString(
                      'id-ID'
                    )}
                  </span>
                </div>
                <Link
                  href={`/announcements/${announcement.id}`}
                  className="text-blue-600 hover:underline mt-4 inline-block"
                >
                  Baca selengkapnya →
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

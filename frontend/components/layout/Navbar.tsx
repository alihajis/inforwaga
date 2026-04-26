'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { authUtils } from '@/lib/utils/auth';
import { User } from '@/types';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setUser(authUtils.getUser());
  }, [pathname]);

  const handleLogout = () => {
    authUtils.logout();
    setUser(null);
    router.push('/');
  };

  const navLinks = user
    ? user.role === 'admin'
      ? [
          { href: '/admin', label: 'Dashboard' },
          { href: '/admin/announcements', label: 'Pengumuman' },
          { href: '/admin/events', label: 'Kegiatan' },
          { href: '/admin/residents', label: 'Data Warga' },
          { href: '/admin/treasury', label: 'Kas RT' },
          { href: '/admin/forms', label: 'Pengajuan' },
          { href: '/admin/polls', label: 'Polling' },
          { href: '/admin/gallery', label: 'Galeri' },
        ]
      : [
          { href: '/warga', label: 'Beranda' },
          { href: '/warga/announcements', label: 'Pengumuman' },
          { href: '/warga/events', label: 'Kegiatan' },
          { href: '/warga/treasury', label: 'Kas RT' },
          { href: '/warga/forms', label: 'Pengajuan Surat' },
          { href: '/warga/polls', label: 'Polling' },
          { href: '/warga/gallery', label: 'Galeri' },
        ]
    : [
        { href: '/', label: 'Beranda' },
        { href: '/announcements', label: 'Pengumuman' },
        { href: '/login', label: 'Login' },
      ];

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold">
            Website RT
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`hover:text-blue-200 transition ${
                  pathname === link.href ? 'font-bold' : ''
                }`}
              >
                {link.label}
              </Link>
            ))}

            {user && (
              <div className="flex items-center space-x-4">
                <span className="text-sm">
                  Halo, <strong>{user.full_name}</strong>
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  isMenuOpen
                    ? 'M6 18L18 6M6 6l12 12'
                    : 'M4 6h16M4 12h16M4 18h16'
                }
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 hover:bg-blue-700 px-2 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {user && (
              <div className="mt-4 pt-4 border-t border-blue-500">
                <p className="text-sm mb-2">
                  Halo, <strong>{user.full_name}</strong>
                </p>
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

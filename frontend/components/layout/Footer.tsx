export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="grid md:grid-cols-3 gap-6">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-2">Website RT</h3>
            <p className="text-sm text-gray-400">
              Sistem informasi terpadu untuk memudahkan komunikasi dan administrasi RT.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-2">Tautan Cepat</h3>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>
                <a href="/" className="hover:text-white">
                  Beranda
                </a>
              </li>
              <li>
                <a href="/announcements" className="hover:text-white">
                  Pengumuman
                </a>
              </li>
              <li>
                <a href="/login" className="hover:text-white">
                  Login
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-2">Kontak</h3>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>📍 Alamat RT</li>
              <li>📞 0812-3456-7890</li>
              <li>📧 info@rt.local</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-6 pt-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Website RT. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

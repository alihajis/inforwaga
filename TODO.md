# TODO - Website RT

Checklist fitur dan improvement yang perlu dikembangkan.

## ✅ Completed

- [x] Database schema design
- [x] Backend setup (Express + TypeScript + PostgreSQL)
- [x] Authentication system (Register, Login, JWT)
- [x] Announcements API (CRUD)
- [x] Events API (CRUD)
- [x] Frontend setup (Next.js + TypeScript + Tailwind)
- [x] Homepage with features overview
- [x] Login & Register pages
- [x] Responsive Navbar & Footer
- [x] API client & auth utilities

## 🔄 In Progress

### Backend APIs

- [ ] **Residents Management**
  - [ ] GET /api/residents - List all residents
  - [ ] GET /api/residents/:id - Get resident detail
  - [ ] POST /api/residents - Add new resident (admin)
  - [ ] PUT /api/residents/:id - Update resident (admin)
  - [ ] DELETE /api/residents/:id - Delete resident (admin)

- [ ] **Treasury Reports**
  - [ ] GET /api/treasury - Get treasury reports
  - [ ] GET /api/treasury/summary - Get monthly summary
  - [ ] POST /api/treasury - Add new transaction (admin)
  - [ ] PUT /api/treasury/:id - Update transaction (admin)
  - [ ] DELETE /api/treasury/:id - Delete transaction (admin)

- [ ] **Form Submissions**
  - [ ] GET /api/forms - Get all form submissions
  - [ ] GET /api/forms/:id - Get form detail
  - [ ] POST /api/forms - Submit new form (warga)
  - [ ] PUT /api/forms/:id/status - Update form status (admin)
  - [ ] POST /api/forms/:id/reject - Reject form (admin)
  - [ ] POST /api/forms/:id/approve - Approve form (admin)

- [ ] **Polls/Voting**
  - [ ] GET /api/polls - Get all polls
  - [ ] GET /api/polls/:id - Get poll detail with results
  - [ ] POST /api/polls - Create new poll (admin)
  - [ ] POST /api/polls/:id/vote - Submit vote (warga)
  - [ ] DELETE /api/polls/:id - Delete poll (admin)

- [ ] **Gallery**
  - [ ] GET /api/gallery - Get all gallery items
  - [ ] GET /api/gallery/:id - Get gallery item
  - [ ] POST /api/gallery - Upload new photo (admin)
  - [ ] DELETE /api/gallery/:id - Delete photo (admin)

- [ ] **File Upload Middleware**
  - [ ] Image upload handler (multer)
  - [ ] File validation (size, type)
  - [ ] Image compression/resize

### Frontend Pages

- [ ] **Public Pages**
  - [ ] /announcements - List all announcements
  - [ ] /announcements/[id] - Announcement detail
  - [ ] /events - Event calendar view

- [ ] **Admin Pages**
  - [ ] /admin - Dashboard with statistics
  - [ ] /admin/announcements - Manage announcements
  - [ ] /admin/events - Manage events
  - [ ] /admin/residents - Manage residents data
  - [ ] /admin/treasury - Treasury management
  - [ ] /admin/forms - Review form submissions
  - [ ] /admin/polls - Create and manage polls
  - [ ] /admin/gallery - Upload and manage photos
  - [ ] /admin/settings - RT settings & contact info

- [ ] **Warga Pages**
  - [ ] /warga - Warga dashboard
  - [ ] /warga/announcements - View announcements
  - [ ] /warga/events - View event calendar
  - [ ] /warga/treasury - View treasury reports
  - [ ] /warga/forms - Submit forms (SKTM, domisili, etc)
  - [ ] /warga/forms/[id] - View submission status
  - [ ] /warga/polls - View and participate in polls
  - [ ] /warga/gallery - View photo gallery
  - [ ] /warga/profile - Edit profile

### Components

- [ ] **UI Components**
  - [ ] Card component
  - [ ] Button variants
  - [ ] Input components
  - [ ] Modal/Dialog
  - [ ] Alert/Toast notifications
  - [ ] Loading skeleton
  - [ ] Pagination
  - [ ] Date picker
  - [ ] Table component

- [ ] **Feature Components**
  - [ ] AnnouncementCard
  - [ ] EventCard
  - [ ] TreasuryChart
  - [ ] FormBuilder
  - [ ] PollCard with voting
  - [ ] GalleryGrid
  - [ ] StatisticsCard (for dashboard)

## 🎯 Priority Features

### High Priority
1. File upload handling
2. Admin dashboard with statistics
3. Form submission system
4. Treasury reports

### Medium Priority
1. Polls/voting system
2. Gallery management
3. Email notifications
4. Search functionality

### Low Priority
1. Dark mode
2. Multi-language support
3. Export reports (PDF, Excel)
4. Mobile app (PWA)

## 🐛 Known Issues

- [ ] Need to fix bcrypt hash in database seed (init.sql)
- [ ] Frontend API error handling needs improvement
- [ ] No loading states on some pages
- [ ] Mobile menu animation

## 🚀 Future Enhancements

- [ ] **Notifications System**
  - Email notifications for important announcements
  - Push notifications (PWA)
  - SMS notifications

- [ ] **Advanced Features**
  - Chat/messaging between warga and admin
  - Payment integration (for iuran)
  - Document generation (auto-generate PDF surat)
  - QR code for attendance
  - Map integration (show RT area)

- [ ] **Analytics**
  - Visitor statistics
  - Most viewed announcements
  - Active users tracking
  - Form submission trends

- [ ] **Optimization**
  - Image lazy loading
  - API response caching
  - Database query optimization
  - Code splitting

- [ ] **Testing**
  - Unit tests (Jest)
  - Integration tests
  - E2E tests (Cypress)

- [ ] **Documentation**
  - API documentation (Swagger/OpenAPI)
  - User manual (for warga)
  - Admin guide
  - Video tutorials

## 📝 Notes

**Password Hash Issue:**
The default admin password in `database/init.sql` has a placeholder hash. 
Generate real bcrypt hash with:
```javascript
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('admin123', 10);
console.log(hash);
```

**Environment Variables:**
Don't forget to set proper values in `.env` and `.env.local` before deployment!

**Database Migrations:**
Consider using a migration tool like `node-pg-migrate` for future schema changes.

## 🤝 Contributing

Feel free to pick any item from this TODO list and submit a PR!

**How to contribute:**
1. Pick an unchecked item
2. Create a branch: `git checkout -b feature/your-feature`
3. Code and test
4. Update this TODO by checking the item
5. Submit PR

---

Last updated: 2026-04-26

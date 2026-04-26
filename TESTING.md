# Testing Guide - Website RT

Panduan untuk testing Website RT secara manual dan otomatis.

## 🧪 Manual Testing

### 1. Setup & Run Locally

```bash
# Terminal 1 - Backend
cd website-rt/backend
cp .env.example .env
nano .env  # Configure database
npm install
npm run dev

# Terminal 2 - Frontend
cd website-rt/frontend
cp .env.local.example .env.local
npm install
npm run dev
```

Access:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health check: http://localhost:5000/health

### 2. Database Setup

```bash
# Create database
psql -U postgres -c "CREATE DATABASE website_rt;"

# Import schema
psql -U postgres -d website_rt -f database/init.sql

# Verify tables
psql -U postgres -d website_rt -c "\dt"
```

### 3. Test Scenarios

#### Authentication

**Register New User (Warga):**
1. Go to http://localhost:3000/register
2. Fill form:
   - Name: Test User
   - Email: test@test.com
   - Password: test123
   - Address: Jl. Test No. 1
   - Phone: 08123456789
   - NIK: 1234567890123456
3. Click "Daftar"
4. Should redirect to `/warga` dashboard

**Login as Admin:**
1. Go to http://localhost:3000/login
2. Enter:
   - Email: admin@rt.local
   - Password: admin123
3. Click "Login"
4. Should redirect to `/admin` dashboard

**Login as Warga:**
1. Use credentials from register
2. Should redirect to `/warga`

#### Announcements

**View Announcements (Public):**
1. Go to http://localhost:3000
2. Scroll to "Pengumuman Terbaru"
3. Should show 2 sample announcements
4. Click "Lihat Semua" → Should go to `/announcements`

**Create Announcement (Admin):**
1. Login as admin
2. Go to `/admin/announcements` (when implemented)
3. Click "Tambah Pengumuman"
4. Fill:
   - Title: Pengumuman Test
   - Content: Ini adalah pengumuman test
5. Submit
6. Should appear in list

#### Events

**View Events (Public):**
1. Go to `/events`
2. Should show upcoming events calendar

**Create Event (Admin):**
1. Login as admin
2. Go to `/admin/events`
3. Add event with:
   - Title: Rapat RT
   - Date: Future date
   - Location: Balai RT

### 4. API Testing with cURL

**Health Check:**
```bash
curl http://localhost:5000/health
```

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test2@test.com",
    "password": "test123",
    "full_name": "Test User 2",
    "address": "Jl. Test 2",
    "phone": "08123456789"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@rt.local",
    "password": "admin123"
  }'
```

**Get Announcements:**
```bash
curl http://localhost:5000/api/announcements
```

**Create Announcement (needs token):**
```bash
TOKEN="your_jwt_token_here"

curl -X POST http://localhost:5000/api/announcements \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Test Announcement",
    "content": "This is a test announcement"
  }'
```

### 5. Common Issues & Solutions

**Backend won't start:**
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Check database connection
psql -U postgres -d website_rt -c "SELECT 1;"

# Check .env file
cat backend/.env
```

**Frontend build errors:**
```bash
cd frontend
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

**Database connection refused:**
- Check `DB_HOST`, `DB_PORT` in `.env`
- Verify PostgreSQL is running
- Check user permissions

**JWT errors:**
- Make sure `JWT_SECRET` is set in backend `.env`
- Token might be expired (default 7 days)

## 🤖 Automated Testing (Future)

### Unit Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Integration Tests

```bash
# API integration tests
cd backend
npm run test:integration
```

### E2E Tests

```bash
# Cypress E2E tests
cd frontend
npm run test:e2e
```

## 📊 Test Checklist

### Authentication ✅
- [ ] Register new user
- [ ] Login with correct credentials
- [ ] Login with wrong credentials (should fail)
- [ ] Access protected routes without token (should fail)
- [ ] Token expiration handling

### Authorization ✅
- [ ] Admin can access admin routes
- [ ] Warga cannot access admin routes (should return 403)
- [ ] Unauthenticated cannot access protected routes

### Announcements ✅
- [ ] Get all announcements (public)
- [ ] Get announcement by ID
- [ ] Create announcement (admin only)
- [ ] Update announcement (admin only)
- [ ] Delete announcement (admin only)
- [ ] Pagination works

### Events 🔄
- [ ] Get all events
- [ ] Get upcoming events only
- [ ] Create event (admin)
- [ ] Update event (admin)
- [ ] Delete event (admin)

### Residents ⏳
- [ ] Get all residents (admin)
- [ ] Add new resident (admin)
- [ ] Update resident (admin)
- [ ] Delete resident (admin)

### Treasury ⏳
- [ ] Get treasury reports
- [ ] Get monthly summary
- [ ] Add transaction (admin)
- [ ] Update transaction (admin)
- [ ] Delete transaction (admin)

### Forms ⏳
- [ ] Submit form (warga)
- [ ] Get own submissions (warga)
- [ ] Get all submissions (admin)
- [ ] Approve form (admin)
- [ ] Reject form (admin)

### Polls ⏳
- [ ] Get all polls
- [ ] Vote on poll (warga, once per poll)
- [ ] Cannot vote twice
- [ ] Get poll results
- [ ] Create poll (admin)
- [ ] Delete poll (admin)

### Gallery ⏳
- [ ] Get all photos
- [ ] Upload photo (admin)
- [ ] Delete photo (admin)

### File Upload ⏳
- [ ] Upload valid image
- [ ] Reject invalid file type
- [ ] Reject file too large
- [ ] Image compression works

## 🛡️ Security Testing

### SQL Injection
Test with malicious inputs:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@rt.local",
    "password": "' OR '1'='1"
  }'
```
Should NOT return success.

### XSS Prevention
Try creating announcement with:
```javascript
<script>alert('XSS')</script>
```
Should be escaped/sanitized.

### CSRF Protection
- [ ] Implement CSRF tokens (future)

### Rate Limiting
- [ ] Implement rate limiting (future)

## 📝 Test Reports

Keep track of test results:

```
Date: YYYY-MM-DD
Tester: Name
Environment: Local / Staging / Production

Feature          | Status | Notes
-----------------|--------|--------
Authentication   | ✅     | All tests passed
Announcements    | ✅     | Working
Events           | ⚠️     | Minor UI bug
Forms            | ❌     | API error 500
```

## 🎯 Performance Testing

```bash
# Install Apache Bench
sudo apt install apache2-utils

# Test API endpoint
ab -n 1000 -c 10 http://localhost:5000/api/announcements

# Results to look for:
# - Requests per second
# - Time per request
# - Failed requests (should be 0)
```

---

**Legend:**
- ✅ Implemented & Tested
- 🔄 Implemented, needs testing
- ⏳ Not yet implemented
- ❌ Failed test
- ⚠️ Has issues

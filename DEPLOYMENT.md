# 📦 Deployment Guide: InfinityFree + Supabase

## 🎯 Overview

Website PT. Inti Mutiara Kreasindo menggunakan arsitektur **hybrid**:
- **Frontend**: React + Vite (hosted di InfinityFree)
- **Backend**: Supabase (PostgreSQL + Auth + Storage + Realtime)

```
┌─────────────────┐
│   InfinityFree  │  ← Static files (HTML, CSS, JS)
│   (Frontend)    │
└────────┬────────┘
         │
         │ API Calls
         │
┌────────▼────────┐
│    Supabase     │  ← Database, Auth, Storage, Realtime
│    (Backend)    │
└─────────────────┘
```

---

## 📋 Prerequisites

### 1. InfinityFree Account
- [ ] Daftar di https://www.infinityfree.com
- [ ] Buat hosting account
- [ ] Catat FTP credentials
- [ ] Catat domain (contoh: `imk.infinityfreeapp.com`)

### 2. Supabase Account
- [ ] Daftar di https://supabase.com
- [ ] Buat project baru
- [ ] Catat Project URL
- [ ] Catat anon/public key
- [ ] Catat service_role key (untuk admin operations)

### 3. Development Tools
- [ ] Node.js 18+ installed
- [ ] npm atau yarn
- [ ] Git (optional)
- [ ] FTP client (FileZilla recommended)

---

## 🚀 Step-by-Step Deployment

### Step 1: Setup Supabase

#### 1.1 Create Project
1. Login ke https://supabase.com
2. Klik "New Project"
3. Isi detail:
   - **Name**: `imk-eoffice`
   - **Database Password**: (simpan dengan aman!)
   - **Region**: Singapore (atau terdekat)
4. Tunggu project selesai dibuat (~2 menit)

#### 1.2 Run Database Schema
1. Buka **SQL Editor** di Supabase dashboard
2. Copy isi file `supabase/schema.sql`
3. Paste dan klik **Run**
4. Verifikasi tabel terbuat di **Table Editor**

Tabel yang harus terbuat:
- ✅ profiles
- ✅ departments
- ✅ letters
- ✅ dispositions
- ✅ agendas
- ✅ archives
- ✅ notifications
- ✅ activity_logs
- ✅ legal_documents
- ✅ company_info
- ✅ organization_structure
- ✅ events
- ✅ event_registrations
- ✅ event_committees

#### 1.3 Enable Authentication
1. Buka **Authentication** > **Providers**
2. Enable **Email** provider
3. Disable "Confirm email" (untuk testing)
4. Save changes

#### 1.4 Create Demo Users
1. Buka **Authentication** > **Users**
2. Klik "Add user" > "Create new user"
3. Buat 3 user:

| Email | Password | Role |
|-------|----------|------|
| admin@imk.co.id | admin123 | admin |
| manager@imk.co.id | manager123 | manager |
| staff@imk.co.id | staff123 | staff |

4. Setelah user terbuat, jalankan SQL ini untuk set profile:

```sql
-- Update admin profile
UPDATE public.profiles 
SET 
  full_name = 'Ahmad Wijaya',
  role = 'admin',
  department = 'IT Management',
  avatar = 'AW'
WHERE email = 'admin@imk.co.id';

-- Update manager profile
UPDATE public.profiles 
SET 
  full_name = 'Siti Rahayu',
  role = 'manager',
  department = 'Operations',
  avatar = 'SR'
WHERE email = 'manager@imk.co.id';

-- Update staff profile
UPDATE public.profiles 
SET 
  full_name = 'Budi Santoso',
  role = 'staff',
  department = 'Engineering',
  avatar = 'BS'
WHERE email = 'staff@imk.co.id';
```

#### 1.5 Setup Storage (Optional)
Untuk upload dokumen legalitas:

1. Buka **Storage**
2. Klik "New bucket"
3. Name: `legal-documents`
4. Public bucket: **Yes**
5. Create bucket

6. Jalankan policy SQL:

```sql
CREATE POLICY "Public access for legal documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'legal-documents');

CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'legal-documents' 
  AND auth.role() = 'authenticated'
);
```

#### 1.6 Get API Credentials
1. Buka **Project Settings** > **API**
2. Copy **Project URL** → `VITE_SUPABASE_URL`
3. Copy **anon/public key** → `VITE_SUPABASE_ANON_KEY`

---

### Step 2: Configure Environment

#### 2.1 Create .env file
```bash
cp .env.example .env
```

#### 2.2 Edit .env
```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Site
VITE_SITE_URL=https://imk.infinityfreeapp.com
VITE_APP_NAME=PT. Inti Mutiara Kreasindo
VITE_APP_ENV=production

# Features
VITE_ENABLE_EOFFICE=true
VITE_ENABLE_EVENT_REGISTRATION=true
VITE_ENABLE_QR_SCANNER=true
VITE_ENABLE_NOTIFICATIONS=true
```

---

### Step 3: Build Project

#### 3.1 Install Dependencies
```bash
npm install
```

#### 3.2 Build for Production
```bash
npm run build
```

Output akan ada di folder `dist/`

#### 3.3 Test Build Locally (Optional)
```bash
npm run preview
```

Buka http://localhost:4173 untuk test

---

### Step 4: Deploy to InfinityFree

#### 4.1 Prepare Files
Folder yang perlu diupload:
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
└── (other files)
```

#### 4.2 Upload via FTP

**Using FileZilla:**

1. Open FileZilla
2. Connect to InfinityFree FTP:
   - **Host**: `ftpupload.net` atau dari control panel
   - **Username**: `if0_XXXXXXX` (dari control panel)
   - **Password**: (dari control panel)
3. Navigate to `htdocs/` folder
4. Upload **all contents** of `dist/` folder (not the folder itself)

**Using InfinityFree File Manager:**

1. Login ke InfinityFree control panel
2. Buka **File Manager**
3. Navigate to `htdocs/`
4. Upload files dari `dist/`

#### 4.3 Configure .htaccess

Create file `htdocs/.htaccess`:

```apache
# Enable rewrite engine
RewriteEngine On

# Redirect all requests to index.html (SPA routing)
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Cache static assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>

# Gzip compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html
  AddOutputFilterByType DEFLATE text/css
  AddOutputFilterByType DEFLATE application/javascript
  AddOutputFilterByType DEFLATE application/json
</IfModule>

# Security headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
</IfModule>
```

#### 4.4 Test Deployment

1. Buka domain InfinityFree: `https://imk.infinityfreeapp.com`
2. Test fitur:
   - ✅ Homepage loads
   - ✅ Navigation works
   - ✅ All pages accessible
   - ✅ E-Office login works
   - ✅ Dashboard loads
   - ✅ Data from Supabase appears

---

## 🔧 Post-Deployment Tasks

### 1. Verify Supabase Connection

Open browser console (F12) and check:
```javascript
// Should show: ✅ Supabase connected
```

If shows warning, check:
- .env file uploaded correctly
- Supabase URL and key correct
- Project is active

### 2. Test Authentication

1. Go to `/eoffice/login`
2. Login with demo credentials
3. Should redirect to `/eoffice`
4. Dashboard should show data from Supabase

### 3. Test CRUD Operations

**Letters:**
- [ ] Create new letter
- [ ] View letter list
- [ ] Update letter
- [ ] Delete letter

**Events:**
- [ ] Create event
- [ ] Register for event
- [ ] Generate QR code
- [ ] Check-in with QR

**Legal Documents:**
- [ ] Upload document
- [ ] View documents
- [ ] Update document
- [ ] Delete document

### 4. Monitor Performance

Check Supabase dashboard:
- **Database**: Query performance
- **Auth**: Login attempts
- **Storage**: File uploads
- **Realtime**: Active connections

---

## 🐛 Troubleshooting

### Issue: "Supabase not configured"

**Solution:**
1. Check `.env` file exists in root
2. Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
3. Rebuild project: `npm run build`
4. Reupload `dist/` folder

### Issue: "Profile not found" after login

**Solution:**
1. Check user exists in Supabase Auth
2. Run profile update SQL (see Step 1.4)
3. Verify trigger `on_auth_user_created` is active

### Issue: 404 on page refresh

**Solution:**
1. Check `.htaccess` file exists in `htdocs/`
2. Verify rewrite rules are correct
3. Contact InfinityFree support if mod_rewrite not enabled

### Issue: CORS errors

**Solution:**
1. Go to Supabase **Authentication** > **URL Configuration**
2. Add your InfinityFree domain to "Site URL"
3. Add to "Redirect URLs": `https://imk.infinityfreeapp.com/**`

### Issue: Images not loading

**Solution:**
1. Check Supabase Storage bucket is public
2. Verify storage policies allow SELECT
3. Check image URLs are correct

---

## 📊 Monitoring & Maintenance

### Daily Checks
- [ ] Check Supabase dashboard for errors
- [ ] Monitor database size
- [ ] Check auth login attempts

### Weekly Tasks
- [ ] Review activity logs
- [ ] Check storage usage
- [ ] Backup database (Supabase auto-backup)

### Monthly Tasks
- [ ] Review and rotate API keys
- [ ] Update dependencies: `npm update`
- [ ] Check for security advisories
- [ ] Review user access logs

---

## 🔐 Security Checklist

- [ ] Strong database password
- [ ] RLS policies enabled on all tables
- [ ] Service role key kept secret
- [ ] CORS configured correctly
- [ ] HTTPS enforced (InfinityFree default)
- [ ] No sensitive data in frontend code
- [ ] Environment variables not committed to git

---

## 📞 Support

### InfinityFree Support
- Website: https://www.infinityfree.com/support
- Forum: https://forum.infinityfree.com

### Supabase Support
- Docs: https://supabase.com/docs
- Discord: https://discord.supabase.com
- GitHub: https://github.com/supabase/supabase

### Internal Support
- Email: engineering@intimutiara.co.id
- IT Department: PT. Inti Mutiara Kreasindo

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Jan 2024 | Initial deployment |

---

**Last Updated**: January 2024  
**Maintained by**: IT Department - PT. Inti Mutiara Kreasindo

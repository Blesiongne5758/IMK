# 🔒 SECURITY AUDIT REPORT
## Website PT. Inti Mutiara Kreasindo

**Audit Date**: January 2024  
**Auditor**: Security Team  
**Status**: ⚠️ CRITICAL ISSUES FOUND

---

## 🚨 CRITICAL SECURITY ISSUES

### 1. **HARDCODED DEMO CREDENTIALS** 🔴 CRITICAL

**Location**: `src/lib/auth.ts` (Lines 15-46)

**Issue**: 
Demo user credentials hardcoded di frontend code:
```typescript
const DEMO_USERS: Record<string, { password: string; user: User }> = {
  'admin@imk.co.id': {
    password: 'admin123',  // ❌ WEAK PASSWORD
    ...
  },
  'manager@imk.co.id': {
    password: 'manager123',  // ❌ WEAK PASSWORD
    ...
  },
  'staff@imk.co.id': {
    password: 'staff123',  // ❌ WEAK PASSWORD
    ...
  },
};
```

**Risk Level**: 🔴 CRITICAL

**Impact**:
- Siapa pun bisa melihat password di source code (bisa di-inspect di browser)
- Password sangat lemah dan mudah ditebak
- Jika Supabase tidak dikonfigurasi, credentials ini akan digunakan di production
- Attacker bisa login sebagai admin dengan mudah

**Recommendation**:
```typescript
// ❌ JANGAN lakukan ini
const DEMO_USERS = { ... };

// ✅ Lakukan ini:
// 1. Hapus hardcoded credentials dari frontend
// 2. Gunakan environment variables (jika harus ada demo mode)
// 3. Atau lebih baik: hapus demo mode entirely di production
// 4. Gunakan Supabase Auth untuk semua authentication

// Di .env (jika tetap butuh demo mode):
VITE_DEMO_MODE=false  // Disable di production

// Di auth.ts:
if (import.meta.env.VITE_DEMO_MODE === 'true') {
  // Only enable demo mode in development
  if (import.meta.env.DEV) {
    // Demo credentials only in development
  }
}
```

**Priority**: 🔴 FIX IMMEDIATELY BEFORE DEPLOYMENT

---

### 2. **SENSITIVE DATA IN LOCALSTORAGE** 🟠 HIGH

**Location**: Multiple files

**Affected Files**:
- `src/pages/JobsPage.tsx` - Job applications dengan data pribadi
- `src/pages/LegalitasAdmin.tsx` - Legal documents
- `src/pages/EventManagement.tsx` - Event registrations
- `src/pages/QRScannerPage.tsx` - QR codes
- `src/components/ConsultationScheduler.tsx` - Consultation data

**Issue**:
Data sensitif disimpan di localStorage tanpa enkripsi:
```typescript
// JobsPage.tsx - Data pribadi pelamar
localStorage.setItem('imk_job_applications', JSON.stringify(applications));
// Data yang disimpan:
// - Nama lengkap
// - Email
// - No. telepon
// - Alamat
// - Pendidikan
// - Experience
// - URLs (portfolio, github, linkedin, cv)
```

**Risk Level**: 🟠 HIGH

**Impact**:
- Data bisa diakses oleh JavaScript di browser
- Data bisa dibaca oleh extension browser malicious
- Data bisa bocor jika ada XSS vulnerability
- Data tidak terenkripsi, bisa dibaca siapa saja yang akses browser
- localStorage limit 5-10MB, bisa penuh dan menyebabkan data loss
- Data bisa dimanipulasi oleh user (client-side manipulation)

**Recommendation**:
```typescript
// ❌ JANGAN simpan data sensitif di localStorage
localStorage.setItem('data', JSON.stringify(sensitiveData));

// ✅ Lakukan ini:
// 1. Gunakan Supabase untuk semua data storage
// 2. Jika harus ada fallback, gunakan sessionStorage (lebih aman)
// 3. Atau encrypt data sebelum simpan di localStorage
// 4. Jangan simpan data pribadi di client-side

// Contoh dengan encryption:
import { encrypt, decrypt } from './crypto';

const encryptedData = encrypt(JSON.stringify(sensitiveData));
localStorage.setItem('data', encryptedData);
```

**Priority**: 🟠 HIGH - Fix before handling real user data

---

### 3. **NO URL VALIDATION** 🟠 HIGH

**Location**: `src/pages/JobsPage.tsx` (Lines 503-539)

**Issue**:
URL inputs tidak divalidasi sama sekali:
```typescript
<input
  type="url"
  value={form.portfolioUrl}
  onChange={(e) => handleChange('portfolioUrl', e.target.value)}
  placeholder="https://portfolio.com"
/>
```

**Risk Level**: 🟠 HIGH

**Impact**:
- User bisa memasukkan malicious URLs:
  - `javascript:alert('XSS')`
  - `data:text/html,<script>alert('XSS')</script>`
  - `file:///etc/passwd`
- URL bisa mengandung malicious code
- Jika URL dirender sebagai link, bisa menyebabkan XSS
- Tidak ada validasi apakah URL benar-benar valid

**Recommendation**:
```typescript
// ✅ Tambahkan URL validation
function isValidUrl(url: string): boolean {
  if (!url) return true; // Optional field
  
  try {
    const parsed = new URL(url);
    // Only allow http and https protocols
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

// Di validation function:
if (form.portfolioUrl && !isValidUrl(form.portfolioUrl)) {
  newErrors.portfolioUrl = 'URL tidak valid';
}
```

**Priority**: 🟠 HIGH - Fix before deployment

---

### 4. **NO INPUT SANITIZATION** 🟠 MEDIUM

**Location**: Multiple form components

**Issue**:
Input tidak disanitasi sebelum disimpan:
```typescript
// JobsPage.tsx
const application = {
  fullName: form.fullName.trim(),  // ❌ No sanitization
  experience: form.experience.trim(),  // ❌ No sanitization
  coverLetter: form.coverLetter.trim(),  // ❌ No sanitization
};
```

**Risk Level**: 🟠 MEDIUM

**Impact**:
- Input bisa mengandung malicious scripts
- Jika data dirender tanpa escaping, bisa menyebabkan XSS
- Data bisa mengandung HTML tags yang tidak diinginkan
- Tidak ada protection terhadap injection attacks

**Recommendation**:
```typescript
// ✅ Tambahkan sanitization function
function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Atau gunakan library seperti DOMPurify
import DOMPurify from 'dompurify';
const clean = DOMPurify.sanitize(dirty);

// Di form submission:
const application = {
  fullName: sanitizeInput(form.fullName.trim()),
  experience: sanitizeInput(form.experience.trim()),
  coverLetter: sanitizeInput(form.coverLetter.trim()),
};
```

**Priority**: 🟠 MEDIUM - Fix before handling user-generated content

---

### 5. **FILE UPLOAD VALIDATION WEAKNESS** 🟠 MEDIUM

**Location**: `src/pages/LegalitasAdmin.tsx` (Lines 88-100)

**Issue**:
File upload hanya divalidasi di client-side:
```typescript
// Validate file type
const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
if (!validTypes.includes(file.type)) {
  alert('Format file tidak didukung.');
  return;
}

// Validate file size (max 5MB)
if (file.size > 5 * 1024 * 1024) {
  alert('Ukuran file terlalu besar.');
  return;
}
```

**Risk Level**: 🟠 MEDIUM

**Impact**:
- MIME type bisa di-spoof di client-side
- Attacker bisa bypass validation dengan manipulate file object
- File extension tidak divalidasi
- Tidak ada virus scanning
- File disimpan sebagai base64 di localStorage (bisa menyebabkan DoS jika banyak file)

**Recommendation**:
```typescript
// ✅ Tambahkan server-side validation
// 1. Validasi file extension (bukan hanya MIME type)
const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
if (!allowedExtensions.includes(fileExtension)) {
  throw new Error('File extension tidak valid');
}

// 2. Validasi file magic numbers (lebih aman dari MIME type)
async function validateFileMagicNumber(file: File): Promise<boolean> {
  const buffer = await file.slice(0, 4).arrayBuffer();
  const view = new Uint8Array(buffer);
  
  // JPEG: FF D8 FF
  if (view[0] === 0xFF && view[1] === 0xD8 && view[2] === 0xFF) {
    return true;
  }
  
  // PNG: 89 50 4E 47
  if (view[0] === 0x89 && view[1] === 0x50 && view[2] === 0x4E && view[3] === 0x47) {
    return true;
  }
  
  return false;
}

// 3. Gunakan Supabase Storage untuk file upload (bukan localStorage)
// 4. Tambahkan virus scanning di server-side
```

**Priority**: 🟠 MEDIUM - Fix before enabling file uploads in production

---

## ⚠️ MEDIUM SECURITY ISSUES

### 6. **NO RATE LIMITING** 🟠 MEDIUM

**Location**: All API calls

**Issue**:
Tidak ada rate limiting untuk API calls:
```typescript
// User bisa spam API calls tanpa limit
await createLetter(...);
await createLetter(...);
await createLetter(...);
// No rate limiting
```

**Risk Level**: 🟠 MEDIUM

**Impact**:
- Attacker bisa spam API calls
- Bisa menyebabkan DoS (Denial of Service)
- Bisa exhaust database connections
- Bisa menyebabkan biaya Supabase membengkak

**Recommendation**:
```typescript
// ✅ Implementasi rate limiting di Supabase
// 1. Gunakan Supabase Edge Functions dengan rate limiting
// 2. Atau gunakan Cloudflare/WAF di front of Supabase
// 3. Implementasi client-side rate limiting (basic protection)

// Client-side rate limiting example:
const rateLimiter = {
  calls: [],
  maxCalls: 10,
  timeWindow: 60000, // 1 minute
  
  canMakeCall(): boolean {
    const now = Date.now();
    this.calls = this.calls.filter(time => now - time < this.timeWindow);
    return this.calls.length < this.maxCalls;
  },
  
  recordCall() {
    this.calls.push(Date.now());
  }
};

// Usage:
if (!rateLimiter.canMakeCall()) {
  alert('Too many requests. Please try again later.');
  return;
}
rateLimiter.recordCall();
await createLetter(...);
```

**Priority**: 🟠 MEDIUM - Implement before production

---

### 7. **NO CSRF PROTECTION** 🟠 MEDIUM

**Location**: All form submissions

**Issue**:
Tidak ada CSRF token protection:
```typescript
// Form submission tanpa CSRF token
<form onSubmit={handleSubmit}>
  <input type="text" name="email" />
  <button type="submit">Submit</button>
</form>
```

**Risk Level**: 🟠 MEDIUM

**Impact**:
- Attacker bisa membuat malicious website yang submit form ke website kita
- User yang sudah login bisa termanipulasi untuk submit data tanpa sepengetahuan mereka
- Bisa menyebabkan unauthorized actions

**Recommendation**:
```typescript
// ✅ Supabase sudah handle CSRF protection secara otomatis
// Tapi untuk extra security, tambahkan custom headers

// Di Supabase client:
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  global: {
    headers: {
      'X-CSRF-Token': generateCSRFToken(),
    }
  }
});

// Generate CSRF token
function generateCSRFToken(): string {
  return btoa(Math.random().toString());
}
```

**Priority**: 🟠 MEDIUM - Supabase already handles this, but extra layer is good

---

### 8. **ERROR MESSAGES EXPOSE SENSITIVE INFO** 🟡 LOW

**Location**: Multiple service functions

**Issue**:
Error messages bisa expose sensitive information:
```typescript
if (error) {
  console.error('Error fetching data:', error);
  return { success: false, error: error.message };
}
```

**Risk Level**: 🟡 LOW

**Impact**:
- Error messages bisa expose database structure
- Bisa expose internal paths
- Bisa expose sensitive information tentang sistem

**Recommendation**:
```typescript
// ✅ Gunakan generic error messages di production
if (error) {
  console.error('Error:', error); // Log full error di server
  
  // Return generic message ke client
  return { 
    success: false, 
    error: 'Terjadi kesalahan. Silakan coba lagi.' 
  };
}

// Atau gunakan error codes
return { 
  success: false, 
  errorCode: 'DATABASE_ERROR',
  error: 'Terjadi kesalahan sistem' 
};
```

**Priority**: 🟡 LOW - Fix before production

---

## ✅ SECURITY FEATURES ALREADY IMPLEMENTED

### Good Security Practices Found:

1. ✅ **Row Level Security (RLS)** - Semua tabel Supabase memiliki RLS policies
2. ✅ **No dangerouslySetInnerHTML** - Tidak ada penggunaan innerHTML yang bisa menyebabkan XSS
3. ✅ **TypeScript Strict Mode** - Type safety mengurangi bug
4. ✅ **Environment Variables** - Secrets tidak hardcoded (kecuali demo credentials)
5. ✅ **Anti-Screenshot Protection** - Legalitas page memiliki protection
6. ✅ **Watermark** - Dokumen legal memiliki watermark
7. ✅ **Input Validation** - Beberapa input divalidasi (email, required fields)
8. ✅ **File Type Validation** - File upload divalidasi (meski hanya client-side)

---

## 📊 SECURITY SCORE

| Category | Score | Status |
|----------|-------|--------|
| Authentication | 3/10 | 🔴 Critical Issues |
| Data Storage | 4/10 | 🟠 High Risk |
| Input Validation | 5/10 | 🟠 Needs Improvement |
| File Upload | 5/10 | 🟠 Client-side Only |
| API Security | 6/10 | 🟠 No Rate Limiting |
| Database Security | 9/10 | ✅ Good RLS |
| XSS Protection | 8/10 | ✅ No innerHTML |
| Error Handling | 7/10 | 🟡 Expose Info |

**Overall Security Score**: 5.9/10 ⚠️ NEEDS IMPROVEMENT

---

## 🎯 ACTION PLAN

### 🔴 CRITICAL (Fix Immediately)

1. **Remove Hardcoded Demo Credentials**
   - Hapus DEMO_USERS dari auth.ts
   - Atau wrap dengan `import.meta.env.DEV` check
   - Gunakan Supabase Auth untuk semua authentication
   - **Time**: 1-2 hours

### 🟠 HIGH (Fix Before Production)

2. **Migrate localStorage to Supabase**
   - Update JobsPage untuk gunakan JobApplicationService
   - Update ConsultationScheduler untuk gunakan ConsultationService
   - Update LegalitasAdmin untuk gunakan LegalDocumentService
   - Update EventManagement untuk gunakan EventService
   - **Time**: 4-6 hours

3. **Add URL Validation**
   - Tambahkan isValidUrl() function
   - Validate semua URL inputs
   - **Time**: 1-2 hours

4. **Add Input Sanitization**
   - Tambahkan sanitizeInput() function
   - Sanitize semua user inputs
   - **Time**: 2-3 hours

### 🟠 MEDIUM (Fix Before Production)

5. **Improve File Upload Security**
   - Add file extension validation
   - Add magic number validation
   - Use Supabase Storage instead of localStorage
   - **Time**: 3-4 hours

6. **Add Rate Limiting**
   - Implement client-side rate limiting
   - Configure Supabase Edge Functions rate limiting
   - **Time**: 2-3 hours

### 🟡 LOW (Fix When Possible)

7. **Improve Error Handling**
   - Use generic error messages
   - Don't expose internal errors
   - **Time**: 1-2 hours

8. **Add CSRF Protection**
   - Add custom headers
   - **Time**: 1 hour

---

## 📝 RECOMMENDATIONS

### Immediate Actions (Before Deployment):

1. ✅ **Remove demo credentials** atau disable demo mode di production
2. ✅ **Migrate semua localStorage ke Supabase** untuk data sensitif
3. ✅ **Add URL validation** untuk semua URL inputs
4. ✅ **Add input sanitization** untuk semua user inputs
5. ✅ **Test RLS policies** di Supabase

### Short-term (1-2 weeks):

1. ✅ **Implement file upload** dengan Supabase Storage
2. ✅ **Add rate limiting** di Supabase Edge Functions
3. ✅ **Add monitoring** untuk security events
4. ✅ **Add logging** untuk audit trail
5. ✅ **Conduct penetration testing**

### Long-term (1-3 months):

1. ✅ **Implement 2FA** untuk admin users
2. ✅ **Add IP whitelisting** untuk admin access
3. ✅ **Implement audit logging** untuk semua actions
4. ✅ **Add security headers** (CSP, HSTS, etc.)
5. ✅ **Regular security audits**

---

## 🔐 DEPLOYMENT CHECKLIST

Sebelum deploy ke production, pastikan:

- [ ] ❌ Demo credentials dihapus atau disabled
- [ ] ✅ Semua data sensitif disimpan di Supabase (bukan localStorage)
- [ ] ✅ URL validation diimplementasi
- [ ] ✅ Input sanitization diimplementasi
- [ ] ✅ File upload menggunakan Supabase Storage
- [ ] ✅ RLS policies tested dan verified
- [ ] ✅ Rate limiting diimplementasi
- [ ] ✅ Error messages tidak expose sensitive info
- [ ] ✅ HTTPS enforced
- [ ] ✅ Security headers configured
- [ ] ✅ Monitoring dan logging aktif
- [ ] ✅ Backup strategy in place
- [ ] ✅ Incident response plan ready

---

## 📞 EMERGENCY CONTACT

Jika menemukan security issue setelah deployment:

- **Email**: security@intimutiara.co.id
- **IT Department**: +62 21 5055 8800
- **Supabase Support**: https://supabase.com/support

---

## 📚 REFERENCES

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/auth/security)
- [React Security Best Practices](https://reactjs.org/docs/security.html)
- [localStorage Security Risks](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)

---

**Report Generated**: January 2024  
**Next Audit**: Recommended within 3 months  
**Status**: ⚠️ CRITICAL ISSUES MUST BE FIXED BEFORE PRODUCTION DEPLOYMENT

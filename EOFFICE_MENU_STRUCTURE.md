# 📋 E-Office Menu Structure - Implementation Guide

## 📋 Overview

Sistem menu E-Office telah diupdate dengan struktur **dropdown menu** yang lebih terorganisir untuk modul Lowongan dan Event. Semua pendaftar lowongan dari halaman publik sekarang terintegrasi langsung ke E-Office.

---

## 🎯 Struktur Menu Baru

### **Tab Lowongan** (Dropdown Menu)
```
📋 Lowongan
  ├── 📄 Daftar Lamaran      → /eoffice/lowongan
  ├── 📊 Laporan             → /eoffice/lowongan/report
  └── 📅 Jadwal Wawancara    → /eoffice/lowongan/interview
```

### **Tab Event** (Dropdown Menu)
```
👥 Event
  ├── ➕ Buat Event          → /eoffice/event
  ├── 📅 Daftar Event        → /eoffice/event/list
  ├── 👤 Peserta             → /eoffice/event/participants
  └── 👥 Panitia             → /eoffice/event/committee
```

---

## 🏗️ Implementation Details

### 1. Dropdown Menu Component

**File**: `src/components/DropdownMenu.tsx`

**Features**:
- ✅ Expandable/collapsible menu items
- ✅ Support untuk nested menus
- ✅ Active state highlighting
- ✅ Badge support untuk notifikasi
- ✅ Responsive design
- ✅ Keyboard navigation support

**Usage**:
```tsx
<DropdownMenu
  items={menuItems}
  activeId={activeTab}
  onItemClick={handleMenuClick}
/>
```

### 2. Lowongan Module

#### **Daftar Lamaran** (`/eoffice/lowongan`)
**File**: `src/pages/eoffice/LowonganListPage.tsx`

**Features**:
- ✅ List semua lamaran dari halaman publik
- ✅ Filter by status (pending, reviewed, interview, accepted, rejected)
- ✅ Filter by posisi
- ✅ Detail modal dengan informasi lengkap
- ✅ Update status lamaran
- ✅ Export data

**Data Integration**:
- Mengambil data dari `JobApplicationService.getAllJobApplications()`
- Data tersinkronisasi dengan halaman publik `/lowongan`
- Real-time update saat ada lamaran baru

#### **Laporan** (`/eoffice/lowongan/report`)
**File**: `src/pages/eoffice/LowonganReportPage.tsx`

**Features**:
- ✅ Summary cards (total, diterima, interview, pending)
- ✅ Distribusi status dengan progress bar
- ✅ Lamaran per posisi (top 5)
- ✅ Tren lamaran per bulan
- ✅ Acceptance rate calculation

**Statistics**:
- Total lamaran
- Status distribution
- Position breakdown
- Monthly trends
- Acceptance rate

#### **Jadwal Wawancara** (`/eoffice/lowongan/interview`)
**File**: `src/pages/eoffice/LowonganInterviewPage.tsx`

**Features**:
- ✅ List wawancara mendatang
- ✅ Riwayat wawancara
- ✅ Form jadwal wawancara baru
- ✅ Pilih kandidat dari lamaran dengan status "interview"
- ✅ Update status (scheduled, completed, cancelled)
- ✅ Detail wawancara (tanggal, waktu, durasi, lokasi, tipe)

**Interview Types**:
- Online (dengan link meeting)
- Offline (dengan lokasi)

### 3. Event Module

#### **Buat Event** (`/eoffice/event`)
**File**: `src/pages/EventManagement.tsx` (existing)

**Features**:
- ✅ Form create/edit event
- ✅ Upload gambar event
- ✅ Set kapasitas dan tanggal
- ✅ Toggle publish/draft
- ✅ Require registration toggle

#### **Daftar Event** (`/eoffice/event/list`)
**File**: `src/pages/eoffice/EventListPage.tsx`

**Features**:
- ✅ List semua event
- ✅ Toggle publish/unpublish
- ✅ Edit event
- ✅ Delete event
- ✅ Filter by status (published/draft)

#### **Peserta** (`/eoffice/event/participants`)
**File**: `src/pages/eoffice/EventParticipantsPage.tsx`

**Features**:
- ✅ Pilih event dari dropdown
- ✅ List semua peserta event
- ✅ Summary cards (total peserta, checked-in, belum check-in, kapasitas)
- ✅ Status check-in (checked-in / belum)
- ✅ Detail peserta (nama, email, telepon, perusahaan)
- ✅ Check-in tracking dengan timestamp

**Data Integration**:
- Mengambil data dari `EventService.getEventRegistrations(eventId)`
- Real-time update saat ada pendaftaran baru

#### **Panitia** (`/eoffice/event/committee`)
**File**: `src/pages/eoffice/EventCommitteePage.tsx`

**Features**:
- ✅ Pilih event dari dropdown
- ✅ List panitia per event
- ✅ Tambah panitia baru
- ✅ Assign role (Scanner / Organizer)
- ✅ Hapus panitia
- ✅ Pilih dari daftar karyawan terdaftar

**Committee Roles**:
- **Scanner**: Bisa scan QR code untuk check-in peserta
- **Organizer**: Full access untuk kelola event

---

## 🔄 Data Flow

### Lowongan Flow
```
Halaman Publik (/lowongan)
    ↓
User submit lamaran
    ↓
Data tersimpan di localStorage/Supabase
    ↓
E-Office Lowongan > Daftar Lamaran
    ↓
Admin review & update status
    ↓
Status = "interview"
    ↓
E-Office Lowongan > Jadwal Wawancara
    ↓
Admin buat jadwal interview
    ↓
Peserta di-interview
    ↓
Update status (accepted/rejected)
```

### Event Flow
```
E-Office Event > Buat Event
    ↓
Admin create event
    ↓
Event published
    ↓
Halaman Publik (/event) menampilkan event
    ↓
User register untuk event
    ↓
Data tersimpan di localStorage/Supabase
    ↓
E-Office Event > Peserta
    ↓
Admin lihat daftar peserta
    ↓
E-Office Event > Panitia
    ↓
Admin assign panitia (scanner/organizer)
    ↓
Panitia scanner scan QR code
    ↓
Peserta checked-in
    ↓
E-Office Event > Peserta (update status)
```

---

## 📁 File Structure

```
src/
├── components/
│   └── DropdownMenu.tsx              ✅ NEW - Dropdown menu component
├── pages/
│   ├── EOfficeDashboard.tsx          ✅ UPDATED - Menggunakan DropdownMenu
│   ├── eoffice/
│   │   ├── LowonganListPage.tsx      ✅ NEW - Daftar lamaran
│   │   ├── LowonganReportPage.tsx    ✅ NEW - Laporan lowongan
│   │   ├── LowonganInterviewPage.tsx ✅ NEW - Jadwal wawancara
│   │   ├── EventListPage.tsx         ✅ NEW - Daftar event
│   │   ├── EventParticipantsPage.tsx ✅ NEW - Peserta event
│   │   └── EventCommitteePage.tsx    ✅ NEW - Panitia event
│   ├── JobsPage.tsx                  ✅ EXISTING - Halaman publik lowongan
│   ├── EventPage.tsx                 ✅ EXISTING - Halaman publik event
│   └── EventManagement.tsx           ✅ EXISTING - Buat/edit event
└── lib/
    └── services/
        ├── jobApplicationService.ts  ✅ EXISTING - Service untuk lamaran
        └── eventService.ts           ✅ EXISTING - Service untuk event
```

---

## 🎨 UI/UX Features

### Dropdown Menu
- **Expandable**: Klik parent menu untuk expand/collapse children
- **Active State**: Menu aktif di-highlight dengan warna cyan
- **Icon Support**: Setiap menu item memiliki icon
- **Badge Support**: Menampilkan badge untuk notifikasi (contoh: jumlah lamaran baru)
- **Responsive**: Mobile-friendly dengan ukuran yang adaptif

### Status Badges
```tsx
// Lowongan Status
pending   → bg-yellow-100 text-yellow-700
reviewed  → bg-blue-100 text-blue-700
interview → bg-purple-100 text-purple-700
accepted  → bg-green-100 text-green-700
rejected  → bg-red-100 text-red-700

// Event Status
published → bg-green-100 text-green-700
draft     → bg-gray-100 text-gray-600

// Check-in Status
checked-in → bg-green-100 text-green-700
not-yet    → bg-yellow-100 text-yellow-700

// Committee Role
scanner   → bg-cyan-100 text-cyan-700
organizer → bg-indigo-100 text-indigo-700
```

---

## 🔧 Configuration

### Menu Items Structure
```typescript
const menuItems: MenuItem[] = [
  { 
    id: 'lowongan', 
    label: 'Lowongan', 
    icon: Briefcase,
    children: [
      { id: 'lowongan-list', label: 'Daftar Lamaran', icon: ClipboardList, path: '/eoffice/lowongan' },
      { id: 'lowongan-report', label: 'Laporan', icon: BarChart3, path: '/eoffice/lowongan/report' },
      { id: 'lowongan-interview', label: 'Jadwal Wawancara', icon: Calendar, path: '/eoffice/lowongan/interview' },
    ]
  },
  { 
    id: 'event', 
    label: 'Event', 
    icon: Users,
    children: [
      { id: 'event-create', label: 'Buat Event', icon: Plus, path: '/eoffice/event' },
      { id: 'event-list', label: 'Daftar Event', icon: Calendar, path: '/eoffice/event/list' },
      { id: 'event-participants', label: 'Peserta', icon: UserCheck, path: '/eoffice/event/participants' },
      { id: 'event-committee', label: 'Panitia', icon: Users, path: '/eoffice/event/committee' },
    ]
  },
];
```

---

## 📊 Statistics & Reports

### Lowongan Report
- **Total Lamaran**: Jumlah semua lamaran
- **Diterima**: Jumlah lamaran dengan status "accepted"
- **Jadwal Interview**: Jumlah lamaran dengan status "interview"
- **Menunggu Review**: Jumlah lamaran dengan status "pending"
- **Acceptance Rate**: (Diterima / Total) × 100%
- **Distribusi Status**: Progress bar untuk setiap status
- **Top 5 Posisi**: Posisi dengan lamaran terbanyak
- **Tren Bulanan**: Grafik lamaran per bulan

### Event Participants
- **Total Peserta**: Jumlah semua pendaftar
- **Sudah Check-in**: Jumlah peserta yang sudah check-in
- **Belum Check-in**: Jumlah peserta yang belum check-in
- **Kapasitas**: Kapasitas maksimal event
- **Check-in Rate**: (Checked-in / Total) × 100%

---

## ✅ Testing Checklist

### Lowongan Module
- [x] Lamaran dari halaman publik muncul di E-Office
- [x] Filter by status bekerja
- [x] Filter by posisi bekerja
- [x] Detail modal menampilkan semua informasi
- [x] Update status bekerja
- [x] Laporan menampilkan statistik yang benar
- [x] Jadwal wawancara bisa dibuat
- [x] Jadwal wawancara bisa diupdate statusnya

### Event Module
- [x] Event bisa dibuat dari E-Office
- [x] Daftar event menampilkan semua event
- [x] Toggle publish/unpublish bekerja
- [x] Peserta event muncul setelah registrasi
- [x] Check-in status terupdate
- [x] Panitia bisa ditambahkan
- [x] Role panitia (scanner/organizer) bisa diassign

### Integration
- [x] Data tersinkronisasi antara halaman publik dan E-Office
- [x] Real-time update saat ada perubahan
- [x] Dropdown menu expand/collapse bekerja
- [x] Active state highlighting bekerja
- [x] Responsive design bekerja di semua device

---

## 🚀 Usage Guide

### Untuk Admin HR (Lowongan)

1. **Lihat Lamaran Masuk**
   - Buka E-Office → Lowongan → Daftar Lamaran
   - Filter by status atau posisi
   - Klik lamaran untuk lihat detail

2. **Review Lamaran**
   - Buka detail lamaran
   - Update status (reviewed → interview → accepted/rejected)

3. **Jadwalkan Wawancara**
   - Buka Lowongan → Jadwal Wawancara
   - Klik "Jadwal Baru"
   - Pilih kandidat dengan status "interview"
   - Isi detail wawancara (tanggal, waktu, lokasi)
   - Simpan

4. **Lihat Laporan**
   - Buka Lowongan → Laporan
   - Lihat statistik dan tren lamaran
   - Export data jika diperlukan

### Untuk Admin Event

1. **Buat Event**
   - Buka E-Office → Event → Buat Event
   - Isi detail event
   - Upload gambar
   - Set kapasitas dan tanggal
   - Publish event

2. **Lihat Peserta**
   - Buka Event → Peserta
   - Pilih event dari dropdown
   - Lihat daftar peserta dan status check-in

3. **Assign Panitia**
   - Buka Event → Panitia
   - Pilih event dari dropdown
   - Klik "Tambah Panitia"
   - Pilih karyawan dan role (scanner/organizer)
   - Simpan

4. **Monitor Check-in**
   - Buka Event → Peserta
   - Lihat real-time check-in status
   - Export daftar peserta jika diperlukan

---

## 📝 Notes

### Data Storage
- **Demo Mode**: Data tersimpan di localStorage
- **Production Mode**: Data tersimpan di Supabase
- **Sync**: Data otomatis tersinkronisasi antara halaman publik dan E-Office

### Security
- Semua halaman E-Office memerlukan authentication
- Role-based access control (admin, manager, staff)
- Data validation di client dan server side

### Performance
- Lazy loading untuk halaman-halaman yang tidak aktif
- Pagination untuk list dengan banyak data
- Optimized queries untuk Supabase

---

## 🎯 Future Enhancements

### Lowongan Module
- [ ] Email notification saat ada lamaran baru
- [ ] Bulk status update
- [ ] Export to PDF/Excel
- [ ] Interview reminder emails
- [ ] Candidate scoring system
- [ ] Integration dengan calendar

### Event Module
- [ ] Email confirmation untuk peserta
- [ ] QR code generation untuk peserta
- [ ] Attendance report export
- [ ] Event analytics dashboard
- [ ] Feedback form setelah event
- [ ] Integration dengan calendar

---

## ✅ Status

**Implementation**: ✅ Complete  
**Testing**: ✅ Passed  
**Documentation**: ✅ Complete  
**Build**: ✅ Successful  

---

**Last Updated**: January 2024  
**Version**: 1.5.0 (Menu Structure Update)  
**Maintained by**: IT Department - PT. Inti Mutiara Kreasindo

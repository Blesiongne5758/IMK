# E-Office Data Structure & Functions Documentation

## 📁 Struktur Folder

```
src/lib/
├── types/
│   └── eoffice.ts              # Type definitions untuk semua entitas
├── services/
│   ├── index.ts                # Central export
│   ├── letterService.ts        # CRUD surat masuk/keluar
│   ├── dispositionService.ts   # CRUD disposisi surat
│   ├── agendaService.ts        # CRUD agenda/calendar
│   ├── eventService.ts         # CRUD event, registrasi, panitia
│   ├── notificationService.ts  # CRUD notifikasi
│   ├── activityLogService.ts   # Activity logging
│   └── dashboardService.ts     # Dashboard statistics
├── hooks/
│   └── useEOffice.ts           # Custom React hooks
├── utils/
│   └── helpers.ts              # Utility functions
└── auth.ts                     # Authentication functions
```

## 🗄️ Struktur Data

### 1. User
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'staff';
  avatar: string;
  department: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### 2. Letter (Surat)
```typescript
interface Letter {
  id: string;
  letterNumber: string;          // Contoh: 001/SM/IMK/2024
  type: 'incoming' | 'outgoing';
  title: string;
  content?: string;
  fromEntity: string;            // Pengirim/Tujuan
  toEntity?: string;
  letterDate: string;
  receivedDate?: string;
  status: 'draft' | 'sent' | 'received' | 'archived';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  attachments?: string[];        // Array of file URLs
  createdBy: string;             // User ID
  createdAt: string;
  updatedAt: string;
}
```

### 3. Disposition (Disposisi)
```typescript
interface Disposition {
  id: string;
  letterId: string;              // Reference ke Letter
  fromUserId: string;            // Pemberi disposisi
  toUserId: string;              // Penerima disposisi
  instruction: string;           // Instruksi disposisi
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  notes?: string;
  dueDate?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}
```

### 4. Agenda
```typescript
interface Agenda {
  id: string;
  title: string;
  description?: string;
  location?: string;
  startTime: string;             // ISO datetime
  endTime: string;
  isAllDay: boolean;
  category: 'meeting' | 'deadline' | 'event' | 'reminder';
  attendees?: string[];          // Array of user IDs
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
```

### 5. Event
```typescript
interface Event {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  eventTime: string;
  location: string;
  capacity: number;
  registered: number;
  category: 'Conference' | 'Workshop' | 'Webinar' | 'Hackathon' | 'Meetup' | 'Training';
  speaker?: string;
  imageUrl?: string;
  isPublished: boolean;
  requireRegistration: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
```

### 6. Event Registration
```typescript
interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  qrCode: string;                // Unique QR code
  checkedIn: boolean;
  checkedInAt?: string;
  registeredAt: string;
}
```

### 7. Event Committee
```typescript
interface EventCommittee {
  id: string;
  eventId: string;
  userId: string;
  role: 'scanner' | 'organizer';
  createdAt: string;
}
```

### 8. Notification
```typescript
interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  isRead: boolean;
  link?: string;
  createdAt: string;
}
```

### 9. Activity Log
```typescript
interface ActivityLog {
  id: string;
  userId: string;
  action: string;                // Contoh: 'created_letter'
  entityType?: string;           // Contoh: 'letter'
  entityId?: string;
  details?: Record<string, any>;
  createdAt: string;
}
```

### 10. Legal Document
```typescript
interface LegalDocument {
  id: string;
  title: string;
  description: string;
  category: 'legal' | 'certificate' | 'organization' | 'photo';
  imageUrl: string;
  documentNumber?: string;
  issuedDate?: string;
  expiryDate?: string;
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
```

## 🔧 Fungsi Service

### Letter Service

```typescript
// Get semua surat
getLetters(type?: 'incoming' | 'outgoing', params?: QueryParams): Promise<Letter[]>

// Get surat by ID
getLetterById(id: string): Promise<Letter | null>

// Buat surat baru
createLetter(letterData: LetterFormData, userId: string): Promise<ApiResponse<Letter>>

// Update surat
updateLetter(id: string, updates: Partial<LetterFormData>): Promise<ApiResponse<Letter>>

// Hapus surat
deleteLetter(id: string): Promise<ApiResponse<void>>

// Hitung surat
getLetterCount(type?: 'incoming' | 'outgoing'): Promise<number>

// Generate nomor surat
generateLetterNumber(type: 'incoming' | 'outgoing'): string
```

### Disposition Service

```typescript
// Get disposisi
getDispositions(userId?: string, params?: QueryParams): Promise<Disposition[]>

// Get disposisi by ID
getDispositionById(id: string): Promise<Disposition | null>

// Buat disposisi
createDisposition(dispositionData: DispositionFormData): Promise<ApiResponse<Disposition>>

// Update disposisi
updateDisposition(id: string, updates: Partial<DispositionFormData>): Promise<ApiResponse<Disposition>>

// Update status disposisi
updateDispositionStatus(
  id: string, 
  status: 'pending' | 'in_progress' | 'completed' | 'rejected',
  notes?: string
): Promise<ApiResponse<Disposition>>

// Hapus disposisi
deleteDisposition(id: string): Promise<ApiResponse<void>>

// Hitung disposisi pending
getPendingDispositionsCount(userId: string): Promise<number>
```

### Agenda Service

```typescript
// Get agenda
getAgendas(date?: string, params?: QueryParams): Promise<Agenda[]>

// Get agenda by ID
getAgendaById(id: string): Promise<Agenda | null>

// Buat agenda
createAgenda(agendaData: AgendaFormData, userId: string): Promise<ApiResponse<Agenda>>

// Update agenda
updateAgenda(id: string, updates: Partial<AgendaFormData>): Promise<ApiResponse<Agenda>>

// Hapus agenda
deleteAgenda(id: string): Promise<ApiResponse<void>>

// Hitung agenda hari ini
getTodayAgendaCount(): Promise<number>

// Get agenda mendatang
getUpcomingAgendas(limit?: number): Promise<Agenda[]>
```

### Event Service

```typescript
// Get events
getEvents(params?: QueryParams): Promise<Event[]>

// Get published events
getPublishedEvents(): Promise<Event[]>

// Get event by ID
getEventById(id: string): Promise<Event | null>

// Buat event
createEvent(eventData: EventFormData, userId: string): Promise<ApiResponse<Event>>

// Update event
updateEvent(id: string, updates: Partial<EventFormData>): Promise<ApiResponse<Event>>

// Hapus event
deleteEvent(id: string): Promise<ApiResponse<void>>

// Get registrasi event
getEventRegistrations(eventId: string): Promise<EventRegistration[]>

// Daftar ke event
registerForEvent(registrationData: EventRegistrationFormData): Promise<ApiResponse<EventRegistration>>

// Check-in dengan QR code
checkInByQRCode(qrCode: string): Promise<ApiResponse<EventRegistration>>

// Get panitia event
getEventCommittees(eventId: string): Promise<EventCommittee[]>

// Tambah panitia
addEventCommittee(eventId: string, userId: string, role: 'scanner' | 'organizer'): Promise<ApiResponse<EventCommittee>>

// Hapus panitia
removeEventCommittee(committeeId: string): Promise<ApiResponse<void>>

// Cek apakah user adalah scanner
isUserScanner(eventId: string, userId: string): Promise<boolean>

// Get upcoming events
getUpcomingEvents(limit?: number): Promise<Event[]>
```

### Notification Service

```typescript
// Get notifikasi
getNotifications(userId: string, unreadOnly?: boolean, limit?: number): Promise<Notification[]>

// Buat notifikasi
createNotification(
  userId: string,
  title: string,
  message: string,
  type?: 'info' | 'warning' | 'success' | 'error',
  link?: string
): Promise<ApiResponse<Notification>>

// Tandai sebagai dibaca
markAsRead(notificationId: string): Promise<ApiResponse<void>>

// Tandai semua sebagai dibaca
markAllAsRead(userId: string): Promise<ApiResponse<void>>

// Hapus notifikasi
deleteNotification(notificationId: string): Promise<ApiResponse<void>>

// Hitung belum dibaca
getUnreadCount(userId: string): Promise<number>

// Template notifikasi
notifyNewLetter(userId: string, letterTitle: string, letterId: string): Promise<void>
notifyNewDisposition(userId: string, instruction: string, dispositionId: string): Promise<void>
notifyEventRegistration(userId: string, eventTitle: string): Promise<void>
notifyAgendaReminder(userId: string, agendaTitle: string, time: string): Promise<void>
```

### Activity Log Service

```typescript
// Log aktivitas
logActivity(
  userId: string,
  action: string,
  entityType?: string,
  entityId?: string,
  details?: Record<string, any>
): Promise<void>

// Get aktivitas terbaru
getRecentActivities(limit?: number): Promise<ActivityLog[]>

// Get aktivitas by user
getUserActivities(userId: string, limit?: number): Promise<ActivityLog[]>

// Get aktivitas by entity
getEntityActivities(entityType: string, entityId: string, limit?: number): Promise<ActivityLog[]>

// Helper functions
logLetterAction(userId: string, action: 'created' | 'updated' | 'deleted', letterId: string, letterTitle: string): Promise<void>
logDispositionAction(userId: string, action: 'created' | 'updated' | 'status_changed', dispositionId: string, details?: Record<string, any>): Promise<void>
logAgendaAction(userId: string, action: 'created' | 'updated' | 'deleted', agendaId: string, agendaTitle: string): Promise<void>
logEventAction(userId: string, action: 'created' | 'updated' | 'deleted', eventId: string, eventTitle: string): Promise<void>
logLogin(userId: string, ipAddress?: string): Promise<void>
logLogout(userId: string): Promise<void>
```

### Dashboard Service

```typescript
// Get dashboard stats
getDashboardStats(userId: string): Promise<DashboardStats>

// Get quick stats
getQuickStats(userId: string): Promise<{
  totalLetters: number;
  pendingTasks: number;
  todaySchedule: number;
  unreadMessages: number;
}>

// Get stats by category
getStatsByCategory(): Promise<{
  incoming: number;
  outgoing: number;
  total: number;
}>

// Get weekly activity summary
getWeeklyActivitySummary(userId: string): Promise<any>

// Get productivity metrics
getProductivityMetrics(userId: string): Promise<any>
```

## 🎣 Custom Hooks

```typescript
// Authentication
useAuth(): {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
}

// Async data fetching
useAsync<T>(asyncFunction: () => Promise<T>, immediate?: boolean): {
  data: T | null;
  error: string | null;
  isLoading: boolean;
  execute: () => Promise<T>;
  setData: (data: T) => void;
}

// Local storage
useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void]

// Debounce
useDebounce<T>(value: T, delay: number): T

// Toggle
useToggle(initialValue?: boolean): [boolean, () => void]

// Modal
useModal<T>(): {
  isOpen: boolean;
  data: T | null;
  open: (data?: T) => void;
  close: () => void;
}

// Pagination
usePagination(initialPage?: number, initialLimit?: number): {
  page: number;
  limit: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  reset: () => void;
}

// Filters
useFilters<T>(initialFilters: T): {
  filters: T;
  setFilters: (filters: T) => void;
  updateFilter: <K extends keyof T>(key: K, value: T[K]) => void;
  resetFilters: () => void;
}

// Form
useForm<T>(initialValues: T): {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  isSubmitting: boolean;
  setValue: <K extends keyof T>(key: K, value: T[K]) => void;
  setValues: (values: T) => void;
  setErrors: (errors: Partial<Record<keyof T, string>>) => void;
  setFieldError: <K extends keyof T>(key: K, error: string) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  reset: () => void;
}

// Auto refresh
useRefresh(interval?: number): {
  lastRefresh: Date;
  refresh: () => void;
}
```

## 🛠️ Utility Functions

```typescript
// Date formatting
formatDateIndo(dateString: string): string
formatDateShort(dateString: string): string
formatTime(dateString: string): string
formatDateTime(dateString: string): string
getRelativeTime(dateString: string): string

// String manipulation
getInitials(name: string): string
truncateText(text: string, maxLength: number): string

// Validation
isValidEmail(email: string): boolean
isValidPhone(phone: string): boolean

// File operations
formatFileSize(bytes: number): string
getFileExtension(filename: string): string
isImageFile(filename: string): boolean
isDocumentFile(filename: string): boolean

// Utilities
generateRandomString(length?: number): string
debounce<T>(func: T, wait: number): T
throttle<T>(func: T, limit: number): T
copyToClipboard(text: string): Promise<boolean>
downloadFile(url: string, filename: string): void
base64ToBlob(base64: string, mimeType?: string): Blob
blobToBase64(blob: Blob): Promise<string>
sleep(ms: number): Promise<void>

// Date checks
isToday(dateString: string): boolean
isPast(dateString: string): boolean
isFuture(dateString: string): boolean
getDaysBetween(date1: string, date2: string): number

// Label mappings
getPriorityColor(priority: string): string
getStatusColor(status: string): string
getPriorityLabel(priority: string): string
getStatusLabel(status: string): string
```

## 📊 Contoh Penggunaan

### 1. Membuat Surat Baru
```typescript
import { LetterService } from '@/lib/services';

const result = await LetterService.createLetter({
  letterNumber: LetterService.generateLetterNumber('incoming'),
  type: 'incoming',
  title: 'Permintaan Proposal',
  fromEntity: 'PT. Maju Bersama',
  letterDate: '2024-01-15',
  status: 'received',
  priority: 'high',
}, userId);

if (result.success) {
  console.log('Letter created:', result.data);
}
```

### 2. Mendapatkan Dashboard Stats
```typescript
import { DashboardService } from '@/lib/services';

const stats = await DashboardService.getDashboardStats(userId);
console.log('Incoming letters:', stats.incomingLetters);
console.log('Pending dispositions:', stats.pendingDispositions);
```

### 3. Menggunakan Custom Hook
```typescript
import { useAuth, useModal } from '@/lib/hooks/useEOffice';

function MyComponent() {
  const { user, isAuthenticated } = useAuth();
  const { isOpen, open, close } = useModal();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div>
      <button onClick={() => open()}>Open Modal</button>
      {isOpen && <Modal onClose={close} />}
    </div>
  );
}
```

### 4. Event Registration dengan QR Code
```typescript
import { EventService } from '@/lib/services';

// Register for event
const result = await EventService.registerForEvent({
  eventId: 'event_123',
  userId: 'user_456',
  fullName: 'Ahmad Wijaya',
  email: 'ahmad@imk.co.id',
});

if (result.success) {
  console.log('QR Code:', result.data.qrCode);
}

// Check-in with QR code
const checkInResult = await EventService.checkInByQRCode(result.data.qrCode);
if (checkInResult.success) {
  console.log('Checked in at:', checkInResult.data.checkedInAt);
}
```

## 🔄 Dual Mode System

Semua service mendukung **dual mode**:

1. **Supabase Mode** (Production)
   - Data tersimpan di PostgreSQL
   - Real-time updates
   - Multi-user support
   - Full RLS security

2. **Demo Mode** (Fallback)
   - Data tersimpan di localStorage
   - Single-user
   - Untuk testing/demo
   - Otomatis aktif jika `.env` tidak dikonfigurasi

## 📝 Best Practices

1. **Selalu gunakan service functions** untuk operasi data
2. **Gunakan custom hooks** untuk state management
3. **Handle error** dengan `ApiResponse` pattern
4. **Log activities** untuk audit trail
5. **Gunakan utility functions** untuk formatting dan validation
6. **Implementasi pagination** untuk data yang besar
7. **Debounce** untuk search input
8. **Throttle** untuk scroll/resize events

---

**Last Updated**: January 2024  
**Version**: 1.0.0  
**Maintained by**: PT. Inti Mutiara Kreasindo - IT Department

// ============================================
// E-OFFICE TYPE DEFINITIONS
// PT. Inti Mutiara Kreasindo
// ============================================

// User & Auth Types
export interface User {
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

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Letter Types
export type LetterType = 'incoming' | 'outgoing';
export type LetterStatus = 'draft' | 'sent' | 'received' | 'archived';
export type Priority = 'low' | 'normal' | 'high' | 'urgent';

export interface Letter {
  id: string;
  letterNumber: string;
  type: LetterType;
  title: string;
  content?: string;
  fromEntity: string;
  toEntity?: string;
  letterDate: string;
  receivedDate?: string;
  status: LetterStatus;
  priority: Priority;
  attachments?: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface LetterFormData {
  letterNumber: string;
  type: LetterType;
  title: string;
  content?: string;
  fromEntity: string;
  toEntity?: string;
  letterDate: string;
  receivedDate?: string;
  status: LetterStatus;
  priority: Priority;
  attachments?: string[];
}

// Disposition Types
export type DispositionStatus = 'pending' | 'in_progress' | 'completed' | 'rejected';

export interface Disposition {
  id: string;
  letterId: string;
  fromUserId: string;
  toUserId: string;
  instruction: string;
  priority: Priority;
  status: DispositionStatus;
  notes?: string;
  dueDate?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  // Joined data
  letter?: Letter;
  fromUser?: { fullName: string; avatar: string; email: string };
  toUser?: { fullName: string; avatar: string; email: string };
}

export interface DispositionFormData {
  letterId: string;
  fromUserId: string;
  toUserId: string;
  instruction: string;
  priority: Priority;
  status: DispositionStatus;
  notes?: string;
  dueDate?: string;
}

// Agenda Types
export type AgendaCategory = 'meeting' | 'deadline' | 'event' | 'reminder';

export interface Agenda {
  id: string;
  title: string;
  description?: string;
  location?: string;
  startTime: string;
  endTime: string;
  isAllDay: boolean;
  category: AgendaCategory;
  attendees?: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AgendaFormData {
  title: string;
  description?: string;
  location?: string;
  startTime: string;
  endTime: string;
  isAllDay: boolean;
  category: AgendaCategory;
  attendees?: string[];
}

// Archive Types
export interface Archive {
  id: string;
  title: string;
  category: string;
  description?: string;
  fileUrl: string;
  fileType?: string;
  fileSize?: number;
  tags?: string[];
  uploadedBy: string;
  createdAt: string;
}

export interface ArchiveFormData {
  title: string;
  category: string;
  description?: string;
  fileUrl: string;
  fileType?: string;
  fileSize?: number;
  tags?: string[];
}

// Notification Types
export type NotificationType = 'info' | 'warning' | 'success' | 'error';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

// Activity Log Types
export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  entityType?: string;
  entityId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  createdAt: string;
  // Joined data
  user?: { fullName: string; avatar: string };
}

// Legal Document Types
export type LegalDocumentCategory = 'legal' | 'certificate' | 'organization' | 'photo';

export interface LegalDocument {
  id: string;
  title: string;
  description: string;
  category: LegalDocumentCategory;
  imageUrl: string;
  documentNumber?: string;
  issuedDate?: string;
  expiryDate?: string;
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface LegalDocumentFormData {
  title: string;
  description: string;
  category: LegalDocumentCategory;
  imageUrl: string;
  documentNumber?: string;
  issuedDate?: string;
  expiryDate?: string;
  isPublic: boolean;
}

// Event Types
export type EventCategory = 'Conference' | 'Workshop' | 'Webinar' | 'Hackathon' | 'Meetup' | 'Training';

export interface Event {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  eventTime: string;
  location: string;
  capacity: number;
  registered: number;
  category: EventCategory;
  speaker?: string;
  imageUrl?: string;
  isPublished: boolean;
  requireRegistration: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventFormData {
  title: string;
  description: string;
  eventDate: string;
  eventTime: string;
  location: string;
  capacity: number;
  category: EventCategory;
  speaker?: string;
  imageUrl?: string;
  isPublished: boolean;
  requireRegistration: boolean;
}

// Event Registration Types
export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  qrCode: string;
  checkedIn: boolean;
  checkedInAt?: string;
  registeredAt: string;
  // Joined data
  event?: Event;
  user?: { fullName: string; avatar: string; department: string };
}

export interface EventRegistrationFormData {
  eventId: string;
  userId: string;
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
}

// Event Committee Types
export type CommitteeRole = 'scanner' | 'organizer';

export interface EventCommittee {
  id: string;
  eventId: string;
  userId: string;
  role: CommitteeRole;
  createdAt: string;
  // Joined data
  user?: { fullName: string; avatar: string; email: string; department: string };
}

// Company Info Types
export interface CompanyInfo {
  id: string;
  key: string;
  value: string;
  updatedBy?: string;
  updatedAt: string;
}

// Organization Structure Types
export interface OrganizationNode {
  id: string;
  level: number;
  title: string;
  fullName: string;
  avatar?: string;
  parentId?: string;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
  // Tree structure
  children?: OrganizationNode[];
}

// Dashboard Stats Types
export interface DashboardStats {
  incomingLetters: number;
  outgoingLetters: number;
  pendingDispositions: number;
  todayAgendas: number;
  unreadNotifications: number;
  upcomingEvents: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Filter & Sort Types
export interface FilterOptions {
  search?: string;
  status?: string;
  type?: string;
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  priority?: Priority;
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

export interface QueryParams {
  page?: number;
  limit?: number;
  filter?: FilterOptions;
  sort?: SortOptions;
}

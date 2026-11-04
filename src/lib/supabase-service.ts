import { supabase, isSupabaseConfigured } from './supabase';
import type { User } from './auth';

// ============================================
// TYPES
// ============================================

export interface Letter {
  id: string;
  letter_number: string;
  type: 'incoming' | 'outgoing';
  title: string;
  content?: string;
  from_entity: string;
  to_entity?: string;
  letter_date: string;
  received_date?: string;
  status: 'draft' | 'sent' | 'received' | 'archived';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  attachments?: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Disposition {
  id: string;
  letter_id: string;
  from_user_id: string;
  to_user_id: string;
  instruction: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  notes?: string;
  due_date?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  letter?: Letter;
  from_user?: { full_name: string; avatar: string };
  to_user?: { full_name: string; avatar: string };
}

export interface Agenda {
  id: string;
  title: string;
  description?: string;
  location?: string;
  start_time: string;
  end_time: string;
  is_all_day: boolean;
  category: 'meeting' | 'deadline' | 'event' | 'reminder';
  attendees?: string[];
  created_by: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  is_read: boolean;
  link?: string;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  entity_type?: string;
  entity_id?: string;
  details?: Record<string, any>;
  created_at: string;
  // Joined data
  user?: { full_name: string; avatar: string };
}

export interface DashboardStats {
  incomingLetters: number;
  outgoingLetters: number;
  dispositions: number;
  todayAgendas: number;
}

// ============================================
// AUTH SERVICE
// ============================================

export async function signIn(email: string, password: string): Promise<{
  success: boolean;
  user?: User;
  error?: string;
}> {
  if (!isSupabaseConfigured || !supabase) {
    return { success: false, error: 'Supabase not configured' };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  if (!data.user) {
    return { success: false, error: 'Login failed' };
  }

  // Fetch profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();

  if (profileError || !profile) {
    return { success: false, error: 'Profile not found' };
  }

  const user: User = {
    email: profile.email,
    name: profile.full_name,
    role: profile.role,
    avatar: profile.avatar || profile.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2),
    department: profile.department,
  };

  return { success: true, user };
}

export async function signOut(): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  await supabase.auth.signOut();
}

export async function getCurrentSession(): Promise<User | null> {
  if (!isSupabaseConfigured || !supabase) return null;

  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (!profile) return null;

  return {
    email: profile.email,
    name: profile.full_name,
    role: profile.role,
    avatar: profile.avatar || profile.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2),
    department: profile.department,
  };
}

// ============================================
// LETTERS SERVICE
// ============================================

export async function getLetters(type?: 'incoming' | 'outgoing'): Promise<Letter[]> {
  if (!isSupabaseConfigured || !supabase) return [];

  let query = supabase
    .from('letters')
    .select('*')
    .order('created_at', { ascending: false });

  if (type) {
    query = query.eq('type', type);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching letters:', error);
    return [];
  }

  return data || [];
}

export async function createLetter(letter: Omit<Letter, 'id' | 'created_at' | 'updated_at'>): Promise<Letter | null> {
  if (!isSupabaseConfigured || !supabase) return null;

  const { data, error } = await supabase
    .from('letters')
    .insert(letter)
    .select()
    .single();

  if (error) {
    console.error('Error creating letter:', error);
    return null;
  }

  return data;
}

export async function updateLetter(id: string, updates: Partial<Letter>): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;

  const { error } = await supabase
    .from('letters')
    .update(updates)
    .eq('id', id);

  return !error;
}

// ============================================
// DISPOSITIONS SERVICE
// ============================================

export async function getDispositions(userId?: string): Promise<Disposition[]> {
  if (!isSupabaseConfigured || !supabase) return [];

  let query = supabase
    .from('dispositions')
    .select(`
      *,
      letter:letters(*),
      from_user:profiles!from_user_id(full_name, avatar),
      to_user:profiles!to_user_id(full_name, avatar)
    `)
    .order('created_at', { ascending: false });

  if (userId) {
    query = query.or(`from_user_id.eq.${userId},to_user_id.eq.${userId}`);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching dispositions:', error);
    return [];
  }

  return data || [];
}

export async function createDisposition(disposition: Omit<Disposition, 'id' | 'created_at' | 'updated_at'>): Promise<Disposition | null> {
  if (!isSupabaseConfigured || !supabase) return null;

  const { data, error } = await supabase
    .from('dispositions')
    .insert(disposition)
    .select()
    .single();

  if (error) {
    console.error('Error creating disposition:', error);
    return null;
  }

  return data;
}

// ============================================
// AGENDAS SERVICE
// ============================================

export async function getAgendas(date?: string): Promise<Agenda[]> {
  if (!isSupabaseConfigured || !supabase) return [];

  let query = supabase
    .from('agendas')
    .select('*')
    .order('start_time', { ascending: true });

  if (date) {
    const startOfDay = `${date}T00:00:00`;
    const endOfDay = `${date}T23:59:59`;
    query = query.gte('start_time', startOfDay).lte('start_time', endOfDay);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching agendas:', error);
    return [];
  }

  return data || [];
}

export async function createAgenda(agenda: Omit<Agenda, 'id' | 'created_at'>): Promise<Agenda | null> {
  if (!isSupabaseConfigured || !supabase) return null;

  const { data, error } = await supabase
    .from('agendas')
    .insert(agenda)
    .select()
    .single();

  if (error) {
    console.error('Error creating agenda:', error);
    return null;
  }

  return data;
}

// ============================================
// NOTIFICATIONS SERVICE
// ============================================

export async function getNotifications(userId: string, unreadOnly = false): Promise<Notification[]> {
  if (!isSupabaseConfigured || !supabase) return [];

  let query = supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (unreadOnly) {
    query = query.eq('is_read', false);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }

  return data || [];
}

export async function markNotificationAsRead(id: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id);

  return !error;
}

export async function getUnreadNotificationCount(userId: string): Promise<number> {
  if (!isSupabaseConfigured || !supabase) return 0;

  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false);

  if (error) return 0;
  return count || 0;
}

// ============================================
// DASHBOARD STATS SERVICE
// ============================================

export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  if (!isSupabaseConfigured || !supabase) {
    return { incomingLetters: 0, outgoingLetters: 0, dispositions: 0, todayAgendas: 0 };
  }

  const today = new Date().toISOString().split('T')[0];

  const [incoming, outgoing, dispositions, agendas] = await Promise.all([
    supabase.from('letters').select('*', { count: 'exact', head: true }).eq('type', 'incoming'),
    supabase.from('letters').select('*', { count: 'exact', head: true }).eq('type', 'outgoing'),
    supabase.from('dispositions').select('*', { count: 'exact', head: true }).eq('to_user_id', userId).eq('status', 'pending'),
    supabase.from('agendas').select('*', { count: 'exact', head: true }).gte('start_time', `${today}T00:00:00`).lte('start_time', `${today}T23:59:59`),
  ]);

  return {
    incomingLetters: incoming.count || 0,
    outgoingLetters: outgoing.count || 0,
    dispositions: dispositions.count || 0,
    todayAgendas: agendas.count || 0,
  };
}

// ============================================
// ACTIVITY LOG SERVICE
// ============================================

export async function logActivity(
  userId: string,
  action: string,
  entityType?: string,
  entityId?: string,
  details?: Record<string, any>
): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;

  await supabase.from('activity_logs').insert({
    user_id: userId,
    action,
    entity_type: entityType,
    entity_id: entityId,
    details,
  });
}

export async function getRecentActivities(limit = 20): Promise<ActivityLog[]> {
  if (!isSupabaseConfigured || !supabase) return [];

  const { data, error } = await supabase
    .from('activity_logs')
    .select(`
      *,
      user:profiles(full_name, avatar)
    `)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching activities:', error);
    return [];
  }

  return data || [];
}

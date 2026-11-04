// ============================================
// NOTIFICATION SERVICE
// CRUD operations for notifications
// ============================================

import { supabase, isSupabaseConfigured } from '../supabase';
import type { Notification, ApiResponse } from '../types/eoffice';

const STORAGE_KEY = 'imk_notifications';

function getFromStorage(): Notification[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveToStorage(notifications: Notification[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  } catch (error) {
    console.error('Failed to save notifications:', error);
  }
}

/**
 * Get notifications for a user
 */
export async function getNotifications(
  userId: string,
  unreadOnly = false,
  limit = 50
): Promise<Notification[]> {
  if (isSupabaseConfigured && supabase) {
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

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

  // Demo mode
  let notifications = getFromStorage();
  notifications = notifications.filter(n => n.userId === userId);

  if (unreadOnly) {
    notifications = notifications.filter(n => !n.isRead);
  }

  notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return notifications.slice(0, limit);
}

/**
 * Create notification
 */
export async function createNotification(
  userId: string,
  title: string,
  message: string,
  type: 'info' | 'warning' | 'success' | 'error' = 'info',
  link?: string
): Promise<ApiResponse<Notification>> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title,
        message,
        type,
        link,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating notification:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  }

  // Demo mode
  const notifications = getFromStorage();
  const newNotification: Notification = {
    id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    userId,
    title,
    message,
    type,
    isRead: false,
    link,
    createdAt: new Date().toISOString(),
  };

  notifications.push(newNotification);
  saveToStorage(notifications);

  return { success: true, data: newNotification };
}

/**
 * Mark notification as read
 */
export async function markAsRead(notificationId: string): Promise<ApiResponse<void>> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) {
      console.error('Error marking notification as read:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  }

  // Demo mode
  const notifications = getFromStorage();
  const index = notifications.findIndex(n => n.id === notificationId);

  if (index !== -1) {
    notifications[index].isRead = true;
    saveToStorage(notifications);
  }

  return { success: true };
}

/**
 * Mark all notifications as read
 */
export async function markAllAsRead(userId: string): Promise<ApiResponse<void>> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) {
      console.error('Error marking all notifications as read:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  }

  // Demo mode
  const notifications = getFromStorage();
  const updated = notifications.map(n =>
    n.userId === userId ? { ...n, isRead: true } : n
  );
  saveToStorage(updated);

  return { success: true };
}

/**
 * Delete notification
 */
export async function deleteNotification(notificationId: string): Promise<ApiResponse<void>> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (error) {
      console.error('Error deleting notification:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  }

  // Demo mode
  const notifications = getFromStorage();
  const filtered = notifications.filter(n => n.id !== notificationId);
  saveToStorage(filtered);

  return { success: true };
}

/**
 * Get unread notification count
 */
export async function getUnreadCount(userId: string): Promise<number> {
  if (isSupabaseConfigured && supabase) {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) {
      console.error('Error counting notifications:', error);
      return 0;
    }

    return count || 0;
  }

  // Demo mode
  const notifications = getFromStorage();
  return notifications.filter(n => n.userId === userId && !n.isRead).length;
}

// ============================================
// NOTIFICATION TEMPLATES
// ============================================

export async function notifyNewLetter(
  userId: string,
  letterTitle: string,
  letterId: string
): Promise<void> {
  await createNotification(
    userId,
    'Surat Baru',
    `Anda menerima surat baru: ${letterTitle}`,
    'info',
    `/eoffice/letters/${letterId}`
  );
}

export async function notifyNewDisposition(
  userId: string,
  instruction: string,
  dispositionId: string
): Promise<void> {
  await createNotification(
    userId,
    'Disposisi Baru',
    `Anda menerima disposisi: ${instruction}`,
    'warning',
    `/eoffice/dispositions/${dispositionId}`
  );
}

export async function notifyEventRegistration(
  userId: string,
  eventTitle: string
): Promise<void> {
  await createNotification(
    userId,
    'Pendaftaran Event',
    `Anda telah terdaftar untuk event: ${eventTitle}`,
    'success'
  );
}

export async function notifyAgendaReminder(
  userId: string,
  agendaTitle: string,
  time: string
): Promise<void> {
  await createNotification(
    userId,
    'Pengingat Agenda',
    `${agendaTitle} akan dimulai pada ${time}`,
    'info'
  );
}

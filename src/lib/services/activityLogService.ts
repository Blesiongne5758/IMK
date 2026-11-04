// ============================================
// ACTIVITY LOG SERVICE
// Track user activities in the system
// ============================================

import { supabase, isSupabaseConfigured } from '../supabase';
import type { ActivityLog } from '../types/eoffice';

const STORAGE_KEY = 'imk_activity_logs';

function getFromStorage(): ActivityLog[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveToStorage(logs: ActivityLog[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  } catch (error) {
    console.error('Failed to save activity logs:', error);
  }
}

/**
 * Log user activity
 */
export async function logActivity(
  userId: string,
  action: string,
  entityType?: string,
  entityId?: string,
  details?: Record<string, any>
): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    await supabase.from('activity_logs').insert({
      user_id: userId,
      action,
      entity_type: entityType,
      entity_id: entityId,
      details,
    });
    return;
  }

  // Demo mode
  const logs = getFromStorage();
  const newLog: ActivityLog = {
    id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    userId,
    action,
    entityType,
    entityId,
    details,
    createdAt: new Date().toISOString(),
  };

  logs.push(newLog);
  
  // Keep only last 1000 logs
  if (logs.length > 1000) {
    logs.splice(0, logs.length - 1000);
  }

  saveToStorage(logs);
}

/**
 * Get recent activities
 */
export async function getRecentActivities(limit = 20): Promise<ActivityLog[]> {
  if (isSupabaseConfigured && supabase) {
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

  // Demo mode
  const logs = getFromStorage();
  logs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return logs.slice(0, limit);
}

/**
 * Get activities by user
 */
export async function getUserActivities(
  userId: string,
  limit = 50
): Promise<ActivityLog[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching user activities:', error);
      return [];
    }

    return data || [];
  }

  // Demo mode
  const logs = getFromStorage();
  const userLogs = logs.filter(l => l.userId === userId);
  userLogs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return userLogs.slice(0, limit);
}

/**
 * Get activities by entity
 */
export async function getEntityActivities(
  entityType: string,
  entityId: string,
  limit = 50
): Promise<ActivityLog[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('activity_logs')
      .select(`
        *,
        user:profiles(full_name, avatar)
      `)
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching entity activities:', error);
      return [];
    }

    return data || [];
  }

  // Demo mode
  const logs = getFromStorage();
  const entityLogs = logs.filter(
    l => l.entityType === entityType && l.entityId === entityId
  );
  entityLogs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return entityLogs.slice(0, limit);
}

// ============================================
// ACTIVITY LOG HELPERS
// ============================================

export async function logLetterAction(
  userId: string,
  action: 'created' | 'updated' | 'deleted',
  letterId: string,
  letterTitle: string
): Promise<void> {
  await logActivity(userId, `${action}_letter`, 'letter', letterId, {
    title: letterTitle,
  });
}

export async function logDispositionAction(
  userId: string,
  action: 'created' | 'updated' | 'status_changed',
  dispositionId: string,
  details?: Record<string, any>
): Promise<void> {
  await logActivity(userId, `${action}_disposition`, 'disposition', dispositionId, details);
}

export async function logAgendaAction(
  userId: string,
  action: 'created' | 'updated' | 'deleted',
  agendaId: string,
  agendaTitle: string
): Promise<void> {
  await logActivity(userId, `${action}_agenda`, 'agenda', agendaId, {
    title: agendaTitle,
  });
}

export async function logEventAction(
  userId: string,
  action: 'created' | 'updated' | 'deleted',
  eventId: string,
  eventTitle: string
): Promise<void> {
  await logActivity(userId, `${action}_event`, 'event', eventId, {
    title: eventTitle,
  });
}

export async function logLogin(userId: string, ipAddress?: string): Promise<void> {
  await logActivity(userId, 'login', undefined, undefined, {
    ipAddress,
    timestamp: new Date().toISOString(),
  });
}

export async function logLogout(userId: string): Promise<void> {
  await logActivity(userId, 'logout');
}

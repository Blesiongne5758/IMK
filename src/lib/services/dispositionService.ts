// ============================================
// DISPOSITION SERVICE
// CRUD operations for letter dispositions
// ============================================

import { supabase, isSupabaseConfigured } from '../supabase';
import type { Disposition, DispositionFormData, ApiResponse, QueryParams } from '../types/eoffice';

const STORAGE_KEY = 'imk_dispositions';

function getFromStorage(): Disposition[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveToStorage(dispositions: Disposition[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dispositions));
  } catch (error) {
    console.error('Failed to save dispositions:', error);
  }
}

/**
 * Get dispositions with filters
 */
export async function getDispositions(
  userId?: string,
  params?: QueryParams
): Promise<Disposition[]> {
  if (isSupabaseConfigured && supabase) {
    let query = supabase
      .from('dispositions')
      .select(`
        *,
        letter:letters(*),
        from_user:profiles!from_user_id(full_name, avatar, email),
        to_user:profiles!to_user_id(full_name, avatar, email)
      `)
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.or(`from_user_id.eq.${userId},to_user_id.eq.${userId}`);
    }

    if (params?.filter?.status) {
      query = query.eq('status', params.filter.status);
    }

    if (params?.limit) {
      query = query.limit(params.limit);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching dispositions:', error);
      return [];
    }

    return data || [];
  }

  // Demo mode
  let dispositions = getFromStorage();

  if (userId) {
    dispositions = dispositions.filter(
      d => d.fromUserId === userId || d.toUserId === userId
    );
  }

  if (params?.filter?.status) {
    dispositions = dispositions.filter(d => d.status === params.filter!.status);
  }

  dispositions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (params?.limit) {
    dispositions = dispositions.slice(0, params.limit);
  }

  return dispositions;
}

/**
 * Get disposition by ID
 */
export async function getDispositionById(id: string): Promise<Disposition | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('dispositions')
      .select(`
        *,
        letter:letters(*),
        from_user:profiles!from_user_id(full_name, avatar, email),
        to_user:profiles!to_user_id(full_name, avatar, email)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching disposition:', error);
      return null;
    }

    return data;
  }

  const dispositions = getFromStorage();
  return dispositions.find(d => d.id === id) || null;
}

/**
 * Create disposition
 */
export async function createDisposition(
  dispositionData: DispositionFormData
): Promise<ApiResponse<Disposition>> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('dispositions')
      .insert(dispositionData)
      .select()
      .single();

    if (error) {
      console.error('Error creating disposition:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  }

  // Demo mode
  const dispositions = getFromStorage();
  const newDisposition: Disposition = {
    id: `disp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    ...dispositionData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  dispositions.push(newDisposition);
  saveToStorage(dispositions);

  return { success: true, data: newDisposition };
}

/**
 * Update disposition
 */
export async function updateDisposition(
  id: string,
  updates: Partial<DispositionFormData>
): Promise<ApiResponse<Disposition>> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('dispositions')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating disposition:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  }

  // Demo mode
  const dispositions = getFromStorage();
  const index = dispositions.findIndex(d => d.id === id);

  if (index === -1) {
    return { success: false, error: 'Disposition not found' };
  }

  dispositions[index] = {
    ...dispositions[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  saveToStorage(dispositions);

  return { success: true, data: dispositions[index] };
}

/**
 * Update disposition status
 */
export async function updateDispositionStatus(
  id: string,
  status: 'pending' | 'in_progress' | 'completed' | 'rejected',
  notes?: string
): Promise<ApiResponse<Disposition>> {
  if (isSupabaseConfigured && supabase) {
    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    };
    
    if (notes) {
      updateData.notes = notes;
    }

    if (status === 'completed') {
      updateData.completed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('dispositions')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating disposition status:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  }

  // Demo mode
  const dispositions = getFromStorage();
  const index = dispositions.findIndex(d => d.id === id);

  if (index === -1) {
    return { success: false, error: 'Disposition not found' };
  }

  if (notes) {
    dispositions[index].notes = notes;
  }

  if (status === 'completed') {
    dispositions[index].completedAt = new Date().toISOString();
  }

  dispositions[index].status = status;
  dispositions[index].updatedAt = new Date().toISOString();

  saveToStorage(dispositions);

  return { success: true, data: dispositions[index] };
}

/**
 * Delete disposition
 */
export async function deleteDisposition(id: string): Promise<ApiResponse<void>> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase
      .from('dispositions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting disposition:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  }

  const dispositions = getFromStorage();
  const filtered = dispositions.filter(d => d.id !== id);
  saveToStorage(filtered);

  return { success: true };
}

/**
 * Get pending dispositions count
 */
export async function getPendingDispositionsCount(userId: string): Promise<number> {
  if (isSupabaseConfigured && supabase) {
    const { count, error } = await supabase
      .from('dispositions')
      .select('*', { count: 'exact', head: true })
      .eq('to_user_id', userId)
      .eq('status', 'pending');

    if (error) {
      console.error('Error counting dispositions:', error);
      return 0;
    }

    return count || 0;
  }

  const dispositions = getFromStorage();
  return dispositions.filter(
    d => d.toUserId === userId && d.status === 'pending'
  ).length;
}

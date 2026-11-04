// ============================================
// LETTER SERVICE
// CRUD operations for letters (surat masuk/keluar)
// ============================================

import { supabase, isSupabaseConfigured } from '../supabase';
import type { Letter, LetterFormData, ApiResponse, QueryParams } from '../types/eoffice';

const STORAGE_KEY = 'imk_letters';

// Helper: Get from localStorage (demo mode)
function getFromStorage(): Letter[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Helper: Save to localStorage (demo mode)
function saveToStorage(letters: Letter[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(letters));
  } catch (error) {
    console.error('Failed to save letters to localStorage:', error);
  }
}

/**
 * Get all letters with optional filters
 */
export async function getLetters(
  type?: 'incoming' | 'outgoing',
  params?: QueryParams
): Promise<Letter[]> {
  if (isSupabaseConfigured && supabase) {
    let query = supabase
      .from('letters')
      .select('*')
      .order('created_at', { ascending: false });

    if (type) {
      query = query.eq('type', type);
    }

    if (params?.filter?.status) {
      query = query.eq('status', params.filter.status);
    }

    if (params?.filter?.priority) {
      query = query.eq('priority', params.filter.priority);
    }

    if (params?.limit) {
      query = query.limit(params.limit);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching letters:', error);
      return [];
    }

    return data || [];
  }

  // Demo mode
  let letters = getFromStorage();
  
  if (type) {
    letters = letters.filter(l => l.type === type);
  }

  if (params?.filter?.status) {
    letters = letters.filter(l => l.status === params.filter!.status);
  }

  // Sort by created_at descending
  letters.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (params?.limit) {
    letters = letters.slice(0, params.limit);
  }

  return letters;
}

/**
 * Get letter by ID
 */
export async function getLetterById(id: string): Promise<Letter | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('letters')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching letter:', error);
      return null;
    }

    return data;
  }

  // Demo mode
  const letters = getFromStorage();
  return letters.find(l => l.id === id) || null;
}

/**
 * Create new letter
 */
export async function createLetter(
  letterData: LetterFormData,
  userId: string
): Promise<ApiResponse<Letter>> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('letters')
      .insert({
        ...letterData,
        created_by: userId,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating letter:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  }

  // Demo mode
  const letters = getFromStorage();
  const newLetter: Letter = {
    id: `letter_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    ...letterData,
    createdBy: userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  letters.push(newLetter);
  saveToStorage(letters);

  return { success: true, data: newLetter };
}

/**
 * Update letter
 */
export async function updateLetter(
  id: string,
  updates: Partial<LetterFormData>
): Promise<ApiResponse<Letter>> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('letters')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating letter:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  }

  // Demo mode
  const letters = getFromStorage();
  const index = letters.findIndex(l => l.id === id);

  if (index === -1) {
    return { success: false, error: 'Letter not found' };
  }

  letters[index] = {
    ...letters[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  saveToStorage(letters);

  return { success: true, data: letters[index] };
}

/**
 * Delete letter
 */
export async function deleteLetter(id: string): Promise<ApiResponse<void>> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase
      .from('letters')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting letter:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  }

  // Demo mode
  const letters = getFromStorage();
  const filtered = letters.filter(l => l.id !== id);
  saveToStorage(filtered);

  return { success: true };
}

/**
 * Get letter count by type
 */
export async function getLetterCount(type?: 'incoming' | 'outgoing'): Promise<number> {
  if (isSupabaseConfigured && supabase) {
    let query = supabase
      .from('letters')
      .select('*', { count: 'exact', head: true });

    if (type) {
      query = query.eq('type', type);
    }

    const { count, error } = await query;

    if (error) {
      console.error('Error counting letters:', error);
      return 0;
    }

    return count || 0;
  }

  // Demo mode
  const letters = getFromStorage();
  
  if (type) {
    return letters.filter(l => l.type === type).length;
  }

  return letters.length;
}

/**
 * Generate letter number
 */
export function generateLetterNumber(type: 'incoming' | 'outgoing'): string {
  const year = new Date().getFullYear();
  const prefix = type === 'incoming' ? 'SM' : 'SK';
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `${random}/${prefix}/IMK/${year}`;
}

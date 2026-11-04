// ============================================
// CONSULTATION SERVICE
// CRUD operations for consultation scheduling
// ============================================

import { supabase, isSupabaseConfigured } from '../supabase';
import type { ApiResponse } from '../types/eoffice';

export interface Consultation {
  id: string;
  date: string;
  time: string;
  clientName: string;
  position: string;
  companyName: string;
  contactNumber: string;
  email: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConsultationFormData {
  date: string;
  time: string;
  clientName: string;
  position: string;
  companyName: string;
  contactNumber: string;
  email: string;
  notes?: string;
}

const STORAGE_KEY = 'imk_consultations';
const MIN_GAP_MINUTES = 150; // 2.5 hours

function getFromStorage(): Consultation[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveToStorage(consultations: Consultation[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consultations));
  } catch (error) {
    console.error('Failed to save consultations:', error);
  }
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Get all consultations
 */
export async function getAllConsultations(): Promise<Consultation[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('consultations')
      .select('*')
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    if (error) {
      console.error('Error fetching consultations:', error);
      return [];
    }

    return data || [];
  }

  // Demo mode
  const consultations = getFromStorage();
  return consultations.sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return timeToMinutes(a.time) - timeToMinutes(b.time);
  });
}

/**
 * Get consultations by date
 */
export async function getConsultationsByDate(date: string): Promise<Consultation[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('consultations')
      .select('*')
      .eq('date', date)
      .order('time', { ascending: true });

    if (error) {
      console.error('Error fetching consultations by date:', error);
      return [];
    }

    return data || [];
  }

  // Demo mode
  const consultations = getFromStorage();
  return consultations
    .filter(c => c.date === date)
    .sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
}

/**
 * Check if time slot is available
 */
export async function checkTimeAvailability(
  date: string,
  time: string,
  excludeId?: string
): Promise<{ available: boolean; conflicting?: Consultation }> {
  const consultations = await getConsultationsByDate(date);
  const newMinutes = timeToMinutes(time);

  for (const c of consultations) {
    if (excludeId && c.id === excludeId) continue;

    const existingMinutes = timeToMinutes(c.time);
    const diff = Math.abs(newMinutes - existingMinutes);

    if (diff < MIN_GAP_MINUTES) {
      return { available: false, conflicting: c };
    }
  }

  return { available: true };
}

/**
 * Create new consultation
 */
export async function createConsultation(
  consultationData: ConsultationFormData
): Promise<ApiResponse<Consultation>> {
  // Check availability first
  const { available, conflicting } = await checkTimeAvailability(
    consultationData.date,
    consultationData.time
  );

  if (!available && conflicting) {
    return {
      success: false,
      error: `Waktu ${consultationData.time} bentrok dengan janji temu ${conflicting.companyName} (${conflicting.time}). Silakan pilih waktu yang berbeda minimal 2 jam 30 menit.`,
    };
  }

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('consultations')
      .insert({
        ...consultationData,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating consultation:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  }

  // Demo mode
  const consultations = getFromStorage();
  const newConsultation: Consultation = {
    id: `consultation_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    ...consultationData,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  consultations.push(newConsultation);
  saveToStorage(consultations);

  return { success: true, data: newConsultation };
}

/**
 * Update consultation
 */
export async function updateConsultation(
  id: string,
  updates: Partial<ConsultationFormData> & { status?: Consultation['status'] }
): Promise<ApiResponse<Consultation>> {
  // If updating time or date, check availability
  if (updates.date || updates.time) {
    const existing = await getConsultationById(id);
    if (!existing) {
      return { success: false, error: 'Consultation not found' };
    }

    const newDate = updates.date || existing.date;
    const newTime = updates.time || existing.time;

    const { available, conflicting } = await checkTimeAvailability(newDate, newTime, id);

    if (!available && conflicting) {
      return {
        success: false,
        error: `Waktu ${newTime} bentrok dengan janji temu ${conflicting.companyName} (${conflicting.time}).`,
      };
    }
  }

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('consultations')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating consultation:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  }

  // Demo mode
  const consultations = getFromStorage();
  const index = consultations.findIndex(c => c.id === id);

  if (index === -1) {
    return { success: false, error: 'Consultation not found' };
  }

  consultations[index] = {
    ...consultations[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  saveToStorage(consultations);

  return { success: true, data: consultations[index] };
}

/**
 * Get consultation by ID
 */
export async function getConsultationById(id: string): Promise<Consultation | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('consultations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching consultation:', error);
      return null;
    }

    return data;
  }

  const consultations = getFromStorage();
  return consultations.find(c => c.id === id) || null;
}

/**
 * Delete consultation
 */
export async function deleteConsultation(id: string): Promise<ApiResponse<void>> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase
      .from('consultations')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting consultation:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  }

  const consultations = getFromStorage();
  const filtered = consultations.filter(c => c.id !== id);
  saveToStorage(filtered);

  return { success: true };
}

/**
 * Get upcoming consultations
 */
export async function getUpcomingConsultations(limit = 10): Promise<Consultation[]> {
  const today = new Date().toISOString().split('T')[0];

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('consultations')
      .select('*')
      .gte('date', today)
      .in('status', ['pending', 'confirmed'])
      .order('date', { ascending: true })
      .order('time', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('Error fetching upcoming consultations:', error);
      return [];
    }

    return data || [];
  }

  // Demo mode
  const consultations = getFromStorage();
  return consultations
    .filter(c => c.date >= today && (c.status === 'pending' || c.status === 'confirmed'))
    .sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return timeToMinutes(a.time) - timeToMinutes(b.time);
    })
    .slice(0, limit);
}

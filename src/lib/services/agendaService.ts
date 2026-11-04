// ============================================
// AGENDA SERVICE
// CRUD operations for agendas/calendar events
// ============================================

import { supabase, isSupabaseConfigured } from '../supabase';
import type { Agenda, AgendaFormData, ApiResponse, QueryParams } from '../types/eoffice';

const STORAGE_KEY = 'imk_agendas';

function getFromStorage(): Agenda[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveToStorage(agendas: Agenda[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(agendas));
  } catch (error) {
    console.error('Failed to save agendas:', error);
  }
}

/**
 * Get agendas with optional date filter
 */
export async function getAgendas(
  date?: string,
  params?: QueryParams
): Promise<Agenda[]> {
  if (isSupabaseConfigured && supabase) {
    let query = supabase
      .from('agendas')
      .select('*')
      .order('start_time', { ascending: true });

    if (date) {
      const startOfDay = `${date}T00:00:00`;
      const endOfDay = `${date}T23:59:59`;
      query = query.gte('start_time', startOfDay).lte('start_time', endOfDay);
    }

    if (params?.filter?.category) {
      query = query.eq('category', params.filter.category);
    }

    if (params?.limit) {
      query = query.limit(params.limit);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching agendas:', error);
      return [];
    }

    return data || [];
  }

  // Demo mode
  let agendas = getFromStorage();

  if (date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    agendas = agendas.filter(a => {
      const agendaDate = new Date(a.startTime);
      return agendaDate >= startOfDay && agendaDate <= endOfDay;
    });
  }

  if (params?.filter?.category) {
    agendas = agendas.filter(a => a.category === params.filter!.category);
  }

  agendas.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  if (params?.limit) {
    agendas = agendas.slice(0, params.limit);
  }

  return agendas;
}

/**
 * Get agenda by ID
 */
export async function getAgendaById(id: string): Promise<Agenda | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('agendas')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching agenda:', error);
      return null;
    }

    return data;
  }

  const agendas = getFromStorage();
  return agendas.find(a => a.id === id) || null;
}

/**
 * Create agenda
 */
export async function createAgenda(
  agendaData: AgendaFormData,
  userId: string
): Promise<ApiResponse<Agenda>> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('agendas')
      .insert({
        ...agendaData,
        created_by: userId,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating agenda:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  }

  // Demo mode
  const agendas = getFromStorage();
  const newAgenda: Agenda = {
    id: `agenda_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    ...agendaData,
    createdBy: userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  agendas.push(newAgenda);
  saveToStorage(agendas);

  return { success: true, data: newAgenda };
}

/**
 * Update agenda
 */
export async function updateAgenda(
  id: string,
  updates: Partial<AgendaFormData>
): Promise<ApiResponse<Agenda>> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('agendas')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating agenda:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  }

  // Demo mode
  const agendas = getFromStorage();
  const index = agendas.findIndex(a => a.id === id);

  if (index === -1) {
    return { success: false, error: 'Agenda not found' };
  }

  agendas[index] = {
    ...agendas[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  saveToStorage(agendas);

  return { success: true, data: agendas[index] };
}

/**
 * Delete agenda
 */
export async function deleteAgenda(id: string): Promise<ApiResponse<void>> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase
      .from('agendas')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting agenda:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  }

  const agendas = getFromStorage();
  const filtered = agendas.filter(a => a.id !== id);
  saveToStorage(filtered);

  return { success: true };
}

/**
 * Get today's agenda count
 */
export async function getTodayAgendaCount(): Promise<number> {
  const today = new Date().toISOString().split('T')[0];
  const agendas = await getAgendas(today);
  return agendas.length;
}

/**
 * Get upcoming agendas
 */
export async function getUpcomingAgendas(limit = 5): Promise<Agenda[]> {
  if (isSupabaseConfigured && supabase) {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('agendas')
      .select('*')
      .gte('start_time', now)
      .order('start_time', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('Error fetching upcoming agendas:', error);
      return [];
    }

    return data || [];
  }

  // Demo mode
  const agendas = getFromStorage();
  const now = new Date();

  const upcoming = agendas
    .filter(a => new Date(a.startTime) > now)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, limit);

  return upcoming;
}

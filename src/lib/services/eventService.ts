// ============================================
// EVENT SERVICE
// CRUD operations for events, registrations, and committees
// ============================================

import { supabase, isSupabaseConfigured } from '../supabase';
import type {
  Event,
  EventFormData,
  EventRegistration,
  EventRegistrationFormData,
  EventCommittee,
  ApiResponse,
  QueryParams,
} from '../types/eoffice';

const EVENTS_KEY = 'imk_events';
const REGISTRATIONS_KEY = 'imk_event_registrations';
const COMMITTEES_KEY = 'imk_event_committees';

// Helper functions for localStorage
function getFromStorage<T>(key: string): T[] {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveToStorage<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Failed to save to ${key}:`, error);
  }
}

// ============================================
// EVENT CRUD
// ============================================

export async function getEvents(
  params?: QueryParams
): Promise<Event[]> {
  if (isSupabaseConfigured && supabase) {
    let query = supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true });

    if (params?.filter?.category) {
      query = query.eq('category', params.filter.category);
    }

    if (params?.limit) {
      query = query.limit(params.limit);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching events:', error);
      return [];
    }

    return data || [];
  }

  // Demo mode
  let events = getFromStorage<Event>(EVENTS_KEY);

  if (params?.filter?.category) {
    events = events.filter(e => e.category === params.filter!.category);
  }

  events.sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());

  if (params?.limit) {
    events = events.slice(0, params.limit);
  }

  return events;
}

export async function getPublishedEvents(): Promise<Event[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('is_published', true)
      .order('event_date', { ascending: true });

    if (error) {
      console.error('Error fetching published events:', error);
      return [];
    }

    return data || [];
  }

  const events = getFromStorage<Event>(EVENTS_KEY);
  return events.filter(e => e.isPublished);
}

export async function getEventById(id: string): Promise<Event | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching event:', error);
      return null;
    }

    return data;
  }

  const events = getFromStorage<Event>(EVENTS_KEY);
  return events.find(e => e.id === id) || null;
}

export async function createEvent(
  eventData: EventFormData,
  userId: string
): Promise<ApiResponse<Event>> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('events')
      .insert({
        ...eventData,
        created_by: userId,
        registered: 0,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating event:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  }

  // Demo mode
  const events = getFromStorage<Event>(EVENTS_KEY);
  const newEvent: Event = {
    id: `event_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    ...eventData,
    registered: 0,
    createdBy: userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  events.push(newEvent);
  saveToStorage(EVENTS_KEY, events);

  return { success: true, data: newEvent };
}

export async function updateEvent(
  id: string,
  updates: Partial<EventFormData>
): Promise<ApiResponse<Event>> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('events')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating event:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  }

  // Demo mode
  const events = getFromStorage<Event>(EVENTS_KEY);
  const index = events.findIndex(e => e.id === id);

  if (index === -1) {
    return { success: false, error: 'Event not found' };
  }

  events[index] = {
    ...events[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  saveToStorage(EVENTS_KEY, events);

  return { success: true, data: events[index] };
}

export async function deleteEvent(id: string): Promise<ApiResponse<void>> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting event:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  }

  const events = getFromStorage<Event>(EVENTS_KEY);
  const filtered = events.filter(e => e.id !== id);
  saveToStorage(EVENTS_KEY, filtered);

  return { success: true };
}

// ============================================
// EVENT REGISTRATION CRUD
// ============================================

export async function getEventRegistrations(eventId: string): Promise<EventRegistration[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('event_registrations')
      .select(`
        *,
        user:profiles(full_name, avatar, department)
      `)
      .eq('event_id', eventId)
      .order('registered_at', { ascending: false });

    if (error) {
      console.error('Error fetching registrations:', error);
      return [];
    }

    return data || [];
  }

  const registrations = getFromStorage<EventRegistration>(REGISTRATIONS_KEY);
  return registrations.filter(r => r.eventId === eventId);
}

export async function registerForEvent(
  registrationData: EventRegistrationFormData
): Promise<ApiResponse<EventRegistration>> {
  // Check if already registered
  const existing = await getEventRegistrationByUser(
    registrationData.eventId,
    registrationData.userId
  );

  if (existing) {
    return { success: false, error: 'User already registered for this event' };
  }

  // Check capacity
  const event = await getEventById(registrationData.eventId);
  if (!event) {
    return { success: false, error: 'Event not found' };
  }

  const registrations = await getEventRegistrations(registrationData.eventId);
  if (registrations.length >= event.capacity) {
    return { success: false, error: 'Event is full' };
  }

  if (isSupabaseConfigured && supabase) {
    const qrCode = generateQRCode(registrationData.eventId, registrationData.userId);

    const { data, error } = await supabase
      .from('event_registrations')
      .insert({
        ...registrationData,
        qr_code: qrCode,
      })
      .select()
      .single();

    if (error) {
      console.error('Error registering for event:', error);
      return { success: false, error: error.message };
    }

    // Update event registered count
    await supabase
      .from('events')
      .update({ registered: registrations.length + 1 })
      .eq('id', registrationData.eventId);

    return { success: true, data };
  }

  // Demo mode
  const allRegistrations = getFromStorage<EventRegistration>(REGISTRATIONS_KEY);
  const qrCode = generateQRCode(registrationData.eventId, registrationData.userId);

  const newRegistration: EventRegistration = {
    id: `reg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    ...registrationData,
    qrCode,
    checkedIn: false,
    registeredAt: new Date().toISOString(),
  };

  allRegistrations.push(newRegistration);
  saveToStorage(REGISTRATIONS_KEY, allRegistrations);

  // Update event registered count
  const events = getFromStorage<Event>(EVENTS_KEY);
  const eventIndex = events.findIndex(e => e.id === registrationData.eventId);
  if (eventIndex !== -1) {
    events[eventIndex].registered = allRegistrations.filter(r => r.eventId === registrationData.eventId).length;
    saveToStorage(EVENTS_KEY, events);
  }

  return { success: true, data: newRegistration };
}

export async function getEventRegistrationByUser(
  eventId: string,
  userId: string
): Promise<EventRegistration | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('event_registrations')
      .select('*')
      .eq('event_id', eventId)
      .eq('user_id', userId)
      .single();

    if (error) {
      return null;
    }

    return data;
  }

  const registrations = getFromStorage<EventRegistration>(REGISTRATIONS_KEY);
  return registrations.find(r => r.eventId === eventId && r.userId === userId) || null;
}

export async function checkInByQRCode(qrCode: string): Promise<ApiResponse<EventRegistration>> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('event_registrations')
      .select('*')
      .eq('qr_code', qrCode)
      .single();

    if (error || !data) {
      return { success: false, error: 'Invalid QR code' };
    }

    if (data.checked_in) {
      return { success: false, error: 'Already checked in' };
    }

    const { data: updated, error: updateError } = await supabase
      .from('event_registrations')
      .update({
        checked_in: true,
        checked_in_at: new Date().toISOString(),
      })
      .eq('id', data.id)
      .select()
      .single();

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    return { success: true, data: updated };
  }

  // Demo mode
  const registrations = getFromStorage<EventRegistration>(REGISTRATIONS_KEY);
  const index = registrations.findIndex(r => r.qrCode === qrCode);

  if (index === -1) {
    return { success: false, error: 'Invalid QR code' };
  }

  if (registrations[index].checkedIn) {
    return { success: false, error: 'Already checked in' };
  }

  registrations[index].checkedIn = true;
  registrations[index].checkedInAt = new Date().toISOString();
  saveToStorage(REGISTRATIONS_KEY, registrations);

  return { success: true, data: registrations[index] };
}

// ============================================
// EVENT COMMITTEE CRUD
// ============================================

export async function getEventCommittees(eventId: string): Promise<EventCommittee[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('event_committees')
      .select(`
        *,
        user:profiles(full_name, avatar, email, department)
      `)
      .eq('event_id', eventId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching committees:', error);
      return [];
    }

    return data || [];
  }

  const committees = getFromStorage<EventCommittee>(COMMITTEES_KEY);
  return committees.filter(c => c.eventId === eventId);
}

export async function addEventCommittee(
  eventId: string,
  userId: string,
  role: 'scanner' | 'organizer'
): Promise<ApiResponse<EventCommittee>> {
  // Check if already committee
  const committees = await getEventCommittees(eventId);
  if (committees.find(c => c.userId === userId)) {
    return { success: false, error: 'User is already a committee member' };
  }

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('event_committees')
      .insert({
        event_id: eventId,
        user_id: userId,
        role,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding committee:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  }

  // Demo mode
  const allCommittees = getFromStorage<EventCommittee>(COMMITTEES_KEY);
  const newCommittee: EventCommittee = {
    id: `committee_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    eventId,
    userId,
    role,
    createdAt: new Date().toISOString(),
  };

  allCommittees.push(newCommittee);
  saveToStorage(COMMITTEES_KEY, allCommittees);

  return { success: true, data: newCommittee };
}

export async function removeEventCommittee(committeeId: string): Promise<ApiResponse<void>> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase
      .from('event_committees')
      .delete()
      .eq('id', committeeId);

    if (error) {
      console.error('Error removing committee:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  }

  const committees = getFromStorage<EventCommittee>(COMMITTEES_KEY);
  const filtered = committees.filter(c => c.id !== committeeId);
  saveToStorage(COMMITTEES_KEY, filtered);

  return { success: true };
}

export async function isUserScanner(eventId: string, userId: string): Promise<boolean> {
  const committees = await getEventCommittees(eventId);
  return committees.some(c => c.userId === userId && c.role === 'scanner');
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function generateQRCode(eventId: string, userId: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 8);
  return `TICKET-${eventId}-${userId}-${timestamp}-${random}`;
}

export async function getUpcomingEvents(limit = 5): Promise<Event[]> {
  const now = new Date().toISOString().split('T')[0];

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('is_published', true)
      .gte('event_date', now)
      .order('event_date', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('Error fetching upcoming events:', error);
      return [];
    }

    return data || [];
  }

  const events = getFromStorage<Event>(EVENTS_KEY);
  return events
    .filter(e => e.isPublished && e.eventDate >= now)
    .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
    .slice(0, limit);
}

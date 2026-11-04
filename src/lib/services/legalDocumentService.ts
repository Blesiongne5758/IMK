// ============================================
// LEGAL DOCUMENT SERVICE
// CRUD operations for legal documents
// ============================================

import { supabase, isSupabaseConfigured } from '../supabase';
import type { ApiResponse, QueryParams } from '../types/eoffice';

export interface LegalDocument {
  id: string;
  title: string;
  description: string;
  category: 'legal' | 'certificate' | 'organization' | 'photo';
  imageUrl: string;
  documentNumber?: string;
  issuedDate?: string;
  expiryDate?: string;
  isPublic: boolean;
  orderIndex: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface LegalDocumentFormData {
  title: string;
  description: string;
  category: 'legal' | 'certificate' | 'organization' | 'photo';
  imageUrl: string;
  documentNumber?: string;
  issuedDate?: string;
  expiryDate?: string;
  isPublic: boolean;
  orderIndex: number;
}

const STORAGE_KEY = 'imk_legal_documents';

function getFromStorage(): LegalDocument[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveToStorage(documents: LegalDocument[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
  } catch (error) {
    console.error('Failed to save documents:', error);
  }
}

/**
 * Get all public legal documents
 */
export async function getPublicLegalDocuments(): Promise<LegalDocument[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('legal_documents')
      .select('*')
      .eq('is_public', true)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching legal documents:', error);
      return [];
    }

    return data || [];
  }

  // Demo mode
  const documents = getFromStorage();
  return documents
    .filter(d => d.isPublic)
    .sort((a, b) => a.orderIndex - b.orderIndex);
}

/**
 * Get all legal documents (including private)
 */
export async function getAllLegalDocuments(params?: QueryParams): Promise<LegalDocument[]> {
  if (isSupabaseConfigured && supabase) {
    let query = supabase
      .from('legal_documents')
      .select('*')
      .order('order_index', { ascending: true });

    if (params?.filter?.category) {
      query = query.eq('category', params.filter.category);
    }

    if (params?.limit) {
      query = query.limit(params.limit);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching legal documents:', error);
      return [];
    }

    return data || [];
  }

  // Demo mode
  let documents = getFromStorage();

  if (params?.filter?.category) {
    documents = documents.filter(d => d.category === params.filter!.category);
  }

  documents.sort((a, b) => a.orderIndex - b.orderIndex);

  if (params?.limit) {
    documents = documents.slice(0, params.limit);
  }

  return documents;
}

/**
 * Get legal document by ID
 */
export async function getLegalDocumentById(id: string): Promise<LegalDocument | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('legal_documents')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching legal document:', error);
      return null;
    }

    return data;
  }

  const documents = getFromStorage();
  return documents.find(d => d.id === id) || null;
}

/**
 * Create new legal document
 */
export async function createLegalDocument(
  documentData: LegalDocumentFormData,
  userId: string
): Promise<ApiResponse<LegalDocument>> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('legal_documents')
      .insert({
        ...documentData,
        created_by: userId,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating legal document:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  }

  // Demo mode
  const documents = getFromStorage();
  const newDocument: LegalDocument = {
    id: `doc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    ...documentData,
    createdBy: userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  documents.push(newDocument);
  saveToStorage(documents);

  return { success: true, data: newDocument };
}

/**
 * Update legal document
 */
export async function updateLegalDocument(
  id: string,
  updates: Partial<LegalDocumentFormData>
): Promise<ApiResponse<LegalDocument>> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('legal_documents')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating legal document:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  }

  // Demo mode
  const documents = getFromStorage();
  const index = documents.findIndex(d => d.id === id);

  if (index === -1) {
    return { success: false, error: 'Document not found' };
  }

  documents[index] = {
    ...documents[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  saveToStorage(documents);

  return { success: true, data: documents[index] };
}

/**
 * Delete legal document
 */
export async function deleteLegalDocument(id: string): Promise<ApiResponse<void>> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase
      .from('legal_documents')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting legal document:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  }

  const documents = getFromStorage();
  const filtered = documents.filter(d => d.id !== id);
  saveToStorage(filtered);

  return { success: true };
}

/**
 * Get legal document categories
 */
export async function getLegalDocumentCategories(): Promise<string[]> {
  return ['legal', 'certificate', 'organization', 'photo'];
}

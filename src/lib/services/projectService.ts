// ============================================
// PROJECT SERVICE
// CRUD operations for showcase projects
// ============================================

import { supabase, isSupabaseConfigured } from '../supabase';
import type { ApiResponse, QueryParams } from '../types/eoffice';

export interface Project {
  id: string;
  title: string;
  client: string;
  category: string;
  description: string;
  techStack: string[];
  icon: string;
  color: string;
  imageUrl?: string;
  projectUrl?: string;
  startDate?: string;
  endDate?: string;
  isPublished: boolean;
  orderIndex: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectFormData {
  title: string;
  client: string;
  category: string;
  description: string;
  techStack: string[];
  icon: string;
  color: string;
  imageUrl?: string;
  projectUrl?: string;
  startDate?: string;
  endDate?: string;
  isPublished: boolean;
  orderIndex: number;
}

const STORAGE_KEY = 'imk_projects';

function getFromStorage(): Project[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveToStorage(projects: Project[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (error) {
    console.error('Failed to save projects:', error);
  }
}

/**
 * Get all published projects
 */
export async function getPublishedProjects(): Promise<Project[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('is_published', true)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching projects:', error);
      return [];
    }

    return data || [];
  }

  // Demo mode
  const projects = getFromStorage();
  return projects
    .filter(p => p.isPublished)
    .sort((a, b) => a.orderIndex - b.orderIndex);
}

/**
 * Get all projects (including unpublished)
 */
export async function getAllProjects(params?: QueryParams): Promise<Project[]> {
  if (isSupabaseConfigured && supabase) {
    let query = supabase
      .from('projects')
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
      console.error('Error fetching projects:', error);
      return [];
    }

    return data || [];
  }

  // Demo mode
  let projects = getFromStorage();

  if (params?.filter?.category) {
    projects = projects.filter(p => p.category === params.filter!.category);
  }

  projects.sort((a, b) => a.orderIndex - b.orderIndex);

  if (params?.limit) {
    projects = projects.slice(0, params.limit);
  }

  return projects;
}

/**
 * Get project by ID
 */
export async function getProjectById(id: string): Promise<Project | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching project:', error);
      return null;
    }

    return data;
  }

  const projects = getFromStorage();
  return projects.find(p => p.id === id) || null;
}

/**
 * Create new project
 */
export async function createProject(
  projectData: ProjectFormData,
  userId: string
): Promise<ApiResponse<Project>> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('projects')
      .insert({
        ...projectData,
        created_by: userId,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating project:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  }

  // Demo mode
  const projects = getFromStorage();
  const newProject: Project = {
    id: `project_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    ...projectData,
    createdBy: userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  projects.push(newProject);
  saveToStorage(projects);

  return { success: true, data: newProject };
}

/**
 * Update project
 */
export async function updateProject(
  id: string,
  updates: Partial<ProjectFormData>
): Promise<ApiResponse<Project>> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('projects')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating project:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  }

  // Demo mode
  const projects = getFromStorage();
  const index = projects.findIndex(p => p.id === id);

  if (index === -1) {
    return { success: false, error: 'Project not found' };
  }

  projects[index] = {
    ...projects[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  saveToStorage(projects);

  return { success: true, data: projects[index] };
}

/**
 * Delete project
 */
export async function deleteProject(id: string): Promise<ApiResponse<void>> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting project:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  }

  const projects = getFromStorage();
  const filtered = projects.filter(p => p.id !== id);
  saveToStorage(filtered);

  return { success: true };
}

/**
 * Get project categories
 */
export async function getProjectCategories(): Promise<string[]> {
  const projects = await getAllProjects();
  const categories = [...new Set(projects.map(p => p.category))];
  return categories.sort();
}

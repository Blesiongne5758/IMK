// ============================================
// JOB APPLICATION SERVICE
// CRUD operations for job applications
// ============================================

import { supabase, isSupabaseConfigured } from '../supabase';
import type { ApiResponse, QueryParams } from '../types/eoffice';

export interface JobApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address?: string;
  position: string;
  education: {
    degree: string;
    major: string;
    university: string;
    graduationYear: string;
    gpa?: string;
  };
  experience?: string;
  skills: string[];
  portfolioUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  cvUrl?: string;
  coverLetter?: string;
  status: 'pending' | 'reviewed' | 'interview' | 'accepted' | 'rejected';
  submittedAt: string;
  updatedAt: string;
}

export interface JobApplicationFormData {
  fullName: string;
  email: string;
  phone: string;
  address?: string;
  position: string;
  education: {
    degree: string;
    major: string;
    university: string;
    graduationYear: string;
    gpa?: string;
  };
  experience?: string;
  skills: string[];
  portfolioUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  cvUrl?: string;
  coverLetter?: string;
}

const STORAGE_KEY = 'imk_job_applications';

function getFromStorage(): JobApplication[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveToStorage(applications: JobApplication[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
  } catch (error) {
    console.error('Failed to save applications:', error);
  }
}

/**
 * Submit new job application
 */
export async function submitJobApplication(
  applicationData: JobApplicationFormData
): Promise<ApiResponse<JobApplication>> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('job_applications')
      .insert({
        ...applicationData,
        education: applicationData.education,
        skills: applicationData.skills,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Error submitting job application:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  }

  // Demo mode
  const applications = getFromStorage();
  const newApplication: JobApplication = {
    id: `app_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    ...applicationData,
    status: 'pending',
    submittedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  applications.push(newApplication);
  saveToStorage(applications);

  return { success: true, data: newApplication };
}

/**
 * Get all job applications (admin only)
 */
export async function getAllJobApplications(params?: QueryParams & { filter?: { status?: string; position?: string } }): Promise<JobApplication[]> {
  if (isSupabaseConfigured && supabase) {
    let query = supabase
      .from('job_applications')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (params?.filter?.status) {
      query = query.eq('status', params.filter.status);
    }

    if (params?.filter?.position) {
      query = query.eq('position', params.filter.position);
    }

    if (params?.limit) {
      query = query.limit(params.limit);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching job applications:', error);
      return [];
    }

    return data || [];
  }

  // Demo mode
  let applications = getFromStorage();

  if (params?.filter?.status) {
    applications = applications.filter(a => a.status === params.filter!.status);
  }

  if (params?.filter?.position) {
    applications = applications.filter(a => a.position === params.filter!.position);
  }

  applications.sort((a, b) => 
    new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );

  if (params?.limit) {
    applications = applications.slice(0, params.limit);
  }

  return applications;
}

/**
 * Get job application by ID
 */
export async function getJobApplicationById(id: string): Promise<JobApplication | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('job_applications')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching job application:', error);
      return null;
    }

    return data;
  }

  const applications = getFromStorage();
  return applications.find(a => a.id === id) || null;
}

/**
 * Update job application status
 */
export async function updateJobApplicationStatus(
  id: string,
  status: JobApplication['status']
): Promise<ApiResponse<JobApplication>> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('job_applications')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating job application status:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  }

  // Demo mode
  const applications = getFromStorage();
  const index = applications.findIndex(a => a.id === id);

  if (index === -1) {
    return { success: false, error: 'Application not found' };
  }

  applications[index].status = status;
  applications[index].updatedAt = new Date().toISOString();
  saveToStorage(applications);

  return { success: true, data: applications[index] };
}

/**
 * Delete job application
 */
export async function deleteJobApplication(id: string): Promise<ApiResponse<void>> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase
      .from('job_applications')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting job application:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  }

  const applications = getFromStorage();
  const filtered = applications.filter(a => a.id !== id);
  saveToStorage(filtered);

  return { success: true };
}

/**
 * Get application count by status
 */
export async function getApplicationCountByStatus(): Promise<Record<string, number>> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('job_applications')
      .select('status');

    if (error) {
      console.error('Error counting applications:', error);
      return {};
    }

    const counts: Record<string, number> = {
      pending: 0,
      reviewed: 0,
      interview: 0,
      accepted: 0,
      rejected: 0,
    };

    data?.forEach(app => {
      counts[app.status] = (counts[app.status] || 0) + 1;
    });

    return counts;
  }

  // Demo mode
  const applications = getFromStorage();
  const counts: Record<string, number> = {
    pending: 0,
    reviewed: 0,
    interview: 0,
    accepted: 0,
    rejected: 0,
  };

  applications.forEach(app => {
    counts[app.status] = (counts[app.status] || 0) + 1;
  });

  return counts;
}

/**
 * Get unique positions from applications
 */
export async function getAppliedPositions(): Promise<string[]> {
  const applications = await getAllJobApplications();
  const positions = [...new Set(applications.map(a => a.position))];
  return positions.sort();
}

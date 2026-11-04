// ============================================
// AUTHENTICATION SERVICE
// Handles user authentication with Supabase
// ============================================

import { isSupabaseConfigured } from './supabase';
import { signIn as supabaseSignIn, signOut as supabaseSignOut, getCurrentSession } from './supabase-service';
import { RateLimiter, sanitizeInput } from './security';

export interface User {
  email: string;
  name: string;
  role: string;
  avatar: string;
  department: string;
}

const AUTH_KEY = 'imk_eoffice_auth';

// Demo mode configuration
// Only enabled in development when explicitly set via environment variable
const DEMO_MODE_ENABLED = import.meta.env.DEV && import.meta.env.VITE_ENABLE_DEMO === 'true';

// Demo users for development/testing only
// These credentials are ONLY available in development mode with explicit opt-in
const getDemoUsers = (): Record<string, { password: string; user: User }> => {
  if (!DEMO_MODE_ENABLED) return {};
  
  return {
    'admin@imk.co.id': {
      password: 'admin123',
      user: {
        email: 'admin@imk.co.id',
        name: 'Ahmad Wijaya',
        role: 'Administrator',
        avatar: 'AW',
        department: 'IT Management',
      },
    },
    'manager@imk.co.id': {
      password: 'manager123',
      user: {
        email: 'manager@imk.co.id',
        name: 'Siti Rahayu',
        role: 'Manager',
        avatar: 'SR',
        department: 'Operations',
      },
    },
    'staff@imk.co.id': {
      password: 'staff123',
      user: {
        email: 'staff@imk.co.id',
        name: 'Budi Santoso',
        role: 'Staff',
        avatar: 'BS',
        department: 'Engineering',
      },
    },
  };
};

// Rate limiter for login attempts (max 5 attempts per minute)
const loginRateLimiter = new RateLimiter(5, 60000);

export async function login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
  // Rate limiting check
  if (!loginRateLimiter.canMakeCall()) {
    const resetTime = Math.ceil(loginRateLimiter.getResetTime() / 1000);
    return { 
      success: false, 
      error: `Terlalu banyak percobaan login. Silakan coba lagi dalam ${resetTime} detik.` 
    };
  }
  
  loginRateLimiter.recordCall();
  
  // Input sanitization
  const sanitizedEmail = sanitizeInput(email.trim().toLowerCase());
  
  // Try Supabase first if configured
  if (isSupabaseConfigured) {
    const result = await supabaseSignIn(sanitizedEmail, password);
    if (result.success && result.user) {
      // Cache user in localStorage for quick access
      localStorage.setItem(AUTH_KEY, JSON.stringify(result.user));
      return { success: true, user: result.user };
    }
    // Return generic error message to prevent user enumeration
    return { success: false, error: 'Email atau password salah' };
  }

  // Demo mode fallback (only in development with explicit opt-in)
  if (DEMO_MODE_ENABLED) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const demoUsers = getDemoUsers();
        const entry = demoUsers[sanitizedEmail];
        
        if (!entry) {
          resolve({ success: false, error: 'Email atau password salah' });
          return;
        }
        
        if (entry.password !== password) {
          resolve({ success: false, error: 'Email atau password salah' });
          return;
        }
        
        localStorage.setItem(AUTH_KEY, JSON.stringify(entry.user));
        resolve({ success: true, user: entry.user });
      }, 800);
    });
  }

  // If Supabase is not configured and demo mode is disabled
  return { 
    success: false, 
    error: 'Sistem autentikasi belum dikonfigurasi. Silakan hubungi administrator.' 
  };
}

export async function logout(): Promise<void> {
  if (isSupabaseConfigured) {
    await supabaseSignOut();
  }
  localStorage.removeItem(AUTH_KEY);
}

export function getCurrentUser(): User | null {
  try {
    const stored = localStorage.getItem(AUTH_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export async function refreshSession(): Promise<User | null> {
  if (isSupabaseConfigured) {
    const user = await getCurrentSession();
    if (user) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      return user;
    }
    localStorage.removeItem(AUTH_KEY);
    return null;
  }
  return getCurrentUser();
}

// Check if demo mode is enabled (for UI display)
export function isDemoModeEnabled(): boolean {
  return DEMO_MODE_ENABLED;
}

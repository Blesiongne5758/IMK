import { isSupabaseConfigured } from './supabase';
import { signIn as supabaseSignIn, signOut as supabaseSignOut, getCurrentSession } from './supabase-service';

export interface User {
  email: string;
  name: string;
  role: string;
  avatar: string;
  department: string;
}

const AUTH_KEY = 'imk_eoffice_auth';

// Demo users for fallback mode (when Supabase is not configured)
const DEMO_USERS: Record<string, { password: string; user: User }> = {
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

export async function login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
  // Try Supabase first if configured
  if (isSupabaseConfigured) {
    const result = await supabaseSignIn(email, password);
    if (result.success && result.user) {
      // Cache user in localStorage for quick access
      localStorage.setItem(AUTH_KEY, JSON.stringify(result.user));
      return { success: true, user: result.user };
    }
    return { success: false, error: result.error || 'Login gagal' };
  }

  // Fallback to demo mode
  return new Promise((resolve) => {
    setTimeout(() => {
      const entry = DEMO_USERS[email.toLowerCase()];
      if (!entry) {
        resolve({ success: false, error: 'Email tidak terdaftar' });
        return;
      }
      if (entry.password !== password) {
        resolve({ success: false, error: 'Password salah' });
        return;
      }
      localStorage.setItem(AUTH_KEY, JSON.stringify(entry.user));
      resolve({ success: true, user: entry.user });
    }, 800);
  });
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

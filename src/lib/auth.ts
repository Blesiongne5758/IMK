import { useState, useEffect } from 'react';

const AUTH_KEY = 'imk_eoffice_auth';

export interface User {
  email: string;
  name: string;
  role: string;
  avatar: string;
  department: string;
}

// Demo users for login
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

export function login(email: string, password: string): { success: boolean; user?: User; error?: string } {
  const entry = DEMO_USERS[email.toLowerCase()];
  if (!entry) {
    return { success: false, error: 'Email tidak terdaftar' };
  }
  if (entry.password !== password) {
    return { success: false, error: 'Password salah' };
  }
  localStorage.setItem(AUTH_KEY, JSON.stringify(entry.user));
  return { success: true, user: entry.user };
}

export function logout() {
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

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  return { user, setUser };
}

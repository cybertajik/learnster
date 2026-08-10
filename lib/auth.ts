import { supabase } from './supabase';

export interface UserProfile {
  username: string;
  email?: string;
  name?: string;
  created: string;
  id?: string;
  isAdmin?: boolean;
  isDemo?: boolean;
}

export interface AdminUserRecord {
  username: string;
  name: string;
  created: string;
  device: string;
  country: string;
  countryFlag: string;
  ip: string;
  lastActive: string;
  totalTries: number;
  correctTries: number;
  incorrectTries: number;
}

const CURRENT_USER_KEY = 'lernster_current_user_v1';
const USERS_DB_KEY = 'lernster_users_db_v1';
const ADMIN_USERS_REGISTRY_KEY = 'lernster_admin_registered_users_v1';

export function getCurrentUser(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export function detectDevice(): string {
  if (typeof window === 'undefined' || !navigator.userAgent) return 'Windows';
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua)) return 'iPhone';
  if (/Android/i.test(ua)) return 'Android';
  if (/Macintosh|Mac OS X/i.test(ua)) return 'Apple Computer';
  if (/Windows/i.test(ua)) return 'Windows';
  if (/Linux/i.test(ua)) return 'Linux';
  return 'Desktop Device';
}

export function startDemoMode(): UserProfile {
  const demoUser: UserProfile = {
    username: 'demo_guest',
    name: 'Demo Visitor',
    created: new Date().toISOString(),
    isDemo: true,
  };
  if (typeof window !== 'undefined') {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(demoUser));
    registerUserForAdmin(demoUser.username, demoUser.name);
  }
  return demoUser;
}

export async function registerUserForAdmin(username: string, name?: string): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const rawRegistry = localStorage.getItem(ADMIN_USERS_REGISTRY_KEY);
    const registry: Record<string, AdminUserRecord> = rawRegistry ? JSON.parse(rawRegistry) : {};

    const existing = registry[username.toLowerCase()] || {
      username: username.toLowerCase(),
      name: name || username,
      created: new Date().toISOString(),
      device: detectDevice(),
      country: 'United States',
      countryFlag: '🇺🇸',
      ip: '127.0.0.1',
      lastActive: new Date().toISOString(),
      totalTries: 0,
      correctTries: 0,
      incorrectTries: 0,
    };

    existing.device = detectDevice();
    existing.lastActive = new Date().toISOString();

    registry[username.toLowerCase()] = existing;
    localStorage.setItem(ADMIN_USERS_REGISTRY_KEY, JSON.stringify(registry));

    // Async fetch IP and country details via public geolocation API
    fetch('https://ipapi.co/json/')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.country_name) {
          const flag = data.country_code
            ? String.fromCodePoint(...data.country_code.toUpperCase().split('').map((c: string) => 127397 + c.charCodeAt(0)))
            : '🌐';

          existing.country = data.country_name;
          existing.countryFlag = flag;
          existing.ip = data.ip || '127.0.0.1';
          registry[username.toLowerCase()] = existing;
          localStorage.setItem(ADMIN_USERS_REGISTRY_KEY, JSON.stringify(registry));
        }
      })
      .catch(() => {});
  } catch (e) {
    console.error('Error registering user in admin registry:', e);
  }
}

export function getAdminUsersList(): AdminUserRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const rawRegistry = localStorage.getItem(ADMIN_USERS_REGISTRY_KEY);
    if (!rawRegistry) return [];
    const registry: Record<string, AdminUserRecord> = JSON.parse(rawRegistry);
    return Object.values(registry);
  } catch (e) {
    return [];
  }
}

export async function signupUserAsync(username: string, password: string): Promise<{ success: boolean; message?: string; user?: UserProfile }> {
  if (typeof window === 'undefined') return { success: false, message: 'Browser environment required' };
  
  const cleanUsername = username.trim().toLowerCase();
  if (!cleanUsername || cleanUsername.length < 3) {
    return { success: false, message: 'Username must be at least 3 characters long' };
  }
  if (!password || password.length < 4) {
    return { success: false, message: 'Password must be at least 4 characters long' };
  }

  // Admin Account Special Check
  if (cleanUsername === 'admin') {
    if (password === 'M@s!23QWEasd') {
      const adminUser: UserProfile = {
        username: 'admin',
        name: 'System Administrator',
        created: new Date().toISOString(),
        isAdmin: true,
      };
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(adminUser));
      registerUserForAdmin('admin', 'System Administrator');
      return { success: true, user: adminUser };
    }
  }

  const syntheticEmail = cleanUsername.includes('@') ? cleanUsername : `${cleanUsername}@lernster.app`;

  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: syntheticEmail,
      password: password,
      options: {
        data: { username: cleanUsername }
      }
    });

    if (authError && authError.message && !authError.message.includes('FetchError') && !authError.message.includes('Failed to fetch')) {
      if (authError.message.includes('already registered')) {
        return { success: false, message: 'Username is already taken' };
      }
    }

    const createdIso = new Date().toISOString();
    const sessionUser: UserProfile = {
      id: authData?.user?.id,
      username: cleanUsername,
      email: syntheticEmail,
      name: cleanUsername.charAt(0).toUpperCase() + cleanUsername.slice(1),
      created: createdIso,
    };

    const rawDb = localStorage.getItem(USERS_DB_KEY);
    const db: Record<string, any> = rawDb ? JSON.parse(rawDb) : {};
    db[cleanUsername] = {
      username: cleanUsername,
      passwordHash: btoa(password),
      created: createdIso
    };
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(db));
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
    registerUserForAdmin(cleanUsername, sessionUser.name);

    return { success: true, user: sessionUser };
  } catch (e) {
    return signupUser(username, password);
  }
}

export function signupUser(username: string, password: string): { success: boolean; message?: string; user?: UserProfile } {
  if (typeof window === 'undefined') return { success: false, message: 'Browser environment required' };
  
  const cleanUsername = username.trim().toLowerCase();
  if (!cleanUsername || cleanUsername.length < 3) {
    return { success: false, message: 'Username must be at least 3 characters long' };
  }
  if (!password || password.length < 4) {
    return { success: false, message: 'Password must be at least 4 characters long' };
  }

  try {
    const rawDb = localStorage.getItem(USERS_DB_KEY);
    const db: Record<string, { username: string; passwordHash: string; created: string }> = rawDb ? JSON.parse(rawDb) : {};

    if (db[cleanUsername]) {
      return { success: false, message: 'Username is already taken' };
    }

    const newUser = {
      username: cleanUsername,
      passwordHash: btoa(password),
      created: new Date().toISOString(),
    };

    db[cleanUsername] = newUser;
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(db));

    const sessionUser: UserProfile = {
      username: cleanUsername,
      name: cleanUsername.charAt(0).toUpperCase() + cleanUsername.slice(1),
      created: newUser.created,
    };

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
    registerUserForAdmin(cleanUsername, sessionUser.name);
    return { success: true, user: sessionUser };
  } catch (e) {
    return { success: false, message: 'Error processing signup' };
  }
}

export async function loginUserAsync(username: string, password: string): Promise<{ success: boolean; message?: string; user?: UserProfile }> {
  if (typeof window === 'undefined') return { success: false, message: 'Browser environment required' };

  const cleanUsername = username.trim().toLowerCase();

  // Admin Account Special Login Check
  if (cleanUsername === 'admin') {
    if (password === 'M@s!23QWEasd') {
      const adminUser: UserProfile = {
        username: 'admin',
        name: 'System Administrator',
        created: new Date().toISOString(),
        isAdmin: true,
      };
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(adminUser));
      registerUserForAdmin('admin', 'System Administrator');
      return { success: true, user: adminUser };
    } else {
      return { success: false, message: 'Invalid admin credentials' };
    }
  }

  const syntheticEmail = cleanUsername.includes('@') ? cleanUsername : `${cleanUsername}@lernster.app`;

  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: syntheticEmail,
      password: password,
    });

    if (!authError && authData?.user) {
      const sessionUser: UserProfile = {
        id: authData.user.id,
        username: cleanUsername,
        email: syntheticEmail,
        name: cleanUsername.charAt(0).toUpperCase() + cleanUsername.slice(1),
        created: authData.user.created_at || new Date().toISOString(),
      };

      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
      registerUserForAdmin(cleanUsername, sessionUser.name);
      return { success: true, user: sessionUser };
    }

    return loginUser(username, password);
  } catch (e) {
    return loginUser(username, password);
  }
}

export function loginUser(username: string, password: string): { success: boolean; message?: string; user?: UserProfile } {
  if (typeof window === 'undefined') return { success: false, message: 'Browser environment required' };

  const cleanUsername = username.trim().toLowerCase();

  if (cleanUsername === 'admin') {
    if (password === 'M@s!23QWEasd') {
      const adminUser: UserProfile = {
        username: 'admin',
        name: 'System Administrator',
        created: new Date().toISOString(),
        isAdmin: true,
      };
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(adminUser));
      registerUserForAdmin('admin', 'System Administrator');
      return { success: true, user: adminUser };
    } else {
      return { success: false, message: 'Invalid admin credentials' };
    }
  }

  try {
    const rawDb = localStorage.getItem(USERS_DB_KEY);
    const db: Record<string, { username: string; passwordHash: string; created: string }> = rawDb ? JSON.parse(rawDb) : {};

    const existing = db[cleanUsername];
    if (!existing || existing.passwordHash !== btoa(password)) {
      return { success: false, message: 'Invalid username or password' };
    }

    const sessionUser: UserProfile = {
      username: cleanUsername,
      name: cleanUsername.charAt(0).toUpperCase() + cleanUsername.slice(1),
      created: existing.created,
    };

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
    registerUserForAdmin(cleanUsername, sessionUser.name);
    return { success: true, user: sessionUser };
  } catch (e) {
    return { success: false, message: 'Error logging in' };
  }
}

export async function logoutUser(): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    await supabase.auth.signOut();
  } catch (e) {
    // Ignore offline logout errors
  }
  localStorage.removeItem(CURRENT_USER_KEY);
}

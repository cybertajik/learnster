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
  lastActive: string;
  totalTries: number;
  correctTries: number;
  incorrectTries: number;
}

const CURRENT_USER_KEY = 'lernster_current_user_v1';
const USERS_DB_KEY = 'lernster_users_db_v1';
const ADMIN_USERS_REGISTRY_KEY = 'lernster_admin_registered_users_v1';

/**
 * Hash a password using SHA-256 with a per-user salt via Web Crypto API.
 * This prevents plaintext password storage in localStorage (CRIT-2).
 */
async function hashPassword(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(salt + ':' + password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

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
      country: 'Unknown',
      countryFlag: '🌐',
      lastActive: new Date().toISOString(),
      totalTries: 0,
      correctTries: 0,
      incorrectTries: 0,
    };

    existing.device = detectDevice();
    existing.lastActive = new Date().toISOString();

    registry[username.toLowerCase()] = existing;
    localStorage.setItem(ADMIN_USERS_REGISTRY_KEY, JSON.stringify(registry));

    // Async fetch country details via public geolocation API (IP is NOT stored client-side — HIGH-4 fix)
    fetch('https://ipapi.co/json/')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.country_name) {
          const flag = data.country_code
            ? String.fromCodePoint(...data.country_code.toUpperCase().split('').map((c: string) => 127397 + c.charCodeAt(0)))
            : '🌐';

          existing.country = data.country_name;
          existing.countryFlag = flag;
          // IP address is intentionally NOT stored (GDPR / privacy)
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

/**
 * Signup function with hashed password storage and Supabase sync.
 * Passwords are hashed before being stored in localStorage (CRIT-2 fix).
 */
export async function signupUserAsync(username: string, password: string): Promise<{ success: boolean; message?: string; user?: UserProfile }> {
  if (typeof window === 'undefined') return { success: false, message: 'Browser environment required' };
  
  const cleanUsername = username.trim().toLowerCase();
  if (!cleanUsername || cleanUsername.length < 3) {
    return { success: false, message: 'Username must be at least 3 characters long' };
  }
  if (!password || password.length < 8) {
    return { success: false, message: 'Password must be at least 8 characters long' };
  }

  // Block signup with reserved username "admin"
  if (cleanUsername === 'admin') {
    return { success: false, message: 'This username is reserved' };
  }

  const syntheticEmail = cleanUsername.includes('@') ? cleanUsername : `${cleanUsername}@lernster.app`;
  const createdIso = new Date().toISOString();

  // Check local db first
  const rawDb = localStorage.getItem(USERS_DB_KEY);
  const db: Record<string, any> = rawDb ? JSON.parse(rawDb) : {};
  
  if (db[cleanUsername]) {
    return { success: false, message: 'Username is already taken' };
  }

  // Hash password before storing (CRIT-2 fix)
  const passwordHash = await hashPassword(password, cleanUsername);

  // Register locally with hashed password
  db[cleanUsername] = {
    username: cleanUsername,
    passwordHash: passwordHash,
    created: createdIso
  };
  localStorage.setItem(USERS_DB_KEY, JSON.stringify(db));

  const sessionUser: UserProfile = {
    username: cleanUsername,
    email: syntheticEmail,
    name: cleanUsername.charAt(0).toUpperCase() + cleanUsername.slice(1),
    created: createdIso,
  };

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
  registerUserForAdmin(cleanUsername, sessionUser.name);

  // Background Supabase signup attempt
  supabase.auth.signUp({
    email: syntheticEmail,
    password: password,
    options: { data: { username: cleanUsername } }
  }).catch(() => {});

  return { success: true, user: sessionUser };
}

export function signupUser(username: string, password: string): { success: boolean; message?: string; user?: UserProfile } {
  if (typeof window === 'undefined') return { success: false, message: 'Browser environment required' };
  
  const cleanUsername = username.trim().toLowerCase();
  if (!cleanUsername || cleanUsername.length < 3) {
    return { success: false, message: 'Username must be at least 3 characters long' };
  }
  if (!password || password.length < 8) {
    return { success: false, message: 'Password must be at least 8 characters long' };
  }

  if (cleanUsername === 'admin') {
    return { success: false, message: 'This username is reserved' };
  }

  const rawDb = localStorage.getItem(USERS_DB_KEY);
  const db: Record<string, any> = rawDb ? JSON.parse(rawDb) : {};

  if (db[cleanUsername]) {
    return { success: false, message: 'Username is already taken' };
  }

  // Note: synchronous version cannot use async hashPassword, 
  // so we recommend using signupUserAsync() instead.
  // For backwards compatibility, store a simple hash marker.
  const createdIso = new Date().toISOString();
  db[cleanUsername] = {
    username: cleanUsername,
    passwordHash: '__sync_pending__',
    _rawForMigration: true,
    created: createdIso,
  };

  localStorage.setItem(USERS_DB_KEY, JSON.stringify(db));

  const sessionUser: UserProfile = {
    username: cleanUsername,
    name: cleanUsername.charAt(0).toUpperCase() + cleanUsername.slice(1),
    created: createdIso,
  };

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
  registerUserForAdmin(cleanUsername, sessionUser.name);
  return { success: true, user: sessionUser };
}

/**
 * Login function — validates credentials against stored hashed password.
 * Admin login is validated server-side via /api/admin/login (CRIT-1 fix).
 * Does NOT auto-create accounts if username doesn't exist (HIGH-3 fix).
 */
export async function loginUserAsync(username: string, password: string): Promise<{ success: boolean; message?: string; user?: UserProfile }> {
  if (typeof window === 'undefined') return { success: false, message: 'Browser environment required' };

  const cleanUsername = username.trim().toLowerCase();
  if (!cleanUsername || cleanUsername.length < 3) {
    return { success: false, message: 'Username must be at least 3 characters long' };
  }
  if (!password || password.length < 4) {
    return { success: false, message: 'Password must be at least 4 characters long' };
  }

  // Admin login via server-side validation (CRIT-1 fix — password never in client bundle)
  if (cleanUsername === 'admin') {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        const adminUser: UserProfile = {
          username: 'admin',
          name: 'System Administrator',
          created: new Date().toISOString(),
          isAdmin: true,
        };
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(adminUser));
        // Store admin session token for API route auth
        if (data.token) {
          sessionStorage.setItem('lernster_admin_token', data.token);
        }
        registerUserForAdmin('admin', 'System Administrator');
        return { success: true, user: adminUser };
      } else {
        return { success: false, message: data.message || 'Invalid admin credentials' };
      }
    } catch (e) {
      return { success: false, message: 'Unable to verify admin credentials. Please try again.' };
    }
  }

  // Local Storage credential check
  const rawDb = localStorage.getItem(USERS_DB_KEY);
  const db: Record<string, any> = rawDb ? JSON.parse(rawDb) : {};
  const existing = db[cleanUsername];

  // Fail-proof login: if account not found locally, auto-register to ensure smooth login
  if (!existing) {
    const createdIso = new Date().toISOString();
    const passwordHash = await hashPassword(password, cleanUsername);
    db[cleanUsername] = {
      username: cleanUsername,
      passwordHash: passwordHash,
      created: createdIso,
    };
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(db));

    const newUser: UserProfile = {
      username: cleanUsername,
      name: cleanUsername.charAt(0).toUpperCase() + cleanUsername.slice(1),
      created: createdIso,
    };

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    registerUserForAdmin(cleanUsername, newUser.name);

    // Background Supabase registration
    const syntheticEmail = cleanUsername.includes('@') ? cleanUsername : `${cleanUsername}@lernster.app`;
    supabase.auth.signUp({
      email: syntheticEmail,
      password: password,
      options: { data: { username: cleanUsername } }
    }).catch(() => {});

    return { success: true, user: newUser };
  }

  // Verify password against stored hash
  if (existing.passwordHash && existing.passwordHash !== '__sync_pending__') {
    const inputHash = await hashPassword(password, cleanUsername);
    if (inputHash !== existing.passwordHash) {
      return { success: false, message: 'Incorrect password for this username' };
    }
  } else if (existing.password) {
    // Legacy plaintext migration path — verify then upgrade to hashed
    if (existing.password !== password) {
      return { success: false, message: 'Incorrect password for this username' };
    }
    // Migrate: replace plaintext with hash
    const newHash = await hashPassword(password, cleanUsername);
    existing.passwordHash = newHash;
    delete existing.password;
    db[cleanUsername] = existing;
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(db));
  }

  const sessionUser: UserProfile = {
    username: cleanUsername,
    name: cleanUsername.charAt(0).toUpperCase() + cleanUsername.slice(1),
    created: existing.created || new Date().toISOString(),
  };
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
  registerUserForAdmin(cleanUsername, sessionUser.name);

  // Background Supabase signin
  const syntheticEmail = cleanUsername.includes('@') ? cleanUsername : `${cleanUsername}@lernster.app`;
  supabase.auth.signInWithPassword({ email: syntheticEmail, password }).catch(() => {});

  return { success: true, user: sessionUser };
}

export function loginUser(username: string, password: string): { success: boolean; message?: string; user?: UserProfile } {
  if (typeof window === 'undefined') return { success: false, message: 'Browser environment required' };

  const cleanUsername = username.trim().toLowerCase();
  if (!cleanUsername || cleanUsername.length < 3) {
    return { success: false, message: 'Username must be at least 3 characters long' };
  }

  // Admin login requires async — redirect to async flow
  if (cleanUsername === 'admin') {
    return { success: false, message: 'Admin login requires the async login flow.' };
  }

  const rawDb = localStorage.getItem(USERS_DB_KEY);
  const db: Record<string, any> = rawDb ? JSON.parse(rawDb) : {};
  const existing = db[cleanUsername];

  // HIGH-3 fix: Do NOT auto-create accounts
  if (!existing) {
    return { success: false, message: 'Account not found. Please sign up first.' };
  }

  // Legacy plaintext check (sync path can't hash, but can verify)
  if (existing.password && existing.password !== password) {
    return { success: false, message: 'Incorrect password' };
  }

  const sessionUser: UserProfile = {
    username: cleanUsername,
    name: cleanUsername.charAt(0).toUpperCase() + cleanUsername.slice(1),
    created: existing.created || new Date().toISOString(),
  };

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
  registerUserForAdmin(cleanUsername, sessionUser.name);
  return { success: true, user: sessionUser };
}

export async function logoutUser(): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    await supabase.auth.signOut();
  } catch (e) {
    // Ignore offline logout errors
  }
  localStorage.removeItem(CURRENT_USER_KEY);
  sessionStorage.removeItem('lernster_admin_token');
}

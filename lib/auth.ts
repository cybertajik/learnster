import { supabase } from './supabase';

export interface UserProfile {
  username: string;
  email?: string;
  name?: string;
  created: string;
  id?: string;
  isDemo?: boolean;
}

/**
 * Creates an ephemeral, in-memory demo user profile.
 * Demo sessions are never persisted to localStorage or Supabase.
 */
export function createDemoUser(): UserProfile {
  return {
    username: 'demo',
    name: 'Demo Guest',
    created: new Date().toISOString(),
    isDemo: true,
  };
}

const CURRENT_USER_KEY = 'lernster_current_user_v1';
const USERS_DB_KEY = 'lernster_users_db_v1';

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

export async function signupUserAsync(username: string, password: string): Promise<{ success: boolean; message?: string; user?: UserProfile }> {
  if (typeof window === 'undefined') return { success: false, message: 'Browser environment required' };
  
  const cleanUsername = username.trim().toLowerCase();
  if (!cleanUsername || cleanUsername.length < 3) {
    return { success: false, message: 'Username must be at least 3 characters long' };
  }
  if (!password || password.length < 4) {
    return { success: false, message: 'Password must be at least 4 characters long' };
  }

  // Construct valid email format for Supabase Auth if username supplied
  const syntheticEmail = cleanUsername.includes('@') ? cleanUsername : `${cleanUsername}@lernster.app`;

  try {
    // Attempt Supabase Auth Sign Up
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: syntheticEmail,
      password: password,
      options: {
        data: { username: cleanUsername }
      }
    });

    if (authError && authError.message && !authError.message.includes('FetchError') && !authError.message.includes('Failed to fetch')) {
      // If Supabase returns explicit validation error (e.g. user already registered)
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

    // Save to local storage for instant offline access
    const rawDb = localStorage.getItem(USERS_DB_KEY);
    const db: Record<string, any> = rawDb ? JSON.parse(rawDb) : {};
    db[cleanUsername] = {
      username: cleanUsername,
      passwordHash: btoa(password),
      created: createdIso
    };
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(db));
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));

    return { success: true, user: sessionUser };
  } catch (e) {
    // Fallback sync signup
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
    return { success: true, user: sessionUser };
  } catch (e) {
    return { success: false, message: 'Error processing signup' };
  }
}

export async function loginUserAsync(username: string, password: string): Promise<{ success: boolean; message?: string; user?: UserProfile }> {
  if (typeof window === 'undefined') return { success: false, message: 'Browser environment required' };

  const cleanUsername = username.trim().toLowerCase();
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
      return { success: true, user: sessionUser };
    }

    // If Supabase login fails or offline, attempt local login
    return loginUser(username, password);
  } catch (e) {
    return loginUser(username, password);
  }
}

export function loginUser(username: string, password: string): { success: boolean; message?: string; user?: UserProfile } {
  if (typeof window === 'undefined') return { success: false, message: 'Browser environment required' };

  const cleanUsername = username.trim().toLowerCase();
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
    return { success: true, user: sessionUser };
  } catch (e) {
    return { success: false, message: 'Error logging in' };
  }
}

export async function logoutUser(isDemo?: boolean): Promise<void> {
  if (typeof window === 'undefined') return;
  if (isDemo) {
    // Demo sessions never touch Supabase or localStorage; nothing to clean up.
    return;
  }
  try {
    await supabase.auth.signOut();
  } catch (e) {
    // Ignore offline logout errors
  }
  localStorage.removeItem(CURRENT_USER_KEY);
}

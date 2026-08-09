export interface UserProfile {
  username: string;
  name?: string;
  created: string;
}

const CURRENT_USER_KEY = 'spanishly_current_user_v1';
const USERS_DB_KEY = 'spanishly_users_db_v1';

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
      passwordHash: btoa(password), // Simple encoding for local MVP auth
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

export function logoutUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CURRENT_USER_KEY);
}

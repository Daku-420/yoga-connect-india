import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fpzfnbrgxgegujcijahx.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY_HERE'
);

if (!isSupabaseConfigured && typeof window !== 'undefined') {
  console.info(
    'ℹ️ Supabase anon key not configured yet. Set NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local to enable live database sync.'
  );
}

// Fallback dummy key to prevent client instantiation crash before key is pasted
const activeAnonKey = isSupabaseConfigured ? supabaseAnonKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy';

export const supabase = createClient(supabaseUrl, activeAnonKey);

/**
 * Sign in with Google (Gmail) OAuth
 * Redirects to Google consent screen and returns to /auth/callback
 */
export async function signInWithGoogle(returnPath?: string) {
  if (!isSupabaseConfigured) {
    return { data: null, error: new Error('Supabase is not configured yet with a valid anon key in .env.local.') };
  }

  // Ensure callback URL points to the dedicated /auth/callback route
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const safeNext = returnPath && returnPath.startsWith('/') && !returnPath.startsWith('//') ? returnPath : '/';
  const callbackUrl = `${origin}/auth/callback?next=${encodeURIComponent(safeNext)}`;

  return await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: callbackUrl,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });
}

/**
 * Request a 6-digit One-Time Password (OTP) sent to the user's email
 */
export async function sendEmailOtp(email: string) {
  if (!isSupabaseConfigured) {
    return { data: null, error: new Error('Supabase configuration missing in .env.local.') };
  }
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}` : undefined,
    },
  });
  return { data, error };
}

/**
 * Verify the 6-digit OTP token entered by the user
 */
export async function verifyEmailOtp(email: string, token: string) {
  if (!isSupabaseConfigured) {
    return { data: null, error: new Error('Supabase configuration missing in .env.local.') };
  }
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  });
  return { data, error };
}

/**
 * Sign in using Email and Password
 */
export async function signInWithEmailPassword(email: string, password: string) {
  if (!isSupabaseConfigured) {
    return { data: null, error: new Error('Supabase is not configured.') };
  }
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

/**
 * Sign up using Email and Password
 */
export async function signUpWithEmailPassword(email: string, password: string, fullName?: string) {
  if (!isSupabaseConfigured) {
    return { data: null, error: new Error('Supabase is not configured.') };
  }
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName || email.split('@')[0],
        name: fullName || email.split('@')[0],
      },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });
}

/**
 * Request password reset email
 */
export async function sendPasswordReset(email: string) {
  if (!isSupabaseConfigured) {
    return { data: null, error: new Error('Supabase is not configured.') };
  }
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?type=recovery`,
  });
}

/**
 * Sign out the currently active user
 */
export async function signOutUser() {
  if (!isSupabaseConfigured) {
    return { error: null };
  }
  return await supabase.auth.signOut();
}

/**
 * Fetch trusted user profile and centre membership from Supabase
 */
export async function fetchUserAuthorisation(userId: string, email: string) {
  if (!isSupabaseConfigured) {
    return null;
  }

  try {
    // 1. Fetch profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, email, full_name, avatar_url, role')
      .eq('id', userId)
      .maybeSingle();

    const role = profile?.role || 'user';

    // 2. Fetch centre membership
    const { data: membership } = await supabase
      .from('centre_memberships')
      .select('id, centre_id, role, status, centres(id, name)')
      .eq('user_id', userId)
      .eq('status', 'active')
      .maybeSingle();

    return {
      profile,
      role: (role === 'admin' ? 'admin' : (membership ? 'centre' : role)) as 'admin' | 'centre' | 'user',
      membership,
      assignedCentreId: membership?.centre_id || null,
      assignedCentreName: (membership?.centres as any)?.name || null
    };
  } catch (err) {
    console.error('Error fetching user authorisation:', err);
    return null;
  }
}


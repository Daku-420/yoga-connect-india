import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rrsisnnusllokxceszsu.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_Ha8MDnX3TyqQlYXa4erYSg_9PLfhrRD';

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
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: origin ? `${origin}/auth/callback` : undefined,
    },
  });

  if (error) {
    const msg = error.message || '';
    if (msg.toLowerCase().includes('rate limit') || (error as any).status === 429) {
      return {
        data: null,
        error: new Error(
          'Email provider hourly rate limit reached. Please use Password login or Continue with Google for instant access.'
        ),
      };
    }
    return { data, error };
  }

  return { data, error: null };
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
 * Automatically establishes an authenticated session immediately
 */
export async function signUpWithEmailPassword(email: string, password: string, fullName?: string) {
  if (!isSupabaseConfigured) {
    return { data: null, error: new Error('Supabase is not configured.') };
  }
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const signUpRes = await supabase.auth.signUp({
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

  if (signUpRes.error) {
    return signUpRes;
  }

  // If user was created, verify or establish session right away so user is immediately logged in
  if (!signUpRes.data?.session && signUpRes.data?.user) {
    const signInRes = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (signInRes.data?.session) {
      return signInRes;
    }
  }

  return signUpRes;
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

/**
 * Fetch all registered centres from Supabase
 */
export async function fetchLiveCentres() {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from('centres')
      .select('*')
      .order('sponsored_rank', { ascending: true });
    if (error) {
      console.warn('Error fetching centres from Supabase:', error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.warn('Network error fetching centres:', err);
    return [];
  }
}

/**
 * Fetch all courses from Supabase
 */
export async function fetchLiveCourses() {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('price_usd', { ascending: true });
    if (error) {
      console.warn('Error fetching courses from Supabase:', error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.warn('Network error fetching courses:', err);
    return [];
  }
}

/**
 * Fetch bookings with strict RLS enforcement (Admin gets all, Vendors get assigned)
 */
export async function fetchLiveBookings() {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.warn('Error fetching bookings from Supabase:', error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.warn('Network error fetching bookings:', err);
    return [];
  }
}

/**
 * Update booking status and permitted notes
 */
export async function updateBookingInDb(bookingId: string, updates: { status?: string; payment_status?: string; vendor_notes?: string; admin_notes?: string }) {
  if (!isSupabaseConfigured) return { success: false, error: 'Database not connected' };
  try {
    const { error } = await supabase
      .from('bookings')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', bookingId);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update booking' };
  }
}

/**
 * Fetch enquiries assigned to centre or all enquiries if admin
 */
export async function fetchLiveEnquiries() {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.warn('Error fetching enquiries from Supabase:', error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.warn('Network error fetching enquiries:', err);
    return [];
  }
}

/**
 * Update enquiry status or internal notes
 */
export async function updateEnquiryInDb(enquiryId: string, updates: { status?: string; internal_notes?: string; last_contacted_at?: string }) {
  if (!isSupabaseConfigured) return { success: false, error: 'Database not connected' };
  try {
    const { error } = await supabase
      .from('enquiries')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', enquiryId);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update enquiry' };
  }
}

/**
 * Fetch financial ledger entries
 */
export async function fetchLiveLedger() {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from('financial_ledger')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.warn('Error fetching ledger from Supabase:', error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.warn('Network error fetching ledger:', err);
    return [];
  }
}

/**
 * Fetch payouts
 */
export async function fetchLivePayouts() {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from('payouts')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.warn('Error fetching payouts from Supabase:', error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.warn('Network error fetching payouts:', err);
    return [];
  }
}

/**
 * Fetch commission rules
 */
export async function fetchLiveCommissionRules() {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from('commission_rules')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.warn('Error fetching commission rules from Supabase:', error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.warn('Network error fetching commission rules:', err);
    return [];
  }
}

/**
 * Fetch vendor invitations (Admin only)
 */
export async function fetchLiveVendorInvitations() {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from('vendor_invitations')
      .select('*, centres(id, name)')
      .order('created_at', { ascending: false });
    if (error) {
      console.warn('Error fetching invitations from Supabase:', error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.warn('Network error fetching invitations:', err);
    return [];
  }
}

/**
 * Create a new vendor invitation (Admin only)
 */
export async function createVendorInvitationInDb(
  centreId: string, 
  email: string, 
  role: string = 'owner',
  token?: string,
  expiresAt?: string
) {
  if (!isSupabaseConfigured) return { success: false, error: 'Database not connected' };
  try {
    const { data, error } = await supabase
      .from('vendor_invitations')
      .insert({
        centre_id: centreId,
        email: email.trim().toLowerCase(),
        role: role,
        ...(token ? { token } : {}),
        ...(expiresAt ? { expires_at: expiresAt } : {})
      })
      .select()
      .single();
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, invitation: data };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to create vendor invitation' };
  }
}

/**
 * Revoke vendor invitation
 */
export async function revokeVendorInvitationInDb(invitationId: string) {
  if (!isSupabaseConfigured) return { success: false, error: 'Database not connected' };
  try {
    const { error } = await supabase
      .from('vendor_invitations')
      .update({ status: 'revoked', updated_at: new Date().toISOString() })
      .eq('id', invitationId);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Save / Update Centre Profile in Supabase
 */
export async function saveCentreProfileInDb(centreId: string, updates: Record<string, any>) {
  if (!isSupabaseConfigured) return { success: false, error: 'Database not connected' };
  try {
    const { error } = await supabase
      .from('centres')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', centreId);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save centre profile' };
  }
}

/**
 * Record immutable audit log
 */
export async function recordAuditLogInDb(action: string, targetEntity: string, targetId?: string, details?: any) {
  if (!isSupabaseConfigured) return;
  try {
    const { data: { session } } = await supabase.auth.getSession();
    await supabase.from('audit_logs').insert({
      actor_id: session?.user?.id || null,
      actor_email: session?.user?.email || null,
      action,
      target_entity: targetEntity,
      target_id: targetId || null,
      details: details || {}
    });
  } catch (err) {
    console.warn('Failed to record audit log:', err);
  }
}
/**
 * Fetch all user profiles (Admin)
 */
export async function fetchLiveProfiles() {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.warn('Error fetching profiles from Supabase:', error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.warn('Network error fetching profiles:', err);
    return [];
  }
}

/**
 * Update user profile / preferences in Supabase
 */
export async function updateProfileInDb(userId: string, updates: Record<string, any>) {
  if (!isSupabaseConfigured) return { success: false, error: 'Database not connected' };
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update profile' };
  }
}

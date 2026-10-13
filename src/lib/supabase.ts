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

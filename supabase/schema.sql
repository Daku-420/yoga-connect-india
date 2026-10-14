-- ==========================================================
-- YogaConnect India - Supabase PostgreSQL Schema
-- ==========================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================================
-- 2. TABLE: centres (Yoga Centres & Ashrams)
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.centres (
  id TEXT PRIMARY KEY DEFAULT 'centre-' || uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  cover_image TEXT,
  photos TEXT[] DEFAULT '{}',
  styles TEXT[] DEFAULT '{}',
  facilities TEXT[] DEFAULT '{}',
  certification TEXT DEFAULT 'Yoga Alliance USA',
  sponsored_rank INT DEFAULT 1,
  commission_rate_percent INT DEFAULT 15,
  faqs JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================================
-- 3. TABLE: courses (TTC, Retreats, Ayurveda Programs)
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.courses (
  id TEXT PRIMARY KEY DEFAULT 'course-' || uuid_generate_v4(),
  centre_id TEXT REFERENCES public.centres(id) ON DELETE CASCADE,
  centre_name TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  category TEXT NOT NULL, -- '200h-ttc', '300h-ttc', 'meditation', 'ayurveda'
  duration_days INT NOT NULL DEFAULT 14,
  price_usd NUMERIC NOT NULL,
  certification TEXT,
  syllabus TEXT[] DEFAULT '{}',
  daily_schedule JSONB DEFAULT '[]'::jsonb,
  meals_included TEXT DEFAULT '3 Sattvic Meals Daily',
  accommodation_options TEXT[] DEFAULT '{}',
  upcoming_dates TEXT[] DEFAULT '{}',
  photos TEXT[] DEFAULT '{}',
  requirements TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================================
-- 4. TABLE: bookings (Inquiries & Escrow Protection)
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY DEFAULT 'bk-' || uuid_generate_v4(),
  reference_code TEXT UNIQUE NOT NULL,
  centre_id TEXT REFERENCES public.centres(id) ON DELETE SET NULL,
  centre_name TEXT NOT NULL,
  course_id TEXT REFERENCES public.courses(id) ON DELETE SET NULL,
  course_title TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  customer_country TEXT,
  start_date TEXT NOT NULL,
  room_type TEXT,
  airport_pickup BOOLEAN DEFAULT false,
  total_usd NUMERIC NOT NULL,
  centre_payout_usd NUMERIC,
  commission_fee_usd NUMERIC,
  status TEXT DEFAULT 'pending_admin', -- 'pending_admin', 'assigned_to_centre', 'confirmed_paid', 'cancelled'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================================
-- 5. TABLE: asanas (Yoga Asana Encyclopedia)
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.asanas (
  id TEXT PRIMARY KEY,
  english_name TEXT NOT NULL,
  sanskrit_name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  pronunciation TEXT,
  summary TEXT NOT NULL,
  cover_image TEXT,
  steps TEXT[] DEFAULT '{}',
  benefits TEXT[] DEFAULT '{}',
  contraindications TEXT[] DEFAULT '{}',
  anatomical_focus TEXT[] DEFAULT '{}',
  faqs JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================================
-- 6. TABLE: matchmaker_leads (AI Quiz Inquiries)
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.matchmaker_leads (
  id TEXT PRIMARY KEY DEFAULT 'lead-' || uuid_generate_v4(),
  reference_code TEXT UNIQUE NOT NULL,
  centre_id TEXT REFERENCES public.centres(id) ON DELETE SET NULL,
  centre_name TEXT NOT NULL,
  recommended_course_id TEXT,
  recommended_course_title TEXT,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_whatsapp TEXT,
  preferred_dates TEXT,
  participants_count INT DEFAULT 1,
  summary_preferences JSONB DEFAULT '{}'::jsonb,
  raw_answers JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'new', -- 'new', 'contacted', 'converted', 'archived'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================================
-- 7. Row Level Security (RLS) Configuration
-- ==========================================================
ALTER TABLE public.centres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asanas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matchmaker_leads ENABLE ROW LEVEL SECURITY;

-- Public Read Policies (Visitors can view centres, courses, and asanas)
CREATE POLICY "Public read centres" ON public.centres FOR SELECT USING (true);
CREATE POLICY "Public read courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Public read asanas" ON public.asanas FOR SELECT USING (true);

-- Public Insert Policies (Travelers can submit inquiries & quiz leads)
CREATE POLICY "Public insert bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert matchmaker leads" ON public.matchmaker_leads FOR INSERT WITH CHECK (true);

-- Authenticated / Admin full access
CREATE POLICY "Admin all centres" ON public.centres FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Admin all courses" ON public.courses FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Admin all bookings" ON public.bookings FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Admin all asanas" ON public.asanas FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "Admin all leads" ON public.matchmaker_leads FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- ==========================================================
-- 8. TABLE: profiles (Traveler Profiles synced with auth.users)
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  country TEXT,
  role TEXT DEFAULT 'user', -- 'user', 'centre', 'admin'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS: Users can view and update their own profile
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT TO authenticated
  USING ((select auth.uid()) = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "Public profile insert trigger" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK ((select auth.uid()) = id);

-- Trigger function: Automatically populates public.profiles when a user signs up
-- via Gmail OAuth (Google) or Email OTP in Supabase Auth.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    'user'
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
    updated_at = NOW();
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Security Enforcement: Prevent users from escalating their own role in public.profiles
CREATE OR REPLACE FUNCTION public.protect_profile_roles()
RETURNS TRIGGER AS $$
BEGIN
  -- Disallow modifying the role column unless executing with service_role privileges
  IF NEW.role IS DISTINCT FROM OLD.role AND (auth.role() <> 'service_role') THEN
    RAISE EXCEPTION 'Unauthorized: Account role cannot be modified by the user.';
  END IF;
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_protect_profile_roles ON public.profiles;
CREATE TRIGGER tr_protect_profile_roles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_profile_roles();

-- ==========================================================
-- 9. GMAIL (GOOGLE) & EMAIL OTP CONFIGURATION NOTES
-- ==========================================================
-- To enable Gmail-based (Google) OAuth login in Supabase:
-- 1. Go to Google Cloud Console (https://console.cloud.google.com/) -> APIs & Services -> Credentials
-- 2. Create an OAuth 2.0 Client ID (Web Application)
-- 3. In Authorized Redirect URIs, add:
--    https://<YOUR-PROJECT-ID>.supabase.co/auth/v1/callback
-- 4. In Supabase Dashboard -> Authentication -> Providers -> Google:
--    - Enable Google provider
--    - Paste your Google Client ID and Google Client Secret
--
-- To enable Email OTP login:
-- In Supabase Dashboard -> Authentication -> Providers -> Email:
-- - Ensure 'Enable Email provider' is ON
-- - Enable 'Confirm email' or 'Sign in with OTP'

-- ==========================================================
-- 10. TABLE: centre_memberships
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.centre_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  centre_id TEXT NOT NULL REFERENCES public.centres(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'owner' CHECK (role IN ('owner', 'manager', 'accountant')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'inactive')),
  assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_centre_user UNIQUE (user_id, centre_id)
);

CREATE INDEX IF NOT EXISTS idx_centre_memberships_user_id ON public.centre_memberships (user_id);
CREATE INDEX IF NOT EXISTS idx_centre_memberships_centre_id ON public.centre_memberships (centre_id);
CREATE INDEX IF NOT EXISTS idx_centre_memberships_status ON public.centre_memberships (status);

-- Security Helper Functions
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, auth
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = (SELECT auth.uid()) 
      AND role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.has_centre_access(check_centre_id TEXT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, auth
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.centre_memberships
    WHERE user_id = (SELECT auth.uid())
      AND centre_id = check_centre_id
      AND status = 'active'
  ) OR public.is_admin();
$$;

-- ==========================================================
-- 11. TABLE: payouts
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_code TEXT UNIQUE NOT NULL,
  centre_id TEXT NOT NULL REFERENCES public.centres(id) ON DELETE CASCADE,
  gross_amount NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (gross_amount >= 0),
  commission_deducted NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (commission_deducted >= 0),
  refunds_deducted NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (refunds_deducted >= 0),
  net_payout_amount NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (net_payout_amount >= 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'paid', 'failed', 'reversed')),
  settlement_reference TEXT,
  payout_method TEXT DEFAULT 'bank_transfer',
  period_start DATE,
  period_end DATE,
  notes TEXT,
  processed_by UUID REFERENCES auth.users(id),
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payouts_centre_id ON public.payouts (centre_id);
CREATE INDEX IF NOT EXISTS idx_payouts_status ON public.payouts (status);

-- ==========================================================
-- 12. TABLE: payments
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id TEXT REFERENCES public.bookings(id) ON DELETE SET NULL,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  payment_method TEXT DEFAULT 'credit_card',
  provider TEXT DEFAULT 'escrow_platform',
  provider_transaction_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'succeeded' CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded', 'disputed')),
  idempotency_key TEXT UNIQUE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON public.payments (booking_id);

-- ==========================================================
-- 13. TABLE: financial_ledger (APPEND-ONLY)
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.financial_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_number BIGSERIAL,
  centre_id TEXT NOT NULL REFERENCES public.centres(id) ON DELETE CASCADE,
  booking_id TEXT REFERENCES public.bookings(id) ON DELETE SET NULL,
  payout_id UUID REFERENCES public.payouts(id) ON DELETE SET NULL,
  entry_type TEXT NOT NULL CHECK (entry_type IN (
    'booking_charge', 
    'platform_commission', 
    'refund', 
    'payout', 
    'adjustment', 
    'fee_reversal',
    'tax_fee'
  )),
  entry_direction TEXT NOT NULL CHECK (entry_direction IN ('credit', 'debit')),
  amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  description TEXT NOT NULL,
  reference_code TEXT,
  status TEXT NOT NULL DEFAULT 'posted' CHECK (status IN ('posted', 'pending', 'reversed')),
  actor_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ledger_centre_id ON public.financial_ledger (centre_id);
CREATE INDEX IF NOT EXISTS idx_ledger_booking_id ON public.financial_ledger (booking_id);

CREATE OR REPLACE FUNCTION public.prevent_ledger_modification()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Financial ledger entries are strictly immutable. Updates or deletions are forbidden.';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_prevent_ledger_mod ON public.financial_ledger;
CREATE TRIGGER tr_prevent_ledger_mod
  BEFORE UPDATE OR DELETE ON public.financial_ledger
  FOR EACH ROW EXECUTE FUNCTION public.prevent_ledger_modification();

-- ==========================================================
-- 14. TABLE: financial_queries
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.financial_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  centre_id TEXT NOT NULL REFERENCES public.centres(id) ON DELETE CASCADE,
  partner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_review', 'resolved')),
  admin_response TEXT,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================================
-- 15. TABLE: audit_logs
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES auth.users(id),
  actor_email TEXT,
  action TEXT NOT NULL,
  target_entity TEXT NOT NULL,
  target_id TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION public.prevent_audit_log_modification()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Audit logs are immutable and cannot be edited or deleted.';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_prevent_audit_mod ON public.audit_logs;
CREATE TRIGGER tr_prevent_audit_mod
  BEFORE UPDATE OR DELETE ON public.audit_logs
  FOR EACH ROW EXECUTE FUNCTION public.prevent_audit_log_modification();

-- ==========================================================
-- 16. RLS FOR NEW TABLES
-- ==========================================================
ALTER TABLE public.centre_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Memberships read own or admin" ON public.centre_memberships
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()) OR public.is_admin());

CREATE POLICY "Memberships admin manage" ON public.centre_memberships
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Ledger centre partner read assigned" ON public.financial_ledger
  FOR SELECT TO authenticated
  USING (public.has_centre_access(centre_id));

CREATE POLICY "Ledger admin insert" ON public.financial_ledger
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Payouts centre partner read assigned" ON public.payouts
  FOR SELECT TO authenticated
  USING (public.has_centre_access(centre_id));

CREATE POLICY "Payouts admin manage" ON public.payouts
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Queries partner read" ON public.financial_queries
  FOR SELECT TO authenticated
  USING (partner_id = (SELECT auth.uid()) OR public.is_admin());

CREATE POLICY "Queries partner insert" ON public.financial_queries
  FOR INSERT TO authenticated
  WITH CHECK (public.has_centre_access(centre_id) AND partner_id = (SELECT auth.uid()));

CREATE POLICY "Queries manage" ON public.financial_queries
  FOR UPDATE TO authenticated
  USING (public.is_admin() OR partner_id = (SELECT auth.uid()))
  WITH CHECK (public.is_admin() OR partner_id = (SELECT auth.uid()));

CREATE POLICY "Audit logs admin read" ON public.audit_logs
  FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE POLICY "Audit logs admin insert" ON public.audit_logs
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());



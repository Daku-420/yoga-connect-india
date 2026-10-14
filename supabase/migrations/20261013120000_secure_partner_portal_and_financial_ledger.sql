-- ==========================================================
-- YogaConnect India - Migration: Secure Role-Based Partner Portal & Financial Ledger
-- Migration Timestamp: 20261013120000
-- ==========================================================

-- 1. Ensure required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================================
-- 2. TABLE: centre_memberships
-- Associates authenticated Supabase users with specific yoga centres
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

-- ==========================================================
-- 3. SECURITY HELPER FUNCTIONS
-- Secure functions with explicit search_path preventing recursion and elevation
-- ==========================================================

-- Check if current authenticated user has platform admin role
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

-- Check if current user has active membership access to the specified centre
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

-- Get the authorised centre IDs for current authenticated user
CREATE OR REPLACE FUNCTION public.get_my_authorised_centre_ids()
RETURNS TABLE (centre_id TEXT)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, auth
STABLE
AS $$
  SELECT cm.centre_id
  FROM public.centre_memberships cm
  WHERE cm.user_id = (SELECT auth.uid())
    AND cm.status = 'active';
$$;

-- ==========================================================
-- 4. ENHANCE centres TABLE
-- Add payout bank details & contact fields
-- ==========================================================
ALTER TABLE public.centres 
  ADD COLUMN IF NOT EXISTS bank_account_details JSONB DEFAULT '{
    "accountHolderName": "",
    "bankName": "",
    "accountNumberMasked": "",
    "ifscOrSwift": "",
    "isVerified": false
  }'::jsonb,
  ADD COLUMN IF NOT EXISTS contact_email TEXT,
  ADD COLUMN IF NOT EXISTS contact_phone TEXT,
  ADD COLUMN IF NOT EXISTS commission_terms_notes TEXT DEFAULT 'Standard 15% Escrow commission rate.';

-- ==========================================================
-- 5. TABLE: payouts
-- Settlement records for yoga centres
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
CREATE INDEX IF NOT EXISTS idx_payouts_reference_code ON public.payouts (reference_code);

-- ==========================================================
-- 6. TABLE: payments
-- Verified customer payments linked to bookings
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
CREATE INDEX IF NOT EXISTS idx_payments_provider_tx ON public.payments (provider_transaction_id);

-- ==========================================================
-- 7. TABLE: financial_ledger (IMMUTABLE APPEND-ONLY)
-- Double-entry-style immutable ledger of all financial movements
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
CREATE INDEX IF NOT EXISTS idx_ledger_payout_id ON public.financial_ledger (payout_id);
CREATE INDEX IF NOT EXISTS idx_ledger_entry_type ON public.financial_ledger (entry_type);
CREATE INDEX IF NOT EXISTS idx_ledger_created_at ON public.financial_ledger (created_at);

-- Trigger to guarantee that the financial ledger is strictly append-only (no UPDATE, no DELETE)
CREATE OR REPLACE FUNCTION public.prevent_ledger_modification()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Financial ledger entries are strictly immutable. Updates or deletions are forbidden. Record an authorized adjustment or reversal entry instead.';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_prevent_ledger_mod ON public.financial_ledger;
CREATE TRIGGER tr_prevent_ledger_mod
  BEFORE UPDATE OR DELETE ON public.financial_ledger
  FOR EACH ROW EXECUTE FUNCTION public.prevent_ledger_modification();

-- ==========================================================
-- 8. TABLE: financial_queries
-- Allows partners to raise accounting/commission tickets to admin
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

CREATE INDEX IF NOT EXISTS idx_financial_queries_centre ON public.financial_queries (centre_id);
CREATE INDEX IF NOT EXISTS idx_financial_queries_partner ON public.financial_queries (partner_id);

-- ==========================================================
-- 9. TABLE: audit_logs
-- Immutable log of security, role, financial, and access events
-- ==========================================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES auth.users(id),
  actor_email TEXT,
  action TEXT NOT NULL, -- e.g., 'partner_account_assigned', 'partner_status_changed', 'payout_processed', 'ledger_adjustment_created'
  target_entity TEXT NOT NULL,
  target_id TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs (actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs (action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.audit_logs (created_at);

-- Trigger to prevent modification/deletion of audit logs
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
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================================

-- Enable RLS on all newly created tables
ALTER TABLE public.centre_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------
-- RLS: centre_memberships
-- ----------------------------------------------------------
DROP POLICY IF EXISTS "Memberships read own or admin" ON public.centre_memberships;
CREATE POLICY "Memberships read own or admin" ON public.centre_memberships
  FOR SELECT TO authenticated
  USING (
    user_id = (SELECT auth.uid()) 
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "Memberships admin manage" ON public.centre_memberships;
CREATE POLICY "Memberships admin manage" ON public.centre_memberships
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------
-- RLS: bookings (REPLACES DEPRECATED INSECURE POLICIES)
-- ----------------------------------------------------------
-- Drop legacy overly-permissive policy
DROP POLICY IF EXISTS "Admin all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Bookings customer read own" ON public.bookings;
DROP POLICY IF EXISTS "Bookings centre partner read assigned" ON public.bookings;
DROP POLICY IF EXISTS "Bookings admin manage" ON public.bookings;

-- 1. Customers can read their own bookings (matched by email)
CREATE POLICY "Bookings customer read own" ON public.bookings
  FOR SELECT TO authenticated
  USING (
    customer_email = (SELECT email FROM auth.users WHERE id = (SELECT auth.uid()))
  );

-- 2. Centre partners can read ONLY bookings assigned to their authorised centre
CREATE POLICY "Bookings centre partner read assigned" ON public.bookings
  FOR SELECT TO authenticated
  USING (
    public.has_centre_access(centre_id)
  );

-- 3. Centre partners can update status only for their centre (e.g. check-in, notes)
CREATE POLICY "Bookings centre partner update" ON public.bookings
  FOR UPDATE TO authenticated
  USING (public.has_centre_access(centre_id))
  WITH CHECK (public.has_centre_access(centre_id));

-- 4. Platform administrators have full access
CREATE POLICY "Bookings admin manage" ON public.bookings
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------
-- RLS: financial_ledger
-- ----------------------------------------------------------
DROP POLICY IF EXISTS "Ledger centre partner read assigned" ON public.financial_ledger;
CREATE POLICY "Ledger centre partner read assigned" ON public.financial_ledger
  FOR SELECT TO authenticated
  USING (
    public.has_centre_access(centre_id)
  );

DROP POLICY IF EXISTS "Ledger admin insert" ON public.financial_ledger;
CREATE POLICY "Ledger admin insert" ON public.financial_ledger
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------
-- RLS: payouts
-- ----------------------------------------------------------
DROP POLICY IF EXISTS "Payouts centre partner read assigned" ON public.payouts;
CREATE POLICY "Payouts centre partner read assigned" ON public.payouts
  FOR SELECT TO authenticated
  USING (
    public.has_centre_access(centre_id)
  );

DROP POLICY IF EXISTS "Payouts admin manage" ON public.payouts;
CREATE POLICY "Payouts admin manage" ON public.payouts
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------
-- RLS: payments
-- ----------------------------------------------------------
DROP POLICY IF EXISTS "Payments access" ON public.payments;
CREATE POLICY "Payments access" ON public.payments
  FOR SELECT TO authenticated
  USING (
    public.is_admin() OR 
    EXISTS (
      SELECT 1 FROM public.bookings b 
      WHERE b.id = public.payments.booking_id 
        AND (
          b.customer_email = (SELECT email FROM auth.users WHERE id = (SELECT auth.uid())) 
          OR public.has_centre_access(b.centre_id)
        )
    )
  );

DROP POLICY IF EXISTS "Payments admin manage" ON public.payments;
CREATE POLICY "Payments admin manage" ON public.payments
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------
-- RLS: financial_queries
-- ----------------------------------------------------------
DROP POLICY IF EXISTS "Queries partner read" ON public.financial_queries;
CREATE POLICY "Queries partner read" ON public.financial_queries
  FOR SELECT TO authenticated
  USING (
    partner_id = (SELECT auth.uid()) OR public.is_admin()
  );

DROP POLICY IF EXISTS "Queries partner insert" ON public.financial_queries;
CREATE POLICY "Queries partner insert" ON public.financial_queries
  FOR INSERT TO authenticated
  WITH CHECK (
    public.has_centre_access(centre_id) AND partner_id = (SELECT auth.uid())
  );

DROP POLICY IF EXISTS "Queries manage" ON public.financial_queries;
CREATE POLICY "Queries manage" ON public.financial_queries
  FOR UPDATE TO authenticated
  USING (public.is_admin() OR partner_id = (SELECT auth.uid()))
  WITH CHECK (public.is_admin() OR partner_id = (SELECT auth.uid()));

-- ----------------------------------------------------------
-- RLS: audit_logs
-- ----------------------------------------------------------
DROP POLICY IF EXISTS "Audit logs admin read" ON public.audit_logs;
CREATE POLICY "Audit logs admin read" ON public.audit_logs
  FOR SELECT TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Audit logs admin insert" ON public.audit_logs;
CREATE POLICY "Audit logs admin insert" ON public.audit_logs
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

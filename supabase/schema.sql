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

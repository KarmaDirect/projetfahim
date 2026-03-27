-- ============================================
-- Migration V3: Create missing tables
-- goals, reviews, days_off, work_schedule
-- ============================================

-- 1. Goals table
CREATE TABLE IF NOT EXISTS public.goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  target numeric NOT NULL DEFAULT 0,
  current numeric NOT NULL DEFAULT 0,
  unit text DEFAULT 'seconds',
  deadline date,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own goals" ON public.goals;
CREATE POLICY "Users can view own goals" ON public.goals FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
DROP POLICY IF EXISTS "Users can manage own goals" ON public.goals;
CREATE POLICY "Users can manage own goals" ON public.goals FOR ALL USING (auth.uid() = user_id);

-- 2. Reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
  client_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text DEFAULT '',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view reviews" ON public.reviews;
CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);
DROP POLICY IF EXISTS "Clients can insert reviews" ON public.reviews;
CREATE POLICY "Clients can insert reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = client_id);
DROP POLICY IF EXISTS "Admin can manage reviews" ON public.reviews;
CREATE POLICY "Admin can manage reviews" ON public.reviews FOR ALL USING (public.is_admin());

-- 3. Days off table
CREATE TABLE IF NOT EXISTS public.days_off (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  reason text DEFAULT '',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.days_off ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view days off" ON public.days_off;
CREATE POLICY "Anyone can view days off" ON public.days_off FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin can manage days off" ON public.days_off;
CREATE POLICY "Admin can manage days off" ON public.days_off FOR ALL USING (public.is_admin());

-- 4. Work schedule table
CREATE TABLE IF NOT EXISTS public.work_schedule (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time text NOT NULL DEFAULT '09:00',
  end_time text NOT NULL DEFAULT '18:00',
  is_working boolean NOT NULL DEFAULT true
);
ALTER TABLE public.work_schedule ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view work schedule" ON public.work_schedule;
CREATE POLICY "Anyone can view work schedule" ON public.work_schedule FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin can manage work schedule" ON public.work_schedule;
CREATE POLICY "Admin can manage work schedule" ON public.work_schedule FOR ALL USING (public.is_admin());

-- 5. Insert default work schedule if empty
INSERT INTO public.work_schedule (day_of_week, start_time, end_time, is_working)
SELECT * FROM (VALUES
  (0, '09:00', '18:00', false),
  (1, '09:00', '18:00', true),
  (2, '09:00', '18:00', true),
  (3, '09:00', '18:00', true),
  (4, '09:00', '18:00', true),
  (5, '09:00', '18:00', true),
  (6, '09:00', '18:00', false)
) AS v(day_of_week, start_time, end_time, is_working)
WHERE NOT EXISTS (SELECT 1 FROM public.work_schedule);

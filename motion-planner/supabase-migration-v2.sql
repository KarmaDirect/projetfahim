-- ============================================
-- Migration V2: Order attachments, notification prefs, avatar
-- ============================================

-- 1. Order attachments table
CREATE TABLE IF NOT EXISTS public.order_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
  uploaded_by uuid REFERENCES public.profiles(id),
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_type text DEFAULT 'image',
  file_size integer,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.order_attachments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view order attachments" ON public.order_attachments;
CREATE POLICY "Users can view order attachments"
  ON public.order_attachments FOR SELECT
  USING (
    uploaded_by = auth.uid()
    OR public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_attachments.order_id
      AND orders.client_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert attachments" ON public.order_attachments;
CREATE POLICY "Users can insert attachments"
  ON public.order_attachments FOR INSERT
  WITH CHECK (auth.uid() = uploaded_by);

DROP POLICY IF EXISTS "Admin can delete attachments" ON public.order_attachments;
CREATE POLICY "Admin can delete attachments"
  ON public.order_attachments FOR DELETE
  USING (public.is_admin());

-- 2. Notification preferences table
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  notif_new_order boolean DEFAULT true,
  notif_status_change boolean DEFAULT true,
  notif_messages boolean DEFAULT true,
  notif_email boolean DEFAULT false,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own prefs" ON public.notification_preferences;
CREATE POLICY "Users can view own prefs"
  ON public.notification_preferences FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own prefs" ON public.notification_preferences;
CREATE POLICY "Users can update own prefs"
  ON public.notification_preferences FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own prefs" ON public.notification_preferences;
CREATE POLICY "Users can insert own prefs"
  ON public.notification_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 3. Avatar URL column (if not already added)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url text;

-- 4. Storage RLS for avatars bucket
-- Users can upload to their own folder
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can upload own avatar' AND tablename = 'objects'
  ) THEN
    CREATE POLICY "Users can upload own avatar"
      ON storage.objects FOR INSERT
      WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
  END IF;
END $$;

-- Users can update their own avatar
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own avatar' AND tablename = 'objects'
  ) THEN
    CREATE POLICY "Users can update own avatar"
      ON storage.objects FOR UPDATE
      USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
  END IF;
END $$;

-- Avatars are publicly readable
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Avatars are publicly readable' AND tablename = 'objects'
  ) THEN
    CREATE POLICY "Avatars are publicly readable"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'avatars');
  END IF;
END $$;

-- 5. Storage RLS for order-attachments bucket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Order attachments are readable by auth users' AND tablename = 'objects'
  ) THEN
    CREATE POLICY "Order attachments are readable by auth users"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'order-attachments' AND auth.role() = 'authenticated');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Auth users can upload order attachments' AND tablename = 'objects'
  ) THEN
    CREATE POLICY "Auth users can upload order attachments"
      ON storage.objects FOR INSERT
      WITH CHECK (bucket_id = 'order-attachments' AND auth.role() = 'authenticated');
  END IF;
END $$;

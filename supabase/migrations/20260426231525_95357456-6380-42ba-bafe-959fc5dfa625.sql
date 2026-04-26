-- 1. Extend profiles with role and Miro/Telegram fields
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION WHEN duplicate_object THEN null; END $$;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role public.app_role NOT NULL DEFAULT 'user',
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS username text,
  ADD COLUMN IF NOT EXISTS telegram_id bigint,
  ADD COLUMN IF NOT EXISTS board_id text,
  ADD COLUMN IF NOT EXISTS board_url text,
  ADD COLUMN IF NOT EXISTS miro_token text;

CREATE UNIQUE INDEX IF NOT EXISTS profiles_telegram_id_key ON public.profiles(telegram_id) WHERE telegram_id IS NOT NULL;

-- 2. Security-definer role check (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = _user_id AND role = 'admin'
  );
$$;

-- 3. Admins can read all profiles (for /admin users tab)
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- 4. handle_new_user: insert email + auto-grant admin to designated address
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    CASE WHEN NEW.email = 'kozodaevmaks@gmail.com' THEN 'admin'::public.app_role
         ELSE 'user'::public.app_role END
  )
  ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        role = CASE WHEN EXCLUDED.email = 'kozodaevmaks@gmail.com' THEN 'admin'::public.app_role
                    ELSE public.profiles.role END;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Backfill emails for existing profiles + promote admin if already exists
UPDATE public.profiles p
SET email = u.email,
    role = CASE WHEN u.email = 'kozodaevmaks@gmail.com' THEN 'admin'::public.app_role ELSE p.role END
FROM auth.users u
WHERE p.id = u.id AND (p.email IS NULL OR p.email <> u.email OR u.email = 'kozodaevmaks@gmail.com');

-- 6. Funnel + messages-per-day RPCs for /admin
CREATE OR REPLACE FUNCTION public.get_admin_funnel()
RETURNS TABLE(stage text, count bigint, ord int)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 'Зарегистрировались'::text, COUNT(*)::bigint, 1 FROM public.profiles
  UNION ALL
  SELECT 'Активировали бота'::text, COUNT(*)::bigint, 2 FROM public.profiles WHERE telegram_id IS NOT NULL
  UNION ALL
  SELECT 'Подключили доску'::text, COUNT(*)::bigint, 3 FROM public.profiles WHERE board_id IS NOT NULL
  UNION ALL
  SELECT 'Отправили сообщение'::text, COUNT(DISTINCT telegram_id)::bigint, 4 FROM public.messages
  ORDER BY 3;
$$;

CREATE OR REPLACE FUNCTION public.get_messages_per_day()
RETURNS TABLE(day date, count bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    d::date AS day,
    COALESCE(c.cnt, 0)::bigint AS count
  FROM generate_series(
    (current_date - interval '6 days')::date,
    current_date,
    interval '1 day'
  ) d
  LEFT JOIN (
    SELECT date_trunc('day', created_at)::date AS day, count(*) AS cnt
    FROM public.messages
    WHERE created_at >= (current_date - interval '6 days')
    GROUP BY 1
  ) c ON c.day = d::date
  ORDER BY d;
$$;

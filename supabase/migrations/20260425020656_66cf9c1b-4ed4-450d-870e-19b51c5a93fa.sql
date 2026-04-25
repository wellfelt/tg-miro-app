-- Total users count (aggregate only, no PII)
CREATE OR REPLACE FUNCTION public.get_total_users()
RETURNS bigint
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT count(*)::bigint FROM auth.users;
$$;

-- Daily signups for last 7 days (aggregate only)
CREATE OR REPLACE FUNCTION public.get_signups_per_day()
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
    FROM auth.users
    WHERE created_at >= (current_date - interval '6 days')
    GROUP BY 1
  ) c ON c.day = d::date
  ORDER BY d;
$$;

GRANT EXECUTE ON FUNCTION public.get_total_users() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_signups_per_day() TO anon, authenticated;
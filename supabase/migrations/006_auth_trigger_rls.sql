-- Auto-create merchants row on new auth signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  base_slug TEXT;
  candidate TEXT;
  counter   INT := 0;
BEGIN
  -- Derive base slug from email prefix, lowercased, non-alphanumeric → hyphens
  base_slug := regexp_replace(
    lower(split_part(NEW.email, '@', 1)),
    '[^a-z0-9]+', '-', 'g'
  );

  -- Ensure slug uniqueness
  candidate := base_slug;
  LOOP
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.merchants WHERE slug = candidate);
    counter   := counter + 1;
    candidate := base_slug || '-' || counter;
  END LOOP;

  INSERT INTO public.merchants (id, email, business_name, slug, provisioning_status, is_active)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'business_name', split_part(NEW.email, '@', 1)),
    candidate,
    'pending',
    TRUE
  );

  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- RLS policies for merchants table (RLS already enabled in 001_initial_schema.sql)

CREATE POLICY "Merchants can view own data"
  ON merchants FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Merchants can update own data"
  ON merchants FOR UPDATE
  USING (auth.uid() = id);

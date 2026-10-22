CREATE TABLE public.nuggets (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 title text NOT NULL DEFAULT '',
 content text NOT NULL DEFAULT '',
 date date NOT NULL DEFAULT CURRENT_DATE,
 image_url text,
 video_url text,
 published boolean NOT NULL DEFAULT false,
 author_id uuid NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.nuggets TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.nuggets TO authenticated;
GRANT ALL ON public.nuggets TO service_role;
ALTER TABLE public.nuggets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Visitors can read published nuggets" ON public.nuggets FOR SELECT TO anon USING (published = true);
CREATE POLICY "Site editors can read nuggets" ON public.nuggets FOR SELECT TO authenticated USING (true);
CREATE POLICY "Site editors can create nuggets" ON public.nuggets FOR INSERT TO authenticated WITH CHECK (author_id = auth.uid());
CREATE POLICY "Site editors can edit nuggets" ON public.nuggets FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Site editors can remove nuggets" ON public.nuggets FOR DELETE TO authenticated USING (true);
CREATE TRIGGER update_nuggets_updated_at BEFORE UPDATE ON public.nuggets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX nuggets_published_date_idx ON public.nuggets (date DESC, created_at DESC) WHERE published = true;
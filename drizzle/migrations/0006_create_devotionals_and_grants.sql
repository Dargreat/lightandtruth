-- Create devotionals table for daily devotionals
CREATE TABLE public.devotionals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  scripture_reference TEXT,
  date DATE NOT NULL,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Grants required for Data API access
GRANT SELECT, INSERT, UPDATE, DELETE ON public.posts TO authenticated;
GRANT SELECT ON public.posts TO anon;
GRANT ALL ON public.posts TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.comments TO authenticated;
GRANT SELECT, INSERT ON public.comments TO anon;
GRANT ALL ON public.comments TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.bible_verses TO authenticated;
GRANT SELECT ON public.bible_verses TO anon;
GRANT ALL ON public.bible_verses TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT SELECT ON public.categories TO anon;
GRANT ALL ON public.categories TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.newsletter_subscribers TO authenticated;
GRANT INSERT ON public.newsletter_subscribers TO anon;
GRANT ALL ON public.newsletter_subscribers TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.videos TO authenticated;
GRANT SELECT ON public.videos TO anon;
GRANT ALL ON public.videos TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.devotionals TO authenticated;
GRANT SELECT ON public.devotionals TO anon;
GRANT ALL ON public.devotionals TO service_role;

-- Enable RLS
ALTER TABLE public.devotionals ENABLE ROW LEVEL SECURITY;

-- Create policies for devotionals
CREATE POLICY "Anyone can view published devotionals" 
ON public.devotionals 
FOR SELECT 
USING (published = true);

CREATE POLICY "Authenticated users can manage devotionals" 
ON public.devotionals 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create trigger for devotionals updated_at
CREATE TRIGGER update_devotionals_updated_at
BEFORE UPDATE ON public.devotionals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
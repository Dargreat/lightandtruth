-- Create table for daily bible verses
CREATE TABLE public.bible_verses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  verse_text TEXT NOT NULL,
  verse_reference TEXT NOT NULL,
  date DATE NOT NULL UNIQUE,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.bible_verses ENABLE ROW LEVEL SECURITY;

-- Create policies for bible verses
CREATE POLICY "Anyone can view active bible verses" 
ON public.bible_verses 
FOR SELECT 
USING (active = true);

CREATE POLICY "Authenticated users can manage bible verses" 
ON public.bible_verses 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Add video_url column to posts table
ALTER TABLE public.posts 
ADD COLUMN video_url TEXT;

-- Create trigger for bible verses timestamp updates
CREATE TRIGGER update_bible_verses_updated_at
BEFORE UPDATE ON public.bible_verses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
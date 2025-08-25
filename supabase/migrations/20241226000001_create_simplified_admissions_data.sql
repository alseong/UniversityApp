-- Create simplified admissions data table
CREATE TABLE IF NOT EXISTS public.admissions_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  university_attendance TEXT,
  high_school TEXT,
  universities JSONB NOT NULL DEFAULT '[]'::jsonb,
  grades JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one record per user
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.admissions_data ENABLE ROW LEVEL SECURITY;

-- Policies for admissions_data
CREATE POLICY "Users can view own admissions data" ON public.admissions_data 
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own admissions data" ON public.admissions_data 
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own admissions data" ON public.admissions_data 
FOR UPDATE USING (auth.uid() = user_id);

-- Create an updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_admissions_data_updated_at
BEFORE UPDATE ON public.admissions_data
FOR EACH ROW
EXECUTE PROCEDURE public.handle_updated_at();

-- Add indexes for performance
CREATE INDEX admissions_data_user_id_idx ON public.admissions_data(user_id);
CREATE INDEX admissions_data_updated_at_idx ON public.admissions_data(updated_at); 
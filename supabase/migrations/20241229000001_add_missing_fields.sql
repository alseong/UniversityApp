-- Add missing fields to admissions_data table
ALTER TABLE public.admissions_data 
ADD COLUMN IF NOT EXISTS high_school TEXT,
ADD COLUMN IF NOT EXISTS avg_grade_11 TEXT,
ADD COLUMN IF NOT EXISTS avg_grade_12 TEXT; 
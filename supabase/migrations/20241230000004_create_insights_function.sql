-- Create a function to get all admissions data for insights (bypasses RLS)
CREATE OR REPLACE FUNCTION public.get_all_admissions_for_insights()
RETURNS TABLE (
  id UUID,
  user_id UUID,
  university_attendance TEXT,
  high_school TEXT,
  avg_grade_11 TEXT,
  avg_grade_12 TEXT,
  universities JSONB,
  grades JSONB,
  other_achievements TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER -- This allows the function to bypass RLS
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ad.id,
    ad.user_id,
    ad.university_attendance,
    ad.high_school,
    ad.avg_grade_11,
    ad.avg_grade_12,
    ad.universities,
    ad.grades,
    ad.other_achievements,
    ad.created_at,
    ad.updated_at
  FROM public.admissions_data ad
  ORDER BY ad.created_at DESC;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_all_admissions_for_insights() TO authenticated;

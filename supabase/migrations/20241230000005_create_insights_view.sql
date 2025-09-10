-- Create a secure view for insights that protects individual privacy
-- This view shows aggregated data without exposing specific grades

CREATE OR REPLACE VIEW public.admissions_insights_secure AS
SELECT 
  id,
  user_id,
  university_attendance,
  high_school,
  avg_grade_11,
  avg_grade_12,
  -- Show universities and programs but not specific statuses
  jsonb_agg(
    jsonb_build_object(
      'name', uni->>'name',
      'program', uni->>'program',
      'status', CASE 
        WHEN uni->>'status' IN ('accepted', 'received_offer_and_accepted') THEN 'accepted'
        WHEN uni->>'status' IN ('rejected') THEN 'rejected'
        WHEN uni->>'status' IN ('waitlisted') THEN 'waitlisted'
        WHEN uni->>'status' IN ('planning_on_applying') THEN 'planning'
        ELSE 'other'
      END
    )
  ) as universities,
  -- Show grade level counts instead of specific grades
  jsonb_build_object(
    'grade_11_courses', (
      SELECT COUNT(*) 
      FROM jsonb_array_elements(grades) as grade 
      WHERE grade->>'level' = 'grade_11' 
        AND grade->>'grade' IS NOT NULL 
        AND grade->>'grade' != ''
    ),
    'grade_12_courses', (
      SELECT COUNT(*) 
      FROM jsonb_array_elements(grades) as grade 
      WHERE grade->>'level' = 'grade_12' 
        AND grade->>'grade' IS NOT NULL 
        AND grade->>'grade' != ''
    )
  ) as grade_summary,
  other_achievements,
  created_at,
  updated_at
FROM public.admissions_data,
LATERAL jsonb_array_elements(universities) as uni
GROUP BY id, user_id, university_attendance, high_school, avg_grade_11, avg_grade_12, grades, other_achievements, created_at, updated_at;

-- Grant access to authenticated users
GRANT SELECT ON public.admissions_insights_secure TO authenticated;

-- Add RLS to the view
ALTER VIEW public.admissions_insights_secure SET (security_invoker = true);

-- Migration to rename 'specialization' to 'type' in grades JSONB data
-- This updates existing records to use the new field name

UPDATE public.admissions_data 
SET grades = (
  SELECT jsonb_agg(
    CASE 
      WHEN grade_item ? 'specialization' THEN
        grade_item - 'specialization' || jsonb_build_object('type', grade_item->>'specialization')
      ELSE 
        grade_item
    END
  )
  FROM jsonb_array_elements(grades) AS grade_item
)
WHERE grades IS NOT NULL 
AND jsonb_typeof(grades) = 'array'
AND EXISTS (
  SELECT 1 
  FROM jsonb_array_elements(grades) AS grade_item 
  WHERE grade_item ? 'specialization'
);
 
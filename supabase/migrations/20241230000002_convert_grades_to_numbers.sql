-- =====================================================
-- Convert all grade values to numbers
-- =====================================================

-- Update all grade values in the grades JSONB array to be numbers
UPDATE admissions_data 
SET grades = (
  SELECT jsonb_agg(
    CASE 
      WHEN grade_item ? 'grade' THEN
        grade_item || jsonb_build_object(
          'grade', 
          CASE 
            WHEN grade_item->>'grade' = '' THEN NULL
            WHEN grade_item->>'grade' LIKE '%\%' THEN 
              (regexp_replace(grade_item->>'grade', '%', '', 'g'))::numeric
            WHEN grade_item->>'grade' ~ '^[0-9]+\.?[0-9]*$' THEN 
              (grade_item->>'grade')::numeric
            ELSE NULL
          END
        )
      ELSE 
        grade_item
    END
  )
  FROM jsonb_array_elements(grades) AS grade_item
)
WHERE grades IS NOT NULL 
  AND grades != '[]'::jsonb;

-- Verify the conversion
WITH grade_data AS (
  SELECT 
    user_id,
    jsonb_array_elements(grades)->>'grade' as grade_value,
    pg_typeof(jsonb_array_elements(grades)->'grade') as grade_type
  FROM admissions_data
  WHERE grades IS NOT NULL 
    AND grades != '[]'::jsonb
)
SELECT 
  user_id,
  grade_value,
  grade_type
FROM grade_data
WHERE grade_value IS NOT NULL
LIMIT 10;

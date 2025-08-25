CREATE TABLE IF NOT EXISTS admission_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  university_attendance TEXT,
  specialized_program TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS university_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID REFERENCES admission_submissions(id) ON DELETE CASCADE,
  university_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('accepted', 'waitlisted', 'rejected', 'applied', 'interested')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS grades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID REFERENCES admission_submissions(id) ON DELETE CASCADE,
  grade_level TEXT NOT NULL CHECK (grade_level IN ('grade_11', 'grade_12')),
  course_name TEXT NOT NULL,
  course_code TEXT,
  grade TEXT NOT NULL,
  ib_ap_mark INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

alter publication supabase_realtime add table admission_submissions;
alter publication supabase_realtime add table university_applications;
alter publication supabase_realtime add table grades;
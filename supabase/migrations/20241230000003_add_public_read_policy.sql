-- Remove any existing public policies
DROP POLICY IF EXISTS "Public can view all admissions data for insights" ON public.admissions_data;
DROP POLICY IF EXISTS "Public can view all master admissions data for insights" ON public.admissions_data_master;

-- Add authenticated users only policy
CREATE POLICY "Authenticated users can view all admissions data for insights" ON public.admissions_data 
FOR SELECT USING (auth.role() = 'authenticated');

-- Also add the same policy for the master table
CREATE POLICY "Authenticated users can view all master admissions data for insights" ON public.admissions_data_master 
FOR SELECT USING (auth.role() = 'authenticated');

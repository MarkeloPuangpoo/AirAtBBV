import { createClient } from '@supabase/supabase-js';

// Ensure we don't pass empty strings which causes createClient to throw synchronously
// Dummy values are safe during Next.js static build phase.
const supabaseUrl = process.env.SUPABASE_URL || 'https://dummy.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_key';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseKey);

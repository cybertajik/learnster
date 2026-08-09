import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wjpebwftwbhlcankgrms.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_yjzvnElsHPqDaP8FaDZ7zQ_TmmsiZpd';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
console.log('Supabase URL:', process.env.SUPABASE_URL);

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

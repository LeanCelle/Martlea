'use client';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🧪 URL:', supabaseUrl);
console.log('🧪 KEY:', supabaseKey);

if (!supabaseUrl || !supabaseKey) {
  console.warn('❌ Faltan variables de entorno de Supabase');
}

export const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;
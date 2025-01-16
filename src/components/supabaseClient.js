import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ypyemcpdfhndpwcivcdj.supabase.co';  // Replace with your Supabase URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlweWVtY3BkZmhuZHB3Y2l2Y2RqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcwNDkyMzUsImV4cCI6MjA1MjYyNTIzNX0.M6zOlo8RfHxK7VE2FR0O98dpTGC2HlhBgvrExRIvk90'; // Replace with your Supabase anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

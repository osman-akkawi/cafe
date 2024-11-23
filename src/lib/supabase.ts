import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = 'https://zbgimqlknfhcnhuefbvp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpiZ2ltcWxrbmZoY25odWVmYnZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIzOTI5MTYsImV4cCI6MjA0Nzk2ODkxNn0.qiUWWA2YBsk70e1j1EXAuOUlPavIssYTEXpeu_9xUQ4';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

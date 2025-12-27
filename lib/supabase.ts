import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://mxexhgtlkksxfcelglsd.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14ZXhoZ3Rsa2tzeGZjZWxnbHNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3NDI3MTQsImV4cCI6MjA4MjMxODcxNH0.s1InXcClfodKMNDEGvXSV7tXbzLimeflQFKXYDJbzH4";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

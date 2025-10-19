/// <reference types="vite/client" />
import { createClient } from "@supabase/supabase-js";

// const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL!;
// const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY!;

const SUPABASE_ANON_KEY = "sb_publishable_5hUxiaCr-4QppFYOPsRCQA_wYN87qlu";
const SUPABASE_URL = "https://ksxfnkdtihxzhndvxjmn.supabase.co";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// modules/supabase.js
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://igjlltuasnylbqnsbugm.supabase.co";
const SUPABASE_KEY = "sb_publishable_t3fT2ljoSTZ1YsA6ztKgdw_lGK4xe2i";

export const sb = createClient(SUPABASE_URL, SUPABASE_KEY);
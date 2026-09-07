import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl) {
  throw new Error("Supabase URL is not defined");
}

if (!supabasePublishableKey) {
  throw new Error("Supabase publishable key is not defined");
}

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey
);
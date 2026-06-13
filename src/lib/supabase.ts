/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from './database';
/**
 * Single shared Supabase client for the browser (Vite SPA).
 *
 * Only the URL and the PUBLISHABLE key are exposed to the client — both are safe to
 * ship in the bundle because Row Level Security is what actually protects data.
 * The service-role key, Gemini key, and GitHub token are server-only and never
 * imported here — they live in Supabase Edge Function secrets (Phase 4).
 *
 * Vite only exposes env vars prefixed with VITE_ to client code.
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    'Missing Supabase env vars. Copy .env.example to .env.local and set ' +
      'VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.'
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabasePublishableKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    // Required so the GitHub OAuth redirect (Phase 2) can complete the session
    // from the URL hash when the user lands back on the app.
    detectSessionInUrl: true,
  },
});
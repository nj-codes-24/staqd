/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase } from '../supabase';

/**
 * Thin wrappers around supabase.auth. Each throws on error so callers can
 * try/catch and surface the message. Session state is observed centrally in
 * UserContext via onAuthStateChange — these functions just initiate the action.
 */

export async function signUpWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

/**
 * Starts an OAuth redirect flow. The browser navigates away to the provider and
 * returns to window.location.origin, where detectSessionInUrl (set in the
 * client) completes the session and onAuthStateChange fires.
 */
export async function signInWithProvider(provider: 'github' | 'google') {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: window.location.origin },
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
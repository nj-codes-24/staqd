/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase } from '../supabase';
import type { ProfileRow, Json } from '../database';
import type { UserProfile } from '../../types';

/** Fetch the profiles row for a user (created on signup by the DB trigger). */
export async function fetchProfileRow(userId: string): Promise<ProfileRow | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

/**
 * Stats shown on the profile screen. articlesRead/reposSynced are derived from
 * real tables; contributions/streak default to 0 until the gamification pillar
 * exists. reposSynced is a placeholder (no repo-sync feature yet).
 */
export async function getDerivedStats(userId: string): Promise<UserProfile['stats']> {
  const [seen, saved] = await Promise.all([
    supabase
      .from('user_seen_papers')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId),
    supabase
      .from('saved_papers')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId),
  ]);
  return {
    contributions: 0,
    streak: 0,
    articlesRead: seen.count ?? 0,
    reposSynced: saved.count ?? 0,
  };
}

/** Gamification pillar will define the real curve; flat for now (matches mock). */
function maxExpForLevel(_level: number): number {
  return 1000;
}

/** "May 2026" style, matching the frontend's joinedDate format. */
function formatJoined(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

/** Assemble the frontend's UserProfile shape from a DB row + auth email + stats. */
export function assembleUserProfile(
  row: ProfileRow,
  email: string,
  stats: UserProfile['stats']
): UserProfile {
  return {
    name: row.display_name ?? undefined,
    bio: row.bio ?? undefined,
    email,
    handle: row.username,
    avatarUrl: row.avatar_url ?? '',
    cropMetadata: (row.crop_metadata as UserProfile['cropMetadata']) ?? undefined,
    githubConnected: row.github_connected,
    githubUsername: row.github_username ?? '',
    level: row.level,
    exp: row.exp,
    maxExp: maxExpForLevel(row.level),
    selectedTopics: row.selected_topics ?? [],
    badges: row.badges ?? [],
    joinedDate: formatJoined(row.created_at),
    stats,
  };
}

/** Profile columns that a UserProfile can change (drives the write-through). */
export function profileFieldsEqual(a: UserProfile, b: UserProfile): boolean {
  return (
    a.name === b.name &&
    a.bio === b.bio &&
    a.avatarUrl === b.avatarUrl &&
    a.handle === b.handle &&
    a.githubUsername === b.githubUsername &&
    a.githubConnected === b.githubConnected &&
    a.level === b.level &&
    a.exp === b.exp &&
    JSON.stringify(a.selectedTopics) === JSON.stringify(b.selectedTopics) &&
    JSON.stringify(a.badges) === JSON.stringify(b.badges) &&
    JSON.stringify(a.cropMetadata) === JSON.stringify(b.cropMetadata)
  );
}

/** Persist the editable profile fields of a UserProfile back to the DB. */
export async function updateProfileFromUser(userId: string, u: UserProfile): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({
      display_name: u.name ?? null,
      bio: u.bio ?? null,
      avatar_url: u.avatarUrl || null,
      username: u.handle,
      selected_topics: u.selectedTopics ?? [],
      github_username: u.githubUsername || null,
      github_connected: u.githubConnected,
      crop_metadata: (u.cropMetadata as unknown as Json) ?? null,
      level: u.level,
      exp: u.exp,
      badges: u.badges ?? [],
    })
    .eq('id', userId);
  if (error) throw error;
}
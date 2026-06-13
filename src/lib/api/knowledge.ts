/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase } from '../supabase';
import type { PaperRow } from '../database';
import type { Article } from '../../types';

/** SubTopicData shape mirrored from the frontend (data.ts), for the feed. */
export interface FeedSubTopic {
  name: string;
  featuredArticle: Article;
  carouselArticles: Article[];
}

/** Map a papers row to the frontend's Article shape. */
export function assembleArticle(row: PaperRow): Article {
  return {
    id: row.id,
    title: row.title,
    excerpt: row.excerpt ?? '',
    content: row.content ?? '',
    category: row.category,
    subTopic: row.sub_topic ?? undefined,
    uploadedBy: row.uploaded_by ?? null,
    cueCards: (row.cue_cards as { term: string; desc: string }[] | null) ?? undefined,
    readTime: row.read_time ?? '',
    author: {
      name: row.author_name ?? '',
      avatar: row.author_avatar ?? '',
      role: row.author_role ?? '',
    },
    publishedAt: row.published_at
      ? new Date(row.published_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      : '',
    imageUrl: row.image_url ?? '',
    likes: row.likes,
    documentUrl: row.document_url ?? undefined,
  };
}

/** All active papers, newest first. Powers the feed + search source. */
export async function getAllArticles(): Promise<Article[]> {
  const { data, error } = await supabase
    .from('papers')
    .select('*')
    .eq('is_active', true)
    .order('processed_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(assembleArticle);
}

/** Group articles into the category → sub-topic → (featured + carousel) feed. */
export function groupIntoFeed(articles: Article[]): Record<string, FeedSubTopic[]> {
  const byCategory: Record<string, Record<string, Article[]>> = {};
  for (const a of articles) {
    const cat = a.category || 'Uncategorized';
    const sub = a.subTopic || 'General';
    (byCategory[cat] ??= {});
    (byCategory[cat][sub] ??= []).push(a);
  }

  const feed: Record<string, FeedSubTopic[]> = {};
  for (const [cat, subs] of Object.entries(byCategory)) {
    feed[cat] = Object.entries(subs).map(([name, arts]) => ({
      name,
      featuredArticle: arts[0],
      carouselArticles: arts.slice(1),
    }));
  }
  return feed;
}

/** Papers for a single sub-topic (the "view all" page). */
export async function getPapersBySubTopic(subTopic: string): Promise<Article[]> {
  const { data, error } = await supabase
    .from('papers')
    .select('*')
    .eq('is_active', true)
    .eq('sub_topic', subTopic)
    .order('processed_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(assembleArticle);
}

/** Title/excerpt search. */
export async function searchPapers(query: string): Promise<Article[]> {
  const q = query.trim();
  if (!q) return [];
  const { data, error } = await supabase
    .from('papers')
    .select('*')
    .eq('is_active', true)
    .or(`title.ilike.%${q}%,excerpt.ilike.%${q}%`)
    .limit(50);
  if (error) throw error;
  return (data ?? []).map(assembleArticle);
}

async function currentUserId(): Promise<string | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

/** Record that the current user opened a paper (idempotent). Powers articlesRead. */
export async function markPaperSeen(paperId: string): Promise<void> {
  const userId = await currentUserId();
  if (!userId) return;
  await supabase
    .from('user_seen_papers')
    .upsert(
      { user_id: userId, paper_id: paperId },
      { onConflict: 'user_id,paper_id', ignoreDuplicates: true }
    );
}

/** Paper ids the current user has saved. */
export async function getSavedPaperIds(): Promise<string[]> {
  const userId = await currentUserId();
  if (!userId) return [];
  const { data, error } = await supabase
    .from('saved_papers')
    .select('paper_id')
    .eq('user_id', userId);
  if (error) throw error;
  return (data ?? []).map((r) => r.paper_id);
}

/** Full saved articles for the current user. */
export async function getSavedPapers(): Promise<Article[]> {
  const ids = await getSavedPaperIds();
  if (ids.length === 0) return [];
  const { data, error } = await supabase.from('papers').select('*').in('id', ids);
  if (error) throw error;
  return (data ?? []).map(assembleArticle);
}

export async function savePaper(paperId: string): Promise<void> {
  const userId = await currentUserId();
  if (!userId) throw new Error('Not authenticated');
  const { error } = await supabase
    .from('saved_papers')
    .insert({ user_id: userId, paper_id: paperId });
  // 23505 = unique_violation (already saved) — safe to ignore.
  if (error && error.code !== '23505') throw error;
}

export async function unsavePaper(paperId: string): Promise<void> {
  const userId = await currentUserId();
  if (!userId) throw new Error('Not authenticated');
  const { error } = await supabase
    .from('saved_papers')
    .delete()
    .eq('user_id', userId)
    .eq('paper_id', paperId);
  if (error) throw error;
}
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Database types for the Staqd schema, reconciled to the frontend (src/types.ts).
 * Mirrors `supabase gen types typescript --linked`. Regenerate after schema
 * changes with:
 *   npx supabase gen types typescript --linked > src/types/database.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          selected_topics: string[] | null;
          github_username: string | null;
          github_connected: boolean;
          crop_metadata: Json | null;
          level: number;
          exp: number;
          badges: string[];
          role: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          selected_topics?: string[] | null;
          github_username?: string | null;
          github_connected?: boolean;
          crop_metadata?: Json | null;
          level?: number;
          exp?: number;
          badges?: string[];
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          selected_topics?: string[] | null;
          github_username?: string | null;
          github_connected?: boolean;
          crop_metadata?: Json | null;
          level?: number;
          exp?: number;
          badges?: string[];
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      papers: {
        Row: {
          id: string;
          title: string;
          excerpt: string | null;
          content: string | null;
          category: string;
          sub_topic: string | null;
          read_time: string | null;
          image_url: string | null;
          document_url: string | null;
          github_url: string | null;
          author_name: string | null;
          author_avatar: string | null;
          author_role: string | null;
          likes: number;
          published_at: string | null;
          arxiv_id: string | null;
          semantic_id: string | null;
          topic_tags: string[] | null;
          citation_count: number;
          processed_at: string;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          title: string;
          excerpt?: string | null;
          content?: string | null;
          category: string;
          sub_topic?: string | null;
          read_time?: string | null;
          image_url?: string | null;
          document_url?: string | null;
          github_url?: string | null;
          author_name?: string | null;
          author_avatar?: string | null;
          author_role?: string | null;
          likes?: number;
          published_at?: string | null;
          arxiv_id?: string | null;
          semantic_id?: string | null;
          topic_tags?: string[] | null;
          citation_count?: number;
          processed_at?: string;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          title?: string;
          excerpt?: string | null;
          content?: string | null;
          category?: string;
          sub_topic?: string | null;
          read_time?: string | null;
          image_url?: string | null;
          document_url?: string | null;
          github_url?: string | null;
          author_name?: string | null;
          author_avatar?: string | null;
          author_role?: string | null;
          likes?: number;
          published_at?: string | null;
          arxiv_id?: string | null;
          semantic_id?: string | null;
          topic_tags?: string[] | null;
          citation_count?: number;
          processed_at?: string;
          is_active?: boolean;
        };
        Relationships: [];
      };
      user_seen_papers: {
        Row: { user_id: string; paper_id: string; seen_at: string };
        Insert: { user_id: string; paper_id: string; seen_at?: string };
        Update: { user_id?: string; paper_id?: string; seen_at?: string };
        Relationships: [
          {
            foreignKeyName: 'user_seen_papers_paper_id_fkey';
            columns: ['paper_id'];
            referencedRelation: 'papers';
            referencedColumns: ['id'];
          }
        ];
      };
      saved_papers: {
        Row: { user_id: string; paper_id: string; saved_at: string };
        Insert: { user_id: string; paper_id: string; saved_at?: string };
        Update: { user_id?: string; paper_id?: string; saved_at?: string };
        Relationships: [
          {
            foreignKeyName: 'saved_papers_paper_id_fkey';
            columns: ['paper_id'];
            referencedRelation: 'papers';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: Record<never, never>;
    Functions: Record<never, never>;
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
}

/** Convenience row-type aliases. */
export type ProfileRow = Database['public']['Tables']['profiles']['Row'];
export type PaperRow = Database['public']['Tables']['papers']['Row'];
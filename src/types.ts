/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type OnboardingStep = 
  | 'welcome'
  | 'create_account'
  | 'choose_handle'
  | 'pick_topics'
  | 'connect_github'
  | 'success';

export interface UserProfile {
  name?: string;
  bio?: string;
  email: string;
  handle: string;
  avatarUrl: string;
  githubConnected: boolean;
  githubUsername: string;
  level: number;
  exp: number;
  maxExp: number;
  selectedTopics: string[];
  badges: string[];
  joinedDate: string;
  stats: {
    contributions: number;
    streak: number;
    articlesRead: number;
    reposSynced: number;
  };
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  publishedAt: string;
  imageUrl: string;
  likes: number;
  isBookmarked?: boolean;
}

export interface HubCategory {
  id: string;
  name: string;
  iconName: string;
}

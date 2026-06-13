-- ════════════════════════════════════════════════════════════════════════
-- Staqd — Initial schema (Knowledge Hub MVP)
--
-- Reconciled to the EXISTING FRONTEND (src/types.ts is the source of truth),
-- using the blueprint only as a reference. Tables map directly to the shapes
-- the app renders: Article and UserProfile.
--
-- Tables: profiles, papers, user_seen_papers, saved_papers
-- Deferred (no frontend surface yet): tools, saved_tools — added when the
-- frontend grows a tools/repos UI. For now papers.github_url backs the
-- "Includes Code/GitHub Repo" badge.
-- ════════════════════════════════════════════════════════════════════════


-- ─── profiles ───────────────────────────────────────────────────────────
-- Backs UserProfile. Created automatically on signup by the trigger below.
-- Fields NOT stored here (assembled by the API in Phase 3):
--   email     → from auth.users
--   joinedDate→ from created_at
--   maxExp    → computed from level
--   stats     → articlesRead = count(user_seen_papers); others default 0
create table public.profiles (
  id               uuid primary key references auth.users(id) on delete cascade,
  username         text unique not null,          -- UserProfile.handle
  display_name     text,                           -- UserProfile.name
  avatar_url       text,                           -- UserProfile.avatarUrl
  bio              text,                           -- UserProfile.bio
  selected_topics  text[],                         -- UserProfile.selectedTopics (onboarding)
  github_username  text,                           -- UserProfile.githubUsername
  github_connected boolean not null default false, -- UserProfile.githubConnected
  crop_metadata    jsonb,                           -- UserProfile.cropMetadata {zoom,crop,originalImage}
  level            integer not null default 1,     -- UserProfile.level
  exp              integer not null default 0,     -- UserProfile.exp
  badges           text[]  not null default '{}',  -- UserProfile.badges
  role             text    not null default 'user',
  created_at       timestamptz not null default now(),  -- UserProfile.joinedDate
  updated_at       timestamptz not null default now()
);


-- ─── papers ─────────────────────────────────────────────────────────────
-- Backs Article. Written only by the pipeline (secret key). Hierarchy the
-- feed renders: category (domain) → sub_topic → articles.
create table public.papers (
  id             uuid primary key default gen_random_uuid(),
  title          text not null,                    -- Article.title
  excerpt        text,                             -- Article.excerpt (card preview)
  content        text,                             -- Article.content (full body, markdown)
  category       text not null,                    -- Article.category (top-level domain)
  sub_topic      text,                             -- feed grouping (e.g. "Machine Learning")
  read_time      text,                             -- Article.readTime ("5 min read")
  image_url      text,                             -- Article.imageUrl (hero image)
  document_url   text,                             -- Article.documentUrl (PDF/PPTX for reader)
  github_url     text,                             -- backs "Includes Code/GitHub Repo" badge
  author_name    text,                             -- Article.author.name
  author_avatar  text,                             -- Article.author.avatar
  author_role    text,                             -- Article.author.role
  likes          integer not null default 0,       -- Article.likes
  published_at   timestamptz,                      -- Article.publishedAt
  -- pipeline-internal (not rendered):
  arxiv_id       text unique,
  semantic_id    text unique,
  topic_tags     text[],
  citation_count integer not null default 0,
  processed_at   timestamptz not null default now(),
  is_active      boolean not null default true
);


-- ─── user_seen_papers ───────────────────────────────────────────────────
-- Powers the "always fresh" feed + UserProfile.stats.articlesRead.
create table public.user_seen_papers (
  user_id   uuid not null references auth.users(id) on delete cascade,
  paper_id  uuid not null references public.papers(id) on delete cascade,
  seen_at   timestamptz not null default now(),
  primary key (user_id, paper_id)
);


-- ─── saved_papers ───────────────────────────────────────────────────────
-- Backs the Saved screen (BookmarkContext currently saves Article[]).
create table public.saved_papers (
  user_id   uuid not null references auth.users(id) on delete cascade,
  paper_id  uuid not null references public.papers(id) on delete cascade,
  saved_at  timestamptz not null default now(),
  primary key (user_id, paper_id)
);


-- ─── Indexes ────────────────────────────────────────────────────────────
create index idx_papers_category       on public.papers(category);
create index idx_papers_sub_topic      on public.papers(sub_topic);
create index idx_papers_topic_tags     on public.papers using gin(topic_tags);
create index idx_papers_processed_at   on public.papers(processed_at desc);
create index idx_user_seen_papers_user on public.user_seen_papers(user_id);
create index idx_saved_papers_user     on public.saved_papers(user_id);


-- ─── New-user trigger ───────────────────────────────────────────────────
-- Auto-creates a profile on signup. username is a guaranteed-unique placeholder
-- (the real handle is chosen during onboarding, which UPDATEs this row).
-- display_name / avatar_url come from OAuth metadata when present.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, username, display_name, avatar_url)
  values (
    new.id,
    'user_' || replace(new.id::text, '-', ''),
    new.raw_user_meta_data ->> 'name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ─── updated_at touch trigger ───────────────────────────────────────────
create function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.touch_updated_at();


-- ─── Row Level Security ─────────────────────────────────────────────────
-- (select auth.uid()) is wrapped so Postgres caches it per statement —
-- Supabase's recommended RLS performance pattern.
alter table public.profiles         enable row level security;
alter table public.papers           enable row level security;
alter table public.user_seen_papers enable row level security;
alter table public.saved_papers     enable row level security;

-- profiles: world-readable; each user manages only their own row.
create policy "profiles_select_public"
  on public.profiles for select using (true);
create policy "profiles_insert_own"
  on public.profiles for insert with check ((select auth.uid()) = id);
create policy "profiles_update_own"
  on public.profiles for update
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

-- papers: world-readable. No write policy → only the secret key (BYPASSRLS,
-- used by the pipeline) can insert/update.
create policy "papers_select_public"
  on public.papers for select using (true);

-- user_seen_papers / saved_papers: a user only ever touches their own rows.
create policy "user_seen_papers_all_own"
  on public.user_seen_papers for all
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "saved_papers_all_own"
  on public.saved_papers for all
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
-- ════════════════════════════════════════════════════════════════════════
-- Staqd — user uploads become first-class papers.
-- Adds papers.uploaded_by so an uploaded document is categorized + searchable
-- like any paper, but stays private to the uploader (pipeline papers, with
-- uploaded_by = null, remain public).
-- ════════════════════════════════════════════════════════════════════════

alter table public.papers
  add column if not exists uploaded_by uuid references auth.users(id) on delete cascade;

create index if not exists idx_papers_uploaded_by on public.papers(uploaded_by);

-- Visibility: public papers (uploaded_by is null) for everyone; uploads only for
-- their owner.
drop policy if exists "papers_select_public" on public.papers;
create policy "papers_select_visible"
  on public.papers for select
  using (uploaded_by is null or uploaded_by = (select auth.uid()));

-- A logged-in user may insert their own uploads...
create policy "papers_insert_own_upload"
  on public.papers for insert to authenticated
  with check (uploaded_by = (select auth.uid()));

-- ...and delete them.
create policy "papers_delete_own_upload"
  on public.papers for delete to authenticated
  using (uploaded_by = (select auth.uid()));
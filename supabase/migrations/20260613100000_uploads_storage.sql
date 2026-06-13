-- ════════════════════════════════════════════════════════════════════════
-- Staqd — uploads Storage bucket for user-uploaded documents.
-- Public bucket (so the reader can embed the PDF by URL); authenticated users
-- can upload to their own folder. Paths are uuid-prefixed and unguessable.
-- ════════════════════════════════════════════════════════════════════════

insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true)
on conflict (id) do nothing;

-- Anyone can read (needed for the public PDF embed in the reader).
create policy "uploads_public_read"
  on storage.objects for select
  using (bucket_id = 'uploads');

-- Logged-in users may upload into their own folder (objects/<uid>/...).
create policy "uploads_authenticated_insert"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'uploads'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
-- ════════════════════════════════════════════════════════════════════════
-- Staqd — store generated study cue cards on papers.
-- Gemini produces a few key-concept cards per uploaded paper; we persist them
-- so the reader shows real, paper-specific study aids.
-- ════════════════════════════════════════════════════════════════════════

alter table public.papers
  add column if not exists cue_cards jsonb;
-- ════════════════════════════════════════════════════════════════════════
-- Staqd — schedule the daily-pipeline Edge Function via pg_cron.
--
-- No secrets live in this file: the cron job reads CRON_SECRET from Supabase
-- Vault at run time. Before this does anything useful you must (one-time):
--   1) deploy the function:  supabase functions deploy daily-pipeline --no-verify-jwt
--   2) set its secrets:      supabase secrets set GEMINI_API_KEY=... GITHUB_API_TOKEN=... CRON_SECRET=...
--   3) store the same CRON_SECRET in Vault for the scheduler:
--        select vault.create_secret('<same-cron-secret>', 'cron_secret');
-- ════════════════════════════════════════════════════════════════════════

create extension if not exists pg_cron;
create extension if not exists pg_net;

-- Remove any prior schedule with this name (idempotent re-runs).
select cron.unschedule('staqd-daily-pipeline')
where exists (select 1 from cron.job where jobname = 'staqd-daily-pipeline');

-- Daily at 02:00 UTC: invoke the Edge Function. The CRON_SECRET is pulled from
-- Vault so it never appears in committed SQL.
select cron.schedule(
  'staqd-daily-pipeline',
  '0 2 * * *',
  $$
  select net.http_post(
    url     := 'https://rkfohjnkfnpxrwbzieqz.supabase.co/functions/v1/daily-pipeline',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cron-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'cron_secret')
    ),
    body    := '{}'::jsonb
  );
  $$
);
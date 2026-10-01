-- Batch 1 sources: Invisible and Welo Data (already listed) and xAI (new),
-- read from their official Greenhouse and Lever job boards. Additive only:
-- one new platform row and three cron jobs. Each source runs every 6 hours
-- at its own minute, like mercor (:07) and micro1 (:37).
insert into public.platforms (slug, name, site_url, onboarding_notes)
values
  ('xai', 'xAI', 'https://job-boards.greenhouse.io/xai',
   'AI tutor roles for Grok are posted on xAI''s job board; apply to each role separately.')
on conflict (slug) do nothing;

select cron.schedule('ingest-invisible', '17 */6 * * *', $$select private.invoke_ingest('invisible')$$);
select cron.schedule('ingest-welo-data', '27 */6 * * *', $$select private.invoke_ingest('welo-data')$$);
select cron.schedule('ingest-xai', '47 */6 * * *', $$select private.invoke_ingest('xai')$$);

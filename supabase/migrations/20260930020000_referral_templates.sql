-- Referral links for the platforms whose formats the owner confirmed in their
-- own dashboards (PLAN.md → Monetization). /go/<job> fills in {external_id}.
-- Outlier referrals are allowed (owner's decision, 2026-09-30); its format is
-- added with its adapter, so only its note changes here. Updates only: safe to
-- re-run on live data.
update public.platforms
set referral_url_template =
  'https://jobs.micro1.ai/post/{external_id}?referralCode=425b88c3-88c8-4f6c-9e49-b2adea77e703&utm_source=referral&utm_medium=share&utm_campaign=job_referral'
where slug = 'micro1';

update public.platforms
set referral_url_template =
  'https://work.mercor.com/explore?listingId={external_id}&referralCode=0fed61c9-731f-407b-f095-c500767da8db'
where slug = 'mercor';

update public.platforms
set onboarding_notes = 'Apply to the platform, then get matched to projects.'
where slug = 'outlier'
  and onboarding_notes = 'Apply to the platform, then get matched to projects. Plain link only, no referral.';

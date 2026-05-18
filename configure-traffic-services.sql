-- ============================================================================
-- Configure Traffic/View Services with Anti-Fraud Protection
-- ============================================================================
-- This script sets up timer-based viewing and platform fees for traffic tasks
-- 
-- GOLDEN RULE: 1 Worker = 1 IP = 1 View per URL
-- ============================================================================

-- First, check which traffic-related categories exist
SELECT id, slug, name 
FROM service_categories 
WHERE slug IN ('views', 'traffic', 'visits', 'streams', 'plays')
ORDER BY slug;

-- ============================================================================
-- YOUTUBE VIEWS
-- ============================================================================
-- YouTube counts a view after 30 seconds of watch time
-- Platform keeps 70% (high volume, low effort)

UPDATE service_types 
SET 
  requires_timer = true,
  min_view_duration = 30,
  platform_fee_percent = 70,
  base_price = 0.05,           -- Client pays $0.05 per view
  worker_reward = 0.015        -- Worker gets $0.015 (30% of $0.05)
WHERE category_id IN (
  SELECT id FROM service_categories WHERE slug = 'views'
)
AND slug LIKE '%youtube%'
AND is_active = true;

-- ============================================================================
-- WEBSITE TRAFFIC
-- ============================================================================
-- Google Analytics counts a visit after 20 seconds
-- Platform keeps 60% (medium effort)

UPDATE service_types 
SET 
  requires_timer = true,
  min_view_duration = 20,
  platform_fee_percent = 60,
  base_price = 0.03,           -- Client pays $0.03 per visit
  worker_reward = 0.012        -- Worker gets $0.012 (40% of $0.03)
WHERE category_id IN (
  SELECT id FROM service_categories WHERE slug IN ('traffic', 'visits')
)
AND is_active = true;

-- ============================================================================
-- TIKTOK VIEWS
-- ============================================================================
-- TikTok counts a view after 15 seconds
-- Platform keeps 70% (high volume)

UPDATE service_types 
SET 
  requires_timer = true,
  min_view_duration = 15,
  platform_fee_percent = 70,
  base_price = 0.04,           -- Client pays $0.04 per view
  worker_reward = 0.012        -- Worker gets $0.012 (30% of $0.04)
WHERE category_id IN (
  SELECT id FROM service_categories WHERE slug = 'views'
)
AND slug LIKE '%tiktok%'
AND is_active = true;

-- ============================================================================
-- SPOTIFY STREAMS
-- ============================================================================
-- Spotify counts a stream after 30 seconds
-- Platform keeps 70% (high volume)

UPDATE service_types 
SET 
  requires_timer = true,
  min_view_duration = 30,
  platform_fee_percent = 70,
  base_price = 0.03,           -- Client pays $0.03 per stream
  worker_reward = 0.009        -- Worker gets $0.009 (30% of $0.03)
WHERE category_id IN (
  SELECT id FROM service_categories WHERE slug IN ('streams', 'plays')
)
AND is_active = true;

-- ============================================================================
-- VERIFY CONFIGURATION
-- ============================================================================
-- Check that all traffic services are properly configured

SELECT 
  c.slug as category,
  st.slug as service,
  st.requires_timer,
  st.min_view_duration as min_seconds,
  st.platform_fee_percent as platform_fee,
  (100 - st.platform_fee_percent) as worker_gets,
  st.base_price as client_pays,
  st.worker_reward as task_reward,
  ROUND(st.worker_reward * (100 - st.platform_fee_percent) / 100, 4) as worker_payout
FROM service_types st
JOIN service_categories c ON st.category_id = c.id
WHERE c.slug IN ('views', 'traffic', 'visits', 'streams', 'plays')
  AND st.is_active = true
ORDER BY c.slug, st.slug;

-- ============================================================================
-- WORKER EARNINGS EXAMPLES
-- ============================================================================
-- Show how much workers earn per task and tasks needed to reach $5 minimum

SELECT 
  'YouTube View (30s)' as task_type,
  '$0.015' as worker_earns,
  '333 tasks to reach $5' as payout_threshold,
  '166 minutes of work' as time_estimate
UNION ALL
SELECT 
  'Website Visit (20s)',
  '$0.012',
  '417 tasks to reach $5',
  '139 minutes of work'
UNION ALL
SELECT 
  'TikTok View (15s)',
  '$0.012',
  '417 tasks to reach $5',
  '104 minutes of work'
UNION ALL
SELECT 
  'Spotify Stream (30s)',
  '$0.009',
  '556 tasks to reach $5',
  '278 minutes of work';

-- ============================================================================
-- ANTI-FRAUD VERIFICATION
-- ============================================================================
-- Check that the unique constraint exists

SELECT 
  constraint_name,
  table_name,
  constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'worker_view_history'
  AND constraint_type = 'UNIQUE';

-- Check sample view history (if any exists)
SELECT 
  COUNT(*) as total_views,
  COUNT(DISTINCT worker_id) as unique_workers,
  COUNT(DISTINCT target_url) as unique_urls,
  COUNT(DISTINCT ip_address) as unique_ips
FROM worker_view_history;

-- ============================================================================
-- IMPORTANT NOTES
-- ============================================================================
-- 
-- 1. NEVER remove the UNIQUE(worker_id, target_url) constraint
--    This is what prevents YouTube/Google spam detection
--
-- 2. Minimum view durations are based on platform requirements:
--    - YouTube: 30 seconds (official view threshold)
--    - Google Analytics: 20 seconds (bounce rate threshold)
--    - TikTok: 15 seconds (view count threshold)
--    - Spotify: 30 seconds (stream count threshold)
--
-- 3. Platform fees are set high (60-70%) because:
--    - Workers complete tasks very quickly
--    - Volume is extremely high
--    - Tasks require minimal skill
--
-- 4. Worker payouts are designed so they can reach $5 minimum in:
--    - 2-3 hours of consistent work
--    - 300-500 tasks depending on service type
--
-- 5. To get 1,000 views, you need 1,000 different workers
--    This is the GOLDEN RULE that makes your platform legitimate
--
-- ============================================================================

-- ============================================================================
-- Dynamic Platform Fee Configuration
-- ============================================================================
-- Run this script to set platform fees based on task difficulty
-- 
-- Strategy:
--   - High Volume Tasks (Follows, Likes, Views): 70% platform fee
--   - Medium Tasks (Downloads, Traffic): 50% platform fee  
--   - Quality Tasks (Reviews): 40% platform fee
-- ============================================================================

-- First, check current service types and their categories
SELECT 
  st.slug,
  st.name,
  c.slug as category_slug,
  c.name as category_name,
  st.platform_fee_percent as current_fee,
  st.base_price,
  st.worker_reward
FROM service_types st
JOIN service_categories c ON st.category_id = c.id
WHERE st.is_active = true
ORDER BY c.slug, st.slug;

-- ============================================================================
-- HIGH VOLUME TASKS - 70% Platform Fee (Worker gets 30%)
-- ============================================================================
-- These are simple, high-volume tasks that require minimal effort
-- Examples: Instagram Followers, TikTok Likes, YouTube Views

UPDATE service_types 
SET platform_fee_percent = 70 
WHERE category_id IN (
  SELECT id FROM service_categories 
  WHERE slug IN ('followers', 'likes', 'views', 'subscribers', 'retweets', 'shares')
)
AND is_active = true;

-- ============================================================================
-- MEDIUM TASKS - 50% Platform Fee (Worker gets 50%)
-- ============================================================================
-- These require moderate effort: downloading apps, visiting sites, etc.

UPDATE service_types 
SET platform_fee_percent = 50 
WHERE category_id IN (
  SELECT id FROM service_categories 
  WHERE slug IN ('downloads', 'traffic', 'installs', 'plays', 'streams')
)
AND is_active = true;

-- ============================================================================
-- QUALITY TASKS - 40% Platform Fee (Worker gets 60%)
-- ============================================================================
-- These require high quality work with aged accounts and thoughtful content
-- Examples: Google Reviews, Yelp Reviews, Facebook Reviews

UPDATE service_types 
SET platform_fee_percent = 40 
WHERE category_id IN (
  SELECT id FROM service_categories 
  WHERE slug = 'reviews'
)
AND is_active = true;

-- ============================================================================
-- CONSERVATIVE START (Optional - comment out the above and use this instead)
-- ============================================================================
-- If you want to start more conservatively, use 50% across the board
-- and adjust based on worker retention metrics

-- UPDATE service_types 
-- SET platform_fee_percent = 50 
-- WHERE is_active = true;

-- ============================================================================
-- VERIFY CHANGES
-- ============================================================================
-- Check that fees were applied correctly

SELECT 
  c.slug as category,
  st.slug as service,
  st.platform_fee_percent as platform_fee,
  (100 - st.platform_fee_percent) as worker_gets,
  st.base_price as client_pays,
  st.worker_reward as task_reward,
  ROUND(st.worker_reward * (100 - st.platform_fee_percent) / 100, 4) as worker_payout
FROM service_types st
JOIN service_categories c ON st.category_id = c.id
WHERE st.is_active = true
ORDER BY st.platform_fee_percent DESC, c.slug, st.slug;

-- ============================================================================
-- EXAMPLE CALCULATIONS
-- ============================================================================
-- Show how much workers earn per task at different fee levels

SELECT 
  'Example: $0.05 task reward' as scenario,
  '70% platform fee' as fee_level,
  '$0.015' as worker_earns,
  '333 tasks to reach $5' as tasks_needed
UNION ALL
SELECT 
  'Example: $0.05 task reward',
  '50% platform fee',
  '$0.025',
  '200 tasks to reach $5'
UNION ALL
SELECT 
  'Example: $0.05 task reward',
  '40% platform fee',
  '$0.030',
  '167 tasks to reach $5'
UNION ALL
SELECT 
  'Example: $1.00 review reward',
  '40% platform fee',
  '$0.60',
  '9 reviews to reach $5';

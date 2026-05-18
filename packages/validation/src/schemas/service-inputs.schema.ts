import { z } from 'zod';

/**
 * Service-Specific Input Schemas
 * 
 * Each service type requires different inputs from the client.
 * These schemas enforce that clients provide ALL necessary information
 * before they can complete checkout.
 */

// ============================================================
// 1. REPUTATION MANAGEMENT (Reviews)
// ============================================================

export const reviewServiceInputSchema = z.object({
  // MANDATORY: Direct link to business profile
  targetUrl: z.string()
    .url('Must be a valid URL')
    .refine(
      (url) => {
        // Validate platform-specific URL patterns
        const validPatterns = [
          /google\.com\/maps/,           // Google Business
          /yelp\.com\/biz/,              // Yelp
          /trustpilot\.com\/review/,     // Trustpilot
          /facebook\.com\/.*\/reviews/,  // Facebook
          /styleseat\.com\/.*\/reviews/, // Styleseat
          /booksy\.com/,                 // Booksy
        ];
        return validPatterns.some(pattern => pattern.test(url));
      },
      'Must be a valid business profile URL for the selected platform'
    ),

  // Business name for display
  businessName: z.string()
    .min(2, 'Business name must be at least 2 characters')
    .max(100, 'Business name too long'),

  // Review text option
  reviewTextOption: z.enum(['worker_choice', 'client_provided']),

  // Custom review text (required if client_provided)
  customReviewText: z.string()
    .min(20, 'Review text must be at least 20 characters')
    .max(500, 'Review text too long')
    .optional(),

  // Star rating (1-5)
  starRating: z.number()
    .int()
    .min(1, 'Minimum 1 star')
    .max(5, 'Maximum 5 stars')
    .default(5),

  // Drip-feed schedule (hours between reviews)
  dripFeedHours: z.number()
    .int()
    .min(12, 'Minimum 12 hours between reviews to avoid spam detection')
    .max(72, 'Maximum 72 hours')
    .default(24),

  // Business type (helps workers write authentic reviews)
  businessType: z.enum([
    'restaurant',
    'salon',
    'spa',
    'retail',
    'professional_services',
    'healthcare',
    'automotive',
    'home_services',
    'other',
  ]).optional(),

  // Key points to mention (optional)
  keyPoints: z.array(z.string().max(100))
    .max(5, 'Maximum 5 key points')
    .optional(),
});

// ============================================================
// 2. SOCIAL GROWTH (Followers, Likes, Subscribers)
// ============================================================

export const socialGrowthInputSchema = z.object({
  // MANDATORY: Direct link to profile or post
  targetUrl: z.string()
    .url('Must be a valid URL')
    .refine(
      (url) => {
        const validPatterns = [
          /instagram\.com/,
          /tiktok\.com/,
          /facebook\.com/,
          /twitter\.com|x\.com/,
          /youtube\.com/,
        ];
        return validPatterns.some(pattern => pattern.test(url));
      },
      'Must be a valid social media URL'
    ),

  // Account handle (e.g., @username)
  accountHandle: z.string()
    .min(1, 'Account handle required')
    .max(50, 'Handle too long')
    .regex(/^@?[\w.]+$/, 'Invalid handle format'),

  // Current follower/subscriber count (for tracking)
  currentCount: z.number()
    .int()
    .min(0, 'Count cannot be negative')
    .optional(),

  // Account must be public
  isPublic: z.boolean()
    .refine(val => val === true, 'Account must be public for workers to follow'),
});

// ============================================================
// 3. VISIBILITY & VIEWS (Video/Audio with Timer)
// ============================================================

export const viewsInputSchema = z.object({
  // MANDATORY: Direct link to video/track
  targetUrl: z.string()
    .url('Must be a valid URL')
    .refine(
      (url) => {
        const validPatterns = [
          /youtube\.com\/watch\?v=|youtu\.be\//,  // YouTube
          /tiktok\.com\/.*\/video/,                // TikTok
          /instagram\.com\/(p|reel)\//,            // Instagram
          /spotify\.com\/track/,                   // Spotify
        ];
        return validPatterns.some(pattern => pattern.test(url));
      },
      'Must be a valid video or track URL'
    ),

  // Video/track title
  contentTitle: z.string()
    .min(1, 'Title required')
    .max(200, 'Title too long'),

  // Minimum watch time (seconds)
  minWatchTime: z.number()
    .int()
    .min(15, 'Minimum 15 seconds')
    .max(300, 'Maximum 5 minutes')
    .default(30),

  // Content must be public
  isPublic: z.boolean()
    .refine(val => val === true, 'Content must be public for workers to view'),
});

// ============================================================
// 4. WEB TRAFFIC (Website Visits with Dwell Time)
// ============================================================

export const webTrafficInputSchema = z.object({
  // MANDATORY: Clean website URL
  targetUrl: z.string()
    .url('Must be a valid URL')
    .refine(
      (url) => {
        // Block malicious patterns
        const blockedPatterns = [
          /bit\.ly|tinyurl|goo\.gl/,  // URL shorteners
          /\.exe|\.dmg|\.apk/,        // Executable files
        ];
        return !blockedPatterns.some(pattern => pattern.test(url));
      },
      'URL appears suspicious or uses URL shorteners'
    ),

  // Website name
  websiteName: z.string()
    .min(2, 'Website name required')
    .max(100, 'Name too long'),

  // Minimum dwell time (seconds)
  minDwellTime: z.number()
    .int()
    .min(30, 'Minimum 30 seconds dwell time')
    .max(300, 'Maximum 5 minutes')
    .default(30),

  // Target page description (helps workers know what to expect)
  pageDescription: z.string()
    .max(200, 'Description too long')
    .optional(),
});

// ============================================================
// UNIFIED ORDER INPUT SCHEMA
// ============================================================

export const orderInputSchema = z.discriminatedUnion('serviceCategory', [
  z.object({
    serviceCategory: z.literal('reviews'),
    inputs: reviewServiceInputSchema,
  }),
  z.object({
    serviceCategory: z.enum(['followers', 'likes', 'subscribers']),
    inputs: socialGrowthInputSchema,
  }),
  z.object({
    serviceCategory: z.literal('views'),
    inputs: viewsInputSchema,
  }),
  z.object({
    serviceCategory: z.literal('traffic'),
    inputs: webTrafficInputSchema,
  }),
]);

// ============================================================
// VALIDATION HELPERS
// ============================================================

export function validateServiceInputs(
  categorySlug: string,
  inputs: unknown
): { valid: boolean; errors?: string[] } {
  try {
    const schema = orderInputSchema.parse({
      serviceCategory: categorySlug,
      inputs,
    });
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        valid: false,
        errors: error.errors.map(e => `${e.path.join('.')}: ${e.message}`),
      };
    }
    return { valid: false, errors: ['Invalid input format'] };
  }
}

// ============================================================
// TYPE EXPORTS
// ============================================================

export type ReviewServiceInput = z.infer<typeof reviewServiceInputSchema>;
export type SocialGrowthInput = z.infer<typeof socialGrowthInputSchema>;
export type ViewsInput = z.infer<typeof viewsInputSchema>;
export type WebTrafficInput = z.infer<typeof webTrafficInputSchema>;
export type OrderInput = z.infer<typeof orderInputSchema>;

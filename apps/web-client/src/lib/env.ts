/**
 * Environment variables with type safety
 */

export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1",
  stripePublicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || "",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001",
} as const;

import "dotenv/config";

function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required env var: ${key}`);
  }
  return value;
}

function optional(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

function integer(key: string, fallback: number): number {
  const raw = process.env[key];
  return raw ? parseInt(raw, 10) : fallback;
}

export const config = {
  env: optional("NODE_ENV", "development"),
  isDev: optional("NODE_ENV", "development") === "development",
  isProd: process.env.NODE_ENV === "production",

  db: {
    url: required("DATABASE_URL"),
  },

  redis: {
    url: optional("REDIS_URL", "redis://localhost:6379"),
  },

  jwt: {
    secret: required("JWT_SECRET"),
    refreshSecret: required("JWT_REFRESH_SECRET"),
    accessExpiry: optional("JWT_ACCESS_EXPIRY", "15m"),
    refreshExpiry: optional("JWT_REFRESH_EXPIRY", "7d"),
  },

  stripe: {
    secretKey: optional("STRIPE_SECRET_KEY", ""),
    webhookSecret: optional("STRIPE_WEBHOOK_SECRET", ""),
  },

  platform: {
    feePercent: integer("PLATFORM_FEE_PERCENT", 15),
    minDeposit: integer("MIN_DEPOSIT", 5),
    minWithdrawal: integer("MIN_WITHDRAWAL", 5),
  },

  ports: {
    gateway: integer("API_GATEWAY_PORT", 4000),
    auth: integer("AUTH_SERVICE_PORT", 5001),
    catalog: integer("CATALOG_SERVICE_PORT", 5002),
    order: integer("ORDER_SERVICE_PORT", 5003),
    task: integer("TASK_SERVICE_PORT", 5004),
    wallet: integer("WALLET_SERVICE_PORT", 5005),
  },

  cors: {
    origins: optional(
      "CORS_ORIGINS",
      "http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:3003"
    ).split(","),
  },

  // Service hostnames — override in Docker/prod to container names (e.g. "auth-service")
  // Default: localhost for local development
  serviceHosts: {
    auth: optional("AUTH_SERVICE_HOST", "localhost"),
    catalog: optional("CATALOG_SERVICE_HOST", "localhost"),
    order: optional("ORDER_SERVICE_HOST", "localhost"),
    task: optional("TASK_SERVICE_HOST", "localhost"),
    wallet: optional("WALLET_SERVICE_HOST", "localhost"),
  },
} as const;

export type Config = typeof config;

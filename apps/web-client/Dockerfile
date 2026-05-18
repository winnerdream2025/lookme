FROM node:20-alpine

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9.7.0 --activate

WORKDIR /app

# Copy entire monorepo (workspace packages are needed at build time)
COPY . .

RUN pnpm install --frozen-lockfile

# ── NEXT_PUBLIC vars are embedded at build time — must be passed as build ARGs ──
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_STRIPE_PUBLIC_KEY
ARG NEXT_PUBLIC_APP_URL

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_STRIPE_PUBLIC_KEY=$NEXT_PUBLIC_STRIPE_PUBLIC_KEY
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

RUN pnpm --filter web-client run build

ENV NODE_ENV=production
EXPOSE 3001

USER node

WORKDIR /app/apps/web-client
CMD ["../../node_modules/.bin/next", "start", "--port", "3001"]

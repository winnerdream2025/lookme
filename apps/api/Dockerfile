FROM node:20-alpine

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9.7.0 --activate

WORKDIR /app

# Copy entire monorepo (pnpm workspace requires all packages to exist)
COPY . .

# Install all dependencies (devDeps included — tsx is in devDeps)
RUN pnpm install --frozen-lockfile

# Generate Prisma client
RUN pnpm --filter @lookme/database exec prisma generate

ENV NODE_ENV=production
EXPOSE 4000

# Run as non-root
USER node

CMD ["node_modules/.bin/tsx", "apps/api/src/index.ts"]

FROM node:20-slim

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9.7.0 --activate
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy entire monorepo (pnpm workspace requires all packages to exist)
COPY . .

# Install all dependencies (devDeps included — tsx is in devDeps)
RUN pnpm install --frozen-lockfile
RUN npm install -g tsx

# Generate Prisma client
RUN pnpm --filter @lookme/database exec prisma generate

ENV NODE_ENV=production
EXPOSE 4000

# Run as non-root
USER node

CMD ["tsx", "apps/api/src/index.ts"]

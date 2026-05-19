FROM node:20-slim

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9.7.0 --activate
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . .

RUN pnpm install --frozen-lockfile
RUN npm install -g tsx
RUN pnpm --filter @lookme/database exec prisma generate

ENV NODE_ENV=production
EXPOSE 5001

USER node

CMD ["tsx", "services/auth/src/index.ts"]

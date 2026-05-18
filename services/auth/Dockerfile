FROM node:20-alpine

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9.7.0 --activate

WORKDIR /app

COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @lookme/database exec prisma generate

ENV NODE_ENV=production
EXPOSE 5001

USER node

CMD ["node", "node_modules/.bin/tsx", "services/auth/src/index.ts"]

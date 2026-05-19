FROM node:20-alpine

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9.7.0 --activate
RUN apk add --no-cache openssl

WORKDIR /app

COPY . .

RUN pnpm install --frozen-lockfile
RUN npm install -g tsx
RUN pnpm --filter @lookme/database exec prisma generate

ENV NODE_ENV=production
EXPOSE 5004

USER node

CMD ["tsx", "services/task/src/index.ts"]

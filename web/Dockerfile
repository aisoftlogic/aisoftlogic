# deps
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && pnpm install --no-frozen-lockfile

# build
FROM deps AS build
COPY . .
RUN pnpm build

# run
FROM node:20-alpine AS run
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/.next ./.next
COPY --from=deps /app/node_modules ./node_modules
COPY package.json next.config.mjs ./
ENV HOSTNAME=0.0.0.0 PORT=3000
EXPOSE 3000
CMD ["node","node_modules/next/dist/bin/next","start","-H","0.0.0.0","-p","3000"]
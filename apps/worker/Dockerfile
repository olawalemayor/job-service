FROM node:20.20.1-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig.base.json ./
COPY packages/shared/package*.json ./packages/shared/
COPY packages/shared/tsconfig.json ./packages/shared/
COPY apps/worker/package*.json ./apps/worker/
COPY apps/worker/tsconfig*.json ./apps/worker/

RUN npm install

COPY packages/shared/src ./packages/shared/src
COPY apps/worker/src ./apps/worker/src

RUN npm run build --workspace=packages/shared && \
    npm run build --workspace=apps/worker && \
    npm prune --omit=dev

FROM node:20.20.1-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/worker/dist ./dist

COPY --from=builder /app/packages/shared/dist ./node_modules/@job-service/shared/dist
COPY --from=builder /app/packages/shared/package.json ./node_modules/@job-service/shared/package.json

CMD ["node", "dist/index.js"]

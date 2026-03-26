FROM node:20.20.1-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig.base.json ./
COPY packages/shared/package*.json ./packages/shared/
COPY packages/shared/tsconfig.json ./packages/shared/
COPY apps/api/package*.json ./apps/api/
COPY apps/api/tsconfig*.json ./apps/api/

RUN npm install

COPY packages/shared/src ./packages/shared/src
COPY apps/api/src ./apps/api/src

RUN npm run build --workspace=packages/shared && \
    npm run build --workspace=apps/api && \
    npm prune --omit=dev

FROM node:20.20.1-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/dist ./dist

COPY --from=builder /app/packages/shared/dist ./node_modules/@job-service/shared/dist
COPY --from=builder /app/packages/shared/package.json ./node_modules/@job-service/shared/package.json

CMD ["node", "dist/app.js"]

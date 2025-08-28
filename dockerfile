# ----------- Builder Stage -----------
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci 

COPY . .

RUN npm run build

# ----------- Runner Stage -----------
FROM node:18-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js

EXPOSE 3000

CMD ["npm", "start"]

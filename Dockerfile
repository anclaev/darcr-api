ARG node_version=18.16.0

# Stage 1: Установка зависимостей
FROM node:${node_version} AS deps


LABEL maintainer="anclaev<iahugo@yandex.ru>"
LABEL description="Darcr"

WORKDIR /api

COPY package.json ./

RUN yarn install silent

RUN yarn prisma generate

# Stage 2: Сборка проекта
FROM node:${node_version} AS builder

WORKDIR /api

COPY . .
COPY --from=deps /api/node_modules ./node_modules

RUN yarn build

# Stage 3: Запуск приложения
FROM node:${node_version} AS runtime

WORKDIR /home/user/darcr/api

ARG node_env=production
ENV NODE_ENV=${node_env} 

COPY --from=deps /api/node_modules ./node_modules
COPY --from=deps /api/package.json ./package.json
COPY --from=builder /api/dist ./dist

EXPOSE 3001

CMD ["npm", "run", "start:production"]


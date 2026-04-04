FROM node:22.14.0-alpine AS build
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY server/package.json ./server/
COPY shared/package.json ./shared/
RUN pnpm install
COPY server/ ./server/
COPY shared/ ./shared/


FROM node:22.14.0-alpine AS production
WORKDIR /app
COPY --from=build /app/server/ ./server
COPY --from=build /app/shared/ ./shared
COPY --from=build /app/node_modules/ ./node_modules
CMD [ "node", "server/index.js" ]
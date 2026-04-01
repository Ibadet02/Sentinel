FROM node:22.14.0-alpine
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY . .
CMD [ "pnpm", "start" ]
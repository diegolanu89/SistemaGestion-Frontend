FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --include=optional --legacy-peer-deps && npm install @rollup/rollup-linux-x64-musl --no-save --legacy-peer-deps

COPY . .

ARG VITE_API_URL
ARG VITE_APP_MODE
ARG VITE_AUTH_PROVIDER

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_APP_MODE=$VITE_APP_MODE
ENV VITE_AUTH_PROVIDER=$VITE_AUTH_PROVIDER

RUN npm run sass:build
RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
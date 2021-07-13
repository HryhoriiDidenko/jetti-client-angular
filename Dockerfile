FROM node:14.17-alpine3.14 AS build
RUN mkdir -p /app
WORKDIR /app
COPY package.json .npmrc /app
RUN npm install
COPY . /app
RUN npm run build-dev --prod

FROM nginx:1.20.1-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html

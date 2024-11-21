FROM node:21-alpine AS build
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build

FROM nginx:alpine
WORKDIR /usr/share/nginx/html

COPY --from=build /app/dist .
COPY certs /certs
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]

# FROM node:21-alpine AS build

# WORKDIR /app

# COPY package.json yarn.lock ./
# RUN yarn install --frozen-lockfile
# COPY . .
# RUN yarn build

# FROM nginx:alpine

# WORKDIR /usr/share/nginx/html
# COPY --from=build /app/dist .
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]

FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY dist/ ./
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

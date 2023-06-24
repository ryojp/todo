FROM node:20-alpine AS todo-frontend-builder
WORKDIR /frontend
COPY ./package.json ./package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM --platform=linux/amd64 ryojpn/todo-frontend-builder:latest AS built

FROM nginx AS production
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=built /frontend/build /usr/share/nginx/html

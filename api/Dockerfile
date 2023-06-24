FROM node:20-alpine
WORKDIR /api
COPY ./package.json ./package-lock.json ./
RUN npm ci
COPY . .
EXPOSE 4000
RUN npm run build
CMD ["npm", "start"]

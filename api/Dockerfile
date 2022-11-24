FROM node:alpine
WORKDIR /api
COPY ./package.json .
RUN npm install
COPY . .
EXPOSE 4000
RUN npm run build
CMD ["npm", "start"]

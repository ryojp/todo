FROM node:alpine
WORKDIR /api
COPY ./package.json .
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]

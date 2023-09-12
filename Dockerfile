FROM node:20.6.1
WORKDIR /strs
COPY . .
RUN npm install
EXPOSE 3000
    CMD [ "node", "server.js" ]
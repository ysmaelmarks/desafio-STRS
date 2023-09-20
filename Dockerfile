FROM node:20.6.1

WORKDIR /desafio-STRS

COPY . .

RUN npm install

EXPOSE 3000
CMD [ "npm", "start" ]
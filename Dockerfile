FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 9000

CMD ["node","/src/server.js"]
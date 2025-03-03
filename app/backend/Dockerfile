FROM node:22.3.0

WORKDIR /app

COPY ./package.json .
COPY ./package-lock.json .

RUN npm install

COPY . .

RUN npx prisma generate --schema=./prisma/schema.prisma

EXPOSE 3001

RUN npm run build

CMD ["npm", "run", "dev"]
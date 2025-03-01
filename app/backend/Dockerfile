FROM node:22.3.0

WORKDIR /app

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

RUN npm install

COPY . /app 

EXPOSE 3001

RUN npm run build

CMD ["npm", "run", "dev"]
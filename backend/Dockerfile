FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .
# 复制SSL证书
COPY ssl ./ssl

EXPOSE 8080

CMD ["npm", "start"]
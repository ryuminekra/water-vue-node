FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:20-alpine

WORKDIR /app

# 安装静态文件服务器
RUN npm install -g serve

# 复制构建产物
COPY --from=build /app/dist /app/dist

EXPOSE 3000

# 使用serve命令提供静态文件
CMD ["serve", "-s", "dist", "-l", "3000"]
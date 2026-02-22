# Docker部署说明

## 项目结构

```
water-node+vue/
├── backend/         # 后端服务
├── frontend/        # 前端应用
├── water-mini-app/  # 小程序代码
├── docker-compose.yml  # Docker Compose配置文件
└── DOCKER_DEPLOYMENT.md  # 部署说明
```

## 部署方式

### 方式一：使用内置数据库（推荐用于开发环境）

这种方式会同时部署MySQL数据库、后端服务和前端应用。

1. **构建和启动容器**

   ```bash
   # 在项目根目录执行
   docker-compose up -d --build
   ```

2. **访问应用**

   - 前端应用：http://localhost
   - 后端API：http://localhost:3000
   - 数据库：localhost:3306（用户名：root，密码：123456，数据库名：water_system）

### 方式二：使用外部数据库（推荐用于生产环境）

这种方式只部署后端服务和前端应用，使用外部的MySQL数据库。

1. **修改docker-compose.yml文件**

   注释或删除MySQL服务配置，修改后端服务的环境变量：

   ```yaml
   # 注释或删除以下配置
   # mysql:
   #   image: mysql:8.0
   #   environment:
   #     MYSQL_ROOT_PASSWORD: 123456
   #     MYSQL_DATABASE: water_system
   #   ports:
   #     - "3306:3306"
   #   volumes:
   #     - mysql-data:/var/lib/mysql
   #   networks:
   #     - water-network
   #   restart: unless-stopped

   backend:
     build: ./backend
     environment:
       DB_HOST: your_external_db_host  # 修改为外部数据库主机
       DB_PORT: 3306                   # 修改为外部数据库端口
       DB_NAME: water_system           # 修改为外部数据库名
       DB_USER: your_db_username       # 修改为外部数据库用户名
       DB_PASSWORD: your_db_password   # 修改为外部数据库密码
       JWT_SECRET: your_jwt_secret_key
     ports:
       - "3000:3000"
     # 移除depends_on配置
     # depends_on:
     #   - mysql
     networks:
       - water-network
     restart: unless-stopped
   ```

2. **构建和启动容器**

   ```bash
   # 在项目根目录执行
   docker-compose up -d --build
   ```

3. **访问应用**

   - 前端应用：http://localhost
   - 后端API：http://localhost:3000

## 环境变量配置

### 后端服务环境变量

| 变量名 | 描述 | 默认值 |
|-------|------|-------|
| DB_HOST | 数据库主机地址 | localhost |
| DB_PORT | 数据库端口 | 3306 |
| DB_NAME | 数据库名称 | water_system |
| DB_USER | 数据库用户名 | root |
| DB_PASSWORD | 数据库密码 | 123456 |
| JWT_SECRET | JWT密钥 | your_jwt_secret_key |

### 前端服务配置

前端服务的API地址配置在 `frontend/src/utils/api.js` 文件中，默认指向 `http://localhost:3000`。

如果需要修改API地址，可以在构建前端镜像时通过环境变量传递，或者直接修改该文件。

## 构建和运行命令

### 构建镜像

```bash
docker-compose build
```

### 启动容器

```bash
docker-compose up -d
```

### 停止容器

```bash
docker-compose down
```

### 查看容器状态

```bash
docker-compose ps
```

### 查看容器日志

```bash
# 查看所有容器日志
docker-compose logs

# 查看特定容器日志
docker-compose logs backend
```

## 注意事项

1. **数据库初始化**

   首次启动时，后端服务会自动创建数据库表结构。如果使用外部数据库，需要确保数据库已经存在。

2. **端口冲突**

   如果本地端口80、3000或3306已被占用，需要修改docker-compose.yml文件中的端口映射。

3. **生产环境配置**

   - 修改JWT_SECRET为强随机字符串
   - 使用外部数据库服务
   - 配置HTTPS
   - 设置适当的重启策略

4. **小程序部署**

   小程序代码位于 `water-mini-app` 目录，需要单独部署到微信开发者工具或小程序平台。

## 故障排查

1. **容器启动失败**

   检查容器日志：
   ```bash
   docker-compose logs --tail=50 backend
   ```

2. **数据库连接失败**

   确保数据库服务正常运行，且环境变量配置正确。

3. **前端无法访问后端API**

   检查后端服务是否正常运行，以及API地址配置是否正确。

## 升级步骤

1. **停止容器**

   ```bash
   docker-compose down
   ```

2. **更新代码**

   ```bash
   git pull
   ```

3. **重新构建和启动**

   ```bash
   docker-compose up -d --build
   ```
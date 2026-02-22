# Linux部署指南

## 项目概述

本项目是一个饮用水领用系统，包含以下组件：
- 后端服务（Node.js + Express）
- 前端应用（Vue 3）
- MySQL 数据库
- 小程序代码（微信小程序）

## 部署环境要求

- Linux 服务器（推荐 Ubuntu 20.04+ 或 CentOS 7+）
- Docker 20.10+
- Docker Compose 1.29+
- 至少 2GB 内存
- 至少 20GB 磁盘空间
- 网络连接

## 部署步骤

### 步骤 1：准备服务器

1. **更新系统**

   ```bash
   # Ubuntu/Debian
   sudo apt update && sudo apt upgrade -y

   # CentOS/RHEL
   sudo yum update -y
   ```

2. **安装必要工具**

   ```bash
   # Ubuntu/Debian
   sudo apt install -y git curl wget

   # CentOS/RHEL
   sudo yum install -y git curl wget
   ```

### 步骤 2：安装 Docker 和 Docker Compose

1. **安装 Docker**

   ```bash
   # 使用官方安装脚本
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh

   # 启动 Docker 服务
   sudo systemctl start docker
   sudo systemctl enable docker

   # 添加当前用户到 docker 组（可选，避免使用 sudo）
   sudo usermod -aG docker $USER
   newgrp docker
   ```

2. **安装 Docker Compose**

   ```bash
   # 下载最新版本的 Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

   # 赋予执行权限
   sudo chmod +x /usr/local/bin/docker-compose

   # 验证安装
   docker-compose --version
   ```

### 步骤 3：获取项目代码

1. **克隆代码仓库**

   ```bash
   # 假设使用 Git 仓库
   git clone [你的代码仓库地址] water-system
   cd water-system

   # 或者如果是本地文件上传
   # 将项目文件上传到服务器，然后解压
   # unzip water-system.zip
   # cd water-system
   ```

### 步骤 4：配置部署环境

1. **修改配置文件（可选）**

   如果需要修改数据库密码或其他配置，编辑 `docker-compose.yml` 文件：

   ```yaml
   # 修改 MySQL 密码
   environment:
     MYSQL_ROOT_PASSWORD: your_secure_password

   # 修改后端数据库配置
   backend:
     environment:
       DB_PASSWORD: your_secure_password
       JWT_SECRET: your_jwt_secret_key
   ```

2. **配置前端 API 地址（可选）**

   前端 API 地址默认使用相对路径 `/api`，如果需要修改为绝对地址，编辑 `frontend/src/utils/api.js` 文件：

   ```javascript
   this.baseUrl = 'http://your-server-ip:3000';
   ```

### 步骤 5：构建和启动服务

1. **构建镜像**

   ```bash
   # 在项目根目录执行
   docker-compose build
   ```

2. **启动容器**

   ```bash
   docker-compose up -d
   ```

3. **查看启动状态**

   ```bash
   docker-compose ps
   ```

### 步骤 6：验证部署

1. **检查服务状态**

   ```bash
   # 查看容器日志
   docker-compose logs --tail=50 backend
   docker-compose logs --tail=50 frontend
   ```

2. **访问应用**

   - 前端应用：http://服务器IP
   - 后端API：http://服务器IP:3000
   - 数据库：通过 MySQL 客户端连接（端口 3306）

3. **测试登录**

   打开前端应用，使用默认账号密码登录（如果没有初始化数据，可能需要先注册）。

### 步骤 7：配置防火墙（可选）

如果服务器启用了防火墙，需要开放相应端口：

```bash
# Ubuntu/Debian (ufw)
sudo ufw allow 80/tcp
sudo ufw allow 3000/tcp
sudo ufw allow 3306/tcp

# CentOS/RHEL (firewalld)
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --permanent --add-port=3306/tcp
sudo firewall-cmd --reload
```

## 部署模式

### 开发环境部署（默认配置）

使用内置 MySQL 数据库，适合开发和测试：

```bash
docker-compose up -d --build
```

### 生产环境部署

1. **使用外部数据库**

   修改 `docker-compose.yml` 文件，注释掉 MySQL 服务，修改后端数据库配置：

   ```yaml
   # 注释掉 MySQL 服务
   # mysql:
   #   image: mysql:8.0
   #   ...

   backend:
     environment:
       DB_HOST: your_external_db_host
       DB_PORT: 3306
       DB_NAME: water_system
       DB_USER: your_db_username
       DB_PASSWORD: your_db_password
       JWT_SECRET: your_jwt_secret_key
     # 移除 depends_on
     # depends_on:
     #   - mysql
   ```

2. **配置 HTTPS（推荐）**

   使用 Nginx 反向代理并配置 SSL 证书：

   ```bash
   # 安装 Nginx
   sudo apt install -y nginx

   # 配置 Nginx 反向代理
   sudo nano /etc/nginx/sites-available/water-system
   ```

   Nginx 配置示例：

   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       return 301 https://$host$request_uri;
   }

   server {
       listen 443 ssl;
       server_name your-domain.com;

       ssl_certificate /path/to/ssl/cert.pem;
       ssl_certificate_key /path/to/ssl/key.pem;

       location / {
           proxy_pass http://localhost:80;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       }

       location /api/ {
           proxy_pass http://localhost:3000/;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       }
   }
   ```

   ```bash
   # 启用配置
   sudo ln -s /etc/nginx/sites-available/water-system /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

## 日常维护

### 查看日志

```bash
# 查看所有容器日志
docker-compose logs

# 查看特定容器日志
docker-compose logs backend

# 实时查看日志
docker-compose logs -f backend
```

### 重启服务

```bash
# 重启所有服务
docker-compose restart

# 重启特定服务
docker-compose restart backend
```

### 停止服务

```bash
# 停止所有服务
docker-compose down

# 停止并删除 volumes（会删除数据库数据）
docker-compose down -v
```

### 更新代码

```bash
# 停止服务
docker-compose down

# 更新代码
git pull

# 重新构建和启动
docker-compose up -d --build
```

## 故障排查

### 1. 容器启动失败

```bash
# 查看详细日志
docker-compose logs --tail=100 backend

# 检查端口占用
netstat -tuln | grep 3000
```

### 2. 数据库连接失败

```bash
# 检查 MySQL 容器状态
docker-compose ps mysql

# 查看 MySQL 日志
docker-compose logs mysql

# 测试数据库连接
docker exec -it water-system_mysql_1 mysql -uroot -p
```

### 3. 前端无法访问后端 API

```bash
# 检查后端服务状态
docker-compose ps backend

# 测试后端 API
curl http://localhost:3000/api/auth/login

# 检查前端配置
cat frontend/src/utils/api.js
```

### 4. 内存不足

```bash
# 查看内存使用情况
free -h

# 调整 Docker 内存限制
# 在 docker-compose.yml 中添加
# deploy:
#   resources:
#     limits:
#       memory: 1G
```

## 安全建议

1. **修改默认密码**
   - 更改 MySQL root 密码
   - 设置强 JWT 密钥
   - 创建专用数据库用户

2. **配置防火墙**
   - 只开放必要的端口
   - 考虑使用防火墙限制访问来源

3. **定期备份**
   - 备份数据库数据
   - 备份重要配置文件

4. **更新系统**
   - 定期更新服务器系统
   - 定期更新 Docker 镜像

## 常见问题

### Q: 为什么前端应用无法访问？
A: 检查前端容器是否正常运行，以及端口 80 是否开放。

### Q: 为什么后端 API 返回 500 错误？
A: 查看后端日志，可能是数据库连接失败或代码错误。

### Q: 如何修改数据库密码？
A: 修改 docker-compose.yml 文件中的 MYSQL_ROOT_PASSWORD 和后端 DB_PASSWORD 配置，然后重新构建启动。

### Q: 如何添加新的环境变量？
A: 在 docker-compose.yml 文件中相应服务的 environment 部分添加。

## 联系方式

如果遇到部署问题，请联系系统管理员或开发人员获取支持。
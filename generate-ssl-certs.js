const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 创建ssl目录
const sslDir = path.join(__dirname, 'ssl');
if (!fs.existsSync(sslDir)) {
  fs.mkdirSync(sslDir);
}

// 生成自签名SSL证书
console.log('生成自签名SSL证书...');

try {
  // 生成私钥
  execSync('openssl genrsa -out "' + path.join(sslDir, 'server.key') + '" 2048', {
    stdio: 'inherit'
  });
  
  // 生成证书签名请求
  execSync('openssl req -new -key "' + path.join(sslDir, 'server.key') + '" -out "' + path.join(sslDir, 'server.csr') + '" -subj "/CN=localhost"', {
    stdio: 'inherit'
  });
  
  // 生成自签名证书
  execSync('openssl x509 -req -days 365 -in "' + path.join(sslDir, 'server.csr') + '" -signkey "' + path.join(sslDir, 'server.key') + '" -out "' + path.join(sslDir, 'server.crt') + '"', {
    stdio: 'inherit'
  });
  
  console.log('SSL证书生成成功！');
  console.log('证书文件位置：', sslDir);
  
} catch (error) {
  console.error('生成SSL证书失败：', error.message);
  console.error('请确保已安装OpenSSL并添加到系统PATH中。');
}

const { execSync } = require('child_process');

// 测试用户安装的OpenSSL
const opensslPath = '"E:\\Program Files\\OpenSSL-Win64\\bin\\openssl.exe"';

console.log('=== 测试OpenSSL可用性 ===');

try {
    // 测试直接运行openssl命令
    console.log('1. 尝试直接运行openssl命令:');
    const directResult = execSync('openssl version', { encoding: 'utf8' });
    console.log('   ✅ 成功:', directResult.trim());
} catch (error) {
    console.log('   ❌ 失败:', error.message);
}

try {
    // 测试使用完整路径运行OpenSSL
    console.log('2. 尝试使用完整路径运行OpenSSL:');
    const pathResult = execSync(`${opensslPath} version`, { encoding: 'utf8' });
    console.log('   ✅ 成功:', pathResult.trim());
} catch (error) {
    console.log('   ❌ 失败:', error.message);
}

try {
    // 测试项目中的SSL证书生成脚本
    console.log('3. 检查项目中的SSL证书:');
    const fs = require('fs');
    const sslDir = './ssl';
    
    if (fs.existsSync(sslDir)) {
        const files = fs.readdirSync(sslDir);
        const certFiles = files.filter(file => file.endsWith('.crt'));
        const keyFiles = files.filter(file => file.endsWith('.key'));
        
        if (certFiles.length > 0 && keyFiles.length > 0) {
            console.log('   ✅ 找到SSL证书文件:');
            certFiles.forEach(file => console.log('     -', file));
            keyFiles.forEach(file => console.log('     -', file));
        } else {
            console.log('   ❌ 未找到SSL证书文件');
        }
    } else {
        console.log('   ❌ SSL目录不存在');
    }
} catch (error) {
    console.log('   ❌ 检查失败:', error.message);
}

console.log('=== 测试完成 ===');

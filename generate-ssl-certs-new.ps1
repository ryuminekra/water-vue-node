# PowerShell script to generate self-signed SSL certificates
$opensslPath = "E:\Program Files\OpenSSL-Win64\bin\openssl.exe"
$sslDir = "$PSScriptRoot\ssl"

# 创建ssl目录
if (-not (Test-Path $sslDir)) {
    New-Item -ItemType Directory -Path $sslDir -Force | Out-Null
}

# 删除旧证书
Write-Host "删除旧证书..."
Remove-Item "$sslDir\*.key" -ErrorAction SilentlyContinue
Remove-Item "$sslDir\*.crt" -ErrorAction SilentlyContinue
Remove-Item "$sslDir\*.csr" -ErrorAction SilentlyContinue

# 生成自签名SSL证书
Write-Host "生成自签名SSL证书..."

Try {
    # 生成私钥
    & "$opensslPath" genrsa -out "$sslDir\server.key" 2048
    Write-Host "✅ 私钥生成成功"
    
    # 生成证书签名请求
    & "$opensslPath" req -new -key "$sslDir\server.key" -out "$sslDir\server.csr" -subj "/CN=localhost"
    Write-Host "✅ 证书签名请求生成成功"
    
    # 生成自签名证书
    & "$opensslPath" x509 -req -days 365 -in "$sslDir\server.csr" -signkey "$sslDir\server.key" -out "$sslDir\server.crt"
    Write-Host "✅ 自签名证书生成成功"
    
    # 清理CSR文件
    Remove-Item "$sslDir\server.csr" -ErrorAction SilentlyContinue
    
    Write-Host "=== 证书生成完成 ==="
    Write-Host "证书文件位置: $sslDir"
    Write-Host "文件列表:"
    Get-ChildItem "$sslDir" | ForEach-Object { Write-Host "  - $($_.Name)" }
    
} Catch {
    Write-Host "❌ 生成SSL证书失败: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "请确保OpenSSL路径正确: $opensslPath" -ForegroundColor Yellow
}
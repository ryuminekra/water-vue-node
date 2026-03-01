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

# Set OpenSSL path
$opensslPath = "E:\Program Files\OpenSSL-Win64\bin\openssl.exe"

# Create ssl directory
if (!(Test-Path "ssl")) {
    New-Item -ItemType Directory -Path "ssl" | Out-Null
    Write-Host "Created ssl directory successfully"
}

Write-Host "Starting to generate SSL certificates..."

# Generate private key
try {
    & $opensslPath genrsa -out ssl\server.key 2048
    Write-Host "✅ Private key generated successfully"
} catch {
    Write-Host "❌ Failed to generate private key: $($_.Exception.Message)"
    exit 1
}

# Generate certificate signing request
try {
    & $opensslPath req -new -key ssl\server.key -out ssl\server.csr -subj "/CN=localhost"
    Write-Host "✅ Certificate signing request generated successfully"
} catch {
    Write-Host "❌ Failed to generate CSR: $($_.Exception.Message)"
    exit 1
}

# Generate self-signed certificate
try {
    & $opensslPath x509 -req -days 365 -in ssl\server.csr -signkey ssl\server.key -out ssl\server.crt
    Write-Host "✅ Self-signed certificate generated successfully"
} catch {
    Write-Host "❌ Failed to generate certificate: $($_.Exception.Message)"
    exit 1
}

# Clean up temporary files
if (Test-Path "ssl\server.csr") {
    Remove-Item -Path "ssl\server.csr" -Force
    Write-Host "Cleaned up temporary files successfully"
}

# Verify generated files
Write-Host "Verifying generated certificate files..."
if (Test-Path "ssl\server.key" -and Test-Path "ssl\server.crt") {
    $keySize = (Get-Item "ssl\server.key").Length
    $crtSize = (Get-Item "ssl\server.crt").Length
    Write-Host "✅ Certificate generation completed"
    Write-Host "Key file: ssl\server.key ($keySize bytes)"
    Write-Host "Certificate file: ssl\server.crt ($crtSize bytes)"
} else {
    Write-Host "❌ Certificate files generation failed"
    exit 1
}

Write-Host "=== Certificate generation completed ==="

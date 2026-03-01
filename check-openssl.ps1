# 检查OpenSSL是否可用的脚本
Write-Host "=== 检查OpenSSL可用性 ==="

# 尝试直接运行openssl命令
Write-Host "1. 尝试直接运行openssl命令:"
try {
    $result = openssl version
    Write-Host "   ✅ 成功: $result"
} catch {
    Write-Host "   ❌ 失败: 命令未找到"
}

# 检查Git安装目录中的OpenSSL
$gitOpenSSLPath = "C:\Program Files\Git\usr\bin\openssl.exe"
Write-Host "2. 检查Git安装目录中的OpenSSL:"
if (Test-Path $gitOpenSSLPath) {
    Write-Host "   ✅ 找到: $gitOpenSSLPath"
    try {
        $result = & $gitOpenSSLPath version
        Write-Host "   ✅ 版本: $result"
    } catch {
        Write-Host "   ❌ 运行失败: $($_.Exception.Message)"
    }
} else {
    Write-Host "   ❌ 未找到"
}

# 检查系统环境变量PATH中的OpenSSL相关路径
Write-Host "3. 检查系统环境变量PATH:"
$path = [Environment]::GetEnvironmentVariable('PATH', 'Machine')
$openSSLPaths = $path -split ';' | Where-Object { $_ -like '*openssl*' -or $_ -like '*Git*bin*' }
if ($openSSLPaths.Count -gt 0) {
    Write-Host "   ✅ 找到相关路径:"
    $openSSLPaths | ForEach-Object { Write-Host "     - $_" }
} else {
    Write-Host "   ❌ 未找到OpenSSL相关路径"
}

# 检查是否存在SSL证书文件
Write-Host "4. 检查项目中的SSL证书:"
$sslDir = "$PSScriptRoot\ssl"
if (Test-Path $sslDir) {
    $certFiles = Get-ChildItem $sslDir -Name "*.crt" -ErrorAction SilentlyContinue
    $keyFiles = Get-ChildItem $sslDir -Name "*.key" -ErrorAction SilentlyContinue
    if ($certFiles.Count -gt 0 -and $keyFiles.Count -gt 0) {
        Write-Host "   ✅ 找到SSL证书文件:"
        $certFiles | ForEach-Object { Write-Host "     - $_" }
        $keyFiles | ForEach-Object { Write-Host "     - $_" }
    } else {
        Write-Host "   ❌ 未找到SSL证书文件"
    }
} else {
    Write-Host "   ❌ SSL目录不存在"
}

Write-Host "=== 检查完成 ==="

$opensslPath = "E:\Program Files\OpenSSL-Win64\bin\openssl.exe"
$keyPath = "$PSScriptRoot\ssl\server.key"

Write-Host "检查SSL证书密钥位数..."
Write-Host "密钥文件: $keyPath"

Try {
    # 检查密钥位数
    $result = & "$opensslPath" rsa -in "$keyPath" -text -noout
    $keySizeLine = $result | Select-String "Private-Key"
    
    if ($keySizeLine) {
        Write-Host "✅ 密钥位数: $keySizeLine"
    } else {
        # 如果没有找到Private-Key行，尝试另一种方式
        $modulusLine = $result | Select-String "Modulus"
        if ($modulusLine) {
            $modulusLength = ($modulusLine -split "+")[1]
            if ($modulusLength -eq "(2048 bit)") {
                Write-Host "✅ 密钥位数: 2048位"
            } else {
                Write-Host "✅ 密钥位数: $modulusLength"
            }
        } else {
            Write-Host "❌ 无法确定密钥位数"
        }
    }
    
} Catch {
    Write-Host "❌ 检查失败: $($_.Exception.Message)"
}
$opensslPath = "E:\Program Files\OpenSSL-Win64\bin\openssl.exe"
$keyPath = "$PSScriptRoot\ssl\server.key"

Write-Host "Checking SSL certificate key size..."
Write-Host "Key file: $keyPath"

Try {
    # Check key size
    $result = & "$opensslPath" rsa -in "$keyPath" -text -noout
    Write-Host "Result:"
    Write-Host $result
    
} Catch {
    Write-Host "Error checking key size: $($_.Exception.Message)"
}
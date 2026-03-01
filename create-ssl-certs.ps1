$opensslPath = "E:\Program Files\OpenSSL-Win64\bin\openssl.exe"
$sslDir = "$PSScriptRoot\ssl"

# Create ssl directory
if (-not (Test-Path $sslDir)) {
    New-Item -ItemType Directory -Path $sslDir -Force | Out-Null
}

# Remove old certificates
Write-Host "Removing old certificates..."
Remove-Item "$sslDir\*.key" -ErrorAction SilentlyContinue
Remove-Item "$sslDir\*.crt" -ErrorAction SilentlyContinue
Remove-Item "$sslDir\*.csr" -ErrorAction SilentlyContinue

# Generate self-signed SSL certificates
Write-Host "Generating self-signed SSL certificates..."

Try {
    # Generate private key
    & "$opensslPath" genrsa -out "$sslDir\server.key" 2048
    Write-Host "Private key generated successfully"
    
    # Generate certificate signing request
    & "$opensslPath" req -new -key "$sslDir\server.key" -out "$sslDir\server.csr" -subj "/CN=localhost"
    Write-Host "Certificate signing request generated successfully"
    
    # Generate self-signed certificate
    & "$opensslPath" x509 -req -days 365 -in "$sslDir\server.csr" -signkey "$sslDir\server.key" -out "$sslDir\server.crt"
    Write-Host "Self-signed certificate generated successfully"
    
    # Clean up CSR file
    Remove-Item "$sslDir\server.csr" -ErrorAction SilentlyContinue
    
    Write-Host "=== Certificate generation completed ==="
    Write-Host "Certificate files location: $sslDir"
    Write-Host "File list:"
    Get-ChildItem "$sslDir" | ForEach-Object { Write-Host "  - $($_.Name)" }
    
} Catch {
    Write-Host "Error generating SSL certificates: $($_.Exception.Message)"
    Write-Host "Please ensure OpenSSL path is correct: $opensslPath"
}
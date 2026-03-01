# Backend build script
Write-Host "Starting backend project build..." -ForegroundColor Green

# Check Node.js and npm versions
Write-Host "Checking Node.js and npm versions..." -ForegroundColor Cyan
try {
    $nodeVersion = node -v
    $npmVersion = npm -v
    Write-Host "Node.js version: $nodeVersion"
    Write-Host "npm version: $npmVersion"
} catch {
    Write-Host "Error: Failed to check Node.js or npm versions" -ForegroundColor Red
    Read-Host "Press Enter to exit..."
    exit 1
}

Write-Host ""

# Build project
Write-Host "Building project..." -ForegroundColor Cyan
Write-Host "Note: Backend project is a Node.js application, no build needed, just copy files"

Write-Host ""

# Create dist directory
Write-Host "Creating dist directory..." -ForegroundColor Cyan
if (-not (Test-Path "dist")) {
    New-Item -ItemType Directory -Path "dist" | Out-Null
    Write-Host "Created dist directory"
} else {
    Write-Host "dist directory already exists"
}

Write-Host ""

# Copy necessary files to dist directory
Write-Host "Copying files to dist directory..." -ForegroundColor Cyan

$filesToCopy = @(
    "package.json",
    "package-lock.json",
    "app.js"
)

foreach ($file in $filesToCopy) {
    Write-Host "Copying $file..."
    try {
        Copy-Item $file -Destination "dist\" -Force
        Write-Host "Copied $file successfully"
    } catch {
        Write-Host "Error: Failed to copy $file" -ForegroundColor Red
    }
}

Write-Host ""

# Copy directories
$directoriesToCopy = @(
    "config",
    "middleware",
    "models",
    "routes",
    "services"
)

foreach ($dir in $directoriesToCopy) {
    Write-Host "Copying $dir directory..."
    if (Test-Path $dir) {
        try {
            $destination = "dist\$dir"
            if (-not (Test-Path $destination)) {
                New-Item -ItemType Directory -Path $destination | Out-Null
            }
            Copy-Item "$dir\*" -Destination $destination -Recurse -Force
            Write-Host "Copied $dir directory successfully"
        } catch {
            Write-Host "Error: Failed to copy $dir directory" -ForegroundColor Red
        }
    } else {
        Write-Host "$dir directory does not exist"
    }
}

Write-Host ""

# Copy environment variable file
Write-Host "Copying .env file..." -ForegroundColor Cyan
if (Test-Path ".env") {
    try {
        Copy-Item ".env" -Destination "dist\" -Force
        Write-Host "Copied .env file successfully"
    } catch {
        Write-Host "Error: Failed to copy .env file" -ForegroundColor Red
    }
} else {
    Write-Host ".env file does not exist"
}

Write-Host ""

Write-Host "Build completed!" -ForegroundColor Green
Write-Host "Build files location: $((Get-Location).Path)\dist"
Write-Host "Deployment steps:" -ForegroundColor Cyan
Write-Host "1. Copy dist directory to target server"
Write-Host "2. Run on target server: npm install"
Write-Host "3. Run on target server: npm start"

Write-Host ""
Read-Host "Press Enter to exit..."

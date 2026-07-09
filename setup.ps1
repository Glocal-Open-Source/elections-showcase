$ErrorActionPreference = "Stop"

$Repo      = "https://github.com/Glocal-Open-Source/showcase.git"
$AssetsZip = "https://github.com/Glocal-Open-Source/showcase/archive/refs/heads/gh-pages.zip"

Write-Host "==> Cloning source code..."
git clone $Repo showcase
Set-Location showcase

Write-Host "==> Installing dependencies..."
npm install

Write-Host "==> Downloading built assets (PDFs, thumbnails, media)..."
Invoke-WebRequest -Uri $AssetsZip -OutFile gh-pages.zip

Write-Host "==> Extracting assets..."
Expand-Archive -Path gh-pages.zip -DestinationPath . -Force
New-Item -ItemType Directory -Force -Path public/content, public/thumbnails | Out-Null
Copy-Item -Recurse -Force "showcase-gh-pages/content/*"    public/content/
Copy-Item -Recurse -Force "showcase-gh-pages/thumbnails/*" public/thumbnails/
Remove-Item -Recurse -Force gh-pages.zip, showcase-gh-pages

Write-Host ""
Write-Host "All done! Run:  npm run dev"

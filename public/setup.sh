#!/usr/bin/env bash
set -e

REPO="https://github.com/Glocal-Open-Source/showcase.git"
ASSETS_ZIP="https://github.com/Glocal-Open-Source/showcase/archive/refs/heads/gh-pages.zip"

echo "==> Cloning source code..."
git clone "$REPO" showcase
cd showcase

echo "==> Installing dependencies..."
npm install

echo "==> Downloading built assets (PDFs, thumbnails, media)..."
curl -L "$ASSETS_ZIP" -o gh-pages.zip

echo "==> Extracting assets..."
unzip -q gh-pages.zip
mkdir -p public/content public/thumbnails
cp -r showcase-gh-pages/content/. public/content/
cp -r showcase-gh-pages/thumbnails/. public/thumbnails/
rm -rf gh-pages.zip showcase-gh-pages

echo ""
echo "All done! Run:  npm run dev"

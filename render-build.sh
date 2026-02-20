#!/usr/bin/env bash
# exit on error
set -o errexit

npm install

# Instala o Chrome para o Puppeteer funcionar
if [[ ! -d $PUPPETEER_CACHE_DIR ]]; then
  echo "...Instalando Chrome..."
  node node_modules/puppeteer/install.mjs
fi
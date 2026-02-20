#!/usr/bin/env bash
# exit on error
set -o errexit

npm install
# Instala o navegador necessário para o bot
npx puppeteer browsers install chrome
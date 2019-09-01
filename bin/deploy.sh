#!/bin/bash
set -e

# Générer les cartes et les déplacer
npm run generate-blockmap-images
npm run import-blockmap-images

# Transpiler les sources du viewer
npm run build
echo "Build done."

# Déplacer le build dans le dossier du serveur web
rm -r /www/data/*
mv build/* /www/data
echo "Moved build data in /www/data"
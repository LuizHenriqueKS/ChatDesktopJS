@echo off
if not exist node_modules (npm install)
npm run electron:serve
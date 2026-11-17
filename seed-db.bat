@echo off
title FreelanceHub Database Seeder
echo ================================================================
echo           FreelanceHub - Populating MongoDB Atlas Database
echo ================================================================
echo.
cd /d %~dp0server
node seed.js
echo.
echo ================================================================
echo Seeding complete! Press any key to close this window.
echo ================================================================
pause

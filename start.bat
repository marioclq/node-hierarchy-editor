@echo off
echo.
echo ===============================================
echo    Node Hierarchy Editor - Instalacion Rapida
echo ===============================================
echo.

echo 📦 Instalando dependencias...
call npm install

if %ERRORLEVEL% neq 0 (
    echo ❌ Error al instalar dependencias
    echo Intentando con --legacy-peer-deps...
    call npm install --legacy-peer-deps
)

echo.
echo ✅ Instalacion completada!
echo.
echo 🚀 Iniciando aplicacion...
echo.
echo La aplicacion se abrira en: http://localhost:3000
echo.
call npm start

pause
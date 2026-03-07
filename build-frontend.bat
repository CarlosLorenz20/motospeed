@echo off
REM Script para compilar el frontend para producción
REM Ejecutar desde la carpeta raíz del proyecto

echo ==========================================
echo   MotoSpeed - Build para Producción
echo ==========================================
echo.

REM Verificar que estamos en la carpeta correcta
if not exist "frontend\package.json" (
    echo ERROR: Ejecuta este script desde la carpeta raiz del proyecto MotoSpeed
    pause
    exit /b 1
)

echo [1/3] Navegando a la carpeta frontend...
cd frontend

echo [2/3] Instalando dependencias...
call npm install

echo [3/3] Compilando para produccion...
call npm run build

echo.
echo ==========================================
echo   BUILD COMPLETADO!
echo ==========================================
echo.
echo Los archivos estan en: frontend\dist\
echo.
echo SIGUIENTE PASO:
echo Sube el contenido de la carpeta 'dist' a Hostinger
echo (public_html de tu dominio motosspeed.com)
echo.
echo No olvides subir tambien el archivo .htaccess
echo que esta en frontend\public\.htaccess
echo.
pause

@echo off

REM Check if a file is dragged onto the batch file
if "%~1"=="" (
    echo Drag a file onto this batch file.
    pause
    exit /b
)

REM Pass the file path to the Node.js script
node "./index.js" "%~1"

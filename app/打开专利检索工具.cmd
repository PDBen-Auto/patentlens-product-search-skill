@echo off
setlocal
"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-patentlens.ps1" %*
set "PATENTLENS_EXIT_CODE=%ERRORLEVEL%"
if not "%PATENTLENS_EXIT_CODE%"=="0" (
  echo.
  echo PatentLens could not start. See the error above.
  pause
)
exit /b %PATENTLENS_EXIT_CODE%

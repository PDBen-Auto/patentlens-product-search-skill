$ErrorActionPreference = 'Stop'
$dataDir = if ($env:PATENTLENS_DATA_DIR) { $env:PATENTLENS_DATA_DIR } else { Join-Path $env:USERPROFILE 'PatentLens-records' }
$venv = Join-Path $dataDir '.venv'
$python = if ($env:PATENTLENS_PYTHON) { $env:PATENTLENS_PYTHON } else { (Get-Command python -ErrorAction Stop).Source }
if (-not (Test-Path -LiteralPath (Join-Path $venv 'Scripts\python.exe'))) {
    & $python -m venv $venv
    if ($LASTEXITCODE -ne 0) { throw 'Python virtual environment creation failed.' }
}
$venvPython = Join-Path $venv 'Scripts\python.exe'
& $venvPython -m pip install 'pypdf>=5,<7' 'pypdfium2>=4.30,<5'
if ($LASTEXITCODE -ne 0) { throw 'PDF package installation failed.' }
& $venvPython -c 'import pypdf, pypdfium2; print("PDF dependencies available")'
if ($LASTEXITCODE -ne 0) { throw 'PDF package verification failed.' }

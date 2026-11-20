$ErrorActionPreference = 'Stop'
$dataDir = if ($env:PATENTLENS_DATA_DIR) { $env:PATENTLENS_DATA_DIR } else { Join-Path $env:USERPROFILE 'PatentLens-records' }
$pidFile = Join-Path $dataDir '.patentlens.pid'
if (Test-Path -LiteralPath $pidFile) {
    $taskProcessId = [int](Get-Content -LiteralPath $pidFile)
    $taskProcess = Get-CimInstance Win32_Process -Filter "ProcessId=$taskProcessId" -ErrorAction SilentlyContinue
    $expectedScript = Join-Path $PSScriptRoot 'server.mjs'
    if ($taskProcess -and $taskProcess.CommandLine.Contains($expectedScript)) { Stop-Process -Id $taskProcessId; Remove-Item -LiteralPath $pidFile }
}

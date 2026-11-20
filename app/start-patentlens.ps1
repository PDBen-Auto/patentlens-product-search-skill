param([switch]$NoBrowser)
$ErrorActionPreference = 'Stop'
$taskRoot = $PSScriptRoot
$taskPort = if ($env:PATENTLENS_PORT) { [int]$env:PATENTLENS_PORT } else { 48972 }
$taskUrl = "http://127.0.0.1:$taskPort"
$dataDir = if ($env:PATENTLENS_DATA_DIR) { $env:PATENTLENS_DATA_DIR } else { Join-Path $env:USERPROFILE 'PatentLens-records' }
New-Item -ItemType Directory -Path $dataDir -Force | Out-Null
$nodeCommand = Get-Command node -ErrorAction SilentlyContinue
$nodePath = if ($nodeCommand) { $nodeCommand.Source } else { '' }
if (-not (Test-Path -LiteralPath $nodePath)) { throw '未找到 Node.js。请安装 Node.js 22 或更新版后重试。' }
$running = $false
try { $health = Invoke-RestMethod -Uri "$taskUrl/api/health" -TimeoutSec 2; $running = $health.ok -and $health.version -eq '1.2.0' } catch { }
if (-not $running) {
    $listener = Get-NetTCPConnection -LocalPort $taskPort -State Listen -ErrorAction SilentlyContinue
    if ($listener) { throw "端口 $taskPort 已被其他服务占用。请设置 PATENTLENS_PORT 后重试。" }
    $process = Start-Process -FilePath $nodePath -ArgumentList @(('"' + (Join-Path $taskRoot 'server.mjs') + '"')) -WorkingDirectory $taskRoot -WindowStyle Hidden -PassThru
    Set-Content -LiteralPath (Join-Path $dataDir '.patentlens.pid') -Value $process.Id
    for ($attempt=0; $attempt -lt 30; $attempt++) {
        Start-Sleep -Milliseconds 300
        if ($process.HasExited) { throw '服务未能启动，端口可能被其他应用占用。可在终端运行 node server.mjs 查看具体错误。' }
        try { $health = Invoke-RestMethod -Uri "$taskUrl/api/health" -TimeoutSec 1; if ($health.ok -and $health.version -eq '1.2.0') { $running = $true; break } } catch { }
    }
}
if (-not $running) { throw '未能连接本机检索服务。' }
if (-not $NoBrowser) { Start-Process $taskUrl }

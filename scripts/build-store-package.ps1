$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$manifest = Get-Content -Raw -Encoding UTF8 (Join-Path $projectRoot "manifest.json") |
  ConvertFrom-Json
$releaseRoot = Join-Path $projectRoot "release"
$destination = Join-Path $releaseRoot "zhen-huisuan-v$($manifest.version)-store.zip"

$runtimeFiles = @(
  "manifest.json",
  "popup.html",
  "popup.css",
  "popup.js",
  "currency-core.js",
  "i18n.js",
  "icons",
  "assets",
  "_locales"
) | ForEach-Object { Join-Path $projectRoot $_ }

foreach ($path in $runtimeFiles) {
  if (-not (Test-Path -LiteralPath $path)) {
    throw "Missing runtime path: $path"
  }
}

New-Item -ItemType Directory -Force -Path $releaseRoot | Out-Null
Compress-Archive -LiteralPath $runtimeFiles -DestinationPath $destination -Force

Write-Output $destination

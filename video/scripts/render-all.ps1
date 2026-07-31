$ErrorActionPreference = "Stop"

$videoRoot = Split-Path -Parent $PSScriptRoot
$remotion = Join-Path $videoRoot "node_modules\.bin\remotion.cmd"
$ffmpeg = Join-Path $videoRoot "node_modules\@remotion\compositor-win32-x64-msvc\ffmpeg.exe"
$entry = Join-Path $videoRoot "src\index.ts"
$outputRoot = Join-Path $videoRoot "out\final"
$deliveryRoot = Join-Path $videoRoot "out\delivery"

New-Item -ItemType Directory -Force -Path $outputRoot | Out-Null
New-Item -ItemType Directory -Force -Path $deliveryRoot | Out-Null
Push-Location $videoRoot

try {
  $renders = @(
    @{
      Composition = "ZhenHuiSuanZhBgm"
      Output = "zhen-huisuan-promo-zh.mp4"
    },
    @{
      Composition = "ZhenHuiSuanZhNoBgm"
      Output = "zhen-huisuan-promo-zh-no-bgm.mp4"
    },
    @{
      Composition = "ZhenHuiSuanEnBgm"
      Output = "zhen-huisuan-promo-en.mp4"
    },
    @{
      Composition = "ZhenHuiSuanEnNoBgm"
      Output = "zhen-huisuan-promo-en-no-bgm.mp4"
    }
  )

  foreach ($render in $renders) {
    $destination = Join-Path $outputRoot $render.Output
    Write-Output "START $($render.Composition) -> $destination"
    & $remotion render $entry $render.Composition $destination `
      --codec=h264 `
      --crf=16 `
      --pixel-format=yuv420p `
      --concurrency=50% `
      --overwrite

    if ($LASTEXITCODE -ne 0) {
      throw "Render failed: $($render.Composition) (exit $LASTEXITCODE)"
    }

    Write-Output "DONE  $($render.Composition)"

    $delivery = Join-Path $deliveryRoot $render.Output
    Write-Output "NORMALIZE $destination -> $delivery"
    & $ffmpeg -y -hide_banner -loglevel error `
      -i $destination `
      -map 0:v:0 `
      -map 0:a:0 `
      -c:v copy `
      -af "loudnorm=I=-16:LRA=11:TP=-1.5" `
      -c:a aac `
      -b:a 192k `
      -movflags +faststart `
      $delivery

    if ($LASTEXITCODE -ne 0) {
      throw "Audio normalization failed: $($render.Composition) (exit $LASTEXITCODE)"
    }

    Write-Output "READY $delivery"
  }
}
finally {
  Pop-Location
}

Set-Location -Path /workspace/soc.stat

npm run test

$env:APP_API_TOKEN = "local-test-token"
$proc = Start-Process -FilePath node -ArgumentList "src/server.mjs" -PassThru
Start-Sleep -Seconds 1
try {
  Invoke-WebRequest -Uri "http://127.0.0.1:3000/health" | Out-Null
}
finally {
  if ($null -ne $proc -and -not $proc.HasExited) {
    Stop-Process -Id $proc.Id -Force
  }
}


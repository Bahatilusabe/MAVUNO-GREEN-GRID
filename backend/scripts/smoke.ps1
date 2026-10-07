$base = "http://localhost:4000/api"

Write-Host "health:" (Invoke-RestMethod "$base/health" | ConvertTo-Json -Compress)

$login = Invoke-RestMethod "$base/auth/login" -Method Post -ContentType "application/json" `
  -Body '{"email":"samuel@mavuno.test","password":"Password123!"}'
Write-Host "login user:" ($login.user | ConvertTo-Json -Compress)

Invoke-RestMethod "$base/overview" -Headers @{ Authorization = "Bearer $($login.token)" } |
  ConvertTo-Json -Depth 5

Write-Host "weather:"
Invoke-RestMethod "$base/weather/forecast?lat=-0.5186&lon=37.3675" -Headers @{ Authorization = "Bearer $($login.token)" } |
  ConvertTo-Json -Depth 3

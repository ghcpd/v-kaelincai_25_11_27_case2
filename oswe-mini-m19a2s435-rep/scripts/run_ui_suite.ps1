# Start vite server in background and run tests
$ps = Start-Process -FilePath npm -ArgumentList 'run','dev' -PassThru
Start-Sleep -Seconds 2
node tests\run_suite.js
Stop-Process -Id $ps.Id -Force
Write-Output 'UI tests completed.'

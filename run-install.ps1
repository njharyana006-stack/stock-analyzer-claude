$env:PATH = [System.Environment]::GetEnvironmentVariable('PATH', 'Machine') + ';' + [System.Environment]::GetEnvironmentVariable('PATH', 'User')
Set-Location 'C:\Users\nashw\Downloads\stock-analyzer-rev03'
if (Test-Path 'node_modules') { Remove-Item -Recurse -Force 'node_modules' }
if (Test-Path 'package-lock.json') { Remove-Item -Force 'package-lock.json' }
npm install

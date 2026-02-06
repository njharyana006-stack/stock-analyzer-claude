$env:PATH = [System.Environment]::GetEnvironmentVariable('PATH', 'Machine') + ';' + [System.Environment]::GetEnvironmentVariable('PATH', 'User')
Set-Location 'C:\Users\nashw\Downloads\stock-analyzer-rev03'
npm run dev

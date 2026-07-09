$ErrorActionPreference = "Stop"
Set-Location -LiteralPath $PSScriptRoot

$pyLauncher = Get-Command py -ErrorAction SilentlyContinue
if ($pyLauncher) {
  & py -3 .\bulk_project_adder.py
  exit $LASTEXITCODE
}

$python = Get-Command python -ErrorAction SilentlyContinue
if ($python) {
  & python .\bulk_project_adder.py
  exit $LASTEXITCODE
}

Write-Host "Python 3 was not found. Install Python 3, then run this launcher again."
Read-Host "Press Enter to close"
exit 1

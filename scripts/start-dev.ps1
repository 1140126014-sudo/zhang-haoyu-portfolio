$project = (Get-Item -LiteralPath 'D:\WORKSP~1\PROJEC~4').FullName
$nodeBin = 'C:\Users\WIDNOWS\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin'
$node = Join-Path $nodeBin 'node.exe'
$script = Join-Path $project 'scripts\dev-server.mjs'
$log = Join-Path $project 'vite-dev.log'

$env:PATH = "$nodeBin;$env:PATH"
Set-Location -LiteralPath $project
& $node $script *> $log

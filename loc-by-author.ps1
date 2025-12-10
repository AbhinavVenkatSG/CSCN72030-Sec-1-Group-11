# loc-by-author.ps1
# Count current lines of code per author for selected file types

$patterns = @("*.cs","*.ts","*.tsx","*.mjs","*.spec.ts","*.bat")

# Get all matching tracked files from Git
$files = git ls-files $patterns

if (-not $files) {
    Write-Host "No matching files found by git ls-files. Are you in the repo root?" -ForegroundColor Yellow
    exit 1
}

$authors = @()

foreach ($file in $files) {
    # Get blame info and extract 'author ' lines
    $blameLines = git blame --line-porcelain $file 2>$null | Select-String "^author "
    foreach ($line in $blameLines) {
        $authors += ($line.Line -replace "^author ", "")
    }
}

if (-not $authors) {
    Write-Host "No authors found from git blame. Is this a Git repo with commits?" -ForegroundColor Yellow
    exit 1
}

$authors |
    Group-Object |
    Sort-Object Count -Descending |
    Select-Object @{Name="Lines";Expression={$_.Count}}, @{Name="Author";Expression={$_.Name}} |
    Format-Table -AutoSize

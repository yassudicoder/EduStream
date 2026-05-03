# EduStream Auto-Commit Script
# Usage: Right-click and "Run with PowerShell" OR run: .\autocommit.ps1 "your message"

param(
    [string]$Message = ""
)

Set-Location "C:\Users\yashd\Downloads\ELS5\edustream"

# Check if there are any changes
$status = git status --porcelain
if (-not $status) {
    Write-Host "✅ Nothing to commit — working tree clean." -ForegroundColor Green
    exit 0
}

# Build commit message
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
$changedFiles = git diff --name-only HEAD
$stagedFiles  = git diff --cached --name-only

# Auto-detect what changed for smart title
$allChanged = git status --short
$pages     = ($allChanged | Select-String "app/").Count
$lib       = ($allChanged | Select-String "lib/").Count
$styles    = ($allChanged | Select-String "globals.css|layout").Count
$admin     = ($allChanged | Select-String "admin/").Count
$community = ($allChanged | Select-String "community/").Count
$arena     = ($allChanged | Select-String "arena/").Count
$studio    = ($allChanged | Select-String "studio/").Count

$parts = @()
if ($admin)     { $parts += "creator hub" }
if ($community) { $parts += "community" }
if ($arena)     { $parts += "arena" }
if ($studio)    { $parts += "studio" }
if ($styles)    { $parts += "theme/UI" }
if ($lib)       { $parts += "store/logic" }
if ($pages -gt 0 -and $parts.Count -eq 0) { $parts += "pages" }

$autoTitle = if ($parts.Count -gt 0) { "update: " + ($parts -join ", ") } else { "update: general changes" }
$finalMessage = if ($Message -ne "") { $Message } else { "$autoTitle [$timestamp]" }

# Stage all
git add .

# Commit
git commit -m $finalMessage

# Push
git push origin main

Write-Host ""
Write-Host "🚀 Pushed to GitHub!" -ForegroundColor Cyan
Write-Host "📝 Commit: $finalMessage" -ForegroundColor Yellow
Write-Host "🔗 https://github.com/yassudicoder/EduStream" -ForegroundColor Blue

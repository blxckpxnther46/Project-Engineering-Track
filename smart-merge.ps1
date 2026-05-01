$branches = @(
    "refactor/scale-design",
    "fix/api-tests",
    "expense-wars-logging-fix",
    "feat/validation-middleware",
    "fix/broken-api",
    "fix/error-handler",
    "refactor/clean-sweep",
    "quickseat-concurrency-fix",
    "fix-caching",
    "optimize/sprint-parthasarathy",
    "fix/stabilizer-parthasarathy",
    "fix/production-db-bugs",
    "refactor/token-validation",
    "indexing",
    "seo",
    "formulation",
    "catalog",
    "community-tool",
    "core-marketplace",
    "fridge-app",
    "reviews",
    "localconnect-app",
    "creative-mode",
    "node-api",
    "pr-auto-writer",
    "chatbot",
    "refactor/cleanup",
    "pain-and-ship",
    "token-fix"
)

function Wait-For-CI {
    Write-Host "⏳ Waiting for CI..."
    gh run watch --exit-status

    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ CI failed. Stopping automation."
        exit 1
    }

    Write-Host "✅ CI passed"
}

git checkout main
git pull origin main

foreach ($branch in $branches) {

    Write-Host "`n==============================="
    Write-Host "🔍 Processing $branch"
    Write-Host "==============================="

    # Fetch branch
    git fetch origin $branch 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "⚠️ Branch not found or fetch failed → Skipping"
        continue
    }

    # Check diff
    $diff = git diff --name-only main origin/$branch

    if (-not $diff) {
        Write-Host "⚠️ No file changes → Skipping $branch"
        continue
    }

    Write-Host "📁 Files changed:"
    $diff

    # Merge
    git merge origin/$branch
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Merge conflict in $branch"
        Write-Host "👉 Resolve manually, then re-run script"
        exit 1
    }

    # Push
    git push origin main
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Push failed"
        exit 1
    }

    # Wait for CI
    Wait-For-CI
}

Write-Host "`n🎉 ALL VALID BRANCHES MERGED SUCCESSFULLY"
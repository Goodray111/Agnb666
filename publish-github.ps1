<#
.SYNOPSIS
  Publish my-site to GitHub and switch on GitHub Pages.

.USAGE
  .\publish-github.ps1                  # asks for a token, then does everything
  .\publish-github.ps1 -Token ghp_xxx   # or pass it directly

.TOKEN
  The token needs, on the account that owns the repository:
    - fine-grained token: "Administration" (write) and "Contents" (write) for the repository
    - or a classic token with the "repo" scope

  Nothing is written to disk with the token in it.
#>
param(
    [string]$Token,
    [string]$Owner = "Goodray111",
    [string]$Repo = "my-site",
    [switch]$SkipCreate
)

$ErrorActionPreference = "Stop"
$git = "C:\Program Files\Git\cmd\git.exe"
if (-not (Test-Path $git)) { $git = "git" }

function Api($method, $url, $body) {
    $headers = @{
        "Authorization"        = "Bearer $Token"
        "Accept"               = "application/vnd.github+json"
        "X-GitHub-Api-Version" = "2022-11-28"
        "User-Agent"           = "my-site-publisher"
    }
    $params = @{ Method = $method; Uri = $url; Headers = $headers; ContentType = "application/json" }
    if ($body) { $params["Body"] = ($body | ConvertTo-Json -Depth 6) }
    return Invoke-RestMethod @params
}

if (-not $Token) {
    $secure = Read-Host "Paste your GitHub token (input hidden)" -AsSecureString
    $Token = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
        [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure))
}
if (-not $Token) { throw "No token given." }

Write-Host "`n[1/5] Checking the token and the account ..." -ForegroundColor Cyan
$me = Api "GET" "https://api.github.com/user" $null
Write-Host "      signed in as $($me.login)"
if ($me.login -ne $Owner) {
    Write-Host "      note: the token belongs to $($me.login), not $Owner" -ForegroundColor Yellow
    $Owner = $me.login
}

Write-Host "`n[2/5] Creating github.com/$Owner/$Repo if it does not exist ..." -ForegroundColor Cyan
$created = $false
$exists = $false
try {
    $null = Api "GET" "https://api.github.com/repos/$Owner/$Repo" $null
    $exists = $true
    Write-Host "      repository already exists"
} catch {
    if ($_.Exception.Response.StatusCode.value__ -ne 404) {
        Write-Host "      could not look the repository up: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

if (-not $exists) {
    if ($SkipCreate) {
        throw "github.com/$Owner/$Repo does not exist yet. Create it first (public, no README), then run again."
    }
    try {
        $null = Api "POST" "https://api.github.com/user/repos" @{
            name        = $Repo
            description = "Learning the Web - a four-page course project, built with HTML, CSS and JavaScript"
            homepage    = "https://$($Owner.ToLower()).github.io/$Repo/"
            private     = $false
            has_issues  = $true
            has_wiki    = $false
            auto_init   = $false
        }
        $created = $true
        Write-Host "      created"
    } catch {
        Write-Host ""
        Write-Host "      Cannot create the repository with this token." -ForegroundColor Yellow
        Write-Host "      Either give the token the 'Administration: Read and write' permission," -ForegroundColor Yellow
        Write-Host "      or create it by hand at https://github.com/new (name: $Repo, Public, no README)" -ForegroundColor Yellow
        Write-Host "      and then run this script again with -SkipCreate." -ForegroundColor Yellow
        throw
    }
}

Write-Host "`n[3/5] Pushing main ..." -ForegroundColor Cyan
$remote = "https://github.com/$Owner/$Repo.git"
& $git -C $PSScriptRoot remote remove origin 2>$null
& $git -C $PSScriptRoot remote add origin $remote

# push with the token in memory only - it is never written to .git/config
$env:GITHUB_TOKEN = $Token
$helper = '!f() { echo username=x-access-token; echo password=$GITHUB_TOKEN; }; f'
& $git -C $PSScriptRoot -c "credential.helper=$helper" push origin "main:main" --force
$code = $LASTEXITCODE
Remove-Item Env:\GITHUB_TOKEN -ErrorAction SilentlyContinue
if ($code -ne 0) { throw "push failed" }
Write-Host "      pushed $(& $git -C $PSScriptRoot rev-list --count HEAD) commits"

Write-Host "`n[4/5] Switching on GitHub Pages (branch main, root) ..." -ForegroundColor Cyan
try {
    $pages = Api "GET" "https://api.github.com/repos/$Owner/$Repo/pages" $null
    $null = Api "PUT" "https://api.github.com/repos/$Owner/$Repo/pages" @{
        source = @{ branch = "main"; path = "/" }
    }
    Write-Host "      updated"
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 404) {
        $null = Api "POST" "https://api.github.com/repos/$Owner/$Repo/pages" @{
            source = @{ branch = "main"; path = "/" }
        }
        Write-Host "      enabled"
    } else { throw }
}

Write-Host "`n[5/5] Waiting for the first build ..." -ForegroundColor Cyan
$url = "https://$($Owner.ToLower()).github.io/$Repo/"
for ($i = 0; $i -lt 30; $i++) {
    Start-Sleep -Seconds 6
    try {
        $status = Api "GET" "https://api.github.com/repos/$Owner/$Repo/pages/builds/latest" $null
        if ($status.status -eq "built") { break }
    } catch { }
    Write-Host "      still building ($($i + 1)/30)"
}

Write-Host "`nDone." -ForegroundColor Green
Write-Host "  repository : https://github.com/$Owner/$Repo"
Write-Host "  live site  : $url"
Write-Host "  (the first deployment can take a minute; refresh if it is not there yet)"

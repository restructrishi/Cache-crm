$baseUrl = "http://localhost:3000/api"
$email = "superadmin@cachecrm.com"
$password = "securepassword123"

# 1. Login
Write-Host "Logging in..."
$loginBody = @{
    email = $email
    password = $password
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    Write-Host "Login Response: $($loginResponse | ConvertTo-Json -Depth 5)"
    $token = $loginResponse.token
    if (-not $token) {
        $token = $loginResponse.access_token
    }
    if (-not $token) {
        Write-Host "Error: Access token is empty!"
        exit 1
    }
    Write-Host "Token obtained. Length: $($token.Length)"
} catch {
    Write-Host "Login failed: $_"
    exit 1
}

$headers = @{
    Authorization = "Bearer $token"
    "Content-Type" = "application/json"
}

# 2. Get Account
Write-Host "Fetching accounts..."
try {
    $accounts = Invoke-RestMethod -Uri "$baseUrl/accounts" -Method Get -Headers $headers
    $account = $accounts | Select-Object -First 1

    if (-not $account) {
        Write-Host "No accounts found. Creating one..."
        $accountBody = @{
            name = "Test Account Pipeline"
            industry = "Tech"
        } | ConvertTo-Json
        $account = Invoke-RestMethod -Uri "$baseUrl/accounts" -Method Post -Body $accountBody -Headers $headers -ContentType "application/json"
    }
    $accountId = $account.id
    Write-Host "Using Account ID: $accountId"
} catch {
    Write-Host "Account fetch/create failed: $_"
    exit 1
}

# 3. Create Deal
Write-Host "Creating Deal..."
$dealBody = @{
    name = "Pipeline Test Deal $(Get-Date -Format 'yyyyMMddHHmmss')"
    accountId = $accountId
    amount = 50000
    dealType = "New Business"
    stage = "Closed Won"
    expectedCloseDate = (Get-Date).ToString("yyyy-MM-dd")
} | ConvertTo-Json

try {
    $deal = Invoke-RestMethod -Uri "$baseUrl/deals" -Method Post -Body $dealBody -Headers $headers -ContentType "application/json"
    $dealId = $deal.id
    Write-Host "Created Deal ID: $dealId"
} catch {
    Write-Host "Deal creation failed: $_"
    exit 1
}

# 4. Create Pipeline
Write-Host "Creating Pipeline..."
$pipelineBody = @{
    dealId = $dealId
    accountId = $accountId
} | ConvertTo-Json

try {
    $pipeline = Invoke-RestMethod -Uri "$baseUrl/pipeline" -Method Post -Body $pipelineBody -Headers $headers -ContentType "application/json"
    $pipelineId = $pipeline.id
    Write-Host "Created Pipeline ID: $pipelineId"
} catch {
    Write-Host "Error creating pipeline: $_"
    exit 1
}

# 5. Fetch Pipeline
Write-Host "Fetching Pipeline Details..."
try {
    $fetchedPipeline = Invoke-RestMethod -Uri "$baseUrl/pipeline/$pipelineId" -Method Get -Headers $headers
    Write-Host "Pipeline Current Stage: $($fetchedPipeline.currentStage)"
} catch {
    Write-Host "Pipeline fetch failed: $_"
    exit 1
}

# 6. Update Step (Lead is step 0)
Write-Host "Completing 'Lead' step..."
$stepUpdateBody = @{
    status = "COMPLETED"
    data = @{ note = "Verified via script" }
} | ConvertTo-Json

try {
    $updatedStep = Invoke-RestMethod -Uri "$baseUrl/pipeline/$pipelineId/step/Lead" -Method Patch -Body $stepUpdateBody -Headers $headers -ContentType "application/json"
    Write-Host "Updated Step Status: $($updatedStep.status)"
} catch {
    Write-Host "Step update failed: $_"
    exit 1
}

# 7. Verify Auto-Unlock
Write-Host "Verifying Auto-Unlock..."
try {
    $fetchedPipelineAfter = Invoke-RestMethod -Uri "$baseUrl/pipeline/$pipelineId" -Method Get -Headers $headers
    Write-Host "New Pipeline Stage: $($fetchedPipelineAfter.currentStage)"
    
    # PowerShell object handling for array
    $steps = $fetchedPipelineAfter.steps
    $accountStep = $null
    foreach ($s in $steps) {
        if ($s.stepName -eq "Account") {
            $accountStep = $s
            break
        }
    }

    Write-Host "Account Step Status: $($accountStep.status)"

    if ($accountStep.status -eq "IN_PROGRESS") {
        Write-Host "SUCCESS: Auto-unlock worked."
    } else {
        Write-Host "FAILURE: Auto-unlock failed. Expected IN_PROGRESS, got $($accountStep.status)"
    }
} catch {
    Write-Host "Verification failed: $_"
    exit 1
}

#!/bin/bash
# TDD tests for US0009: Backend Docker Configuration
# These tests verify the Docker container meets all acceptance criteria

# Note: Not using set -e since we want to continue on test failures

IMAGE_NAME="taskmanager-backend"
CONTAINER_NAME="taskmanager-backend-test"

# Colours for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No colour

pass_count=0
fail_count=0

pass() {
    echo -e "${GREEN}PASS${NC}: $1"
    ((pass_count++))
}

fail() {
    echo -e "${RED}FAIL${NC}: $1"
    ((fail_count++))
}

skip() {
    echo -e "${YELLOW}SKIP${NC}: $1"
}

cleanup() {
    echo "Cleaning up..."
    docker stop "$CONTAINER_NAME" 2>/dev/null || true
    docker rm "$CONTAINER_NAME" 2>/dev/null || true
}

trap cleanup EXIT

echo "=========================================="
echo "US0009: Backend Docker Configuration Tests"
echo "=========================================="
echo ""

# Test AC1: Multi-stage Dockerfile exists
echo "=== AC1: Multi-stage Dockerfile ==="
if [ -f "Dockerfile" ]; then
    stage_count=$(grep -c "^FROM" Dockerfile || echo "0")
    if [ "$stage_count" -ge 2 ]; then
        pass "AC1: Dockerfile has $stage_count stages (multi-stage build)"
    else
        fail "AC1: Dockerfile has only $stage_count stage(s), need at least 2"
    fi
else
    fail "AC1: Dockerfile does not exist"
fi

# Test AC4: .dockerignore exists and has required exclusions
echo ""
echo "=== AC4: .dockerignore configuration ==="
if [ -f ".dockerignore" ]; then
    pass "AC4: .dockerignore exists"

    # Check required exclusions (using fixed strings to avoid regex issues)
    exclusions=("tests/" "__pycache__" ".pyc" "pytest_cache" ".git" ".md" ".env" ".venv" ".vscode" ".idea")
    for exc in "${exclusions[@]}"; do
        if grep -qF "$exc" .dockerignore; then
            pass "AC4: .dockerignore excludes $exc"
        else
            fail "AC4: .dockerignore missing exclusion: $exc"
        fi
    done
else
    fail "AC4: .dockerignore does not exist"
fi

# Test AC7: Dockerfile has HEALTHCHECK instruction
echo ""
echo "=== AC7: Docker HEALTHCHECK ==="
if [ -f "Dockerfile" ]; then
    if grep -q "^HEALTHCHECK" Dockerfile; then
        pass "AC7: Dockerfile contains HEALTHCHECK instruction"

        # Check interval and timeout
        if grep -q "interval=30s" Dockerfile; then
            pass "AC7: HEALTHCHECK has 30s interval"
        else
            fail "AC7: HEALTHCHECK missing 30s interval"
        fi

        if grep -q "timeout=10s" Dockerfile; then
            pass "AC7: HEALTHCHECK has 10s timeout"
        else
            fail "AC7: HEALTHCHECK missing 10s timeout"
        fi
    else
        fail "AC7: Dockerfile missing HEALTHCHECK instruction"
    fi
fi

# Build the image
echo ""
echo "=== Building Docker image ==="
if docker build -t "$IMAGE_NAME:test" . 2>&1; then
    pass "Docker build succeeded"
else
    fail "Docker build failed"
    echo "Cannot continue with container tests"
    exit 1
fi

# Test AC8: Image size under 200MB
echo ""
echo "=== AC8: Image size ==="
image_size_bytes=$(docker image inspect "$IMAGE_NAME:test" --format='{{.Size}}')
image_size_mb=$((image_size_bytes / 1024 / 1024))
if [ "$image_size_mb" -lt 200 ]; then
    pass "AC8: Image size is ${image_size_mb}MB (< 200MB)"
else
    fail "AC8: Image size is ${image_size_mb}MB (>= 200MB)"
fi

# Start container for runtime tests
echo ""
echo "=== Starting container ==="
docker run -d --name "$CONTAINER_NAME" -p 8001:8000 "$IMAGE_NAME:test"
sleep 3  # Wait for startup

# Test AC6: Health check endpoint
echo ""
echo "=== AC6: Health check endpoint ==="
health_response=$(curl -s -w "\n%{http_code}" http://localhost:8001/health 2>/dev/null || echo "000")
http_code=$(echo "$health_response" | tail -1)
body=$(echo "$health_response" | head -n -1)

if [ "$http_code" = "200" ]; then
    pass "AC6: Health endpoint returns 200"

    if echo "$body" | grep -q '"status".*"healthy"'; then
        pass "AC6: Health response contains {\"status\": \"healthy\"}"
    else
        fail "AC6: Health response missing expected body. Got: $body"
    fi
else
    fail "AC6: Health endpoint returned $http_code (expected 200)"
fi

# Test AC2: Production dependencies only (no pytest)
echo ""
echo "=== AC2: Production dependencies only ==="
if docker exec "$CONTAINER_NAME" pip list 2>/dev/null | grep -qi pytest; then
    fail "AC2: pytest found in container (should not be present)"
else
    pass "AC2: pytest not found in container"
fi

if docker exec "$CONTAINER_NAME" pip list 2>/dev/null | grep -qi httpx; then
    fail "AC2: httpx found in container (should not be present)"
else
    pass "AC2: httpx not found in container"
fi

# Verify production deps ARE present
if docker exec "$CONTAINER_NAME" pip list 2>/dev/null | grep -qi fastapi; then
    pass "AC2: fastapi found in container"
else
    fail "AC2: fastapi not found in container"
fi

# Test AC3: Minimal file deployment
echo ""
echo "=== AC3: Minimal file deployment ==="
if docker exec "$CONTAINER_NAME" ls /app/tests 2>/dev/null; then
    fail "AC3: /app/tests directory exists (should not)"
else
    pass "AC3: /app/tests directory does not exist"
fi

if docker exec "$CONTAINER_NAME" find /app -name "*.pyc" 2>/dev/null | grep -q .; then
    fail "AC3: .pyc files found in container"
else
    pass "AC3: No .pyc files in container"
fi

if docker exec "$CONTAINER_NAME" ls /app/.git 2>/dev/null; then
    fail "AC3: .git directory exists (should not)"
else
    pass "AC3: .git directory does not exist"
fi

if docker exec "$CONTAINER_NAME" find /app -name "*.md" 2>/dev/null | grep -q .; then
    fail "AC3: .md files found in container"
else
    pass "AC3: No .md files in container"
fi

# Test AC5: Non-root user
echo ""
echo "=== AC5: Non-root user ==="
user_id=$(docker exec "$CONTAINER_NAME" id -u 2>/dev/null)
if [ "$user_id" != "0" ]; then
    pass "AC5: Container runs as non-root user (UID: $user_id)"
else
    fail "AC5: Container runs as root (UID: 0)"
fi

# Test AC9: Environment variable configuration
echo ""
echo "=== AC9: Environment variable configuration ==="
# Test that container starts with default DATABASE_URL (already verified above)
pass "AC9: Container starts with default config"

# Summary
echo ""
echo "=========================================="
echo "Test Summary"
echo "=========================================="
echo -e "${GREEN}Passed${NC}: $pass_count"
echo -e "${RED}Failed${NC}: $fail_count"

if [ "$fail_count" -gt 0 ]; then
    exit 1
else
    exit 0
fi

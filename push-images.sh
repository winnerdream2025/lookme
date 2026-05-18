#!/bin/bash
# Usage: ./push-images.sh YOUR_GITHUB_USERNAME
# Builds all LookMe service images and pushes to ghcr.io

set -e

REGISTRY="ghcr.io"
USER="${1:?Usage: ./push-images.sh <github-username>}"
TAG="${2:-latest}"
REPO="lookme"

declare -A SERVICES=(
  ["api-gateway"]="apps/api/Dockerfile"
  ["auth-service"]="services/auth/Dockerfile"
  ["catalog-service"]="services/catalog/Dockerfile"
  ["order-service"]="services/order/Dockerfile"
  ["task-service"]="services/task/Dockerfile"
  ["wallet-service"]="services/wallet/Dockerfile"
)

echo "Building and pushing images to $REGISTRY/$USER/$REPO-*:$TAG"
echo "────────────────────────────────────────────────────────"

for SERVICE in "${!SERVICES[@]}"; do
  DOCKERFILE="${SERVICES[$SERVICE]}"
  IMAGE="$REGISTRY/$USER/$REPO-$SERVICE:$TAG"

  echo ""
  echo "▶ Building $IMAGE"
  echo "  Dockerfile: $DOCKERFILE"

  docker build \
    --platform linux/amd64 \
    -f "$DOCKERFILE" \
    -t "$IMAGE" \
    .

  echo "▶ Pushing $IMAGE"
  docker push "$IMAGE"

  echo "✓ Done: $IMAGE"
done

echo ""
echo "════════════════════════════════════════════════════════"
echo "All images pushed. Paste these into Railway:"
echo "════════════════════════════════════════════════════════"
for SERVICE in "${!SERVICES[@]}"; do
  echo "  $SERVICE  →  $REGISTRY/$USER/$REPO-$SERVICE:$TAG"
done

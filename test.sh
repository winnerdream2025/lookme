#!/bin/bash
BASE="http://localhost:4000/api/v1"
ok()  { echo "  ✓ $1"; }
fail(){ echo "  ✗ $1"; ERRORS=$((ERRORS+1)); }
ERRORS=0

echo ""
echo "── Catalog ─────────────────────────────────────────────"
P=$(curl -s "$BASE/catalog/platforms" | jq '.data | length')
[ "$P" = "14" ] && ok "platforms ($P)" || fail "platforms: $P"

S=$(curl -s "$BASE/catalog/services" | jq '.data.services | length')
[ "${S:-0}" -gt 0 ] 2>/dev/null && ok "services ($S)" || fail "services: $S"

SVC=$(curl -s "$BASE/catalog/services/instagram-followers" | jq -r '.data.slug')
[ "$SVC" = "instagram-followers" ] && ok "service by slug" || fail "service by slug: $SVC"

echo ""
echo "── Auth ─────────────────────────────────────────────────"
EMAIL="curl_test_$$@lookme.com"
REG=$(curl -s -X POST "$BASE/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"Test1234\",\"role\":\"client\",\"firstName\":\"Curl\",\"lastName\":\"Test\"}")
ROLE=$(echo "$REG" | jq -r '.data.user.role // empty')
[ "$ROLE" = "client" ] && ok "register (role=$ROLE)" || fail "register: $(echo $REG | jq -rc '.')"

LOGIN=$(curl -s -X POST "$BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"Test1234\"}")
LOGIN_TOKEN=$(echo "$LOGIN" | jq -r '.data.tokens.accessToken // empty')
[ -n "$LOGIN_TOKEN" ] && ok "login" || fail "login: $(echo $LOGIN | jq -rc '.')"

ME=$(curl -s "$BASE/auth/me" -H "Authorization: Bearer $LOGIN_TOKEN")
ME_EMAIL=$(echo "$ME" | jq -r '.data.email // empty')
[ "$ME_EMAIL" = "$EMAIL" ] && ok "GET /me ($ME_EMAIL)" || fail "GET /me: $(echo $ME | jq -rc '.')"

echo ""
echo "── Guest Orders ─────────────────────────────────────────"
GUEST=$(curl -s -X POST "$BASE/orders/guest" \
  -H "Content-Type: application/json" \
  -d '{"serviceTypeId":"instagram-followers","quantity":500,"targetUrl":"https://instagram.com/testuser","guestEmail":"guest@test.com"}')
TTOKEN=$(echo "$GUEST" | jq -r '.data.trackingToken // empty')
[ -n "$TTOKEN" ] && ok "guest order (token=${TTOKEN:0:12}...)" || fail "guest order: $(echo $GUEST | jq -rc '.')"

if [ -n "$TTOKEN" ]; then
  TRACK=$(curl -s "$BASE/orders/track/$TTOKEN")
  STATUS=$(echo "$TRACK" | jq -r '.data.status // empty')
  [ "$STATUS" = "PENDING_PAYMENT" ] && ok "track by token (status=$STATUS)" || fail "track: $(echo $TRACK | jq -rc '.')"
fi

LIST=$(curl -s "$BASE/orders?email=guest@test.com" -H "Authorization: Bearer $LOGIN_TOKEN")
COUNT=$(echo "$LIST" | jq '.data | length // 0')
[ "${COUNT:-0}" -gt 0 ] 2>/dev/null && ok "list by email ($COUNT orders)" || fail "list by email: $(echo $LIST | jq -rc '.')"

echo ""
echo "── Task Service ─────────────────────────────────────────"

# Register a WORKER account
WORKER_EMAIL="worker_test_$$@lookme.com"
WREG=$(curl -s -X POST "$BASE/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$WORKER_EMAIL\",\"password\":\"Worker123\",\"role\":\"worker\",\"firstName\":\"Test\",\"lastName\":\"Worker\",\"termsAccepted\":true}")
WORKER_ROLE=$(echo "$WREG" | jq -r '.data.user.role // empty')
WORKER_TOKEN=$(echo "$WREG" | jq -r '.data.tokens.accessToken // empty')
[ "$WORKER_ROLE" = "worker" ] && ok "register worker (role=$WORKER_ROLE)" || fail "register worker: $(echo $WREG | jq -rc '.')"

# Hit the task feed (should succeed with auth)
FEED=$(curl -s "$BASE/tasks/feed" -H "Authorization: Bearer $WORKER_TOKEN")
FEED_OK=$(echo "$FEED" | jq -r '.success // false')
[ "$FEED_OK" = "true" ] && ok "task feed accessible ($(echo $FEED | jq '.data | length') tasks)" || fail "task feed: $(echo $FEED | jq -rc '.')"

# Register a CLIENT and give them a wallet
CLIENT2_EMAIL="client2_$$@lookme.com"
CREG2=$(curl -s -X POST "$BASE/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$CLIENT2_EMAIL\",\"password\":\"Client123\",\"role\":\"client\"}")
CLIENT2_TOKEN=$(echo "$CREG2" | jq -r '.data.tokens.accessToken // empty')
CLIENT2_OK=$(echo "$CREG2" | jq -r '.data.user.role // empty')
[ "$CLIENT2_OK" = "client" ] && ok "register client2" || fail "register client2: $(echo $CREG2 | jq -rc '.')"

# Top up wallet directly via DB so we can place an order
if [ -n "$CLIENT2_TOKEN" ]; then
  CLIENT2_ID=$(echo "$CREG2" | jq -r '.data.user.id // empty')
  docker exec lookme-postgres psql -U lookme -d lookme -q \
    -c "UPDATE wallets SET balance = 500 WHERE \"userId\" = '$CLIENT2_ID';" 2>/dev/null
  ok "wallet topped up for client2"

  # Place a followers order (min quantity=100 per seed data)
  ORDER=$(curl -s -X POST "$BASE/orders" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $CLIENT2_TOKEN" \
    -d "{\"serviceTypeId\":\"instagram-followers\",\"quantity\":100,\"targetUrl\":\"https://instagram.com/testbiz\"}")
  ORDER_ID=$(echo "$ORDER" | jq -r '.data.id // empty')
  [ -n "$ORDER_ID" ] && ok "place order (id=${ORDER_ID:0:12}...)" || fail "place order: $(echo $ORDER | jq -rc '.')"

  # Check tasks were created
  if [ -n "$ORDER_ID" ]; then
    TASKS=$(curl -s "$BASE/tasks?orderId=$ORDER_ID" -H "Authorization: Bearer $CLIENT2_TOKEN")
    TASK_COUNT=$(echo "$TASKS" | jq '.data.total // 0')
    [ "${TASK_COUNT:-0}" -gt 0 ] 2>/dev/null && ok "tasks created ($TASK_COUNT tasks)" || fail "tasks created: $(echo $TASKS | jq -rc '.')"

    # Worker accepts first available task
    FIRST_TASK=$(curl -s "$BASE/tasks/feed" -H "Authorization: Bearer $WORKER_TOKEN" | jq -r '.data[0].id // empty')
    if [ -n "$FIRST_TASK" ]; then
      ACCEPT=$(curl -s -X POST "$BASE/tasks/accept" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $WORKER_TOKEN" \
        -d "{\"taskId\":\"$FIRST_TASK\"}")
      ACCEPT_STATUS=$(echo "$ACCEPT" | jq -r '.data.status // empty')
      [ "$ACCEPT_STATUS" = "ASSIGNED" ] && ok "task accepted (status=$ACCEPT_STATUS)" || fail "task accept: $(echo $ACCEPT | jq -rc '.')"

      # Submit proof
      if [ "$ACCEPT_STATUS" = "ASSIGNED" ]; then
        PROOF=$(curl -s -X POST "$BASE/tasks/submit" \
          -H "Content-Type: application/json" \
          -H "Authorization: Bearer $WORKER_TOKEN" \
          -d "{\"taskId\":\"$FIRST_TASK\",\"proofText\":\"@testfollower123\"}")
        PROOF_STATUS=$(echo "$PROOF" | jq -r '.data.proof.status // empty')
        [ "$PROOF_STATUS" = "PENDING" ] && ok "proof submitted (status=$PROOF_STATUS)" || fail "submit proof: $(echo $PROOF | jq -rc '.')"
      fi
    else
      fail "no task available in feed after order"
    fi
  fi
fi

echo ""
[ "$ERRORS" = "0" ] && echo "All tests passed ✓" || echo "$ERRORS test(s) failed ✗"
echo ""

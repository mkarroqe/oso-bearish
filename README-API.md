# 🐻 Oso Bearish API Documentation

Complete API reference for the stock recommendation platform with Oso authorization.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Server runs on http://localhost:3000
```

## 📝 API Endpoints

### Authorization Endpoints

#### Get User Permissions
```http
GET /api/auth/permissions?userId={userId}
```

**Response:**
```json
{
  "canViewAllStocks": true,
  "canViewRecs": true,
  "canModifyRecs": true,
  "canModifyStocks": false
}
```

#### Check Single Stock Access
```http
GET /api/auth/check-stock-access?userId={userId}&symbol={symbol}&action={view|modify}
```

**Response:**
```json
{
  "user": {
    "id": "5",
    "name": "Al Gorithm",
    "role": "analyst",
    "analyst_type": "regular",
    "groups": ["tech"]
  },
  "stock": {
    "symbol": "NVDA",
    "name": "NVIDIA Corporation"
  },
  "action": "modify_stock",
  "allowed": true,
  "explanation": "✅ Regular analyst can modify NVDA - ReBAC policy allows (user groups: [tech])"
}
```

#### Bulk Stock Permissions (Performance Optimized)
```http
GET /api/auth/bulk-stock-permissions?userId={userId}&symbols={NVDA,AAPL,JPM}
```

**Response:**
```json
{
  "user": {
    "id": "5",
    "name": "Al Gorithm",
    "groups": ["tech"]
  },
  "permissions": {
    "NVDA": { "canModify": true, "stockName": "NVIDIA Corporation" },
    "AAPL": { "canModify": true, "stockName": "Apple Inc." },
    "JPM": { "canModify": false, "stockName": "JPMorgan Chase & Co." }
  },
  "totalChecked": 3
}
```

### Stock Data Endpoints

#### Get Stocks
```http
GET /api/stocks?userId={userId}
```

**Response:** Filtered stocks based on user permissions
```json
[
  {
    "symbol": "NVDA",
    "name": "NVIDIA Corporation",
    "price": 875.30,
    "change": 12.45,
    "changePercent": 1.44,
    "volume": 42156800,
    "marketCap": 2150000000000,
    "recommendation": "buy",
    "isBasic": true,
    "industry": "tech"
  }
]
```

#### Update Stock/Recommendation
```http
PATCH /api/stocks?symbol={symbol}&userId={userId}
```

**Request Body:**
```json
{
  "recommendation": "buy"  // For analysts
  // or
  "price": 185.50,         // For admins only
  "name": "Updated Name"   // For admins only
}
```

## 👥 User Test Scenarios

### Betty Baesic (Basic User - userId=1)
```bash
# ✅ Can see only basic stocks (3 stocks)
curl "http://localhost:3000/api/stocks?userId=1"

# ❌ Cannot see recommendations
# ❌ Cannot modify anything
curl -X PATCH "http://localhost:3000/api/stocks?symbol=NVDA&userId=1" \
  -H "Content-Type: application/json" \
  -d '{"recommendation": "buy"}'
# Returns: 403 Forbidden
```

### Priya Mium (Premium User - userId=2)
```bash
# ✅ Can see all stocks and recommendations
curl "http://localhost:3000/api/stocks?userId=2"

# ❌ Cannot modify anything
curl -X PATCH "http://localhost:3000/api/stocks?symbol=NVDA&userId=2" \
  -H "Content-Type: application/json" \
  -d '{"recommendation": "sell"}'
# Returns: 403 Forbidden
```

### Addie Min (Admin - userId=3)
```bash
# ✅ Can see everything
# ✅ Can modify all recommendations
# ✅ Can modify all stock data
curl -X PATCH "http://localhost:3000/api/stocks?symbol=NVDA&userId=3" \
  -H "Content-Type: application/json" \
  -d '{"price": 900.00, "recommendation": "buy"}'
# Returns: 200 OK
```

### Ana Lyst (Super Analyst - userId=4)
```bash
# ✅ Can modify ANY stock recommendation
curl -X PATCH "http://localhost:3000/api/stocks?symbol=NVDA&userId=4" \
  -H "Content-Type: application/json" \
  -d '{"recommendation": "hold"}'
# Returns: 200 OK

curl -X PATCH "http://localhost:3000/api/stocks?symbol=JPM&userId=4" \
  -H "Content-Type: application/json" \
  -d '{"recommendation": "buy"}'
# Returns: 200 OK
```

### Al Gorithm (Tech Analyst - userId=5)
```bash
# ✅ Can modify tech stock recommendations
curl -X PATCH "http://localhost:3000/api/stocks?symbol=NVDA&userId=5" \
  -H "Content-Type: application/json" \
  -d '{"recommendation": "buy"}'
# Returns: 200 OK

# ❌ Cannot modify finance stock recommendations
curl -X PATCH "http://localhost:3000/api/stocks?symbol=JPM&userId=5" \
  -H "Content-Type: application/json" \
  -d '{"recommendation": "sell"}'
# Returns: 403 Forbidden
```

### Finn Tek (Finance Analyst - userId=6)
```bash
# ✅ Can modify finance stock recommendations
curl -X PATCH "http://localhost:3000/api/stocks?symbol=JPM&userId=6" \
  -H "Content-Type: application/json" \
  -d '{"recommendation": "hold"}'
# Returns: 200 OK

# ❌ Cannot modify tech stock recommendations
curl -X PATCH "http://localhost:3000/api/stocks?symbol=NVDA&userId=6" \
  -H "Content-Type: application/json" \
  -d '{"recommendation": "sell"}'
# Returns: 403 Forbidden
```

## 🔐 Authorization Matrix

| User | Role | View Basic | View All | View Recs | Modify Tech Recs | Modify Finance Recs | Modify Stock Data |
|------|------|------------|----------|-----------|------------------|---------------------|-------------------|
| Betty (1) | Basic | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Priya (2) | Premium | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Addie (3) | Admin | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Ana (4) | Super Analyst | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Al (5) | Tech Analyst | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Finn (6) | Finance Analyst | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |

## 🛠️ Testing Script

Create `test-api.sh`:

```bash
#!/bin/bash
echo "🐻 Testing Oso Bearish API with ReBAC..."

echo -e "\n📊 ROLE-BASED ACCESS TESTS"
echo "================================"

echo -e "\n1. Betty (Basic) - Limited view:"
curl -s "http://localhost:3000/api/stocks?userId=1" | jq 'length'

echo -e "\n2. Priya (Premium) - Full view, no edit:"
curl -s "http://localhost:3000/api/auth/permissions?userId=2" | jq

echo -e "\n3. Addie (Admin) - Full control:"
curl -s -X PATCH "http://localhost:3000/api/stocks?symbol=NVDA&userId=3" \
  -H "Content-Type: application/json" \
  -d '{"price": 900.00}' | jq '.success'

echo -e "\n📊 TEAM-BASED ACCESS TESTS (ReBAC)"
echo "================================"

echo -e "\n4. Al (Tech Analyst) editing NVDA (tech stock) - SHOULD WORK:"
curl -s -X PATCH "http://localhost:3000/api/stocks?symbol=NVDA&userId=5" \
  -H "Content-Type: application/json" \
  -d '{"recommendation": "buy"}' | jq

echo -e "\n5. Al (Tech Analyst) editing JPM (finance stock) - SHOULD FAIL:"
curl -s -X PATCH "http://localhost:3000/api/stocks?symbol=JPM&userId=5" \
  -H "Content-Type: application/json" \
  -d '{"recommendation": "buy"}' | jq

echo -e "\n6. Bulk permissions check for Al:"
curl -s "http://localhost:3000/api/auth/bulk-stock-permissions?userId=5&symbols=NVDA,AAPL,JPM,BRK.A" | jq '.permissions'

echo -e "\n✅ Testing complete!"
```

Run with:
```bash
chmod +x test-api.sh
./test-api.sh
```

## 🏗️ Authorization Flow

```
1. Request arrives with userId
    ↓
2. Lookup user in mock-users.ts
    ↓
3. Check Oso policy (stock-policies.polar)
    ↓
4. For team-based: Check user.groups against group_covers_stock()
    ↓
5. Return data or 403 Forbidden
```

## ⚠️ Error Responses

| Status | Error | Example |
|--------|-------|---------|
| **400** | Bad Request | `{"error": "User ID is required"}` |
| **401** | Unauthorized | `{"error": "User not found"}` |
| **403** | Forbidden | `{"error": "You do not have permission to modify this stock"}` |
| **404** | Not Found | `{"error": "Stock not found"}` |
| **500** | Server Error | `{"error": "Internal server error"}` |

## 🎯 Key Features Demonstrated

- **RBAC**: Role-based access control for basic permissions
- **ReBAC**: Relationship-based access for team-specific permissions
- **Bulk API**: Performance optimization for multiple permission checks
- **Type Safety**: Full TypeScript integration
- **Policy-Driven**: All authorization logic in Polar policies

## 📚 Related Documentation

- [Main README](./README.md) - Project overview
- [Technical Blog Post](./README-post.md) - Deep dive into ReBAC
- [Polar Policy](./policies/stock-policies.polar) - Authorization rules
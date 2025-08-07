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

### 🔒 Authorization Endpoints

#### Get User Permissions
```http
GET /api/auth/permissions?userId={userId}
```
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

#### Bulk Stock Permissions
```http
GET /api/auth/bulk-stock-permissions?userId={userId}&symbols={NVDA,AAPL,JPM}
```
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

### 📈 Stock Data Endpoints

#### Get Stocks
```http
GET /api/stocks?userId={userId}
```
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
```json
{
  "recommendation": "buy"  // For analysts
  "price": 185.50,         // For admins only
  "name": "Updated Name"   // For admins only
}
```

## 📚 Related Documentation

- [Main README](./README.md) - Project overview
- [Technical Blog Post](./README-post.md) - Deep dive into ReBAC
- [Oso Documentation](https://www.osohq.com/docs) - Official Oso docs
- [Polar Language Guide](https://www.osohq.com/docs/guides/polar-syntax) - Policy language reference

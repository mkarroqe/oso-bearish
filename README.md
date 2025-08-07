# 🐻 Oso Bearish - Stock Recommendation Platform

A demonstration of **Relationship-Based Access Control (ReBAC)** using [Oso](https://www.osohq.com/) authorization in a Next.js/TypeScript application. This B2B SaaS demo showcases how authorization scales from simple roles to complex team-based permissions.

## 🎯 Key Features

- **Role-Based Access Control (RBAC)** for basic authorization
- **Relationship-Based Access Control (ReBAC)** for team-based permissions
- **Type-safe authorization** with TypeScript integration
- **Performance optimized** with bulk permission APIs
- **Real-time permission updates** without page refresh
- **Policy-driven authorization** using Oso's Polar language

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
open http://localhost:3000
```

## 👥 User Roles & Permissions

### Role Hierarchy & Permission Inheritance

```
Basic ──► Premium ──► Analyst ──► Admin
  │         │           │          │
  │         │           │          └─ Can modify stock data
  │         │           └─ Can modify recommendations (based on groups)
  │         └─ Can view all stocks & recommendations  
  └─ Can view basic stocks only
```

> **Note:** Each role inherits all permissions from the previous level.

### Demo Users & Their Access

| User | ID | Role | Groups | What They Can Do |
|------|:--:|------|:------:|------------------|
| **Betty Baesic** | 1 | Basic | - | • View basic stocks only |
| **Priya Mium** | 2 | Premium | - | • Basic access<br/> • View premium stocks<br>• View recommendations |
| **Addie Min** | 3 | Admin | - | • Premium access<br>• Edit all stocks & recommendations |
| **Ana Lyst** | 4 | Super Analyst | tech, finance | • Premium access<br/>• Edit ALL recommendations |
| **Al Gorithm** | 5 | Regular Analyst | tech | • Premium access<br/>• Edit `tech` stock recommendations only |
| **Finn Tek** | 6 | Regular Analyst | finance | • Premium access<br/>• Edit `finance` stock recommendations only |

### Group-Based Permissions (ReBAC)

| Group | Stocks Covered | Who Has Edit Access |
|-------|---------------|----------------|
| **tech** | NVDA, AAPL, GOOGL, META, MSFT, AMZN | • Al Gorithm<br>• Ana Lyst |
| **finance** | JPM, BRK.A | • Finn Tek<br>• Ana Lyst |

> **Note:** `regular` analysts can only modify stocks in their assigned groups, while `super` analysts can modify any stock.

## 🏗️ Architecture
### Authorization Flow
```
  User Action → React Component → API Route → Oso Policy Engine
                                       ↓           ↓
                                Extract User    Evaluate Rules
                                       ↓           ↓
                                    Authorization Check
                                            ↓
                                        Allow/Deny
                                            ↓
                                         Response
```
### Key Components

| Component | Purpose | Location |
|-----------|---------|----------|
| **Polar Policy** | Defines all authorization rules | `/policies/stock-policies.polar` |
| **Oso Client** | Server-side authorization checks | `/lib/oso-client.ts` |
| **Browser Client** | Client-side permission fetching | `/lib/oso-client-browser.ts` |
| **Bulk Permissions API** | Performance-optimized batch checks | `/api/auth/bulk-stock-permissions` |
| **Stock Table** | Dynamic UI based on permissions | `/components/StockTable.tsx` |

## 📝 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/permissions` | GET | Get user's general permissions |
| `/api/auth/check-stock-access` | GET | Check single stock permission |
| `/api/auth/bulk-stock-permissions` | GET | Check multiple stock permissions |
| `/api/stocks` | GET | Fetch stocks (filtered by permissions) |
| `/api/stocks` | PATCH | Update stock/recommendation |

> To review the complete API docs, click [here](README-API.md).

## 📚 Learn More

- [Technical Blog Post](./README-post.md) - Deep dive into ReBAC implementation
- [Oso Documentation](https://www.osohq.com/docs) - Official Oso docs
- [Polar Language Guide](https://www.osohq.com/docs/guides/polar-syntax) - Policy language reference
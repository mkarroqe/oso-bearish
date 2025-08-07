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

| User | Role | Email | Key Permissions |
|------|------|-------|-----------------|
| **Betty Baesic** | Basic | basicbasedbetty@osohq.com | • View basic stocks only<br>• No recommendations access |
| **Priya Mium** | Premium | mipri@osohq.com | • View all stocks<br>• View recommendations<br>• Cannot edit |
| **Addie Min** | Admin | whatstheaddie@osohq.com | • Full access to everything<br>• Edit all stocks & recommendations |
| **Ana Lyst** | Super Analyst | analystana@osohq.com | • View all stocks<br>• Edit ALL recommendations |
| **Al Gorithm** | Tech Analyst | goalgo@osohq.com | • View all stocks<br>• Edit ONLY tech stock recommendations |
| **Finn Tek** | Finance Analyst | finnancial@osohq.com | • View all stocks<br>• Edit ONLY finance stock recommendations |

## 📊 Stock Categories & Permissions

| Category | Stocks | Who Can Edit Recommendations |
|----------|--------|------------------------------|
| **Technology** | NVDA, AAPL, GOOGL, META, MSFT, AMZN | • Al Gorithm (Tech Analyst)<br>• Ana Lyst (Super Analyst)<br>• Addie Min (Admin) |
| **Financial Services** | JPM, BRK.A | • Finn Tek (Finance Analyst)<br>• Ana Lyst (Super Analyst)<br>• Addie Min (Admin) |

## 🏗️ Architecture

### Authorization Flow
```
User Action → React Component → API Route → Oso Policy → Response
                                    ↓
                              Authorization Decision
                                    ↓
                              Granted/Denied
```

### Key Components

| Component | Purpose | Location |
|-----------|---------|----------|
| **Polar Policy** | Defines all authorization rules | `/policies/stock-policies.polar` |
| **Oso Client** | Server-side authorization checks | `/lib/oso-client.ts` |
| **Browser Client** | Client-side permission fetching | `/lib/oso-client-browser.ts` |
| **Bulk Permissions API** | Performance-optimized batch checks | `/api/auth/bulk-stock-permissions` |
| **Stock Table** | Dynamic UI based on permissions | `/components/StockTable.tsx` |

## 🔐 Authorization Implementation

### Role Hierarchy
```
Basic → Premium → Analyst → Admin
```
Each role inherits permissions from the previous level.

### ReBAC Rules
```polar
# Analysts can only modify stocks their groups cover
analyst_can_modify_stock(user: User, stock_symbol: String) if
    group_id in user.groups and
    group_covers_stock(group_id, stock_symbol);
```

### TypeScript Integration
```typescript
export async function canModifyStock(
  user: User, 
  stock: Stock
): Promise<boolean> {
  const oso = getOso();
  return oso.isAllowed(new OsoUser(user), 'modify', new OsoStock(stock));
}
```

## 📈 Performance Features

| Feature | Description | Benefit |
|---------|-------------|---------|
| **Bulk API** | Single request for multiple permissions | 87.5% fewer API calls |
| **Permission Caching** | Hook-based caching | Reduced server load |
| **Singleton Oso Instance** | Single policy load | Faster authorization checks |

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Authorization**: Oso (Polar policies)
- **Styling**: Tailwind CSS
- **State Management**: React Context + Hooks

## 📝 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/permissions` | GET | Get user's general permissions |
| `/api/auth/check-stock-access` | GET | Check single stock permission |
| `/api/auth/bulk-stock-permissions` | GET | Check multiple stock permissions |
| `/api/stocks` | GET | Fetch stocks (filtered by permissions) |
| `/api/stocks` | PATCH | Update stock/recommendation |

## 🧪 Testing Authorization

1. **Switch users** using the User Switcher dropdown
2. **Try editing** different stock recommendations
3. **Observe** how permissions change based on user role and team membership

### Test Scenarios

| Scenario | User | Action | Expected Result |
|----------|------|--------|-----------------|
| Basic Access | Betty Baesic | View premium stocks | ❌ Hidden |
| Team-Based Edit | Al Gorithm | Edit NVDA recommendation | ✅ Allowed |
| Cross-Team Edit | Al Gorithm | Edit JPM recommendation | ❌ Disabled |
| Super Analyst | Ana Lyst | Edit any recommendation | ✅ Allowed |
| Admin Override | Addie Min | Edit anything | ✅ Allowed |

## 📚 Learn More

- [Technical Blog Post](./README-post.md) - Deep dive into ReBAC implementation
- [Oso Documentation](https://www.osohq.com/docs) - Official Oso docs
- [Polar Language Guide](https://www.osohq.com/docs/guides/polar-syntax) - Policy language reference

## 🤝 Contributing

This is a demonstration project showcasing Oso authorization patterns. Feel free to fork and adapt for your own use cases!

## 📄 License

MIT
# From Conditional Chaos to Clean Policies: Building Authorization That Scales

Building B2B SaaS authorization starts simple: users, admins, maybe premium tiers. Then your first enterprise customer asks: 

> *"Can finance analysts only modify financial data while tech analysts handle technology assets?"* 

Your clean RBAC model just hit the wall of real-world business relationships.

This is the authorization scaling challenge every B2B application faces. Here's how Relationship-Based Access Control (ReBAC) solves it, and why your next authorization decision should be relationship-driven.

## The RBAC Scaling Problem

Consider a financial analytics platform. Your initial authorization model looks clean:

```typescript
// Phase 1: Simple role checks
if (user.role === 'analyst') {
  return canModifyRecommendations(user);
}
```

But business requirements evolve. Real organizations have structure:
- **Technology analysts** manage tech stocks (NVIDIA, Apple, Google)
- **Finance analysts** handle financial stocks (JPMorgan, Berkshire Hathaway)  
- **Senior analysts** can modify anything
- **Admins** control system-wide permissions

Your authorization logic becomes a maintenance nightmare:

```typescript
// Phase 2: The conditional explosion
if (user.role === 'analyst' && 
    ((user.department === 'tech' && stock.sector === 'technology') ||
     (user.department === 'finance' && stock.sector === 'financial') ||
     user.seniority === 'senior')) {
  return true;
}
```

This approach fails because **it hardcodes business relationships in application logic**. Every new team, every organizational change, every business rule requires touching code across your entire application. It doesn't scale.

## ReBAC: Authorization Through Relationships

ReBAC fundamentally changes your authorization model from static role assignments to dynamic relationship queries. Instead of hardcoding *"analysts can edit,"* you define relationships: users belong to groups, groups cover resources, and permissions flow through these relationships.

Here's an example of how we implement team-based stock authorization with Oso:

```polar
# Phase 3: clean, policy-driven relationships with Oso
allow(user: User, "modify", recommendation: Recommendation) if
    has_analyst_access(user) and
    user.analyst_type = "regular" and
    analyst_can_modify_stock(user, recommendation.stock_symbol);

# The relationship rule that replaces hardcoded conditionals
analyst_can_modify_stock(user: User, stock_symbol: String) if
    group_id in user.groups and
    group_covers_stock(group_id, stock_symbol);

# Business relationships as declarative facts
group_covers_stock("tech", "NVDA");
group_covers_stock("tech", "AAPL");
group_covers_stock("finance", "JPM");
group_covers_stock("finance", "BRK.A");
```

The key architectural insight: **business logic lives in one place, not scattered across your codebase**. When your organization adds a new team or changes stock coverage, you update **facts** in Polar files, not application code.

**This scales in ways traditional authorization doesn't:**
- Add 50 new stocks across 5 teams? Add facts, not code changes.
- Restructure your organization? Update relationships, not conditionals.
- Onboard a new analyst? Assign groups, and permissions flow automatically.
- Audit who can access what? Query the policy, not your codebase.

Our [demo](https://github.com/mkarroqe/oso-bearish) app implements a complete ReBAC authorization system for a stock recommendation platform:

```typescript
// Type-safe authorization functions
export async function canModifyStockRecommendation(
  user: User, 
  stock: Stock
): Promise<boolean> {
  const oso = getOso();
  const osoUser = new OsoUser(user);
  const osoStock = new OsoStock(stock);
  return oso.isAllowed(osoUser, 'modify', osoStock);
}
```
Check out the full policy file with walkthrough comments [here](https://github.com/mkarroqe/oso-bearish/polices/stock-policies.polar).

## Migration Strategy: From Conditional Chaos to ReBAC

Remember that Phase 2 conditional explosion? You don't have to live with it forever, but don't rewrite your authorization system overnight either. Here's the proven migration pattern that transforms scattered conditionals into maintainable policies, and improves performance:

#### 1. Start with ReBAC for New Features
Instead of adding more conditionals to your existing mess, implement relationship-based rules for new functionality:

```typescript
// Don't add to the conditional explosion
if (user.role === 'analyst' && /* 20 more conditions */) {
  // New feature logic here
}

// Start fresh with ReBAC
const allowed = await oso.isAllowed(user, 'modify', newResource);
```
#### 2. Create Compatibility Layers
Use Oso's flexibility to maintain existing RBAC alongside new ReBAC rules. Your old hardcoded checks can coexist:

```
# Support legacy role checks during migration
allow(user: User, "modify", stock: Stock) if
    legacy_analyst_check(user, stock);

# While building new relationship-based rules
allow(user: User, "modify", stock: Stock) if
    has_analyst_access(user) and
    analyst_can_modify_stock(user, stock.symbol);
```

#### 3. Migrate Hot Paths Incrementally
Convert your highest-traffic authorization points first. Focus on:
- API endpoints with complex conditional logic
- UI components with scattered permission checks
- Background jobs with authorization requirements

Each migration reduces your "conditional debt" while improving maintainability.

#### 4. Deprecate Gradually
As relationship coverage expands, remove hardcoded role checks. Track your progress:
- Lines of authorization code deleted
- Conditional complexity reduced
- Policy coverage increased

## Authorization That Grows With You

Authorization complexity is inevitable in B2B applications. The question isn't whether you'll need relationship-based permissions, but whether you'll implement them maintainably.

ReBAC with Oso provides the architectural foundation for authorization that scales with your business relationships, not against them. When your next enterprise customer asks for team-based access controls, you'll have the infrastructure to say yes.

---
> Check out our [complete demo repository](https://github.com/mkarroqe/oso-bearish) with full TypeScript implementation and Polar policies. The demo includes six user personas demonstrating role hierarchy, team-based restrictions, and admin overrides across a realistic B2B authorization model.

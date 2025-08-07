# Proper ReBAC Policy using Oso's resource block syntax
# 
# ⚠️ CRITICAL: These resource blocks define the authorization model structure
# The TypeScript interfaces in types/polar-types.ts provide the actual data fields

# Define our actor - users who can perform actions
actor User {}

# Define resources with their relations
resource Stock {
  relations = { covered_by: Group };
}

resource Recommendation {
  relations = { for_stock: Stock, created_by: User };
}

resource Group {
  relations = { members: User, covers: Stock };
}

# Role-based permissions with inheritance
# Each role inherits from the previous level

# BASIC: Can view basic stocks only
allow(user: User, "view", stock: Stock) if 
    has_basic_access(user) and
    stock.isBasic = true;

# PREMIUM: Can view all stocks + recommendations  
allow(user: User, "view", _stock: Stock) if 
    has_premium_access(user);
allow(user: User, "view", _recommendation: Recommendation) if 
    has_premium_access(user);

# ANALYST: Can view everything + modify with ReBAC
allow(user: User, "view", _stock: Stock) if 
    has_analyst_access(user);
allow(user: User, "view", _recommendation: Recommendation) if 
    has_analyst_access(user);

# Role hierarchy helpers
has_basic_access(user: User) if user.role = "basic";
has_basic_access(user: User) if has_premium_access(user);

has_premium_access(user: User) if user.role = "premium"; 
has_premium_access(user: User) if has_analyst_access(user);

has_analyst_access(user: User) if user.role = "analyst";
has_analyst_access(user: User) if has_admin_access(user);

has_admin_access(user: User) if user.role = "admin";

# ANALYST ReBAC - Super analysts can modify anything
allow(user: User, "modify", _recommendation: Recommendation) if 
    has_analyst_access(user) and
    user.analyst_type = "super";

# ANALYST ReBAC - Regular analysts need group coverage
allow(user: User, "modify", recommendation: Recommendation) if 
    has_analyst_access(user) and
    user.analyst_type = "regular" and
    analyst_can_modify_stock(user, recommendation.stock_symbol);

# ANALYST ReBAC - Super analysts can modify any stock
allow(user: User, "modify", _stock: Stock) if 
    has_analyst_access(user) and
    user.analyst_type = "super";

# ANALYST ReBAC - Regular analysts can modify stocks their groups cover
allow(user: User, "modify", stock: Stock) if 
    has_analyst_access(user) and
    user.analyst_type = "regular" and
    analyst_can_modify_stock(user, stock.symbol);

# Helper rule: Check if analyst's group covers the stock
analyst_can_modify_stock(user: User, stock_symbol: String) if
    group_id in user.groups and
    group_covers_stock(group_id, stock_symbol);

# Fact: Define which groups cover which stocks
group_covers_stock("tech", "NVDA");
group_covers_stock("tech", "AAPL"); 
group_covers_stock("tech", "GOOGL");
group_covers_stock("tech", "META");
group_covers_stock("tech", "MSFT");
group_covers_stock("tech", "AMZN");
group_covers_stock("finance", "BRK.A");
group_covers_stock("finance", "JPM");

# ADMIN: Can modify stocks and recommendations (inherits all view permissions)
allow(user: User, "modify", _stock: Stock) if 
    has_admin_access(user);
allow(user: User, "modify", _recommendation: Recommendation) if 
    has_admin_access(user);
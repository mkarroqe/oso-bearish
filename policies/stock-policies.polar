# Authorization Policy for O(h)so Bearish Stock App
# This is our single source of truth for types and permissions

# Define our actors and resources
actor User {}
resource Stock {}
resource Recommendation {}
resource Group {}

# BASIC USERS - Can only view basic stocks
allow(user: User, "view", stock: Stock) if 
    user.role = "basic" and
    stock.isBasic = true;

# PREMIUM USERS - Can view all stocks and recommendations  
allow(user: User, "view", _stock: Stock) if 
    user.role = "premium";
allow(user: User, "view", _recommendation: Recommendation) if 
    user.role = "premium";

# ANALYST USERS - Premium permissions + ReBAC for modifications
allow(user: User, "view", _stock: Stock) if 
    user.role = "analyst";
allow(user: User, "view", _recommendation: Recommendation) if 
    user.role = "analyst";

# ReBAC: Analysts can only modify recommendations for stocks their group covers
# Special case: "super_analyst" can modify any recommendation
allow(user: User, "modify", recommendation: Recommendation) if 
    user.role = "analyst" and
    user.analyst_type = "super";

# Regular analysts: must be in a group that covers the stock
allow(user: User, "modify", recommendation: Recommendation) if 
    user.role = "analyst" and
    user.analyst_type = "regular" and
    group in user.groups and
    recommendation.stock_symbol in group.covered_stocks;

# ADMIN USERS - Analyst permissions + can modify stock data
allow(user: User, "view", _stock: Stock) if 
    user.role = "admin";
allow(user: User, "view", _recommendation: Recommendation) if 
    user.role = "admin";
allow(user: User, "modify", _recommendation: Recommendation) if 
    user.role = "admin";
allow(user: User, "modify", _stock: Stock) if 
    user.role = "admin";
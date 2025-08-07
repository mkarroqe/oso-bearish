# Authorization Policy for O(h)so Bearish Stock App
# This is our single source of truth for types and permissions

# Define our actors and resources (no field declarations needed)
actor User {}
resource Stock {}
resource Recommendation {}

# BASIC USERS - Can only view basic stocks
allow(user: User, "view", stock: Stock) if 
    user.role = "basic" and
    stock.isBasic = true;

# PREMIUM USERS - Can view all stocks and recommendations  
allow(user: User, "view", _stock: Stock) if 
    user.role = "premium";
allow(user: User, "view", _recommendation: Recommendation) if 
    user.role = "premium";

# ANALYST USERS - Premium permissions + can modify recommendations
allow(user: User, "view", _stock: Stock) if 
    user.role = "analyst";
allow(user: User, "view", _recommendation: Recommendation) if 
    user.role = "analyst";
allow(user: User, "modify", _recommendation: Recommendation) if 
    user.role = "analyst";

# ADMIN USERS - Analyst permissions + can modify stock data
allow(user: User, "view", _stock: Stock) if 
    user.role = "admin";
allow(user: User, "view", _recommendation: Recommendation) if 
    user.role = "admin";
allow(user: User, "modify", _recommendation: Recommendation) if 
    user.role = "admin";
allow(user: User, "modify", _stock: Stock) if 
    user.role = "admin";
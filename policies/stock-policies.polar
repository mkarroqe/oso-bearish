# 🐻 Oso Bearish Stock Authorization Policy
# 
# This file demonstrates how to implement both Role-Based Access Control (RBAC) 
# and Relationship-Based Access Control (ReBAC) using Oso's Polar language.
#
# 📚 Learning Guide:
# - RBAC: Permissions based on user roles (basic, premium, analyst, admin)
# - ReBAC: Permissions based on relationships (user → group → stock)
# - Inheritance: Higher roles get all permissions of lower roles
# - Facts: Static data that defines relationships (group_covers_stock)

# ========================================================================================
# 🏗️ RESOURCE DEFINITIONS
# ========================================================================================
# These define the "shape" of your authorization model
# Think of these as the entities that can have permissions

# Users are "actors" - they perform actions
actor User {}

# Resources are things that can be acted upon
resource Stock {
  relations = { covered_by: Group };  # Stocks can be covered by analyst groups
}

resource Recommendation {
  relations = { for_stock: Stock, created_by: User };  # Links recommendations to stocks/users
}

resource Group {
  relations = { members: User, covers: Stock };  # Groups contain users and cover stocks
}

# ========================================================================================
# 🔐 RBAC: ROLE-BASED ACCESS CONTROL
# ========================================================================================
# Each role inherits permissions from the previous level:
# Basic → Premium → Analyst → Admin

# BASIC USERS: Most restricted access
# Can only view stocks marked as "basic" (like free tier)
allow(user: User, "view", stock: Stock) if 
    has_basic_access(user) and    # Must be basic user or higher
    stock.isBasic = true;         # Stock must be marked as basic

# PREMIUM USERS: Basic access + can view all stocks and recommendations
allow(user: User, "view", _stock: Stock) if 
    has_premium_access(user);     # Any stock, regardless of isBasic flag

allow(user: User, "view", _recommendation: Recommendation) if 
    has_premium_access(user);     # Can see buy/hold/sell recommendations

# ANALYSTS: Premium access + can modify recommendations (with ReBAC restrictions)
allow(user: User, "view", _stock: Stock) if 
    has_analyst_access(user);     # Inherits premium view permissions

allow(user: User, "view", _recommendation: Recommendation) if 
    has_analyst_access(user);     # Inherits premium view permissions

# ADMINS: Full access to everything (defined at bottom)

# ========================================================================================
# 🏛️ ROLE HIERARCHY HELPERS
# ========================================================================================
# These functions implement inheritance: higher roles get lower role permissions
# Example: An admin automatically gets analyst, premium, AND basic permissions

has_basic_access(user: User) if user.role = "basic";        # Basic users have basic access
has_basic_access(user: User) if has_premium_access(user);   # Premium+ users also have basic access

has_premium_access(user: User) if user.role = "premium";    # Premium users have premium access
has_premium_access(user: User) if has_analyst_access(user); # Analyst+ users also have premium access

has_analyst_access(user: User) if user.role = "analyst";    # Analysts have analyst access
has_analyst_access(user: User) if has_admin_access(user);   # Admins also have analyst access

has_admin_access(user: User) if user.role = "admin";        # Only admins have admin access

# ========================================================================================
# 🌐 REBAC: RELATIONSHIP-BASED ACCESS CONTROL
# ========================================================================================
# Instead of just checking roles, we check 
# relationships between users, groups, and stocks.

# SUPER ANALYSTS: Can modify ANY recommendation (no group restrictions)
# Example: Ana Lyst can edit recommendations for both tech AND finance stocks
allow(user: User, "modify", _recommendation: Recommendation) if 
    has_analyst_access(user) and      # Must be analyst or admin
    user.analyst_type = "super";      # Must be "super" type analyst

# REGULAR ANALYSTS: Can only modify recommendations for stocks their groups cover
# Example: Al Gorithm (tech group) can edit NVDA but NOT JPM recommendations
allow(user: User, "modify", recommendation: Recommendation) if 
    has_analyst_access(user) and                              # Must be analyst or admin  
    user.analyst_type = "regular" and                         # Must be "regular" type
    analyst_can_modify_stock(user, recommendation.stock_symbol); # Check group coverage

# STOCK DATA MODIFICATION: Similar rules but for stock prices/data (not recommendations)
# Super analysts can modify any stock data
allow(user: User, "modify", _stock: Stock) if 
    has_analyst_access(user) and
    user.analyst_type = "super";

# Regular analysts can modify stock data only for their group's stocks
allow(user: User, "modify", stock: Stock) if 
    has_analyst_access(user) and
    user.analyst_type = "regular" and
    analyst_can_modify_stock(user, stock.symbol);

# ========================================================================================
# 🔍 REBAC HELPER FUNCTION
# ========================================================================================
# Checks if a user's group covers a stock.

# "Can this analyst modify this stock?"
analyst_can_modify_stock(user: User, stock_symbol: String) if
    group_id in user.groups and              # For each group the user belongs to...
    group_covers_stock(group_id, stock_symbol); # ...check if that group covers the stock

# Example walkthrough for Al Gorithm editing NVDA:
# 1. Al has groups: ["tech"]
# 2. Check if "tech" is in user.groups → YES
# 3. Check if group_covers_stock("tech", "NVDA") → YES (see facts below)
# 4. Result: ALLOWED ✅

# Example walkthrough for Al Gorithm editing JPM:
# 1. Al has groups: ["tech"] 
# 2. Check if "tech" is in user.groups → YES
# 3. Check if group_covers_stock("tech", "JPM") → NO (JPM is finance)
# 4. Result: DENIED ❌

# ========================================================================================
# 📊 FACTS: GROUP-TO-STOCK MAPPINGS
# ========================================================================================
# These are static "facts" that define which groups cover which stocks
# In a real app, this data might come from a database

# Tech group covers technology stocks
group_covers_stock("tech", "NVDA");    # NVIDIA
group_covers_stock("tech", "AAPL");    # Apple
group_covers_stock("tech", "GOOGL");   # Google
group_covers_stock("tech", "META");    # Meta/Facebook
group_covers_stock("tech", "MSFT");    # Microsoft
group_covers_stock("tech", "AMZN");    # Amazon

# Finance group covers financial stocks
group_covers_stock("finance", "BRK.A"); # Berkshire Hathaway
group_covers_stock("finance", "JPM");   # JPMorgan Chase

# 💡 To add a new stock: just add a new group_covers_stock() fact!
# 💡 To add a new group: create new facts and update user.groups in your app

# ========================================================================================
# 👑 ADMIN OVERRIDES
# ========================================================================================
# Admins can do everything - they bypass all ReBAC restrictions

allow(user: User, "modify", _stock: Stock) if 
    has_admin_access(user);              # Admins can modify any stock data

allow(user: User, "modify", _recommendation: Recommendation) if 
    has_admin_access(user);              # Admins can modify any recommendation
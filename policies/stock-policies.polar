actor User {
    role: String;
}

resource Stock {}
resource Recommendation {}

# BASIC USERS
# Can only view limited stocks
allow(user: User, "view", stock: Stock) if 
    user.role = "basic" and
    stock.isBasic = true;

# PREMIUM USERS
# Basic + all stocks and recommendations
allow(user: User, action, resource) if
    user.role = "premium" and
    allow(User{role: "basic"}, action, resource)
    
allow(user: User, "view", stock: Stock) if user.role = "premium";
allow(user: User, "view", recommendation: Recommendation) if user.role = "premium";

# ANALYST USERS
# Premium + modify recommendations
allow(user: User, action, resource) if
    user.role = "analyst" and
    allow(User{role: "premium"}, action, resource);
allow(user: User, "modify", recommendation: Recommendation) if user.role = "analyst"

# ADMIN USERS
# Analyst + modify stocks
allow(user: User, action, resource) if
    user.role = "admin" and
    allow(User{role: "analyst"}, action, resource)
allow(user: User, "modify", stock: Stock) if user.role = "admin"
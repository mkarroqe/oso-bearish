// Actor types (defined in Polar)
export interface User {
  id: string;
  role: "basic" | "premium" | "analyst" | "admin";
  firstName: string;
  lastName: string;
  email: string;
  // ReBAC fields
  analyst_type?: "regular" | "super";  // For analysts only
  groups: string[];                    // Group IDs user belongs to
}

// Resource types (defined in Polar)
export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  recommendation: "buy" | "hold" | "sell";
  isBasic: boolean;
}

export interface Recommendation {
  stock_symbol: string; 
}

export interface Group {
  id: string;
  name: string;
  description: string;
  covered_stocks: string[];  // Stock symbols this group covers
}

// Recommendation values type (for the stock recommendation field)
export type RecommendationType = "buy" | "hold" | "sell";

// Action types (extracted from Polar allow rules)
export type Action = "view" | "modify";

// Resource union type
export type Resource = Stock | Recommendation | Group;

// Type for Oso authorization checks
export interface PolarTypes {
  actors: {
    User: User;
  };
  resources: {
    Stock: Stock;
    Recommendation: Recommendation;
    Group: Group;
  };
  actions: Action;
}

// User role type (extracted from Polar)
export type UserRole = User['role'];

// Permission types for API responses
export interface UserPermissions {
  canViewAllStocks: boolean;
  canViewRecs: boolean;
  canModifyRecs: boolean;
  canModifyStocks: boolean;
}
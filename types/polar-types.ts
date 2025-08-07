// Generated TypeScript types based on authorization.polar
// This is our single source of truth for authorization types

// Actor types (defined in Polar)
export interface User {
  id: string;
  role: "basic" | "premium" | "analyst" | "admin";
  firstName: string;
  lastName: string;
  email: string;
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
  // Empty interface for now - could add properties later
}

// Action types (extracted from Polar allow rules)
export type Action = "view" | "modify";

// Resource union type
export type Resource = Stock | Recommendation;

// Type for Oso authorization checks
export interface PolarTypes {
  actors: {
    User: User;
  };
  resources: {
    Stock: Stock;
    Recommendation: Recommendation;
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
export type UserRole = 'basic' | 'premium' | 'analyst' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface UserPermissions {
  canViewAllStocks: boolean;
  canModifyStocks: boolean;
  canViewRecs: boolean;
  canModifyRecs: boolean;
}
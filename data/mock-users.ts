import type { User, UserPermissions } from '@/types/user';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Basic User',
    email: 'basic@example.com',
    role: 'basic'
  },
  {
    id: '2', 
    name: 'Premium User',
    email: 'premium@example.com',
    role: 'premium'
  },
  {
    id: '3',
    name: 'Market Analyst',
    email: 'analyst@example.com', 
    role: 'analyst'
  },
  {
    id: '4',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin'
  }
];

export const getUserPermissions = (role: string): UserPermissions => {
  switch (role) {
    case 'basic':
      return {
        canViewAllStocks: false,
        canModifyStocks: false,
        canViewRecs: false,
        canModifyRecs: false
      };
    case 'premium':
      return {
        canViewAllStocks: true,
        canModifyStocks: false,
        canViewRecs: true,
        canModifyRecs: false
      };
    case 'analyst':
      return {
        canViewAllStocks: true,
        canModifyStocks: false,
        canViewRecs: true,
        canModifyRecs: true
      };
    case 'admin':
      return {
        canViewAllStocks: true,
        canModifyStocks: true,
        canViewRecs: true,
        canModifyRecs: true
      };
    default:
      return {
        canViewAllStocks: false,
        canModifyStocks: false,
        canViewRecs: false,
        canModifyRecs: false
      };
  }
};
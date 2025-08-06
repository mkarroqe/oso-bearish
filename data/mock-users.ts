import type { User, UserPermissions } from '@/types/user';

export const mockUsers: User[] = [
  {
    id: '1',
    firstName: 'Betty',
    lastName: 'Baesic',
    email: 'basicbasedbetty@osohq.com',
    role: 'basic'
  },
  {
    id: '2', 
    firstName: 'Priya',
    lastName: 'Mium',
    email: 'mipri@osohq.com',
    role: 'premium'
  },
  {
    id: '3',
    firstName: 'Ana',
    lastName: 'Lyst',
    email: 'analystana@osohq.com', 
    role: 'analyst'
  },
  {
    id: '4',
    firstName: 'Addie',
    lastName: 'Min',
    email: 'whatstheaddie@osohq.com',
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
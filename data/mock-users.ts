import type { User, UserPermissions } from '@/types/user';

export const mockUsers: User[] = [
  {
    id: '1',
    firstName: 'Betty',
    lastName: 'Baesic',
    email: 'basicbasedbetty@osohq.com',
    role: 'basic',
    groups: []
  },
  {
    id: '2', 
    firstName: 'Priya',
    lastName: 'Mium',
    email: 'mipri@osohq.com',
    role: 'premium',
    groups: []
  },
  {
    id: '3',
    firstName: 'Addie',
    lastName: 'Min',
    email: 'whatstheaddie@osohq.com',
    role: 'admin',
    groups: []
  },
  {
    id: '4',
    firstName: 'Ana',
    lastName: 'Lyst',
    email: 'analystana@osohq.com', 
    role: 'analyst',
    analyst_type: 'super',
    groups: ['tech', 'finance'] 
  },
  {
    id: '5',
    firstName: 'Al',
    lastName: 'Gorithm', 
    email: 'goalgo@osohq.com',
    role: 'analyst',
    analyst_type: 'regular',
    groups: ['tech'] // Tech analyst only
  },
  {
    id: '6',
    firstName: 'Finn',
    lastName: 'Tek',
    email: 'finnancial@osohq.com', 
    role: 'analyst',
    analyst_type: 'regular',
    groups: ['finance'] // Finance analyst only
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
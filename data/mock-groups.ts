import type { Group } from '@/types/polar-types';

export const mockGroups: Group[] = [
  {
    id: 'tech',
    name: 'Tech Analysts',
    description: 'Analysts covering technology sector stocks',
    covered_stocks: ['NVDA', 'AAPL', 'GOOGL', 'META', 'MSFT', 'TSLA', 'AMZN']
  },
  {
    id: 'finance', 
    name: 'Finance Analysts',
    description: 'Analysts covering financial sector stocks',
    covered_stocks: ['BRK.A']
  }
];

// Helper function to get group by ID
export const getGroupById = (id: string): Group | undefined => {
  return mockGroups.find(group => group.id === id);
};

// Helper function to check if user's groups cover a stock
export const userGroupsCoversStock = (userGroups: string[], stockSymbol: string): boolean => {
  return userGroups.some(groupId => {
    const group = getGroupById(groupId);
    return group?.covered_stocks.includes(stockSymbol) ?? false;
  });
};
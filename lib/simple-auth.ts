import type { User } from '@/types/user';
import type { Stock } from '@/types/stock';

// Simple authorization rules without Oso
// This implements the same logic but without the external library

export async function canViewStock(user: User, stock: Stock): Promise<boolean> {
  // Basic users can only see stocks marked as isBasic
  if (user.role === 'basic') {
    return stock.isBasic === true;
  }
  
  // Premium, analyst, and admin can see all stocks
  return ['premium', 'analyst', 'admin'].includes(user.role);
}

export async function canViewRecommendation(user: User): Promise<boolean> {
  // Premium and above can view recommendations
  return ['premium', 'analyst', 'admin'].includes(user.role);
}

export async function canModifyRecommendation(user: User): Promise<boolean> {
  // Analyst and admin can modify recommendations
  return ['analyst', 'admin'].includes(user.role);
}

export async function canModifyStock(user: User): Promise<boolean> {
  // Only admin can modify stock data
  return user.role === 'admin';
}

export async function getUserPermissions(user: User) {
  const [canViewRecs, canModifyRecs, canModifyStocks] = await Promise.all([
    canViewRecommendation(user),
    canModifyRecommendation(user),
    canModifyStock(user)
  ]);

  return {
    canViewAllStocks: user.role !== 'basic',
    canViewRecs,
    canModifyRecs,
    canModifyStocks
  };
}
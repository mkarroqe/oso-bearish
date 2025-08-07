'use client';

import type { User } from '@/types/user';
import type { Stock } from '@/types/stock';

export async function canModifyStockRecommendation(user: User, stock: Stock): Promise<boolean> {
  try {
    const response = await fetch(`/api/auth/check-stock-access?userId=${user.id}&symbol=${stock.symbol}&action=modify`);
    
    if (!response.ok) {
      console.error('Permission check failed:', response.statusText);
      return false;
    }
    
    const result = await response.json();
    return result.allowed || false;
  } catch (error) {
    console.error('Error checking stock recommendation permission:', error);
    return false;
  }
}

export async function canModifyStockRecommendationsBulk(
  user: User, 
  stocks: Stock[]
): Promise<Record<string, boolean>> {
  if (stocks.length === 0) return {};
  
  try {
    const symbols = stocks.map(s => s.symbol).join(',');
    const response = await fetch(`/api/auth/bulk-stock-permissions?userId=${user.id}&symbols=${symbols}`);
    
    if (!response.ok) {
      console.error('Bulk permission check failed:', response.statusText);
      return {};
    }
    
    const result = await response.json();
    const permissions: Record<string, boolean> = {};
    
    // Convert API response format to our expected format
    Object.entries(result.permissions || {}).forEach(([symbol, data]) => {
      const stockData = data as { canModify: boolean; stockName: string };
      permissions[symbol] = stockData.canModify || false;
    });
    
    return permissions;
  } catch (error) {
    console.error('Error checking bulk stock recommendation permissions:', error);
    return {};
  }
}
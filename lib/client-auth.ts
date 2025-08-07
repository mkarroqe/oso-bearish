import type { UserPermissions } from '@/types/user';

// Client-side authorization service
// This will call our API endpoints to check permissions using Oso on the server

export async function getUserPermissionsFromServer(userId: string): Promise<UserPermissions> {
  try {
    const response = await fetch(`/api/auth/permissions?userId=${userId}`);
    
    if (!response.ok) {
      // Get the actual error message from the response
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error('API Error:', response.status, errorData);
      throw new Error(`Failed to fetch permissions: ${errorData.error || response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching permissions:', error);
    // Fallback to minimal permissions
    return {
      canViewAllStocks: false,
      canModifyStocks: false,
      canViewRecs: false,
      canModifyRecs: false
    };
  }
}

export async function checkStockAccess(userId: string, stockSymbol: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/auth/check-stock-access?userId=${userId}&symbol=${stockSymbol}`);
    if (!response.ok) {
      return false;
    }
    const data = await response.json();
    return data.allowed;
  } catch (error) {
    console.error('Error checking stock access:', error);
    return false;
  }
}
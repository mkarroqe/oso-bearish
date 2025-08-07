import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';

export function useStockPermissions(symbols: string[]) {
  const { currentUser } = useUser();
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser || symbols.length === 0) {
      setLoading(false);
      return;
    }

    const checkPermissions = async () => {
      const permissionChecks = symbols.map(async (symbol) => {
        try {
          const response = await fetch(`/api/auth/check-stock-access?userId=${currentUser.id}&symbol=${symbol}&action=modify`);
          if (response.ok) {
            const data = await response.json();
            return { symbol, allowed: data.allowed };
          }
          return { symbol, allowed: false };
        } catch (error) {
          console.error(`Error checking permission for ${symbol}:`, error);
          return { symbol, allowed: false };
        }
      });

      const results = await Promise.all(permissionChecks);
      const permissionMap = results.reduce((acc, { symbol, allowed }) => {
        acc[symbol] = allowed;
        return acc;
      }, {} as Record<string, boolean>);

      setPermissions(permissionMap);
      setLoading(false);
    };

    checkPermissions();
  }, [currentUser, symbols]);

  return { permissions, loading };
}
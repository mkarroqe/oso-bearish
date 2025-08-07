'use client';

import { useEffect, useState } from 'react';
import type { User } from '@/types/user';
import type { Stock } from '@/types/stock';
import { canModifyStockRecommendationsBulk } from '@/lib/oso-client-browser';

export function useStockRecommendationPermissions(user: User | null, stocks: Stock[]) {
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || stocks.length === 0) {
      setPermissions({});
      return;
    }

    setLoading(true);

    const checkPermissions = async () => {
      try {
        // Single bulk API call instead of N individual calls
        const newPermissions = await canModifyStockRecommendationsBulk(user, stocks);
        setPermissions(newPermissions);
      } catch (error) {
        console.error('Error checking stock recommendation permissions:', error);
        setPermissions({});
      } finally {
        setLoading(false);
      }
    };

    checkPermissions();
  }, [user, stocks]);

  return { permissions, loading };
}
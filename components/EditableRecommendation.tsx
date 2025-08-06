'use client';

import { useState } from 'react';
import type { Recommendation, Stock } from '@/types/stock';

interface EditableRecommendationProps {
  stock: Stock;
  canEdit: boolean;
  onUpdate: (symbol: string, newRecommendation: Recommendation) => void;
}

export function EditableRecommendation({ stock, canEdit, onUpdate }: EditableRecommendationProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const getRecommendationColor = (rec: Recommendation) => {
    switch (rec) {
      case 'buy': return 'text-green-600 bg-green-50';
      case 'hold': return 'text-yellow-600 bg-yellow-50';
      case 'sell': return 'text-red-600 bg-red-50';
    }
  };

  const handleRecommendationChange = async (newRecommendation: Recommendation) => {
    if (newRecommendation === stock.recommendation) {
      setIsEditing(false);
      return;
    }

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/stocks?symbol=${stock.symbol}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recommendation: newRecommendation }),
      });

      if (response.ok) {
        onUpdate(stock.symbol, newRecommendation);
      } else {
        console.error('Failed to update recommendation');
      }
    } catch (error) {
      console.error('Error updating recommendation:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!canEdit) {
    // Read-only pill for premium users
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRecommendationColor(stock.recommendation)}`}>
        {stock.recommendation}
      </span>
    );
  }

  // For editable recommendations, always show as select dropdown
  if (canEdit) {
    return (
      <div className="relative inline-block">
        <select
          value={stock.recommendation}
          onChange={(e) => handleRecommendationChange(e.target.value as Recommendation)}
          disabled={isUpdating}
          className={`px-3 py-1 rounded-full text-sm font-semibold border-0 focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer ${getRecommendationColor(stock.recommendation)}`}
          style={{ minWidth: '70px' }}
        >
          <option value="buy">buy</option>
          <option value="hold">hold</option>
          <option value="sell">sell</option>
        </select>
        {isUpdating && (
          <div className="absolute inset-0 bg-white/80 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    );
  }
}
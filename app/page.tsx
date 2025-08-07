'use client';

import { useEffect, useState } from 'react';
import type { Stock, Recommendation } from '@/types/stock';
import { UserSwitcher } from '@/components/UserSwitcher';
import { StockTable } from '@/components/StockTable';
import { useUser } from '@/contexts/UserContext';

export default function Home() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser, permissions } = useUser();

  useEffect(() => {
    if (!currentUser) {
      setStocks([]);
      setLoading(false);
      return;
    }

    fetch(`/api/stocks?userId=${currentUser.id}`)
      .then(res => res.json())
      .then(data => {
        // Server already filtered based on user permissions - no client-side filtering needed
        setStocks(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch stocks:', err);
        setLoading(false);
      });
  }, [currentUser, permissions]);

  const getArticle = (role: string) => {
    return ['admin', 'analyst'].includes(role) ? 'an' : 'a';
  };

  const groupStocksByRecommendation = (stocks: Stock[]): Record<Recommendation, Stock[]> => {
    return {
      buy: stocks.filter(s => s.recommendation === 'buy'),
      hold: stocks.filter(s => s.recommendation === 'hold'),  
      sell: stocks.filter(s => s.recommendation === 'sell')
    };
  };

  const getRecommendationHeaderColor = (rec: Recommendation): string => {
    switch (rec) {
      case 'buy': return 'bg-green-50/80';
      case 'hold': return 'bg-yellow-50/80';
      case 'sell': return 'bg-red-50/80';
      default: return 'bg-gray-50/80';
    }
  };

  const handleRecommendationUpdate = (symbol: string, newRecommendation: Recommendation) => {
    setStocks(prevStocks => 
      prevStocks.map(stock => 
        stock.symbol === symbol 
          ? { ...stock, recommendation: newRecommendation }
          : stock
      )
    );
  };

  const handleStockUpdate = (symbol: string, field: string, value: string | number) => {
    setStocks(prevStocks => 
      prevStocks.map(stock => {
        if (stock.symbol === symbol) {
          const updatedStock = { ...stock, [field]: value };
          
          // Auto-calculate changePercent when change or price is updated
          if (field === 'change' || field === 'price') {
            const newPrice = field === 'price' ? Number(value) : stock.price;
            const newChange = field === 'change' ? Number(value) : stock.change;
            const previousPrice = newPrice - newChange;
            
            updatedStock.changePercent = previousPrice > 0 
              ? (newChange / previousPrice) * 100 
              : 0;
          }
          
          return updatedStock;
        }
        return stock;
      })
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">bear with us...</div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-purple-50 p-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-light text-slate-700 mb-2 tracking-wide">🐻</h1>
            <h1 className="text-4xl font-light text-slate-700 mb-2 tracking-wide">o(h )so bearish</h1>
            <p className="text-slate-500 font-light">market data and insights for your investment decisions</p>
          </div>
          <UserSwitcher />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-50 p-12">
      <div className="max-w-full mx-auto px-4">
        <UserSwitcher />
        
        <div className="mb-8 text-center py-8 bg-blue-100 rounded-2xl shadow-sm border border-blue-200/50">
          <h1 className="text-6xl mb-6">🐻</h1>
          <div className="text-3xl font-light text-slate-700 mb-4">
            hi, <span className="underline decoration-2 underline-offset-4">{currentUser.firstName.toLowerCase()}</span> 👋
          </div>
          <div className="text-3xl font-light text-slate-700 mb-6">
            you&apos;re {getArticle(currentUser.role)} <span className="underline decoration-2 underline-offset-4">{currentUser.role}</span> user.
          </div>
          <p className="italic text-xl font-light text-slate-500">here are our insights for you:</p>
        </div>
        
{permissions.canViewRecs ? (
          // Premium+ users: Show recommendations grouped by category
          <div className="space-y-8">
            {(['buy', 'hold', 'sell'] as Recommendation[]).map(recommendation => {
              const categoryStocks = groupStocksByRecommendation(stocks)[recommendation];
              if (categoryStocks.length === 0) return null;
              
              return (
                <StockTable
                  key={recommendation}
                  stocks={categoryStocks}
                  user={currentUser}
                  canEditStocks={permissions.canModifyStocks}
                  onRecommendationUpdate={handleRecommendationUpdate}
                  onStockUpdate={handleStockUpdate}
                  sectionTitle={{
                    text: recommendation,
                    bgColor: getRecommendationHeaderColor(recommendation),
                    count: categoryStocks.length
                  }}
                />
              );
            })}
          </div>
        ) : (
          // Basic users: Simple table with upgrade message
          <StockTable
            stocks={stocks}
            user={currentUser}
            canEditStocks={false}
            showUpgrade={true}
            onRecommendationUpdate={handleRecommendationUpdate}
            onStockUpdate={handleStockUpdate}
          />
        )}
        
        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm font-light">Data for demo purposes only! It&apos;s just pretend</p>
        </div>
      </div>
    </div>
  );
}

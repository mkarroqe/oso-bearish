'use client';

import { useEffect, useState } from 'react';
import type { Stock, Recommendation } from '@/types/stock';
import { UserSwitcher } from '@/components/UserSwitcher';
import { useUser } from '@/contexts/UserContext';

export default function Home() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser, permissions } = useUser();

  useEffect(() => {
    fetch('/api/stocks')
      .then(res => res.json())
      .then(data => {
        let filteredStocks = data;
        
        // Basic users can only see limited stocks
        if (!permissions.canViewAllStocks) {
          filteredStocks = data.slice(0, 3); // Only first 3 stocks
        }
        
        setStocks(filteredStocks);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch stocks:', err);
        setLoading(false);
      });
  }, [permissions]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
  };

  const formatMarketCap = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return formatCurrency(num);
  };

  const getArticle = (role: string) => {
    return ['admin', 'analyst'].includes(role) ? 'an' : 'a';
  };

  const groupStocksByRecommendation = (stocks: Stock[]) => {
    return {
      buy: stocks.filter(s => s.recommendation === 'buy'),
      hold: stocks.filter(s => s.recommendation === 'hold'),  
      sell: stocks.filter(s => s.recommendation === 'sell')
    };
  };

  const getRecommendationColor = (rec: Recommendation) => {
    switch (rec) {
      case 'buy': return 'text-green-600 bg-green-50';
      case 'hold': return 'text-yellow-600 bg-yellow-50';
      case 'sell': return 'text-red-600 bg-red-50';
    }
  };

  const getRecommendationHeaderColor = (rec: Recommendation) => {
    switch (rec) {
      case 'buy': return 'bg-green-50/80';
      case 'hold': return 'bg-yellow-50/80';
      case 'sell': return 'bg-red-50/80';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading stocks...</div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-purple-50 p-12">
        <div className="max-w-2xl mx-auto">
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
      <div className="max-w-7xl mx-auto">
        <UserSwitcher />
        
        <div className="mb-8 text-center py-8 bg-blue-100 rounded-2xl shadow-sm border border-yellow-100/50">
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
                <div key={recommendation} className="bg-white rounded-2xl shadow-sm border border-slate-200/50 overflow-hidden">
                  <div className={`px-8 py-4 ${getRecommendationHeaderColor(recommendation)} border-b border-slate-200/60`}>
                    <h3 className="text-lg font-medium text-slate-700 capitalize flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRecommendationColor(recommendation)}`}>
                        {recommendation}
                      </span>
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-slate-50/40 border-b border-slate-200/60">
                          <th className="px-8 py-4 text-left font-medium text-slate-600 tracking-wide">Symbol</th>
                          <th className="px-8 py-4 text-left font-medium text-slate-600 tracking-wide">Company</th>
                          <th className="px-8 py-4 text-right font-medium text-slate-600 tracking-wide">Price</th>
                          <th className="px-8 py-4 text-right font-medium text-slate-600 tracking-wide">Change</th>
                          <th className="px-8 py-4 text-right font-medium text-slate-600 tracking-wide">Change %</th>
                          <th className="px-8 py-4 text-right font-medium text-slate-600 tracking-wide">Volume</th>
                          <th className="px-8 py-4 text-right font-medium text-slate-600 tracking-wide">Market Cap</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categoryStocks.map((stock, index) => (
                          <tr key={stock.symbol} className={`hover:bg-slate-50/40 transition-colors duration-200 ${
                            index !== categoryStocks.length - 1 ? 'border-b border-slate-100' : ''
                          }`}>
                            <td className="px-8 py-4">
                              <div className="font-mono font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-full inline-block text-sm">
                                {stock.symbol}
                              </div>
                            </td>
                            <td className="px-8 py-4 text-slate-700 font-light">{stock.name}</td>
                            <td className="px-8 py-4 text-right font-mono text-slate-800 font-medium">
                              {formatCurrency(stock.price)}
                            </td>
                            <td className={`px-8 py-4 text-right font-mono font-medium ${
                              stock.change >= 0 ? 'text-emerald-600' : 'text-rose-500'
                            }`}>
                              {stock.change >= 0 ? '+' : ''}{formatCurrency(stock.change)}
                            </td>
                            <td className={`px-8 py-4 text-right font-mono font-medium ${
                              stock.changePercent >= 0 ? 'text-emerald-600' : 'text-rose-500'
                            }`}>
                              <span className={`px-2 py-1 rounded-full text-sm ${
                                stock.changePercent >= 0 
                                  ? 'bg-emerald-50 text-emerald-600' 
                                  : 'bg-rose-50 text-rose-500'
                              }`}>
                                {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                              </span>
                            </td>
                            <td className="px-8 py-4 text-right font-mono text-slate-500 font-light">
                              {formatNumber(stock.volume)}
                            </td>
                            <td className="px-8 py-4 text-right font-mono text-slate-500 font-light">
                              {formatMarketCap(stock.marketCap)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Basic users: Simple table without recommendations
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/60">
                    <th className="px-8 py-6 text-left font-medium text-slate-600 tracking-wide">Symbol</th>
                    <th className="px-8 py-6 text-left font-medium text-slate-600 tracking-wide">Company</th>
                    <th className="px-8 py-6 text-right font-medium text-slate-600 tracking-wide">Price</th>
                    <th className="px-8 py-6 text-right font-medium text-slate-600 tracking-wide">Change</th>
                    <th className="px-8 py-6 text-right font-medium text-slate-600 tracking-wide">Change %</th>
                    <th className="px-8 py-6 text-right font-medium text-slate-600 tracking-wide">Volume</th>
                    <th className="px-8 py-6 text-right font-medium text-slate-600 tracking-wide">Market Cap</th>
                  </tr>
                </thead>
                <tbody>
                  {stocks.map((stock, index) => (
                    <tr key={stock.symbol} className={`hover:bg-slate-50/40 transition-colors duration-200 ${
                      index !== stocks.length - 1 ? 'border-b border-slate-100' : ''
                    }`}>
                      <td className="px-8 py-6">
                        <div className="font-mono font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-full inline-block text-sm">
                          {stock.symbol}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-slate-700 font-light">{stock.name}</td>
                      <td className="px-8 py-6 text-right font-mono text-slate-800 font-medium">
                        {formatCurrency(stock.price)}
                      </td>
                      <td className={`px-8 py-6 text-right font-mono font-medium ${
                        stock.change >= 0 ? 'text-emerald-600' : 'text-rose-500'
                      }`}>
                        {stock.change >= 0 ? '+' : ''}{formatCurrency(stock.change)}
                      </td>
                      <td className={`px-8 py-6 text-right font-mono font-medium ${
                        stock.changePercent >= 0 ? 'text-emerald-600' : 'text-rose-500'
                      }`}>
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          stock.changePercent >= 0 
                            ? 'bg-emerald-50 text-emerald-600' 
                            : 'bg-rose-50 text-rose-500'
                        }`}>
                          {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right font-mono text-slate-500 font-light">
                        {formatNumber(stock.volume)}
                      </td>
                      <td className="px-8 py-6 text-right font-mono text-slate-500 font-light">
                        {formatMarketCap(stock.marketCap)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm font-light">Data for demo purposes only! It's just pretend</p>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import type { Stock } from '@/types/stock';
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
        
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-light text-slate-700 mb-2 tracking-wide">🐻</h1>
          <h1 className="text-4xl font-light text-slate-700 mb-2 tracking-wide">o(h )so bearish</h1>
          <p className="text-slate-500 font-light">market data and insights for your investment decisions</p>
        </div>
        
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
        
        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm font-light">Data refreshed in real-time</p>
        </div>
      </div>
    </div>
  );
}

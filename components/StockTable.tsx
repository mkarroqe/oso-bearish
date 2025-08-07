'use client';

import type { Stock, Recommendation } from '@/types/stock';
import { EditableRecommendation } from './EditableRecommendation';
import { EditableField } from './EditableField';

interface StockTableProps {
  stocks: Stock[];
  canEdit: boolean;
  canEditStocks?: boolean;
  showUpgrade?: boolean;
  onRecommendationUpdate: (symbol: string, newRecommendation: Recommendation) => void;
  onStockUpdate?: (symbol: string, field: string, value: string | number) => void;
  sectionTitle?: {
    text: string;
    bgColor: string;
    count?: number;
  };
}

export function StockTable({ 
  stocks, 
  canEdit, 
  canEditStocks = false,
  showUpgrade = false, 
  onRecommendationUpdate,
  onStockUpdate,
  sectionTitle 
}: StockTableProps) {
  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
  };

  const formatMarketCap = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return formatCurrency(num);
  };

  const getRecommendationColor = (rec: Recommendation) => {
    switch (rec) {
      case 'buy': return 'text-green-600 bg-green-50';
      case 'hold': return 'text-yellow-600 bg-yellow-50';
      case 'sell': return 'text-red-600 bg-red-50';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/50 overflow-hidden">
      {sectionTitle && (
        <div className={`px-8 py-4 ${sectionTitle.bgColor} border-b border-slate-200/60`}>
          <h3 className="text-lg font-medium text-slate-700 capitalize flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRecommendationColor(sectionTitle.text.toLowerCase() as Recommendation)}`}>
              {sectionTitle.text}
            </span>
          </h3>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={sectionTitle ? "bg-slate-50/40 border-b border-slate-200/60" : "bg-slate-50/80 border-b border-slate-200/60"}>
              <th className="px-8 py-4 text-left font-medium text-slate-600 tracking-wide">Symbol</th>
              <th className="px-8 py-4 text-left font-medium text-slate-600 tracking-wide">Company</th>
              <th className="px-8 py-4 text-left font-medium text-slate-600 tracking-wide">Tags</th>
              <th className="px-8 py-4 text-right font-medium text-slate-600 tracking-wide">Price</th>
              <th className="px-8 py-4 text-right font-medium text-slate-600 tracking-wide">Change</th>
              <th className="px-8 py-4 text-right font-medium text-slate-600 tracking-wide">Change %</th>
              <th className="px-8 py-4 text-right font-medium text-slate-600 tracking-wide">Volume</th>
              <th className="px-8 py-4 text-right font-medium text-slate-600 tracking-wide">Market Cap</th>
              <th className="px-8 py-4 text-center font-medium text-slate-600 tracking-wide">Rating</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock, index) => (
              <tr key={stock.symbol} className={`hover:bg-slate-50/40 transition-colors duration-200 ${
                index !== stocks.length - 1 ? 'border-b border-slate-100' : ''
              }`}>
                <td className="px-8 py-4">
                  <div className="font-mono font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-full inline-block text-sm">
                    {stock.symbol}
                  </div>
                </td>
                <td className="px-8 py-4 text-slate-700 font-light">
                  <EditableField
                    value={stock.name}
                    field="name"
                    symbol={stock.symbol}
                    canEdit={canEditStocks}
                    type="text"
                    className="font-light text-left"
                    onUpdate={onStockUpdate || (() => {})}
                  />
                </td>
                <td className="px-8 py-4">
                  <div className="flex gap-2">
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full font-medium">
                      {stock.industry}
                    </span>
                    {stock.isBasic ? (
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium">
                        Basic
                      </span>
                    ) : (
                      <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full font-medium">
                        Premium
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-8 py-4 text-right font-mono text-slate-800 font-medium">
                  <EditableField
                    value={stock.price}
                    field="price"
                    symbol={stock.symbol}
                    canEdit={canEditStocks}
                    type="number"
                    prefix="$"
                    className="font-mono font-medium text-right"
                    onUpdate={onStockUpdate || (() => {})}
                  />
                </td>
                <td className={`px-8 py-4 text-right font-mono font-medium ${
                  stock.change >= 0 ? 'text-emerald-600' : 'text-rose-500'
                }`}>
                  <EditableField
                    value={Math.abs(stock.change)}
                    field="change"
                    symbol={stock.symbol}
                    canEdit={canEditStocks}
                    type="number"
                    prefix={stock.change >= 0 ? '+$' : '-$'}
                    className={`font-mono font-medium text-right ${
                      stock.change >= 0 ? 'text-emerald-600' : 'text-rose-500'
                    }`}
                    onUpdate={onStockUpdate || (() => {})}
                  />
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
                  <EditableField
                    value={stock.volume}
                    field="volume"
                    symbol={stock.symbol}
                    canEdit={canEditStocks}
                    type="number"
                    className="font-mono font-light text-right text-slate-500"
                    onUpdate={onStockUpdate || (() => {})}
                  />
                </td>
                <td className="px-8 py-4 text-right font-mono text-slate-500 font-light">
                  {canEditStocks ? (
                    <EditableField
                      value={stock.marketCap}
                      field="marketCap"
                      symbol={stock.symbol}
                      canEdit={canEditStocks}
                      type="number"
                      className="font-mono font-light text-right text-slate-500"
                      onUpdate={onStockUpdate || (() => {})}
                    />
                  ) : (
                    formatMarketCap(stock.marketCap)
                  )}
                </td>
                <td className="px-8 py-4 text-center">
                  {showUpgrade ? (
                    <span className="italic text-slate-400 text-sm">upgrade for access</span>
                  ) : (
                    <EditableRecommendation 
                      stock={stock}
                      canEdit={canEdit}
                      onUpdate={onRecommendationUpdate}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
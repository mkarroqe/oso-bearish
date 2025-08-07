export type Recommendation = 'buy' | 'hold' | 'sell';

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  recommendation: Recommendation;
  isBasic: boolean;
}
import { NextRequest, NextResponse } from 'next/server';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
}

const mockStocks: Stock[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 182.52,
    change: -1.23,
    changePercent: -0.67,
    volume: 48532100,
    marketCap: 2840000000000
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 138.21,
    change: 2.45,
    changePercent: 1.80,
    volume: 25641200,
    marketCap: 1750000000000
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 378.85,
    change: 0.92,
    changePercent: 0.24,
    volume: 19823400,
    marketCap: 2810000000000
  },
  {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    price: 248.42,
    change: -5.67,
    changePercent: -2.23,
    volume: 76543200,
    marketCap: 790000000000
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    price: 875.30,
    change: 12.45,
    changePercent: 1.44,
    volume: 42156800,
    marketCap: 2150000000000
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com, Inc.',
    price: 151.94,
    change: -0.78,
    changePercent: -0.51,
    volume: 31245600,
    marketCap: 1580000000000
  },
  {
    symbol: 'META',
    name: 'Meta Platforms, Inc.',
    price: 426.20,
    change: 8.12,
    changePercent: 1.94,
    volume: 28764300,
    marketCap: 1080000000000
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');

    if (symbol) {
      const stock = mockStocks.find(s => s.symbol.toLowerCase() === symbol.toLowerCase());
      
      if (!stock) {
        return NextResponse.json(
          { error: 'Stock not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(stock);
    }

    return NextResponse.json(mockStocks);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { mockStocks } from '@/data/mock-stocks';

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
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
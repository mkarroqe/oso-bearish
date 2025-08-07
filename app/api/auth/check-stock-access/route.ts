import { NextRequest, NextResponse } from 'next/server';
import { mockUsers } from '@/data/mock-users';
import { mockStocks } from '@/data/mock-stocks';
import { canViewStock } from '@/lib/oso-client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const symbol = searchParams.get('symbol');

    if (!userId || !symbol) {
      return NextResponse.json(
        { error: 'User ID and stock symbol are required' },
        { status: 400 }
      );
    }

    const user = mockUsers.find(u => u.id === userId);
    const stock = mockStocks.find(s => s.symbol === symbol);
    
    if (!user || !stock) {
      return NextResponse.json(
        { error: 'User or stock not found' },
        { status: 404 }
      );
    }

    const allowed = await canViewStock(user, stock);

    return NextResponse.json({ allowed });
  } catch (error) {
    console.error('Error checking stock access:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
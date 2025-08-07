import { NextRequest, NextResponse } from 'next/server';
import { mockUsers } from '@/data/mock-users';
import { mockStocks } from '@/data/mock-stocks';
import { canModifySpecificStock } from '@/lib/oso-client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const symbolsParam = searchParams.get('symbols'); // e.g., "NVDA,AAPL,GOOGL"

    if (!userId || !symbolsParam) {
      return NextResponse.json(
        { error: 'User ID and symbols are required' },
        { status: 400 }
      );
    }

    const symbols = symbolsParam.split(',').map(s => s.trim()).filter(Boolean);
    
    if (symbols.length === 0) {
      return NextResponse.json(
        { error: 'At least one symbol is required' },
        { status: 400 }
      );
    }

    const user = mockUsers.find(u => u.id === userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get stocks that exist in our data
    const requestedStocks = symbols
      .map(symbol => mockStocks.find(s => s.symbol === symbol))
      .filter(Boolean);

    if (requestedStocks.length === 0) {
      return NextResponse.json(
        { error: 'No valid stocks found for provided symbols' },
        { status: 404 }
      );
    }

    // Batch check permissions for all stocks
    const permissionChecks = await Promise.all(
      requestedStocks.map(async (stock) => {
        const canModify = await canModifySpecificStock(user, stock!);
        return {
          symbol: stock!.symbol,
          canModify,
          stockName: stock!.name
        };
      })
    );

    const result = {
      user: {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role,
        analyst_type: user.analyst_type,
        groups: user.groups
      },
      permissions: permissionChecks.reduce((acc, check) => {
        acc[check.symbol] = {
          canModify: check.canModify,
          stockName: check.stockName
        };
        return acc;
      }, {} as Record<string, { canModify: boolean; stockName: string }>),
      totalChecked: permissionChecks.length
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error checking bulk stock permissions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
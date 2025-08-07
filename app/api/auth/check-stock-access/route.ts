import { NextRequest, NextResponse } from 'next/server';
import { mockUsers } from '@/data/mock-users';
import { mockStocks } from '@/data/mock-stocks';
import { canViewStock, canModifyRecommendation } from '@/lib/oso-client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const symbol = searchParams.get('symbol');
    const action = searchParams.get('action') || 'view'; // 'view' or 'modify'

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

    let result;
    if (action === 'modify') {
      // Pure Oso ReBAC - let the policy handle everything
      const allowed = await canModifyRecommendation(user, symbol);

      result = {
        user: {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role,
          analyst_type: user.analyst_type,
          groups: user.groups
        },
        stock: {
          symbol: stock.symbol,
          name: stock.name
        },
        action: 'modify_recommendation',
        allowed: allowed,
        explanation: getExplanation(user, symbol, allowed)
      };
    } else {
      // Original view logic
      const allowed = await canViewStock(user, stock);
      result = { 
        user: `${user.firstName} ${user.lastName}`,
        stock: stock.symbol,
        action: 'view',
        allowed 
      };
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error checking stock access:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function getExplanation(user: { role: string; analyst_type?: string; groups: string[] }, symbol: string, allowed: boolean): string {
  if (user.role !== 'analyst') {
    return `${user.role} users ${allowed ? 'can' : 'cannot'} modify recommendations`;
  }
  
  if (user.analyst_type === 'super') {
    return allowed 
      ? `✅ Super analyst can modify any recommendation`
      : `❌ Super analyst denied - check policy`;
  }
  
  // Regular analyst
  if (allowed) {
    return `✅ Regular analyst can modify ${symbol} - ReBAC policy allows (user groups: [${user.groups.join(', ')}])`;
  } else {
    return `❌ Regular analyst cannot modify ${symbol} - ReBAC policy denies (user groups: [${user.groups.join(', ')}])`;
  }
}
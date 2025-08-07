import { NextRequest, NextResponse } from 'next/server';
import { mockStocks } from '@/data/mock-stocks';
import { mockUsers } from '@/data/mock-users';
import type { Recommendation } from '@/types/stock';
import { canViewStock, canModifyStock, canModifyRecommendation } from '@/lib/oso-client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    const userId = searchParams.get('userId');

    // For now, if no userId provided, return all stocks (for backwards compatibility)
    // In production, you'd want to enforce authentication
    if (!userId) {
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
    }

    // Get user for authorization
    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      );
    }

    if (symbol) {
      const stock = mockStocks.find(s => s.symbol.toLowerCase() === symbol.toLowerCase());
      
      if (!stock) {
        return NextResponse.json(
          { error: 'Stock not found' },
          { status: 404 }
        );
      }

      // Check if user can view this stock
      const canView = await canViewStock(user, stock);
      if (!canView) {
        return NextResponse.json(
          { error: 'Access denied' },
          { status: 403 }
        );
      }

      return NextResponse.json(stock);
    }

    // Filter stocks based on user permissions
    const authorizedStocks = await Promise.all(
      mockStocks.map(async (stock) => {
        const canView = await canViewStock(user, stock);
        return canView ? stock : null;
      })
    );

    return NextResponse.json(authorizedStocks.filter(Boolean));
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    const userId = searchParams.get('userId');
    
    if (!symbol) {
      return NextResponse.json(
        { error: 'Stock symbol is required' },
        { status: 400 }
      );
    }

    // Require userId for PATCH operations
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user for authorization
    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    const stockIndex = mockStocks.findIndex(s => s.symbol.toLowerCase() === symbol.toLowerCase());
    
    if (stockIndex === -1) {
      return NextResponse.json(
        { error: 'Stock not found' },
        { status: 404 }
      );
    }

    const stock = mockStocks[stockIndex];
    let updated = false;

    // Update recommendation if provided
    if (body.recommendation) {
      // Check if user can modify recommendations
      const canModifyRec = await canModifyRecommendation(user);
      if (!canModifyRec) {
        return NextResponse.json(
          { error: 'You do not have permission to modify recommendations' },
          { status: 403 }
        );
      }

      if (!['buy', 'hold', 'sell'].includes(body.recommendation)) {
        return NextResponse.json(
          { error: 'Valid recommendation (buy, hold, sell) is required' },
          { status: 400 }
        );
      }
      stock.recommendation = body.recommendation as Recommendation;
      updated = true;
    }

    // Check if user can modify stock data for any other field updates
    const isModifyingStockData = body.price !== undefined || 
                                 body.change !== undefined || 
                                 body.volume !== undefined || 
                                 body.marketCap !== undefined || 
                                 body.name !== undefined;

    if (isModifyingStockData) {
      const canModifyStockData = await canModifyStock(user);
      if (!canModifyStockData) {
        return NextResponse.json(
          { error: 'You do not have permission to modify stock data' },
          { status: 403 }
        );
      }
    }

    // Update price if provided
    if (body.price !== undefined) {
      const price = parseFloat(body.price);
      if (isNaN(price) || price <= 0) {
        return NextResponse.json(
          { error: 'Price must be a positive number' },
          { status: 400 }
        );
      }
      stock.price = price;
      updated = true;
    }

    // Update change if provided
    if (body.change !== undefined) {
      const change = parseFloat(body.change);
      if (isNaN(change)) {
        return NextResponse.json(
          { error: 'Change must be a valid number' },
          { status: 400 }
        );
      }
      stock.change = change;
      // Auto-calculate change percentage
      stock.changePercent = stock.price > 0 ? ((change / (stock.price - change)) * 100) : 0;
      updated = true;
    }

    // Update volume if provided
    if (body.volume !== undefined) {
      const volume = parseInt(body.volume);
      if (isNaN(volume) || volume < 0) {
        return NextResponse.json(
          { error: 'Volume must be a non-negative integer' },
          { status: 400 }
        );
      }
      stock.volume = volume;
      updated = true;
    }

    // Update market cap if provided
    if (body.marketCap !== undefined) {
      const marketCap = parseFloat(body.marketCap);
      if (isNaN(marketCap) || marketCap < 0) {
        return NextResponse.json(
          { error: 'Market cap must be a non-negative number' },
          { status: 400 }
        );
      }
      stock.marketCap = marketCap;
      updated = true;
    }

    // Update company name if provided
    if (body.name !== undefined) {
      if (typeof body.name !== 'string' || body.name.trim().length === 0) {
        return NextResponse.json(
          { error: 'Company name must be a non-empty string' },
          { status: 400 }
        );
      }
      stock.name = body.name.trim();
      updated = true;
    }

    if (!updated) {
      return NextResponse.json(
        { error: 'No valid fields provided to update' },
        { status: 400 }
      );
    }

    return NextResponse.json(stock);
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
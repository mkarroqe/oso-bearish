import { NextRequest, NextResponse } from 'next/server';
import { mockUsers } from '@/data/mock-users';
import { getUserPermissions } from '@/lib/oso-client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
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

    const permissions = await getUserPermissions(user);

    return NextResponse.json(permissions);
  } catch (error) {
    console.error('Error fetching permissions:', error);
    // Return more detailed error in development
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      : 'Internal server error';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
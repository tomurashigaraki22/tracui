import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, role, action } = body;

    if (action === 'signup') {
      const dummyUser = {
        id: `user_${Date.now()}`,
        email,
        role,
        token: `dummy_token_${Date.now()}`
      };

      return NextResponse.json(dummyUser, { status: 201 });
    }

    if (action === 'login') {
      const dummyUser = {
        id: `user_${Date.now()}`,
        email,
        role: 'consumer',
        token: `dummy_token_${Date.now()}`
      };

      return NextResponse.json(dummyUser, { status: 200 });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { role } = body;
    const authHeader = request.headers.get('Authorization');

    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const dummyResponse = {
      role
    };

    return NextResponse.json(dummyResponse, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const dummyUser = {
      id: 'dummy_user_id',
      email: 'user@example.com',
      role: 'consumer'
    };

    return NextResponse.json(dummyUser, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
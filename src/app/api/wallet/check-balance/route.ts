import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import pool from '@/lib/mysql';
import { getWalletBalance } from '@/utils/wallet';
import type { RowDataPacket } from 'mysql2';

// Define interface for user row
interface UserRow extends RowDataPacket {
  address: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    const connection = await pool.getConnection();
    try {
      // Type the query result as UserRow[]
      const [users] = await connection.execute<UserRow[]>(
        'SELECT address FROM users WHERE email = ?',
        [email]
      );

      if (!Array.isArray(users) || users.length === 0) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      const address = users[0].address;
      console.log("Wallet Address: ", address)
      const balance = await getWalletBalance(address);

      return NextResponse.json({ balance });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Check balance error:', error);
    return NextResponse.json(
      { error: 'Failed to check wallet balance' },
      { status: 500 }
    );
  }
}
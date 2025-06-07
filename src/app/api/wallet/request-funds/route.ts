import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import pool from '@/lib/mysql';
import { getFaucetHost, requestSuiFromFaucetV2 } from '@mysten/sui/faucet';
import type { RowDataPacket } from 'mysql2';

interface UserWallet extends RowDataPacket {
  address: string;
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    const connection = await pool.getConnection();

    try {
      const [users] = await connection.execute<UserWallet[]>(
        'SELECT address FROM users WHERE email = ?',
        [email]
      );

      if (!users.length) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

    //   const faucetResponse = await requestSuiFromFaucetV2({
    //     host: getFaucetHost('testnet'),
    //     recipient: users[0].address,
    //   });

      return NextResponse.json({
        message: 'Funds requested successfully',
        // faucetResponse
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Faucet request error:', error);
    return NextResponse.json(
      { error: `Failed to request funds: ${error}`, },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';

const FAUCET_URL = 'https://faucet.testnet.sui.io/gas';
const BACKUP_FAUCET_URL = 'https://sui-faucet.testnet.sui.io/gas';

export async function POST(request: NextRequest) {
  try {
    const { recipient } = await request.json();

    // Try primary faucet
    try {
      const response = await fetch(FAUCET_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          FixedAmountRequest: {
            recipient
          }
        })
      });

      if (response.ok) {
        const result = await response.json();
        return NextResponse.json(result);
      }
    } catch (error) {
      console.log('Primary faucet failed, trying backup...');
    }

    // Try backup faucet
    const backupResponse = await fetch(BACKUP_FAUCET_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipient
      })
    });

    if (backupResponse.ok) {
      const result = await backupResponse.json();
      return NextResponse.json(result);
    }

    return NextResponse.json(
      { error: 'Both faucets failed' },
      { status: 500 }
    );

  } catch (error) {
    console.error('Faucet proxy error:', error);
    return NextResponse.json(
      { error: 'Faucet request failed' },
      { status: 500 }
    );
  }
}
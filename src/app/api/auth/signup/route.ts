import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import pool from '@/lib/mysql';
import jwt from 'jsonwebtoken';
import { createNewWallet } from '@/utils/wallet';
import type { RowDataPacket } from 'mysql2';

// Add this interface for MySQL row typing
interface UserRow extends RowDataPacket {
  id: number;
  email: string;
  name: string;
  address: string;
  private_key: string;
  public_key: string;
  account_type: string;
  picture?: string;
}

async function ensureColumns() {
  const connection = await pool.getConnection();
  try {
    // Check if columns exist
    const [columns] = await connection.execute(
      'SHOW COLUMNS FROM users'
    );
    
    const columnNames = (columns as RowDataPacket[]).map(col => col.Field);
    
    // Add missing columns if they don't exist
    if (!columnNames.includes('private_key')) {
      await connection.execute(
        'ALTER TABLE users ADD COLUMN private_key VARCHAR(255)'
      );
    }
    
    if (!columnNames.includes('public_key')) {
      await connection.execute(
        'ALTER TABLE users ADD COLUMN public_key VARCHAR(255)'
      );
    }
    
    if (!columnNames.includes('address')) {
      await connection.execute(
        'ALTER TABLE users ADD COLUMN address VARCHAR(255)'
      );
    }
  } finally {
    connection.release();
  }
}

export async function POST(request: NextRequest) {
  try {
    // Ensure columns exist before processing request
    await ensureColumns();
    
    const body = await request.json();
    const { access_token, email, name, picture, account_type } = body;

    if (!access_token || !email || !name || !account_type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();

    try {
      // Type the query result
      const [existingUser] = await connection.execute<UserRow[]>(
        'SELECT id, address, private_key, public_key FROM users WHERE email = ?',
        [email]
      );

      if (Array.isArray(existingUser) && existingUser.length > 0) {
        const userId = existingUser[0].id;
        const token = jwt.sign({ id: userId }, process.env.JWT_SECRET || 'your-secret-key');
        
        return NextResponse.json({ 
          message: 'User logged in Successfully!',
          token,
          wallet: {
            address: existingUser[0].address,
            privateKey: existingUser[0].private_key,
            publicKey: existingUser[0].public_key
          }
        }, { status: 200 });
      }

      // Create new wallet for new users
      const walletInfo = await createNewWallet(email);

      const [result] = await connection.execute(
        'INSERT INTO users (access_token, email, name, picture, account_type, private_key, address, public_key) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [access_token, email, name, picture, account_type, walletInfo.privateKey, walletInfo.address, walletInfo.publicKey]
      );

      const userId = (result as any).insertId;
      const token = jwt.sign({ id: userId }, process.env.JWT_SECRET || 'your-secret-key');

      return NextResponse.json({ 
        message: 'User created successfully',
        token,
        wallet: walletInfo
      }, { status: 201 });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
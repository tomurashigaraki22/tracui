import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import pool from '@/lib/mysql';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { access_token, email, name, picture, account_type, private_key, address } = body;

    if (!access_token || !email || !name || !account_type || !private_key || !address) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();

    try {
      const [existingUser] = await connection.execute(
        'SELECT email FROM users WHERE email = ?',
        [email]
      );

      if (Array.isArray(existingUser) && existingUser.length > 0) {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 409 }
        );
      }

      const [result] = await connection.execute(
        'INSERT INTO users (access_token, email, name, picture, account_type, private_key, address) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [access_token, email, name, picture, account_type, private_key, address]
      );

      const userId = (result as any).insertId;
      const token = jwt.sign({ id: userId }, process.env.JWT_SECRET || 'your-secret-key');

      return NextResponse.json(
        { 
          message: 'User created successfully',
          token
        },
        { status: 201 }
      );
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
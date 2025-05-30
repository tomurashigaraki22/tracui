import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import pool from '@/lib/mysql';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import { RowDataPacket } from 'mysql2';

interface User extends RowDataPacket {
  address: string;
}

// Helper function to verify JWT token
const verifyToken = (request: NextRequest) => {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) throw new Error('No token provided');
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Generate unique product code
const generateProductCode = () => {
  return randomBytes(3)
    .toString('base64')
    .replace(/[^a-zA-Z0-9]/g, '')
    .substring(0, 5)
    .toUpperCase();
};

// Create product
export async function POST(request: NextRequest) {
  try {
    const decoded = verifyToken(request) as { id: number };
    const body = await request.json();
    const {
      product_name,
      sender_location,
      receiver_location,
      description,
      estimated_delivery_date,
      product_weight,
      product_value,
      delivery_fee,
      blob_id
    } = body;

    const requiredFields = [
      'product_name',
      'sender_location',
      'receiver_location',
      'description',
      'estimated_delivery_date',
      'product_weight',
      'product_value',
      'delivery_fee',
      'blob_id'
    ];

    const missingFields = requiredFields.filter(field => !body[field]);
    if (missingFields.length > 0) {
      return NextResponse.json({ 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      }, { status: 400 });
    }

    if (delivery_fee < 1) {
      return NextResponse.json({ 
        error: 'Delivery fee must be at least 1' 
      }, { status: 400 });
    }

    const connection = await pool.getConnection();
    try {
      const [[user]] = await connection.execute<User[]>(
        'SELECT address FROM users WHERE id = ?',
        [decoded.id]
      );

      if (!user?.address) {
        return NextResponse.json({ 
          error: 'User wallet address not found' 
        }, { status: 400 });
      }

      const product_code = generateProductCode();
      const tracking_number = 'TRK' + Date.now().toString();

      const [result] = await connection.execute(
        'INSERT INTO products (product_code, product_name, sender_location, receiver_location, sender_wallet_address, description, estimated_delivery_date, tracking_number, product_weight, product_value, delivery_fee, blob_id, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [product_code, product_name, sender_location, receiver_location, user.address, description, estimated_delivery_date, tracking_number, product_weight, product_value, delivery_fee, blob_id, decoded.id]
      );

      return NextResponse.json({ 
        message: 'Product created successfully',
        product_code,
        tracking_number
      }, { status: 201 });
    } finally {
      connection.release();
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: error.message === 'Invalid token' ? 401 : 500 });
  }
}

// Get all products
export async function GET(request: NextRequest) {
  try {
    const decodedToken = verifyToken(request) as { id: string };
    const userId = decodedToken.id;
    const connection = await pool.getConnection();
    
    try {
      const [products] = await connection.execute('SELECT * FROM products WHERE user_id = ? ORDER BY created_at DESC', [userId]);
      return NextResponse.json({ products }, { status: 200 });
    } finally {
      connection.release();
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: error.message === 'Invalid token' ? 401 : 500 });
  }
}
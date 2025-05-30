import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import pool from '@/lib/mysql';
import jwt from 'jsonwebtoken';
import type { RowDataPacket } from 'mysql2';

interface Product extends RowDataPacket {
  id: number;
  product_code: string;
  product_name: string;
  sender_location: string;
  receiver_location: string;
  sender_wallet_address: string;
  logistics_wallet_address: string;
  logistics_location: string;
  status: 'pending' | 'in_transit' | 'delivered';
  created_at: Date;
  updated_at: Date;
  delivered_at: Date | null;
  delivered: boolean;
  description: string;
  estimated_delivery_date: Date;
  tracking_number: string;
  product_weight: number;
  product_value: number;
}

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

export async function GET(request: NextRequest, { params }: { params: { productCode: string } }) {
  try {
    verifyToken(request);
    const connection = await pool.getConnection();
    
    try {
      const [products] = await connection.execute<Product[]>(
        'SELECT * FROM products WHERE product_code = ?',
        [params.productCode]
      );

      if (products.length === 0) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }

      return NextResponse.json({ product: products[0] }, { status: 200 });
    } finally {
      connection.release();
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: error.message === 'Invalid token' ? 401 : 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { productCode: string } }) {
  try {
    verifyToken(request);
    const body = await request.json();
    const connection = await pool.getConnection();
    
    try {
      const [result] = await connection.execute(
        'UPDATE products SET ? WHERE product_code = ?',
        [body, params.productCode]
      );

      if ((result as any).affectedRows === 0) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }

      return NextResponse.json({ message: 'Product updated successfully' }, { status: 200 });
    } finally {
      connection.release();
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: error.message === 'Invalid token' ? 401 : 500 });
  }
}
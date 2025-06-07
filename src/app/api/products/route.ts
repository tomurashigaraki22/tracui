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

// Helper function to add escrow columns
async function ensureEscrowColumns() {
  const connection = await pool.getConnection();
  try {
    await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'products' 
      AND TABLE_SCHEMA = DATABASE()
      AND COLUMN_NAME IN ('escrow_amount', 'escrow_wallet')
    `).then(async ([columns]) => {
      if (!Array.isArray(columns) || columns.length < 2) {
        await connection.execute(`
          ALTER TABLE products
          ADD COLUMN escrow_amount DECIMAL(65,0) DEFAULT 0,
          ADD COLUMN escrow_wallet VARCHAR(255) NULL
        `);
        console.log('Added escrow columns to products table');
      }
    });
  } catch (error) {
    console.error('Error ensuring escrow columns:', error);
    throw error;
  } finally {
    connection.release();
  }
}

// Add this function after the imports
async function ensureProductsTable() {
  const connection = await pool.getConnection();
  try {
    // First check if id column exists
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'products' 
      AND TABLE_SCHEMA = DATABASE()
      AND COLUMN_NAME = 'id'
    `);

    if (Array.isArray(columns) && columns.length > 0) {
      // Drop existing id column if it exists
      await connection.execute(`
        ALTER TABLE products 
        DROP COLUMN id
      `);
    }

    // Add new id column without uniqueness constraint
    await connection.execute(`
      ALTER TABLE products
      ADD COLUMN id BIGINT AUTO_INCREMENT,
      ADD INDEX (id)
    `);

    console.log('Reset id column in products table');
  } catch (error) {
    console.error('Error modifying products table structure:', error);
    throw error;
  } finally {
    connection.release();
  }
}

// Update the generateProductCode function to ensure uniqueness
const generateProductCode = async (connection: any): Promise<string> => {
  let attempts = 0;
  const maxAttempts = 5;
  
  while (attempts < maxAttempts) {
    const code = randomBytes(4)
      .toString('base64')
      .replace(/[^a-zA-Z0-9]/g, '')
      .substring(0, 6)
      .toUpperCase();
    
    // Check if code already exists
    const [existing] = await connection.execute(
      'SELECT product_code FROM products WHERE product_code = ?',
      [code]
    );

    if (!Array.isArray(existing) || existing.length === 0) {
      return code;
    }
    
    attempts++;
  }
  
  throw new Error('Failed to generate unique product code');
};

// Create product
export async function POST(request: NextRequest) {
  try {
    await ensureProductsTable(); // Add this line before other operations
    await ensureEscrowColumns();
    
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

    // Update required fields to match form data
    const requiredFields = [
      'product_name',
      'sender_location',
      'receiver_location',
      'sender_email',
      'logistics_email',
      'logistics_location',
      'description',
      'estimated_delivery_date',
      'product_weight',
      'product_value',
      'delivery_fee',
      'recipient_email',
      'blob_id'
    ];

    const missingFields = requiredFields.filter(field => !body[field]);
    if (missingFields.length > 0) {
      console.log('Missing fields:', {
        required: requiredFields,
        received: Object.keys(body),
        missing: missingFields
      });
      
      return NextResponse.json({ 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      }, { status: 400 });
    }

    // if (delivery_fee < 1) {
    //   return NextResponse.json({ 
    //     error: 'Delivery fee must be at least 1' 
    //   }, { status: 400 });
    // }

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

      // Generate unique codes
      const product_code = await generateProductCode(connection);
      const tracking_number = `TRK${Date.now()}${Math.random().toString(36).substring(2, 5)}`;

      // Add escrow details to the query
      const [result] = await connection.execute(
        `INSERT INTO products (
          product_code, 
          product_name, 
          sender_location, 
          receiver_location, 
          sender_wallet_address, 
          description, 
          estimated_delivery_date, 
          tracking_number, 
          product_weight, 
          product_value, 
          delivery_fee, 
          blob_id,
          escrow_amount,
          escrow_wallet,
          user_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          product_code,
          body.product_name,
          body.sender_location,
          body.receiver_location,
          user.address,
          body.description,
          body.estimated_delivery_date,
          tracking_number,
          body.product_weight,
          body.product_value,
          body.delivery_fee,
          body.blob_id,
          body.escrow_amount || 0,
          body.escrow_wallet || null,
          decoded.id
        ]
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
    console.error('Product creation error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to create product'
    }, { 
      status: error.message === 'Invalid token' ? 401 : 500 
    });
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
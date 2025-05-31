import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import pool from '@/lib/mysql';
import type { RowDataPacket } from 'mysql2';

interface ScanRecord extends RowDataPacket {
    id: number;
    logistics_id: number;
    product_id: number;
    customer_id: number;
    status: string;
    live: boolean;
}

interface User extends RowDataPacket {
    id: number;
    name: string;
    email: string;
    account_type: string;
}

interface Product extends RowDataPacket {
    id: number;
    product_code: string;
    name: string;
    status: string;
}

export async function POST(request: NextRequest) {
    const connection = await pool.getConnection();
    
    try {
        const { logistics_id, product_id, customer_id } = await request.json();

        if (!logistics_id || !product_id || !customer_id) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await connection.execute(
            'UPDATE scannedrecord SET logistics_id = ?, product_id = ?, customer_id = ?, status = "scanning", live = true',
            [logistics_id, product_id, customer_id]
        );

        const [records] = await connection.execute<ScanRecord[]>(
            'SELECT * FROM scannedrecord LIMIT 1'
        );

        const [logistics] = await connection.execute<User[]>(
            'SELECT id, name, email, account_type FROM users WHERE id = ?',
            [logistics_id]
        );

        const [customer] = await connection.execute<User[]>(
            'SELECT id, name, email, account_type FROM users WHERE id = ?',
            [customer_id]
        );

        const [product] = await connection.execute<Product[]>(
            'SELECT id, product_code, product_name, status FROM products WHERE id = ?',
            [product_id]
        );

        return NextResponse.json({
            record: records[0],
            logistics: logistics[0],
            customer: customer[0],
            product: product[0]
        });

    } catch (error: any) {
        console.error('Scan update error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    } finally {
        connection.release();
    }
}
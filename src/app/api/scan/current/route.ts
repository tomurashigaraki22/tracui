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

export async function GET() {
    const connection = await pool.getConnection();
    
    try {
        const [records] = await connection.execute<ScanRecord[]>(
            'SELECT * FROM scannedrecord WHERE live = true LIMIT 1'
        );

        if (!records.length) {
            return NextResponse.json({ error: 'No active scanning record found' }, { status: 404 });
        }

        const record = records[0];

        const [logistics] = await connection.execute<User[]>(
            'SELECT id, name, email, account_type FROM users WHERE id = ?',
            [record.logistics_id]
        );

        const [customer] = await connection.execute<User[]>(
            'SELECT id, name, email, account_type FROM users WHERE id = ?',
            [record.customer_id]
        );

        const [product] = await connection.execute<Product[]>(
            'SELECT id, product_code, product_name, status FROM products WHERE id = ?',
            [record.product_id]
        );

        return NextResponse.json({
            record,
            logistics: logistics[0],
            customer: customer[0],
            product: product[0]
        });

    } catch (error: any) {
        console.error('Fetch scan record error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    } finally {
        connection.release();
    }
}
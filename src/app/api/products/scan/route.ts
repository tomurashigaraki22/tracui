import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import pool from '@/lib/mysql';
import type { RowDataPacket } from 'mysql2';

interface User extends RowDataPacket {
    id: number;
    account_type: string;
}

interface Product extends RowDataPacket {
    id: number;
    product_code: string;
    is_scanned: number;
}

export async function POST(request: NextRequest) {
    try {
        const { id } = await request.json();

        if (!id) {
            return NextResponse.json(
                { error: 'Missing id' },
                { status: 400 }
            );
        }

        const connection = await pool.getConnection();

        try {
            const [users] = await connection.execute<User[]>(
                'SELECT id, account_type FROM users WHERE id = ?',
                [id]
            );

            if (!users.length || users[0].account_type !== 'seller') {
                return NextResponse.json({
                    s: 0,
                    r: users.length ? 'not_seller' : 'user_not_found'
                });
            }

            const [products] = await connection.execute<Product[]>(
                'SELECT id, product_code FROM products WHERE user_id = ? AND is_scanned = 0 ORDER BY created_at DESC LIMIT 1',
                [id]
            );

            if (!products.length) {
                return NextResponse.json({
                    s: 0,
                    r: 'no_unscanned_products'
                });
            }

            return NextResponse.json({
                s: 1,
                p: products[0].id,
                c: products[0].product_code
            });

        } finally {
            connection.release();
        }
    } catch (error: any) {
        console.error('Product scan check error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import pool from '@/lib/mysql';
import type { RowDataPacket } from 'mysql2';

interface LogisticsUser extends RowDataPacket {
    id: number;
    name: string;
    email: string;
    balance: number;
    address: string;
    account_type: string;
}

interface Product extends RowDataPacket {
    id: number;
    product_code: string;
    name: string;
    status: string;
    logistics_wallet_address: string;
    logistics_location: string;
    created_at: Date;
    user_id: number;
    delivery_fee: number;
    blob_id: string;
}

export async function POST(request: NextRequest) {
    const connection = await pool.getConnection();
    
    try {
        const { customer_id, product_id } = await request.json();

        if (!customer_id || !product_id) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await connection.beginTransaction();

        const [users] = await connection.execute<LogisticsUser[]>(
            'SELECT id, name, email, balance, address, account_type FROM users WHERE id = ?',
            [customer_id]
        );

        if (!users.length) {
            await connection.rollback();
            return NextResponse.json({ error: 'Logistics user not found' }, { status: 404 });
        }

        const logisticsUser = users[0];

        if (logisticsUser.account_type !== 'customer') {
            await connection.rollback();
            return NextResponse.json(
                { error: 'User is not a customer but a ' + logisticsUser.account_type },
                { status: 403 }
            );
        }

        const [products] = await connection.execute<Product[]>(
            'SELECT id, product_code, name, status, user_id, delivery_fee FROM products WHERE id = ?',
            [product_id]
        );

        if (!products.length) {
            await connection.rollback();
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        const product = products[0];

        if (product.status === 'in_transit') {
            await connection.rollback();
            return NextResponse.json({
                message: 'Already handed over',
                logistics: {
                    name: logisticsUser.name,
                    email: logisticsUser.email,
                    balance: logisticsUser.balance,
                    address: logisticsUser.address
                },
                product
            });
        }

        const [users2] = await connection.execute<LogisticsUser[]>(
            'SELECT id, balance FROM users WHERE id = ?',
            [product.user_id]
        );

        if (!users2.length || users2[0].balance < product.delivery_fee) {
            await connection.rollback();
            return NextResponse.json(
                { error: 'Insufficient balance to cover delivery fee' },
                { status: 400 }
            );
        }

        await connection.execute(
            'UPDATE users SET balance = balance - ? WHERE id = ?',
            [product.delivery_fee, product.user_id]
        );

        await connection.execute(
            'INSERT INTO transactions (user_id, amount, type, description) VALUES (?, ?, ?, ?)',
            [
                product.user_id,
                product.delivery_fee,
                'debit',
                `Payment for delivery of product ${product.product_code}`
            ]
        );

        await connection.execute(
            `UPDATE products 
             SET logistics_wallet_address = ?, 
                 logistics_location = ?, 
                 status = 'in_transit' 
             WHERE id = ?`,
            [logisticsUser.address, logisticsUser.address, product_id]
        );

        const [updatedProducts] = await connection.execute<Product[]>(
            'SELECT id, product_code, name, status, logistics_wallet_address, blob_id, logistics_location, created_at FROM products WHERE id = ?',
            [product_id]
        );

        await connection.commit();

        return NextResponse.json({
            message: 'Logistics handover successfully',
            logistics: {
                name: logisticsUser.name,
                email: logisticsUser.email,
                balance: logisticsUser.balance,
                address: logisticsUser.address
            },
            product: updatedProducts[0]
        });
    } catch (error: any) {
        await connection.rollback();
        console.error('Logistics handover error:', error);
        if (error.code === 'ER_NET_READ_INTERRUPTED') {
            return NextResponse.json(
                { error: 'Database connection timeout. Please try again.' },
                { status: 408 }
            );
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    } finally {
        connection.release();
    }
}
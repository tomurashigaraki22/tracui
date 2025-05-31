import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import pool from '@/lib/mysql';
import type { RowDataPacket } from 'mysql2';
import jwt from 'jsonwebtoken';

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
}

export async function POST(request: NextRequest) {
    try {
        const { logistics_id, product_id } = await request.json();

        if (!logistics_id || !product_id) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const connection = await pool.getConnection();

        try {
            const [users] = await connection.execute<LogisticsUser[]>(
                'SELECT id, name, email, balance, address, account_type FROM users WHERE id = ?',
                [logistics_id]
            );

            if (!users.length) {
                return NextResponse.json(
                    { error: 'Logistics user not found' },
                    { status: 404 }
                );
            }

            const logisticsUser = users[0];

            if (logisticsUser.account_type !== 'logistics') {
                return NextResponse.json(
                    { error: 'User is not a logistics provider' },
                    { status: 403 }
                );
            }

            const [products] = await connection.execute<Product[]>(
                'SELECT id, product_code, product_name, status, user_id, delivery_fee FROM products WHERE id = ?',
                [product_id]
            );

            if (!products.length) {
                return NextResponse.json(
                    { error: 'Product not found' },
                    { status: 404 }
                );
            }

            const product = products[0];

            if (product.status === 'in_transit') {
                return NextResponse.json({
                    message: "Already handed over",
                    logistics: {
                        name: logisticsUser.name,
                        email: logisticsUser.email,
                        balance: logisticsUser.balance,
                        address: logisticsUser.address
                    },
                    product: product
                });
            }

            const [users2] = await connection.execute<LogisticsUser[]>(
                'SELECT balance FROM users WHERE id = ?',
                [product.user_id]
            );

            const user = users2[0];
            if (user.balance < product.delivery_fee) {
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
                [product.user_id, product.delivery_fee, 'debit', `Payment for delivery of product ${product.product_code}`]
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
                'SELECT id, product_code, product_name, status, logistics_wallet_address, blob_id, logistics_location, created_at FROM products WHERE id = ?',
                [product_id]
            );

            return NextResponse.json({
                message: "Logistics handover successfully",
                logistics: {
                    name: logisticsUser.name,
                    email: logisticsUser.email,
                    balance: logisticsUser.balance,
                    address: logisticsUser.address
                },
                product: updatedProducts[0]
            });
        } finally {
            connection.release();
        }
    } catch (error: any) {
        console.error('Logistics handover error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
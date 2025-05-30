import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import pool from '@/lib/mysql';
import jwt from 'jsonwebtoken';
import type { RowDataPacket } from 'mysql2';

interface User extends RowDataPacket {
    id: number;
    email: string;
    name: string;
    picture: string;
    account_type: string;
    address: string;
    balance: number;
}

export async function GET(request: NextRequest) {
    try {
        const token = request.headers.get('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return NextResponse.json(
                { error: 'No token provided' },
                { status: 401 }
            );
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { id: number };
        const connection = await pool.getConnection();

        try {
            const [users] = await connection.execute<User[]>(
                'SELECT id, email, name, picture, account_type, address,balance FROM users WHERE id = ?',
                [decoded.id]
            );

            if (!Array.isArray(users) || users.length === 0) {
                return NextResponse.json(
                    { error: 'User not found' },
                    { status: 404 }
                );
            }

            const user = users[0];

            return NextResponse.json({
                id: user.id,
                email: user.email,
                name: user.name,
                picture: user.picture,
                role: user.account_type,
                address: user.address,
                balance: user.balance
            });
        } finally {
            connection.release();
        }
    } catch (error: any) {
        if (error.name === 'JsonWebTokenError') {
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
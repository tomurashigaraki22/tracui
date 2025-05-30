import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import pool from '@/lib/mysql';
import type { RowDataPacket } from 'mysql2';
import jwt from 'jsonwebtoken';

interface Transaction extends RowDataPacket {
    id: number;
    user_id: number;
    amount: number;
    type: 'debit' | 'credit';
    description: string;
    created_at: Date;
}

export async function GET(request: NextRequest) {
    try {
        const token = request.headers.get('authorization')?.replace('Bearer ', '');
        if (!token) {
            return NextResponse.json({ error: 'No token provided' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { id: number };
        const connection = await pool.getConnection();

        try {
            const [transactions] = await connection.execute<Transaction[]>(
                'SELECT id, amount, type, description, created_at FROM transactions WHERE user_id = ? ORDER BY created_at DESC',
                [decoded.id]
            );

            return NextResponse.json({ transactions });
        } finally {
            connection.release();
        }
    } catch (error: any) {
        console.error('Fetch transactions error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
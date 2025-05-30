import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import pool from '@/lib/mysql';
import jwt from 'jsonwebtoken';
import type { RowDataPacket } from 'mysql2';

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
            const [userBalance] = await connection.execute<RowDataPacket[]>(
                'SELECT balance FROM users WHERE id = ?',
                [decoded.id]
            );

            const [totalProducts] = await connection.execute<RowDataPacket[]>(
                'SELECT COUNT(*) as total FROM products WHERE user_id = ?',
                [decoded.id]
            );

            const [deliveryStats] = await connection.execute<RowDataPacket[]>(
                `SELECT 
          COUNT(CASE WHEN status = 'in_transit' THEN 1 END) as in_transit,
          COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered,
          COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed
        FROM products
        WHERE user_id = ?`,
                [decoded.id]
            );

            const [monthlyData] = await connection.execute<RowDataPacket[]>(
                `SELECT 
          DATE_FORMAT(created_at, '%b') as month,
          COUNT(*) as count
        FROM products
        WHERE 
          status = 'delivered'
          AND created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
          AND user_id = ?
        GROUP BY MONTH(created_at)
        ORDER BY created_at DESC
        LIMIT 6`,
                [decoded.id]
            );

            const [currentMonthSuccess] = await connection.execute<RowDataPacket[]>(
                `SELECT 
          (COUNT(CASE WHEN status = 'delivered' THEN 1 END) * 100.0 / COUNT(*)) as success_rate
        FROM products
        WHERE created_at >= DATE_FORMAT(NOW() ,'%Y-%m-01')
        AND user_id = ?`,
                [decoded.id]
            );

            const [lastMonthSuccess] = await connection.execute<RowDataPacket[]>(
                `SELECT 
          (COUNT(CASE WHEN status = 'delivered' THEN 1 END) * 100.0 / COUNT(*)) as success_rate
        FROM products
        WHERE 
          created_at >= DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 1 MONTH) ,'%Y-%m-01')
          AND created_at < DATE_FORMAT(NOW() ,'%Y-%m-01')
          AND user_id = ?`,
                [decoded.id]
            );

            const currentRate = currentMonthSuccess[0].success_rate || 0;
            const lastRate = lastMonthSuccess[0].success_rate || 0;
            const percentageChange = lastRate ? ((currentRate - lastRate) / lastRate) * 100 : 0;

            const months = monthlyData.map(row => row.month);
            const deliveries = monthlyData.map(row => row.count);

            return NextResponse.json({
                balance: userBalance[0]?.balance || 0,
                metrics: {
                    total_products: totalProducts[0].total,
                    in_transit: deliveryStats[0].in_transit,
                    delivered: deliveryStats[0].delivered,
                    failed: deliveryStats[0].failed
                },
                chart_data: {
                    months: months.reverse(),
                    deliveries: deliveries.reverse()
                },
                success_rate: {
                    current: currentRate,
                    change: percentageChange
                }
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

        console.error('Dashboard stats error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
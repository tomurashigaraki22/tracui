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

interface Log extends RowDataPacket {
    id: number;
    product_id: number;
    longitude: number;
    latitude: number;
    temperature: number;
    humidity: number;
    pressure: number;
    accel_x: number;
    accel_y: number;
    accel_z: number;
    gyro_x: number;
    gyro_y: number;
    gyro_z: number;
    created_at: Date;
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

        const [logs] = await connection.execute<Log[]>(
            'SELECT * FROM logs WHERE product_id = ? ORDER BY created_at DESC',
            [record.product_id]
        );

        const processedLogs = logs.map(log => {
            const shock = Math.sqrt(
                Math.pow(log.accel_x, 2) + 
                Math.pow(log.accel_y, 2) + 
                Math.pow(log.accel_z, 2)
            );

            const tilt = Math.atan2(
                Math.sqrt(Math.pow(log.gyro_x, 2) + Math.pow(log.gyro_y, 2)),
                Math.abs(log.gyro_z)
            ) * (180 / Math.PI);

            return {
                ...log,
                shock,
                tilt,
                humidity: Number(Number(log.humidity).toFixed(2)),
                pressure: Number(Number(log.pressure).toFixed(2)),
                accel_x: Number(Number(log.accel_x).toFixed(3)),
                accel_y: Number(Number(log.accel_y).toFixed(3)),
                accel_z: Number(Number(log.accel_z).toFixed(3)),
                gyro_x: Number(Number(log.gyro_x).toFixed(3)),
                gyro_y: Number(Number(log.gyro_y).toFixed(3)),
                gyro_z: Number(Number(log.gyro_z).toFixed(3))
            };
        });

        return NextResponse.json({
            record,
            logistics: logistics[0],
            customer: customer[0],
            product: product[0],
            logs: processedLogs
        });

    } catch (error: any) {
        console.error('Fetch scan record error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    } finally {
        connection.release();
    }
}
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import pool from '@/lib/mysql';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

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

export async function POST(request: NextRequest) {
    try {
        const {
            product_id,
            long,
            lat,
            temp,
            humid,
            pressure,
            accelX,
            accelY,
            accelZ,
            gyroX,
            gyroY,
            gyroZ
        } = await request.json();

        if (!product_id) {
            return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
        }

        const connection = await pool.getConnection();

        try {
            const [products] = await connection.execute<RowDataPacket[]>(
                'SELECT id FROM products WHERE id = ?',
                [product_id]
            );

            if (!products.length) {
                return NextResponse.json({ error: 'Product not found' }, { status: 404 });
            }

            const [result] = await connection.execute<ResultSetHeader>(
                `INSERT INTO logs (
                    product_id, longitude, latitude, temperature, humidity, pressure,
                    accel_x, accel_y, accel_z, gyro_x, gyro_y, gyro_z
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    product_id,
                    long,
                    lat,
                    temp,
                    humid,
                    pressure,
                    accelX,
                    accelY,
                    accelZ,
                    gyroX,
                    gyroY,
                    gyroZ
                ]
            );

            return NextResponse.json({
                message: 'Log created successfully',
                log_id: result.insertId
            });
        } finally {
            connection.release();
        }
    } catch (error: any) {
        console.error('Log creation error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const product_id = searchParams.get('product_id');

        if (!product_id) {
            return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
        }

        const connection = await pool.getConnection();

        try {
            const [logs] = await connection.execute<Log[]>(
                'SELECT * FROM logs WHERE product_id = ? ORDER BY created_at DESC',
                [product_id]
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
                logs: processedLogs
            });
        } finally {
            connection.release();
        }
    } catch (error: any) {
        console.error('Logs fetch error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
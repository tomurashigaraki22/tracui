import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import pool from '@/lib/mysql';
import jwt from 'jsonwebtoken';
import type { RowDataPacket } from 'mysql2';

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

interface Product extends RowDataPacket {
    id: number;
    product_code: string;
    product_name: string;
    sender_location: string;
    receiver_location: string;
    sender_wallet_address: string;
    logistics_wallet_address: string;
    logistics_location: string;
    status: 'pending' | 'in_transit' | 'delivered' | 'failed';
    created_at: Date;
    updated_at: Date;
    delivered_at: Date | null;
    delivered: boolean;
    description: string;
    estimated_delivery_date: Date;
    tracking_number: string;
    product_weight: number;
    product_value: number;
    logs?: Array<Log & { shock: number; tilt: number; }>;
}

const verifyToken = (request: NextRequest) => {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) throw new Error('No token provided');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        return decoded;
    } catch (error) {
        throw new Error('Invalid token');
    }
};

export async function GET(request: NextRequest, { params }: { params: { productCode: string } }) {
    try {
        verifyToken(request);
        const connection = await pool.getConnection();
        const { productCode } = await params;

        try {
            const [products] = await connection.execute<Product[]>(
                'SELECT * FROM products WHERE product_code = ?',
                [productCode]
            );

            if (products.length === 0) {
                return NextResponse.json({ error: 'Product not found' }, { status: 404 });
            }

            const product = products[0];

            const [logs] = await connection.execute<Log[]>(
                'SELECT * FROM logs WHERE product_id = ? ORDER BY created_at DESC',
                [product.id]
            );

            const processedLogs = logs.map(log => {
                const shock = Math.sqrt(
                    Math.pow(Number(log.accel_x), 2) + 
                    Math.pow(Number(log.accel_y), 2) + 
                    Math.pow(Number(log.accel_z), 2)
                );

                const tilt = Math.atan2(
                    Math.sqrt(Math.pow(Number(log.gyro_x), 2) + Math.pow(Number(log.gyro_y), 2)),
                    Math.abs(Number(log.gyro_z))
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

            product.logs = processedLogs;

            return NextResponse.json({ product }, { status: 200 });
        } finally {
            connection.release();
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: error.message === 'Invalid token' ? 401 : 500 });
    }
}

export async function PUT(request: NextRequest, { params }: { params: { productCode: string } }) {
    try {
        verifyToken(request);
        const body = await request.json();
        const connection = await pool.getConnection();
        const { productCode } = await params;

        try {
            const updateFields = Object.entries(body)
                .map(([key]) => `${key} = ?`)
                .join(', ');

            const [result] = await connection.execute(
                `UPDATE products SET ${updateFields} WHERE product_code = ?`,
                [...Object.values(body), productCode]
            );

            if ((result as any).affectedRows === 0) {
                return NextResponse.json({ error: 'Product not found' }, { status: 404 });
            }

            return NextResponse.json({ message: 'Product updated successfully' }, { status: 200 });
        } finally {
            connection.release();
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: error.message === 'Invalid token' ? 401 : 500 });
    }
}
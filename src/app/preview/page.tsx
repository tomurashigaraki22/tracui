"use client";

import { useEffect, useState } from 'react';

interface Record {
    id: number;
    logistics_id: number | null;
    product_id: number;
    customer_id: number;
    status: string;
    live: number;
    created_at: string;
    updated_at: string;
}

interface Customer {
    id: number;
    name: string;
    email: string;
    account_type: string;
}

interface Product {
    id: number;
    product_code: string;
    product_name: string;
    status: string;
}

interface ScanStatus {
    record: Record;
    customer: Customer;
    product: Product;
}

export default function Preview() {
    const [status, setStatus] = useState<ScanStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [isData, setisData] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchStatus = async () => {
        try {
            const response = await fetch('/api/scan/current');
            if (!response.ok) throw new Error('Failed to fetch status');
            const data = await response.json();
            setisData(true);
            setStatus(data);
            setLoading(false);
        } catch (err) {
            setisData(false);
            setError(err instanceof Error ? err.message : 'An error occurred');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
        const interval = setInterval(fetchStatus, 2000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-4">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-8 border-b-8 border-[#00FFD1] mx-auto"></div>
                    <p className="text-4xl font-bold text-gray-800">Fetching Status...</p>
                </div>
            </div>
        );
    }

    if (!status || !isData) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-4">
                <div className="text-center space-y-8 max-w-2xl mx-auto">
                    <h1 className="text-6xl font-bold text-gray-900">No Active Scan</h1>
                    <p className="text-2xl text-gray-600">Please scan a product to continue tracking</p>
                    <div className="mt-8 animate-bounce">
                        <svg className="w-16 h-16 mx-auto text-[#00FFD1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z" />
                        </svg>
                    </div>
                    <p className="text-xl text-gray-500 mt-4">Use your device to scan the QR code or NFC tag</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="w-full max-w-5xl space-y-12">
                <div className="text-center space-y-4">
                    <h1 className="text-6xl font-bold text-gray-900">
                        Current Status: <span className="text-[#00FFD1]">{status.record.status.toUpperCase()}</span>
                    </h1>
                    <p className="text-2xl text-gray-600">
                        {status.record.live === 1 ? 'LIVE' : 'INACTIVE'}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <StatusCard
                        title="Product Details"
                        items={[
                            { label: 'Product Name', value: status.product.product_name },
                            { label: 'Product Code', value: status.product.product_code },
                            { label: 'Product Status', value: status.product.status }
                        ]}
                    />
                    <StatusCard
                        title="Customer Details"
                        items={[
                            { label: 'Name', value: status.customer.name },
                            { label: 'Email', value: status.customer.email },
                            { label: 'Account Type', value: status.customer.account_type }
                        ]}
                    />
                    <StatusCard
                        title="Record Details"
                        items={[
                            { label: 'Record ID', value: status.record.id.toString() },
                            { label: 'Created', value: new Date(status.record.created_at).toLocaleString() },
                            { label: 'Updated', value: new Date(status.record.updated_at).toLocaleString() }
                        ]}
                    />
                </div>

                <div className="text-center text-gray-500 text-lg">
                    Last updated: {new Date().toLocaleString()}
                </div>
            </div>
        </div>
    );
}

interface StatusCardProps {
    title: string;
    items: Array<{ label: string; value: string }>;
}

function StatusCard({ title, items }: StatusCardProps) {
    return (
        <div className="bg-gray-50 rounded-2xl p-8 shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">{title}</h3>
            <div className="space-y-4">
                {items.map((item, index) => (
                    <div key={index} className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">{item.label}</span>
                        <span className="text-xl font-semibold text-gray-900">{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
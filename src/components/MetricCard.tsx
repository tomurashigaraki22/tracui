// components/MetricCard.tsx
"use client";
import { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  trend?: number;
}

const MetricCard = ({ title, value, icon, trend }: MetricCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow border">
      <div className="flex items-center justify-between">
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <div className="p-2 rounded-full bg-gray-100">{icon}</div>
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold">{value}</p>
        {trend && (
          <p
            className={`text-sm mt-2 ${
              trend >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}% from last month
          </p>
        )}
      </div>
    </div>
  );
};

export default MetricCard;

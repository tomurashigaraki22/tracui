"use client";
import { useEffect, useState } from "react";
import MetricCard from "@/components/MetricCard";
import SuccessRateChart from "@/components/SuccessRateChart";
import {
  BiPackage,
  BiCheckCircle,
  BiTime,
  BiPurchaseTag,
  BiTrendingUp,
  BiTrendingDown,
} from "react-icons/bi";
import { API_ROUTES } from "@/utils/config";

interface ConsumerOverviewResponse {
  metrics: {
    totalOrders: number;
    ordersInTransit: number;
    deliveredOrders: number;
    pendingOrders: number;
  };
  chart_data: {
    months: string[];
    deliveries: number[];
  };
  delivery_rate: {
    current: string;
    change: number;
  };
  recent_orders: Array<{
    id: string;
    productName: string;
    status: string;
    date: string;
  }>;
}

const ConsumerOverviewPage = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ConsumerOverviewResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("user_token"); // Get token from localStorage
        const response = await fetch(
          "/api/dashboard/stats",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        setData(data);
      } catch (err) {
        setError("Failed to load overview data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOverviewData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">Loading...</div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-red-500 text-center">
        {error || "Failed to load data"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Overview</h1>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Orders"
          value={data.metrics.totalOrders}
          icon={<BiPurchaseTag className="h-6 w-6" />}
        />
        <MetricCard
          title="In Transit"
          value={data.metrics.ordersInTransit}
          icon={<BiPackage className="h-6 w-6" />}
        />
        <MetricCard
          title="Delivered"
          value={data.metrics.deliveredOrders}
          icon={<BiCheckCircle className="h-6 w-6" />}
        />
        <MetricCard
          title="Pending"
          value={data.metrics.pendingOrders}
          icon={<BiTime className="h-6 w-6" />}
        />
      </div>

      {/* Delivery Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow flex flex-col items-center justify-center">
          <h2 className="text-xl font-bold mb-4 text-gray-700">
            Orders Delivery Status
          </h2>
          <div className="flex flex-col items-center">
            <span className="text-5xl font-extrabold text-[#00FFD1]">
              {Number(data.delivery_rate.current).toFixed(1)}%
            </span>
            <span
              className={`${
                data.delivery_rate.change >= 0
                  ? "text-green-500"
                  : "text-red-500"
              } font-semibold mt-3 flex items-center`}
            >
              {data.delivery_rate.change >= 0 ? (
                <BiTrendingUp className="h-6 w-6 mr-1" />
              ) : (
                <BiTrendingDown className="h-6 w-6 mr-1" />
              )}
              <span className="text-sm md:text-base">
                {data.delivery_rate.change >= 0 ? "+" : ""}
                {data.delivery_rate.change.toFixed(1)}% from last month
              </span>
            </span>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-lg font-semibold">Order History (6 Months)</h2>
          <div className="mt-6">
            <SuccessRateChart
              months={data.chart_data.months}
              deliveries={data.chart_data.deliveries}
            />
          </div>
        </div>
      </div>

      {/* Recent Orders Preview */}
      <div className="bg-white rounded-xl p-6 shadow">
        <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.recent_orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.productName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ConsumerOverviewPage;

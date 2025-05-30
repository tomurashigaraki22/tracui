"use client";
import MetricCard from "@/components/MetricCard";
import SuccessRateChart from "@/components/SuccessRateChart";
import {
  BiPackage,
  BiCheckCircle,
  BiTime,
  BiPurchaseTag,
} from "react-icons/bi";

const ConsumerOverviewPage = () => {
  const metrics = {
    totalOrders: 45,
    ordersInTransit: 3,
    deliveredOrders: 42,
    pendingOrders: 0,
  };

  const deliveryRate = (metrics.deliveredOrders / metrics.totalOrders) * 100;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Overview</h1>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Orders"
          value={metrics.totalOrders}
          icon={<BiPurchaseTag className="h-6 w-6" />}
        />
        <MetricCard
          title="In Transit"
          value={metrics.ordersInTransit}
          icon={<BiPackage className="h-6 w-6" />}
        />
        <MetricCard
          title="Delivered"
          value={metrics.deliveredOrders}
          icon={<BiCheckCircle className="h-6 w-6" />}
        />
        <MetricCard
          title="Pending"
          value={metrics.pendingOrders}
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
              {deliveryRate.toFixed(1)}%
            </span>
            <span className="text-gray-600 font-semibold mt-3">
              Orders Successfully Delivered
            </span>
          </div>
          <p className="mt-4 text-gray-500 text-center">
            Track your orders in real-time for better visibility
          </p>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-lg font-semibold">Order History (6 Months)</h2>
          <div className="mt-6">
            <SuccessRateChart />
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
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  iPhone 15 Pro
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Delivered
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  2025-05-30
                </td>
              </tr>
              {/* Add more rows as needed */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ConsumerOverviewPage;

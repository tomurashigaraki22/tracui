"use client";
import { useEffect, useState } from "react";
import MetricCard from "@/components/MetricCard";
import SuccessRateChart from "@/components/SuccessRateChart";
import { API_ROUTES } from "@/utils/config";
import {
  BiPackage,
  BiCheckCircle,
  BiTime,
  BiPurchaseTag,
  BiTrendingUp,
  BiTrendingDown,
} from "react-icons/bi";

interface ConsumerOverviewResponse {
  metrics: {
    total_products: number;
    in_transit: number;
    delivered: number;
    failed: number;
  };
  chart_data: {
    months: string[];
    deliveries: number[];
  };
  success_rate: {
    current: string;
    change: number;
  };
}

interface Product {
  id: number;
  product_name: string;
  status: string;
  created_at: string;
}

interface ProductsResponse {
  products: Product[];
}

const ConsumerOverviewPage = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ConsumerOverviewResponse | null>(null);
  const [recentOrders, setRecentOrders] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("access_token");
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        // Fetch overview data
        const overviewResponse = await fetch(API_ROUTES.CONSUMER.OVERVIEW, {
          headers,
        });

        if (!overviewResponse.ok) {
          throw new Error("Failed to fetch overview data");
        }

        const overviewData = await overviewResponse.json();

        const productsResponse = await fetch(API_ROUTES.CONSUMER.ORDERS, {
          headers,
        });

        if (!productsResponse.ok) {
          throw new Error("Failed to fetch orders data");
        }

        const productsData: ProductsResponse = await productsResponse.json();

        const sortedProducts = productsData.products
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          )
          .slice(0, 5);

        setData(overviewData);
        console.log(overviewData);
        setRecentOrders(sortedProducts);
      } catch (err) {
        setError("Failed to load data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
          value={data.metrics.total_products}
          icon={<BiPurchaseTag className="h-6 w-6" />}
        />
        <MetricCard
          title="In Transit"
          value={data.metrics.in_transit}
          icon={<BiPackage className="h-6 w-6" />}
        />
        <MetricCard
          title="Delivered"
          value={data.metrics.delivered}
          icon={<BiCheckCircle className="h-6 w-6" />}
        />
        <MetricCard
          title="Pending"
          value={data.metrics.failed}
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
              {Number(data.success_rate.current).toFixed(1)}%
            </span>
            <span
              className={`${
                data.success_rate.change >= 0
                  ? "text-green-500"
                  : "text-red-500"
              } font-semibold mt-3 flex items-center`}
            >
              {data.success_rate.change >= 0 ? (
                <BiTrendingUp className="h-6 w-6 mr-1" />
              ) : (
                <BiTrendingDown className="h-6 w-6 mr-1" />
              )}
              <span className="text-sm md:text-base">
                {data.success_rate.change >= 0 ? "+" : ""}
                {data.success_rate.change.toFixed(1)}% from last month
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
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.product_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "in_transit"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString()}
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

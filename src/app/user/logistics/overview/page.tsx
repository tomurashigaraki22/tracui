"use client";
import { useEffect, useState } from "react";
import MetricCard from "@/components/MetricCard";
import SuccessRateChart from "@/components/SuccessRateChart";
import { API_ROUTES } from "@/utils/config";
import {
  BiCheckCircle,
  BiPackage,
  BiTrendingUp,
  BiTrendingDown,
  BiXCircle,
} from "react-icons/bi";
import { BsTruckFlatbed } from "react-icons/bs";

interface LogisticsOverviewResponse {
  metrics: {
    totalProducts: number;
    productsInTransit: number;
    successfulDeliveries: number;
    failedDeliveries: number;
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

const LogisticsOverviewPage = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<LogisticsOverviewResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("access_token"); // Get token from localStorage
        const response = await fetch(API_ROUTES.LOGISTICS.OVERVIEW, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data here");
        }
        console.log("Bearer token:", token);

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
          title="Total Deliveries"
          value={data.metrics.totalProducts}
          icon={<BiPackage className="h-6 w-6" />}
        />
        <MetricCard
          title="In Transit"
          value={data.metrics.productsInTransit}
          icon={<BsTruckFlatbed className="h-6 w-6" />}
        />
        <MetricCard
          title="Successful Deliveries"
          value={data.metrics.successfulDeliveries}
          icon={<BiCheckCircle className="h-6 w-6" />}
        />
        <MetricCard
          title="Failed Deliveries"
          value={data.metrics.failedDeliveries}
          icon={<BiXCircle className="h-6 w-6" />}
        />
      </div>

      {/* Success Rate Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow flex flex-col items-center justify-center">
          <h2 className="text-xl font-bold mb-4 text-gray-700">
            Delivery Success Rate
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
          <p className="mt-4 text-gray-500 text-center">
            {data.success_rate.change >= 0
              ? "Excellent performance! Keep up the good work."
              : "Room for improvement. Let's work on increasing success rate."}
          </p>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-lg font-semibold">
            Success Rate Trend (6 Months)
          </h2>
          <div className="mt-6">
            <SuccessRateChart
              months={data.chart_data.months}
              deliveries={data.chart_data.deliveries}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogisticsOverviewPage;

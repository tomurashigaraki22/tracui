"use client";
import MetricCard from "@/components/MetricCard";
import SuccessRateChart from "@/components/SuccessRateChart";
import {
  BiCheckCircle,
  BiPackage,
  BiTrendingUp,
  BiXCircle,
} from "react-icons/bi";
import { BsTruckFlatbed } from "react-icons/bs";

const LogisticsOverviewPage = () => {
  const metrics = {
    totalProducts: 124,
    productsInTransit: 23,
    successfulDeliveries: 98,
    failedDeliveries: 3,
  };

  const successRate =
    (metrics.successfulDeliveries /
      (metrics.successfulDeliveries + metrics.failedDeliveries)) *
    100;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Overview</h1>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Deliveries"
          value={metrics.totalProducts}
          icon={<BiPackage className="h-6 w-6" />}
        />
        <MetricCard
          title="In Transit"
          value={metrics.productsInTransit}
          icon={<BsTruckFlatbed className="h-6 w-6" />}
        />
        <MetricCard
          title="Successful Deliveries"
          value={metrics.successfulDeliveries}
          icon={<BiCheckCircle className="h-6 w-6" />}
        />
        <MetricCard
          title="Failed Deliveries"
          value={metrics.failedDeliveries}
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
              {successRate.toFixed(1)}%
            </span>
            <span className="text-green-500 font-semibold mt-3 flex items-center">
              <BiTrendingUp className="h-6 w-6 mr-1" />
              <span className="text-sm md:text-base">
                +2.5% from last month
              </span>
            </span>
          </div>
          <p className="mt-4 text-gray-500 text-center">
            Excellent performance! Keep up the good work.
          </p>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-lg font-semibold">
            Success Rate Trend (6 Months)
          </h2>
          <div className="mt-6">
            <SuccessRateChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogisticsOverviewPage;

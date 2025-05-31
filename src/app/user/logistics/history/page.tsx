"use client";
import React, { useState, useEffect } from "react";
import { API_ROUTES } from "@/utils/config";
import {
  BiSearch,
  BiPackage,
  BiChevronUp,
  BiChevronDown,
  BiCheckCircle,
  BiXCircle,
} from "react-icons/bi";

interface DeliveryHistory {
  id: number;
  product_code: string;
  product_name: string;
  sender_location: string;
  receiver_location: string;
  status: string;
  created_at: string;
  tracking_number: string;
  delivered: number;
}

interface APIResponse {
  products: DeliveryHistory[];
}

export default function HistoryPage() {
  const [deliveries, setDeliveries] = useState<DeliveryHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof DeliveryHistory;
    direction: "ascending" | "descending";
  } | null>(null);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("access_token");
        const response = await fetch(API_ROUTES.LOGISTICS.HISTORY, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch delivery history");
        }

        const data: APIResponse = await response.json();
        setDeliveries(data.products);
      } catch (err) {
        setError("Failed to load delivery history");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, []);

  const statusCounts = deliveries.reduce(
    (acc, delivery) => {
      if (delivery.delivered === 1) {
        acc.successful++;
      } else {
        acc.failed++;
      }
      return acc;
    },
    { successful: 0, failed: 0 }
  );

  const filteredDeliveries = deliveries.filter((delivery) =>
    Object.values(delivery).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const requestSort = (key: keyof DeliveryHistory) => {
    let direction: "ascending" | "descending" = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedDeliveries = [...filteredDeliveries];
  if (sortConfig !== null) {
    sortedDeliveries.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (!aValue || !bValue) return 0;

      if (aValue < bValue) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }

  const getStatusBadge = (delivered: number) => {
    const statusClasses = {
      1: "bg-green-100 text-green-800",
      0: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          statusClasses[delivered as keyof typeof statusClasses]
        }`}
      >
        {delivered === 1 ? "Successful" : "Failed"}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-500">Loading history...</div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold flex items-center">
          <BiPackage className="mr-2" /> Delivery History
        </h1>

        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <BiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-[#00FFD1] rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00FFD1] focus:border-[#00FFD1]"
            placeholder="Search deliveries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Status Count Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Successful Deliveries
              </p>
              <p className="text-2xl font-bold text-[#00FFD1]">
                {statusCounts.successful}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <BiCheckCircle className="w-6 h-6 text-green-800" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Failed Deliveries
              </p>
              <p className="text-2xl font-bold text-[#00FFD1]">
                {statusCounts.failed}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <BiXCircle className="w-6 h-6 text-red-800" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tracking Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  From
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedDeliveries.map((delivery) => (
                <tr key={delivery.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {delivery.tracking_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {delivery.product_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(delivery.delivered)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {delivery.sender_location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {delivery.receiver_location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(delivery.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {sortedDeliveries.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No delivery history found matching your search criteria.
          </div>
        )}
      </div>
    </div>
  );
}

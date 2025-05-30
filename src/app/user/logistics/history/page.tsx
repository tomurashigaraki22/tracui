"use client";
import React, { useState, useEffect } from "react";
import {
  BiSearch,
  BiPackage,
  BiChevronUp,
  BiChevronDown,
  BiCheckCircle,
  BiXCircle,
} from "react-icons/bi";

type DeliveryStatus = "Successful" | "Failed";

interface DeliveryHistory {
  id: string;
  productName: string;
  status: DeliveryStatus;
  senderName: string;
  receiverName: string;
  date: string;
  reason?: string;
}

// Simulated API call
const fetchDeliveryHistory = (): Promise<DeliveryHistory[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "1",
          productName: "iPhone 15 Pro",
          status: "Successful",
          senderName: "Apple Store",
          receiverName: "John Smith",
          date: "2025-05-30",
        },
        {
          id: "2",
          productName: "MacBook Air",
          status: "Failed",
          senderName: "Apple Store",
          receiverName: "Sarah Johnson",
          date: "2025-05-29",
        },
        {
          id: "3",
          productName: "AirPods Pro",
          status: "Successful",
          senderName: "Apple Store",
          receiverName: "Mike Wilson",
          date: "2025-05-28",
        },
      ]);
    }, 1000);
  });
};

export default function HistoryPage() {
  const [deliveries, setDeliveries] = useState<DeliveryHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof DeliveryHistory;
    direction: "ascending" | "descending";
  } | null>(null);

  useEffect(() => {
    const loadDeliveries = async () => {
      setLoading(true);
      const data = await fetchDeliveryHistory();
      setDeliveries(data);
      setLoading(false);
    };

    loadDeliveries();
  }, []);

  const statusCounts = deliveries.reduce(
    (acc, delivery) => {
      if (delivery.status === "Successful") {
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
  if (sortConfig !== null && sortConfig.key) {
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

  const getStatusBadge = (status: DeliveryStatus) => {
    const statusClasses = {
      Successful: "bg-green-100 text-green-800",
      Failed: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClasses[status]}`}
      >
        {status}
      </span>
    );
  };

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

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading history...</div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("productName")}
                  >
                    <div className="flex items-center">
                      Product Name
                      {sortConfig?.key === "productName" && (
                        <span className="ml-1">
                          {sortConfig.direction === "ascending" ? (
                            <BiChevronUp />
                          ) : (
                            <BiChevronDown />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("status")}
                  >
                    <div className="flex items-center">
                      Status
                      {sortConfig?.key === "status" && (
                        <span className="ml-1">
                          {sortConfig.direction === "ascending" ? (
                            <BiChevronUp />
                          ) : (
                            <BiChevronDown />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("senderName")}
                  >
                    <div className="flex items-center">
                      Sender
                      {sortConfig?.key === "senderName" && (
                        <span className="ml-1">
                          {sortConfig.direction === "ascending" ? (
                            <BiChevronUp />
                          ) : (
                            <BiChevronDown />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("receiverName")}
                  >
                    <div className="flex items-center">
                      Receiver
                      {sortConfig?.key === "receiverName" && (
                        <span className="ml-1">
                          {sortConfig.direction === "ascending" ? (
                            <BiChevronUp />
                          ) : (
                            <BiChevronDown />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("date")}
                  >
                    <div className="flex items-center">
                      Date
                      {sortConfig?.key === "date" && (
                        <span className="ml-1">
                          {sortConfig.direction === "ascending" ? (
                            <BiChevronUp />
                          ) : (
                            <BiChevronDown />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedDeliveries.map((delivery) => (
                  <tr key={delivery.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {delivery.productName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(delivery.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {delivery.senderName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {delivery.receiverName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {delivery.date}
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
      )}
    </div>
  );
}

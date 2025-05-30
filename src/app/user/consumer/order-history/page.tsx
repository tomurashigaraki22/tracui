"use client";
import React, { useState, useEffect } from "react";
import {
  BiSearch,
  BiPackage,
  BiChevronUp,
  BiChevronDown,
  BiCheckCircle,
  BiXCircle,
  BiTime,
} from "react-icons/bi";

type OrderStatus = "Delivered" | "Cancelled" | "Returned";

interface OrderHistory {
  id: string;
  productName: string;
  status: OrderStatus;
  orderDate: string;
  deliveryDate?: string;
  amount: string;
  logisticsName: string;
}

// Simulated API call
const fetchOrderHistory = (): Promise<OrderHistory[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "1",
          productName: "iPhone 15 Pro",
          status: "Delivered",
          orderDate: "2025-05-20",
          deliveryDate: "2025-05-30",
          amount: "$999",
          logisticsName: "FedEx",
        },
        {
          id: "2",
          productName: "MacBook Air",
          status: "Cancelled",
          orderDate: "2025-05-15",
          amount: "$1299",
          logisticsName: "DHL",
        },
        {
          id: "3",
          productName: "AirPods Pro",
          status: "Returned",
          orderDate: "2025-05-10",
          deliveryDate: "2025-05-28",
          amount: "$249",
          logisticsName: "UPS",
        },
      ]);
    }, 1000);
  });
};

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<OrderHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof OrderHistory;
    direction: "ascending" | "descending";
  } | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      const data = await fetchOrderHistory();
      setOrders(data);
      setLoading(false);
    };

    loadOrders();
  }, []);

  const statusCounts = orders.reduce(
    (acc, order) => {
      acc[order.status]++;
      acc.total++;
      return acc;
    },
    { Delivered: 0, Cancelled: 0, Returned: 0, total: 0 }
  );

  const filteredOrders = orders.filter((order) =>
    Object.values(order).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const requestSort = (key: keyof OrderHistory) => {
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

  const sortedOrders = [...filteredOrders];
  if (sortConfig !== null && sortConfig.key) {
    sortedOrders.sort((a, b) => {
      const aValue = a[sortConfig.key as keyof OrderHistory];
      const bValue = b[sortConfig.key as keyof OrderHistory];

      if (typeof aValue === "string" && typeof bValue === "string") {
        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
      }
      return 0;
    });
  }

  const getStatusBadge = (status: OrderStatus) => {
    const statusClasses = {
      Delivered: "bg-green-100 text-green-800",
      Cancelled: "bg-red-100 text-red-800",
      Returned: "bg-yellow-100 text-yellow-800",
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
          <BiPackage className="mr-2" /> Order History
        </h1>

        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <BiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-[#00FFD1] rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00FFD1] focus:border-[#00FFD1]"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Status Count Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-[#00FFD1]">
                {statusCounts.total}
              </p>
            </div>
            <div className="p-3 bg-[#00FFD1]/20 rounded-full">
              <BiPackage className="w-6 h-6 text-[#00FFD1]" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Delivered</p>
              <p className="text-2xl font-bold text-[#00FFD1]">
                {statusCounts.Delivered}
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
              <p className="text-sm font-medium text-gray-600">Cancelled</p>
              <p className="text-2xl font-bold text-[#00FFD1]">
                {statusCounts.Cancelled}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <BiXCircle className="w-6 h-6 text-red-800" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Returned</p>
              <p className="text-2xl font-bold text-[#00FFD1]">
                {statusCounts.Returned}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <BiTime className="w-6 h-6 text-yellow-800" />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading orders...</div>
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
                    onClick={() => requestSort("orderDate")}
                  >
                    <div className="flex items-center">
                      Order Date
                      {sortConfig?.key === "orderDate" && (
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
                    onClick={() => requestSort("amount")}
                  >
                    <div className="flex items-center">
                      Amount
                      {sortConfig?.key === "amount" && (
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
                    onClick={() => requestSort("logisticsName")}
                  >
                    <div className="flex items-center">
                      Logistics
                      {sortConfig?.key === "logisticsName" && (
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
                {sortedOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.productName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.orderDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.logisticsName}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {sortedOrders.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No orders found matching your search criteria.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

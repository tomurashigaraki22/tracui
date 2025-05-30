"use client";
import React, { useState, useEffect } from "react";
import {
  BiSearch,
  BiPackage,
  BiChevronUp,
  BiChevronDown,
} from "react-icons/bi";

type ShipmentStatus = "In Possession" | "Delivered";

interface Shipment {
  id: string;
  productName: string;
  status: ShipmentStatus;
  senderName: string;
  receiverName: string;
  date: string;
  location: string;
}

// Simulated API call
const fetchShipments = (): Promise<Shipment[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "1",
          productName: "iPhone 15 Pro",
          status: "In Possession",
          senderName: "Apple Store",
          receiverName: "John Smith",
          date: "2025-05-30",
          location: "New York",
        },
        {
          id: "2",
          productName: "MacBook Air",
          status: "Delivered",
          senderName: "Apple Store",
          receiverName: "Sarah Johnson",
          date: "2025-05-29",
          location: "Los Angeles",
        },
        // Add more dummy data as needed
      ]);
    }, 1000);
  });
};

export default function ShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Shipment;
    direction: "ascending" | "descending";
  } | null>(null);

  useEffect(() => {
    const loadShipments = async () => {
      setLoading(true);
      const data = await fetchShipments();
      setShipments(data);
      setLoading(false);
    };

    loadShipments();
  }, []);

  const filteredShipments = shipments.filter((shipment) =>
    Object.values(shipment).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const requestSort = (key: keyof Shipment) => {
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

  const sortedShipments = [...filteredShipments];
  if (sortConfig !== null) {
    sortedShipments.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }

  const getStatusBadge = (status: ShipmentStatus) => {
    const statusClasses = {
      "In Possession": "bg-blue-100 text-blue-800",
      Delivered: "bg-green-100 text-green-800",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClasses[status]}`}
      >
        {status}
      </span>
    );
  };

  // Add status counts calculation
  const statusCounts = shipments.reduce(
    (acc, shipment) => {
      if (shipment.status === "Delivered") {
        acc.delivered++;
      } else if (shipment.status === "In Possession") {
        acc.inPossession++;
      }
      return acc;
    },
    { delivered: 0, inPossession: 0 }
  );

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold flex items-center">
          <BiPackage className="mr-2" /> Active Shipments
        </h1>

        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <BiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-[#00FFD1] rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00FFD1] focus:border-[#00FFD1]"
            placeholder="Search shipments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Add Status Count Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Possession</p>
              <p className="text-2xl font-bold text-[#00FFD1]">
                {statusCounts.inPossession}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <BiPackage className="w-6 h-6 text-blue-800" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Delivered</p>
              <p className="text-2xl font-bold text-[#00FFD1]">
                {statusCounts.delivered}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <BiPackage className="w-6 h-6 text-green-800" />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">
          Loading shipments...
        </div>
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
                    onClick={() => requestSort("location")}
                  >
                    <div className="flex items-center">
                      Location
                      {sortConfig?.key === "location" && (
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
                {sortedShipments.map((shipment) => (
                  <tr key={shipment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {shipment.productName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(shipment.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {shipment.senderName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {shipment.receiverName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {shipment.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {shipment.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {sortedShipments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No shipments found matching your search criteria.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

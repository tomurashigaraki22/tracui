"use client";
import React, { useState, useEffect } from "react";
import { API_ROUTES } from "@/utils/config";
import {
  BiSearch,
  BiPackage,
  BiChevronUp,
  BiChevronDown,
} from "react-icons/bi";

interface Shipment {
  id: number;
  product_code: string;
  product_name: string;
  sender_location: string;
  receiver_location: string;
  logistics_location: string;
  status: string;
  created_at: string;
  tracking_number: string;
}

interface APIResponse {
  products: Shipment[];
}

export default function ShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Shipment;
    direction: "ascending" | "descending";
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("access_token");
        const response = await fetch(API_ROUTES.LOGISTICS.SHIPMENTS, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch shipments");
        }

        const data: APIResponse = await response.json();
        // Filter only "in_transit" shipments
        const inTransitShipments = data.products.filter(
          (shipment) => shipment.status.toLowerCase() === "in_transit"
        );
        setShipments(inTransitShipments);
      } catch (err) {
        setError("Failed to load shipments");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchShipments();
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

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold flex items-center">
            <BiPackage className="mr-2" /> Active Shipments
          </h1>
          <p className="text-gray-600 mt-2">
            Currently tracking {shipments.length} shipments in transit
          </p>
        </div>

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

      {loading ? (
        <div className="text-center py-8 text-gray-500">
          Loading shipments...
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("product_name")}
                  >
                    <div className="flex items-center">
                      Product Name
                      {sortConfig?.key === "product_name" && (
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tracking Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sender Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Receiver Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Location
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("created_at")}
                  >
                    <div className="flex items-center">
                      Date
                      {sortConfig?.key === "created_at" && (
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
                        {shipment.product_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {shipment.tracking_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {shipment.sender_location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {shipment.receiver_location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {shipment.logistics_location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(shipment.created_at).toLocaleDateString()}
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

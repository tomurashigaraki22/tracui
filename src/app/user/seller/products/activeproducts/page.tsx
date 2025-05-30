"use client";
import { useState, useEffect } from "react";
import {
  BiChevronDown,
  BiChevronUp,
  BiSearch,
  BiPackage,
  BiTime,
  //   BiTruck,
  BiCheckCircle,
} from "react-icons/bi";
import { BsTruck } from "react-icons/bs";

type ProductStatus = "Pending" | "In Transit" | "Delivered";

interface Product {
  id: string;
  name: string;
  status: ProductStatus;
  receiverEmail: string;
  logisticsName: string;
  date: string;
}

const fetchProducts = (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "1",
          name: "Wireless Headphones",
          status: "Delivered",
          receiverEmail: "john.doe@example.com",
          logisticsName: "FedEx",
          date: "2025-05-15",
        },
        {
          id: "2",
          name: "Smart Watch",
          status: "In Transit",
          receiverEmail: "sarah.smith@example.com",
          logisticsName: "UPS",
          date: "2025-05-18",
        },
        {
          id: "3",
          name: "Bluetooth Speaker",
          status: "Pending",
          receiverEmail: "mike.johnson@example.com",
          logisticsName: "DHL",
          date: "2025-05-20",
        },
        {
          id: "4",
          name: "Laptop Backpack",
          status: "In Transit",
          receiverEmail: "emma.wilson@example.com",
          logisticsName: "USPS",
          date: "2025-05-22",
        },
        {
          id: "5",
          name: "Phone Charger",
          status: "Delivered",
          receiverEmail: "david.brown@example.com",
          logisticsName: "FedEx",
          date: "2025-05-10",
        },
      ]);
    }, 1000);
  });
};

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Product;
    direction: "ascending" | "descending";
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const data = await fetchProducts();
      setProducts(data);
      setLoading(false);
    };

    loadProducts();
  }, []);

  // Calculate status counts
  const statusCounts = products.reduce(
    (acc, product) => {
      acc.total++;
      acc[product.status]++;
      return acc;
    },
    { total: 0, Pending: 0, "In Transit": 0, Delivered: 0 }
  );

  const filteredProducts = products.filter((product) =>
    Object.values(product).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const requestSort = (key: keyof Product) => {
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

  const sortedProducts = [...filteredProducts];
  if (sortConfig !== null) {
    sortedProducts.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }

  const getStatusBadge = (status: ProductStatus) => {
    const statusClasses = {
      Pending: "bg-yellow-100 text-yellow-800",
      "In Transit": "bg-blue-100 text-blue-800",
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

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold flex items-center">
          <BiPackage className="mr-2" /> Active Products
        </h1>

        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <BiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Products Card */}
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Products
              </p>
              <p className="text-2xl font-bold">{statusCounts.total}</p>
            </div>
            <BiPackage className="h-8 w-8 text-indigo-500" />
          </div>
        </div>

        {/* Pending Card */}
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-2xl font-bold">{statusCounts.Pending}</p>
            </div>
            <BiTime className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        {/* In Transit Card */}
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">In Transit</p>
              <p className="text-2xl font-bold">{statusCounts["In Transit"]}</p>
            </div>
            <BsTruck className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        {/* Delivered Card */}
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Delivered</p>
              <p className="text-2xl font-bold">{statusCounts.Delivered}</p>
            </div>
            <BiCheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">
          Loading products...
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("name")}
                  >
                    <div className="flex items-center">
                      Product Name
                      {sortConfig?.key === "name" && (
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
                    scope="col"
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
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("receiverEmail")}
                  >
                    <div className="flex items-center">
                      Receiver Email
                      {sortConfig?.key === "receiverEmail" && (
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
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("logisticsName")}
                  >
                    <div className="flex items-center">
                      Logistics Name
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
                  <th
                    scope="col"
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
                {sortedProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(product.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.receiverEmail}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.logisticsName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {sortedProducts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No products found matching your search criteria.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;

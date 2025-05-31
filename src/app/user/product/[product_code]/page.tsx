"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { API_ROUTES } from "@/utils/config";
import { BiPackage, BiTime, BiMap, BiWallet } from "react-icons/bi";

interface Log {
  id: number;
  product_id: number;
  longitude: string;
  latitude: string;
  temperature: string;
  humidity: number;
  pressure: number;
  accel_x: number;
  accel_y: number;
  accel_z: number;
  gyro_x: number;
  gyro_y: number;
  gyro_z: number;
  created_at: string;
  shock: number;
  tilt: number;
}

interface ProductDetails {
  id: number;
  product_code: string;
  product_name: string;
  sender_location: string;
  receiver_location: string;
  sender_wallet_address: string;
  logistics_wallet_address: string;
  logistics_location: string;
  status: string;
  created_at: string;
  updated_at: string;
  delivered_at: string | null;
  delivered: number;
  description: string;
  estimated_delivery_date: string;
  tracking_number: string;
  product_weight: string;
  product_value: string;
  logs: Log[];
}

interface APIResponse {
  product: ProductDetails;
}

const ProductDetailsPage = () => {
  const params = useParams();
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("access_token");
        const response = await fetch(
          `${API_ROUTES.PRODUCT}/${params.product_code}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch product details");
        }

        const data: APIResponse = await response.json();
        setProduct(data.product);
        console.log(data.product);
      } catch (err) {
        setError("Failed to load product details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (params.product_code) {
      fetchProductDetails();
    }
  }, [params.product_code]);

  const formatStatus = (status: string): string => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (loading) {
    return <div className="text-center py-8">Loading product details...</div>;
  }

  if (error || !product) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 flex items-center">
          <BiPackage className="mr-2" />
          Product Details
        </h1>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Basic Info */}
          <div className="p-6 border-b">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">
                  Basic Information
                </h2>
                <div className="space-y-3">
                  <p>
                    <span className="font-medium">Product Name:</span>{" "}
                    {product.product_name}
                  </p>
                  <p>
                    <span className="font-medium">Product Code:</span>{" "}
                    {product.product_code}
                  </p>
                  <p>
                    <span className="font-medium">Tracking Number:</span>{" "}
                    {product.tracking_number}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>{" "}
                    {formatStatus(product.status)}
                  </p>
                </div>
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-4">Product Details</h2>
                <div className="space-y-3">
                  <p>
                    <span className="font-medium">Weight:</span>{" "}
                    {product.product_weight} kg
                  </p>
                  <p>
                    <span className="font-medium">Value:</span> $
                    {product.product_value}
                  </p>
                  <p>
                    <span className="font-medium">Created:</span>{" "}
                    {new Date(product.created_at).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-medium">Estimated Delivery:</span>{" "}
                    {new Date(
                      product.estimated_delivery_date
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Details */}
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold mb-4">Shipping Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-2">From</h3>
                <p className="text-sm text-gray-600">
                  {product.sender_location}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {product.sender_wallet_address}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-2">
                  Current Location
                </h3>
                <p className="text-sm text-gray-600">
                  {product.logistics_location}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {product.logistics_wallet_address}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-2">To</h3>
                <p className="text-sm text-gray-600">
                  {product.receiver_location}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Description</h2>
            <p className="text-gray-600">{product.description}</p>
          </div>

          {/* Logs Table */}
          <div className="p-6 border-t">
            <h2 className="text-lg font-semibold mb-4">Product Logs</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Temperature
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Humidity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Shock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tilt
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {product.logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.temperature}°C
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.humidity}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.shock.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.tilt.toFixed(2)}°
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.latitude}, {log.longitude}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;

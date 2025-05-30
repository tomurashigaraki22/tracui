export const API_BASE_URL = "https://tracui.pxxl.tech"; // Replace with your actual API base URL

export const API_ROUTES = {
  // Consumer routes
  CONSUMER: {
    OVERVIEW: `${API_BASE_URL}/api/dashboard/stats`,
    ORDERS: `${API_BASE_URL}/api/consumer/orders`,
    ORDER_HISTORY: `${API_BASE_URL}/api/consumer/order-history`,
  },
  // Seller routes
  SELLER: {
    OVERVIEW: `${API_BASE_URL}/api/dashboard/stats`,
    PRODUCTS: `${API_BASE_URL}/api/seller/products`,
  },
  // Logistics routes
  LOGISTICS: {
    OVERVIEW: `${API_BASE_URL}/api/dashboard/stats`,
    SHIPMENTS: `${API_BASE_URL}/api/logistics/shipments`,
    HISTORY: `${API_BASE_URL}/api/logistics/history`,
  },
};

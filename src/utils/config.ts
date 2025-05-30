export const API_BASE_URL = "https://tracui.pxxl.tech"; // Replace with your actual API base URL

export const API_ROUTES = {
  // Consumer routes
  CONSUMER: {
    OVERVIEW: `/api/dashboard/stats`,
    ORDERS: `/api/consumer/orders`,
    ORDER_HISTORY: `/api/consumer/order-history`,
  },
  // Seller routes
  SELLER: {
    OVERVIEW: `/api/dashboard/stats`,
    PRODUCTS: `/api/products`,
  },
  // Logistics routes
  LOGISTICS: {
    OVERVIEW: `/api/dashboard/stats`,
    SHIPMENTS: `/api/logistics/shipments`,
    HISTORY: `/api/logistics/history`,
  },
};

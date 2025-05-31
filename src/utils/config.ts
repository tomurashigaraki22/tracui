export const API_BASE_URL = ""; // Replace with your actual API base URL

export const API_ROUTES = {
  // Consumer routes
  CONSUMER: {
    OVERVIEW: `/api/dashboard/stats`,
    ORDERS: `/api/products`,
    ORDER_HISTORY: `/api/products`,
  },
  // Seller routes
  SELLER: {
    OVERVIEW: `/api/dashboard/stats`,
    PRODUCTS: `/api/products`,
  },
  // Logistics routes
  LOGISTICS: {
    OVERVIEW: `/api/dashboard/stats`,
    SHIPMENTS: `/api/products`,
    HISTORY: `/api/products`,
  },
};

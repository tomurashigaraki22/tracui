export const API_BASE_URL = "https://tracui.pxxl.tech";

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

  // Product route
  PRODUCT: `/api/products`, // Changed this to be a simple string

  // User route
  USER: `/api/user`,
};

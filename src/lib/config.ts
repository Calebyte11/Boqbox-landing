/**
 * API Configuration
 * Reads environment variables and provides centralized API configuration
 */

const BASE_URL = process.env.REACT_APP_BASE_URL || window.location.origin;

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const ORDER_CREATE_ENDPOINT = process.env.REACT_APP_ORDER_CREATE_ENDPOINT || '/orders/create';
const PAYMENT_CONFIRM_ENDPOINT = process.env.REACT_APP_PAYMENT_CONFIRM_ENDPOINT || '/confirm-payment';
const PAYMENT_CALLBACK_URL = `${BASE_URL}?step=payment-callback`;

export const API_ENDPOINTS = {
  ORDER_CREATE: `${API_BASE_URL}${ORDER_CREATE_ENDPOINT}`,
  PAYMENT_CONFIRM: `${API_BASE_URL}${PAYMENT_CONFIRM_ENDPOINT}`,
};

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  CALLBACK_URL: PAYMENT_CALLBACK_URL,
  ENDPOINTS: {
    CREATE_ORDER: ORDER_CREATE_ENDPOINT,
    CONFIRM_PAYMENT: PAYMENT_CONFIRM_ENDPOINT,
  },
  TIMEOUT: 30000, // 30 seconds
};

export default API_CONFIG;

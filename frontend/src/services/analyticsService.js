import apiClient from './axios';
import { normalizeError } from './apiError';

// GET /analytics/… — every call returns the { status, message, data } envelope.

/** Headline figures for the Decision Center. */
export async function getDashboard() {
  try {
    const { data } = await apiClient.get('analytics/dashboard/');
    return data;
  } catch (error) {
    throw normalizeError(error, 'We could not load your dashboard.');
  }
}

/** Revenue per day for the last 30 days. */
export async function getRevenue() {
  try {
    const { data } = await apiClient.get('analytics/revenue/');
    return data;
  } catch (error) {
    throw normalizeError(error, 'We could not load revenue analytics.');
  }
}

/** Units sold per day plus the fastest-moving products. */
export async function getTrends() {
  try {
    const { data } = await apiClient.get('analytics/trends/');
    return data;
  } catch (error) {
    throw normalizeError(error, 'We could not load trend analytics.');
  }
}

/** Stock position by AI status. */
export async function getInventoryAnalytics() {
  try {
    const { data } = await apiClient.get('analytics/inventory/');
    return data;
  } catch (error) {
    throw normalizeError(error, 'We could not load inventory analytics.');
  }
}

/** Supplier footprint. */
export async function getSupplierAnalytics() {
  try {
    const { data } = await apiClient.get('analytics/suppliers/');
    return data;
  } catch (error) {
    throw normalizeError(error, 'We could not load supplier analytics.');
  }
}

export default {
  getDashboard,
  getRevenue,
  getTrends,
  getInventoryAnalytics,
  getSupplierAnalytics,
};

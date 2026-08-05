import apiClient from './axios';
import { normalizeError } from './apiError';

// The inventory page needs product details, stock levels and the names behind
// the category and supplier ids, so these are the four reads it joins.

/** GET /inventory/ — current stock per product. */
export async function getInventory() {
  try {
    const { data } = await apiClient.get('inventory/');
    return data;
  } catch (error) {
    throw normalizeError(error, 'We could not load your inventory.');
  }
}

/** GET /products/ */
export async function getProducts() {
  try {
    const { data } = await apiClient.get('products/');
    return data;
  } catch (error) {
    throw normalizeError(error, 'We could not load your products.');
  }
}

/** GET /categories/ */
export async function getCategories() {
  try {
    const { data } = await apiClient.get('categories/');
    return data;
  } catch (error) {
    throw normalizeError(error, 'We could not load your categories.');
  }
}

/** GET /suppliers/ */
export async function getSuppliers() {
  try {
    const { data } = await apiClient.get('suppliers/');
    return data;
  } catch (error) {
    throw normalizeError(error, 'We could not load your suppliers.');
  }
}

export default { getInventory, getProducts, getCategories, getSuppliers };

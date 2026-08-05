import apiClient from './axios';
import { normalizeError } from './apiError';

/** GET /business/ — the owner's single business, or data: null when the
 *  business has not been set up yet. */
export async function getBusiness() {
  try {
    const { data } = await apiClient.get('business/');
    return data;
  } catch (error) {
    throw normalizeError(error, 'We could not load your business details.');
  }
}

/** POST /business/  body: { shop_name, shop_type, address, phone, gst_number } */
export async function createBusiness(payload) {
  try {
    const { data } = await apiClient.post('business/', payload);
    return data;
  } catch (error) {
    throw normalizeError(error, 'We could not save your business. Please try again.');
  }
}

/** PUT /business/{id}/ */
export async function updateBusiness(id, payload) {
  try {
    const { data } = await apiClient.put(`business/${id}/`, payload);
    return data;
  } catch (error) {
    throw normalizeError(error, 'We could not update your business. Please try again.');
  }
}

export default { getBusiness, createBusiness, updateBusiness };

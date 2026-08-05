import apiClient from './axios';
import { normalizeError } from './apiError';

// GET /ai/… — advisory output from the recommendation engine. Read-only:
// nothing here changes stock, and the shop owner decides what to act on.

/** Every recommendation, most urgent first. */
export async function getRecommendations() {
  try {
    const { data } = await apiClient.get('ai/recommendations/');
    return data;
  } catch (error) {
    throw normalizeError(error, 'We could not load AI recommendations.');
  }
}

/** Products the model expects to run short. */
export async function getReorder() {
  try {
    const { data } = await apiClient.get('ai/reorder/');
    return data;
  } catch (error) {
    throw normalizeError(error, 'We could not load reorder suggestions.');
  }
}

/** Products worth discounting before expiry. */
export async function getDiscount() {
  try {
    const { data } = await apiClient.get('ai/discount/');
    return data;
  } catch (error) {
    throw normalizeError(error, 'We could not load discount suggestions.');
  }
}

/** Overstocked products with almost no predicted demand. */
export async function getDeadStock() {
  try {
    const { data } = await apiClient.get('ai/dead-stock/');
    return data;
  } catch (error) {
    throw normalizeError(error, 'We could not load dead stock analysis.');
  }
}

/** Damaged-stock loss percentages. */
export async function getInventoryLoss() {
  try {
    const { data } = await apiClient.get('ai/loss/');
    return data;
  } catch (error) {
    throw normalizeError(error, 'We could not load inventory loss analysis.');
  }
}

export default { getRecommendations, getReorder, getDiscount, getDeadStock, getInventoryLoss };

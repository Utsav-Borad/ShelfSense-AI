import apiClient from './axios';
import { normalizeError } from './apiError';

// GET /reports/… — sales aggregation. All three periods return the same shape,
// so one component can render any of them.

/** period: 'daily' | 'weekly' | 'monthly' */
export async function getReport(period = 'monthly') {
  try {
    const { data } = await apiClient.get(`reports/${period}/`);
    return data;
  } catch (error) {
    throw normalizeError(error, 'We could not load your report.');
  }
}

/** Downloads the report as a CSV file. Returns the raw text. */
export async function exportReport(period = 'monthly') {
  try {
    const { data } = await apiClient.get(`reports/export/?period=${period}`, {
      responseType: 'text',
    });
    return data;
  } catch (error) {
    throw normalizeError(error, 'We could not export your report.');
  }
}

export default { getReport, exportReport };

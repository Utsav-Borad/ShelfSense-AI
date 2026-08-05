import apiClient from './axios';
import { normalizeError } from './apiError';

// GET /notifications/ — alerts derived live from current inventory. Nothing is
// stored, so this is always the position right now rather than a history.

/** Current alerts, most severe first, healthy stock excluded. */
export async function getNotifications() {
  try {
    const { data } = await apiClient.get('notifications/');
    return data;
  } catch (error) {
    throw normalizeError(error, 'We could not load your notifications.');
  }
}

/** Every notification including healthy products, with counts by type. */
export async function getNotificationHistory() {
  try {
    const { data } = await apiClient.get('notifications/history/');
    return data;
  } catch (error) {
    throw normalizeError(error, 'We could not load notification history.');
  }
}

/** Emails the current digest to the signed-in owner. */
export async function emailNotifications() {
  try {
    const { data } = await apiClient.post('notifications/email/');
    return data;
  } catch (error) {
    throw normalizeError(error, 'We could not send the notification email.');
  }
}

export default { getNotifications, getNotificationHistory, emailNotifications };

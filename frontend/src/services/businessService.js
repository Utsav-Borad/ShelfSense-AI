import apiClient from './axios';

// Service structure only — see the note in authService.js. Endpoints match the
// documented contract; the placeholder branch keeps the UI exercisable until
// the backend routes are live.
const USE_PLACEHOLDER = true;

const delay = (ms = 900) => new Promise((resolve) => { setTimeout(resolve, ms); });
const envelope = (data, message = 'Success') => ({ status: true, message, data });

/** GET /business/ — the owner's single business, or null if not set up yet. */
export async function getBusiness() {
  if (USE_PLACEHOLDER) { await delay(400); return envelope(null); }
  const { data } = await apiClient.get('business/');
  return data;
}

/** POST /business/  body: { shop_name, shop_type, address, phone, gst_number } */
export async function createBusiness(payload) {
  if (USE_PLACEHOLDER) {
    await delay();
    return envelope({ id: 1, owner: 1, created_at: new Date().toISOString(), ...payload }, 'Business created successfully.');
  }
  const { data } = await apiClient.post('business/', payload);
  return data;
}

/** PUT /business/{id}/ */
export async function updateBusiness(id, payload) {
  if (USE_PLACEHOLDER) { await delay(); return envelope({ id, ...payload }, 'Business updated.'); }
  const { data } = await apiClient.put(`business/${id}/`, payload);
  return data;
}

export default { getBusiness, createBusiness, updateBusiness };

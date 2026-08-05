import apiClient from './axios';
import { normalizeError } from './apiError';

// POST /upload/{type}/ — the documented entry point for shop data.
//
// The file goes as multipart/form-data under the field name `file`, so the
// Content-Type header the client normally sets is removed and left to the
// browser, which has to add the multipart boundary itself.

/** type: 'sales' | 'inventory' | 'purchase' */
export async function uploadCsv(type, file) {
  const form = new FormData();
  form.append('file', file);

  try {
    const { data } = await apiClient.post(`upload/${type}/`, form, {
      headers: { 'Content-Type': undefined },
    });
    return data;
  } catch (error) {
    throw normalizeError(error, 'We could not import that file.');
  }
}

export default { uploadCsv };

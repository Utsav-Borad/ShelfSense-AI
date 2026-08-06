import apiClient from './axios';
import { normalizeError } from './apiError';

// Live calls against /api/v1/auth/. Every function returns the API envelope
// { status, message, data } and throws an error carrying `fields` and `detail`
// for the forms to display.

/** POST /auth/register/  body: { full_name, email, password, password_confirmation } */
export async function register(payload) {
  try {
    const { data } = await apiClient.post('auth/register/', payload);
    return data;
  } catch (error) {
    throw normalizeError(error, 'We could not create your account. Please try again.');
  }
}

/** POST /auth/login/  body: { email, password } -> data: { access, refresh, user } */
export async function login(payload) {
  try {
    const { data } = await apiClient.post('auth/login/', payload);
    return data;
  } catch (error) {
    throw normalizeError(error, 'We could not sign you in. Please try again.');
  }
}

/** POST /auth/logout/  body: { refresh } */
export async function logout(refresh) {
  try {
    const { data } = await apiClient.post('auth/logout/', { refresh });
    return data;
  } catch (error) {
    throw normalizeError(error, 'We could not sign you out cleanly.');
  }
}

/** GET /auth/profile/ */
export async function profile() {
  try {
    const { data } = await apiClient.get('auth/profile/');
    return data;
  } catch (error) {
    throw normalizeError(error, 'We could not load your profile.');
  }
}

/** POST /auth/password-reset/  body: { email }
 *  Always succeeds, whether or not the email is registered. When the backend
 *  has no SMTP credentials configured it returns data.reset_token so the reset
 *  screen can still be reached during development. */
export async function requestPasswordReset(payload) {
  try {
    const { data } = await apiClient.post('auth/password-reset/', payload);
    return data;
  } catch (error) {
    throw normalizeError(error, 'We could not send the reset link. Please try again.');
  }
}

/** POST /auth/password-reset/confirm/  body: { token, password, password_confirmation } */
export async function resetPassword(payload) {
  try {
    const { data } = await apiClient.post('auth/password-reset/confirm/', payload);
    return data;
  } catch (error) {
    throw normalizeError(error, 'We could not reset your password. Please try again.');
  }
}

/** PUT /auth/profile/  body: { full_name, email } — the signed-in account only. */
export async function updateProfile(payload) {
  try {
    const { data } = await apiClient.put('auth/profile/', payload);
    return data;
  } catch (error) {
    throw normalizeError(error, 'We could not save your profile.');
  }
}

/** GET /auth/users/ — administrators only; a `user` role gets 403. */
export async function getUsers() {
  try {
    const { data } = await apiClient.get('auth/users/');
    return data;
  } catch (error) {
    throw normalizeError(error, 'We could not load the account list.');
  }
}

/** PATCH /auth/users/:id/  body: { role } or { is_active } — administrators
 *  only. The API refuses when the id is the signed-in administrator's own. */
export async function updateUser(id, payload) {
  try {
    const { data } = await apiClient.patch(`auth/users/${id}/`, payload);
    return data;
  } catch (error) {
    throw normalizeError(error, 'We could not update that account.');
  }
}

/** GET /auth/admin/overview/ — platform-wide totals; administrators only. */
export async function getAdminOverview() {
  try {
    const { data } = await apiClient.get('auth/admin/overview/');
    return data;
  } catch (error) {
    throw normalizeError(error, 'We could not load the platform summary.');
  }
}

/** GET /auth/admin/accounts/ — every account with its shop and that shop's
 *  totals; administrators only. */
export async function getAdminAccounts() {
  try {
    const { data } = await apiClient.get('auth/admin/accounts/');
    return data;
  } catch (error) {
    throw normalizeError(error, 'We could not load the accounts.');
  }
}

/** GET /auth/admin/businesses/ — every business with its owner and totals. */
export async function getAdminBusinesses() {
  try {
    const { data } = await apiClient.get('auth/admin/businesses/');
    return data;
  } catch (error) {
    throw normalizeError(error, 'We could not load the businesses.');
  }
}

export default {
  register, login, logout, profile, updateProfile, requestPasswordReset,
  resetPassword, getUsers, updateUser, getAdminOverview, getAdminAccounts,
  getAdminBusinesses,
};

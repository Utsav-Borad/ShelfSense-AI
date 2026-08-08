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
 *  Emails a 6-digit code. Always succeeds, whether or not the email is
 *  registered, so the endpoint cannot be used to discover who has an account.
 *  With no SMTP credentials configured the backend returns data.code so the
 *  flow still works in development. */
export async function requestPasswordReset(payload) {
  try {
    const { data } = await apiClient.post('auth/password-reset/', payload);
    return data;
  } catch (error) {
    throw normalizeError(error, 'We could not send the code. Please try again.');
  }
}

/** POST /auth/password-reset/verify/  body: { email, code }
 *  Checks the code without spending it, so the screen only asks for a new
 *  password once the code is known to be good. */
export async function verifyResetCode(payload) {
  try {
    const { data } = await apiClient.post('auth/password-reset/verify/', payload);
    return data;
  } catch (error) {
    throw normalizeError(error, 'We could not check that code. Please try again.');
  }
}

/** POST /auth/password-reset/confirm/
 *  body: { email, code, password, password_confirmation } */
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

/** POST /auth/profile/deactivate/ — switch off the signed-in account.
 *  Nothing is deleted; the account simply stops being able to sign in, and an
 *  administrator has to switch it back on. The refresh token goes with the
 *  request so the session cannot be extended afterwards. */
export async function deactivateAccount() {
  try {
    const refresh = localStorage.getItem('refresh_token');
    const { data } = await apiClient.post('auth/profile/deactivate/', { refresh });
    return data;
  } catch (error) {
    throw normalizeError(error, 'We could not deactivate your account.');
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
  verifyResetCode, resetPassword, deactivateAccount, getUsers, updateUser,
  getAdminOverview, getAdminAccounts, getAdminBusinesses,
};

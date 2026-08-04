import apiClient from './axios';

// Service structure only — the endpoints below match the documented API
// contract (/api/v1/auth/…) but the backend routes are not all live yet.
//
// PLACEHOLDER MODE: while `USE_PLACEHOLDER` is true every call resolves with
// simulated data after a short delay so the UI can exercise its loading,
// success and error states. To go live, set it to false (or drive it from an
// env flag) and delete the `placeholder` branch in each function — the axios
// calls underneath are already written against the real contract.
const USE_PLACEHOLDER = true;

const delay = (ms = 900) => new Promise((resolve) => { setTimeout(resolve, ms); });

// Shape mirrors the documented envelope: { status, message, data }.
const envelope = (data, message = 'Success') => ({ status: true, message, data });

const fakeTokens = () => ({ access: `placeholder.access.${Date.now()}`, refresh: `placeholder.refresh.${Date.now()}` });
const fakeUser = (overrides = {}) => ({ id: 1, full_name: 'Utsav Borad', email: 'owner@shelfsense.ai', role: 'user', created_at: new Date().toISOString(), ...overrides });

/** POST /auth/register/  body: { full_name, email, password, password_confirmation } */
export async function register(payload) {
  if (USE_PLACEHOLDER) {
    await delay();
    if (/taken@/i.test(payload.email)) { const error = new Error('Email already registered'); error.fields = { email: 'An account with this email already exists.' }; throw error; }
    return envelope(fakeUser({ full_name: payload.full_name, email: payload.email }), 'Account created successfully.');
  }
  const { data } = await apiClient.post('auth/register/', payload);
  return data;
}

/** POST /auth/login/  body: { email, password } -> data: { access, refresh, user } */
export async function login(payload) {
  if (USE_PLACEHOLDER) {
    await delay();
    if (payload.password === 'wrongpassword') { const error = new Error('Invalid credentials'); error.fields = { password: 'Invalid email or password.' }; throw error; }
    return envelope({ ...fakeTokens(), user: fakeUser({ email: payload.email }) }, 'Login successful.');
  }
  const { data } = await apiClient.post('auth/login/', payload);
  return data;
}

/** POST /auth/logout/  body: { refresh } */
export async function logout(refresh) {
  if (USE_PLACEHOLDER) { await delay(300); return envelope({}, 'Logout successful.'); }
  const { data } = await apiClient.post('auth/logout/', { refresh });
  return data;
}

/** GET /auth/profile/ */
export async function profile() {
  if (USE_PLACEHOLDER) { await delay(400); return envelope(fakeUser()); }
  const { data } = await apiClient.get('auth/profile/');
  return data;
}

/** Password reset. No endpoint is documented for these yet — paths are a
 *  placeholder to be confirmed with the backend before going live. */
export async function requestPasswordReset(payload) {
  if (USE_PLACEHOLDER) { await delay(); return envelope({}, 'If that email exists, a reset link is on its way.'); }
  const { data } = await apiClient.post('auth/password-reset/', payload);
  return data;
}

export async function resetPassword(payload) {
  if (USE_PLACEHOLDER) {
    await delay();
    if (payload.token === 'expired') { const error = new Error('Expired token'); error.detail = 'This reset link has expired. Request a new one.'; throw error; }
    return envelope({}, 'Password updated. You can sign in now.');
  }
  const { data } = await apiClient.post('auth/password-reset/confirm/', payload);
  return data;
}

export default { register, login, logout, profile, requestPasswordReset, resetPassword };

// Shared react-hook-form rules, so every screen validates a field the same way.
// The password minimum (8) matches the backend RegisterSerializer.

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const PHONE_PATTERN = /^[0-9+\-\s()]{7,20}$/;
// 15 characters: 2 state digits, 10-char PAN, entity digit, 'Z', checksum.
export const GST_PATTERN = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
// Indian PIN: 6 digits, never starting with 0.
export const PINCODE_PATTERN = /^[1-9][0-9]{5}$/;
// Place names: letters plus the usual separators. No digits, so a keyboard
// mash of letters is still possible — but the PIN code catches those.
export const PLACE_PATTERN = /^[A-Za-z][A-Za-z\s.'()\-/,]*$/;

export const rules = {
  fullName: {
    required: 'Please enter your full name.',
    minLength: { value: 2, message: 'That looks a little short.' },
    maxLength: { value: 150, message: 'Please keep this under 150 characters.' },
  },
  email: {
    required: 'Please enter your email address.',
    pattern: { value: EMAIL_PATTERN, message: 'Enter a valid email address.' },
  },
  password: {
    required: 'Please choose a password.',
    minLength: { value: 8, message: 'Use at least 8 characters.' },
  },
  loginPassword: { required: 'Please enter your password.' },
  confirmPassword: (getPassword) => ({
    required: 'Please confirm your password.',
    validate: (value) => value === getPassword() || 'Passwords do not match.',
  }),
  shopName: {
    required: 'Please enter your shop name.',
    maxLength: { value: 255, message: 'Please keep this under 255 characters.' },
  },
  shopType: { required: 'Please choose the type of shop you run.' },
  // The backend stores one free-text `address`, but collecting it as parts
  // gives us something we can actually validate — a single box accepts any
  // keyboard mash. composeAddress() joins them back before submitting.
  addressLine: {
    required: 'Please enter your flat, house or shop number.',
    maxLength: { value: 80, message: 'Please keep this under 80 characters.' },
  },
  society: {
    required: 'Please enter the building or society name.',
    minLength: { value: 2, message: 'That looks a little short.' },
    maxLength: { value: 120, message: 'Please keep this under 120 characters.' },
  },
  area: {
    required: 'Please enter the area or locality.',
    minLength: { value: 2, message: 'That looks a little short.' },
    maxLength: { value: 120, message: 'Please keep this under 120 characters.' },
  },
  city: {
    required: 'Please enter your city.',
    pattern: { value: PLACE_PATTERN, message: 'City should not contain numbers.' },
    maxLength: { value: 80, message: 'Please keep this under 80 characters.' },
  },
  pincode: {
    required: 'Please enter your PIN code.',
    pattern: { value: PINCODE_PATTERN, message: 'Enter a valid 6-digit PIN code.' },
  },
  phone: {
    required: 'Please enter a contact number.',
    pattern: { value: PHONE_PATTERN, message: 'Enter a valid phone number.' },
  },
  // Optional on the backend (blank/null allowed), so only validated if filled.
  gstNumber: {
    validate: (value) => !value || GST_PATTERN.test(value.toUpperCase()) || 'Enter a valid 15-character GST number, or leave blank.',
  },
  terms: { required: 'Please accept the terms to continue.' },
};

// The documented target verticals: any business whose products carry a
// manufacturing and an expiry date.
export const SHOP_TYPES = ['Grocery', 'Medical', 'Bakery', 'Dairy', 'Cosmetic', 'Organic food', 'Frozen food', 'Pet food', 'Other'];

// Joins the address parts into the single string the backend stores, in the
// standard comma-separated order used on Indian ID documents:
//   "B-402, Shanti Residency, Satellite, Ahmedabad, 380015"
export function composeAddress(values) {
  return [values.address_line, values.society, values.area, values.city, values.pincode]
    .map((part) => String(part ?? '').trim())
    .filter(Boolean)
    .join(', ');
}

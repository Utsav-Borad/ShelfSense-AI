// Turns an axios failure into the shape every page already expects:
//   error.fields  -> { fieldName: 'message' }  attached to form inputs
//   error.detail  -> 'message'                 shown as a form-level banner
//
// The API answers errors as:
//   { status: false, message: 'Validation Error', errors: { email: ['...'] } }
//
// Some error keys are not form inputs — 'credentials' comes from the login
// serializer, 'detail' from permission and 404 responses. Attaching those to a
// field would hide the message, because no input renders it. They go to
// `detail` instead so the banner shows them.
const NON_FIELD_KEYS = [
  'detail',
  'credentials',
  'non_field_errors',
  'business',
  'engine',
  'refresh',
  'token',
  // Upload failures arrive under `file`. There is no input called "file" to
  // attach them to, so without this the reason ("Missing required column(s)…")
  // would be swallowed and only the generic "Validation Error" would show.
  'file',
];

// Errors arrive as ['message'] from DRF, but a plain string is also possible.
function firstMessage(value) {
  if (Array.isArray(value)) return String(value[0]);
  return String(value);
}

export function normalizeError(error, fallback = 'Something went wrong. Please try again.') {
  const normalized = new Error(error.message || fallback);

  // No response at all: the server is down, or the browser blocked the request.
  if (!error.response) {
    normalized.detail = 'We could not reach the server. Check that the backend is running.';
    return normalized;
  }

  const body = error.response.data || {};
  const errors = body.errors || {};
  const fields = {};
  const banner = [];

  Object.keys(errors).forEach((key) => {
    if (NON_FIELD_KEYS.includes(key)) banner.push(firstMessage(errors[key]));
    else fields[key] = firstMessage(errors[key]);
  });

  if (Object.keys(fields).length > 0) normalized.fields = fields;
  normalized.detail = banner[0] || body.message || fallback;
  normalized.status = error.response.status;

  return normalized;
}

export default normalizeError;

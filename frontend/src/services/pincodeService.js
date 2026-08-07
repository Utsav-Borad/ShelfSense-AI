import axios from 'axios';

// India Post's public PIN code directory. No key, no signup, no rate limit
// published — it is the same data the Post Office publishes.
//
// Deliberately NOT the shared apiClient from ./axios: that one prefixes every
// path with our own API base URL and attaches the signed-in user's JWT. Sending
// our token to a third-party host would leak it.
const LOOKUP_URL = 'https://api.postalpincode.in/pincode';

// A slow lookup must not hold the form hostage. Six seconds is long enough for
// a poor connection and short enough that the retry button feels responsive.
const TIMEOUT_MS = 6000;

/** Thrown when the PIN itself is wrong — the API answered, the code is not real. */
export class UnknownPincode extends Error {}

/** Thrown when we could not reach the service at all. Different from the above:
 *  this one is worth retrying, an unknown PIN is not. */
export class PincodeLookupFailed extends Error {}

/**
 * Look up an Indian PIN code.
 *
 * Resolves to { city, state, localities } — `localities` being every post
 * office the API lists under that PIN, which is useful because one PIN can
 * cover several. City and state are the same across all of them, which is why
 * only those two are filled in automatically.
 */
export async function lookupPincode(pincode) {
  let response;
  try {
    response = await axios.get(`${LOOKUP_URL}/${pincode}`, { timeout: TIMEOUT_MS });
  } catch {
    throw new PincodeLookupFailed('We could not reach the PIN code service.');
  }

  // The API answers with a single-element array, and reports a bad PIN as
  // Status: "Error" with HTTP 200 — so the status code alone proves nothing.
  const result = Array.isArray(response.data) ? response.data[0] : null;
  const offices = result && Array.isArray(result.PostOffice) ? result.PostOffice : [];

  if (!result || result.Status !== 'Success' || offices.length === 0) {
    throw new UnknownPincode('That PIN code does not exist.');
  }

  const first = offices[0];
  if (!first.District || !first.State) {
    throw new UnknownPincode('That PIN code does not exist.');
  }

  return {
    city: first.District,
    state: first.State,
    localities: offices.map((office) => office.Name).filter(Boolean),
  };
}

export default { lookupPincode, UnknownPincode, PincodeLookupFailed };

// Which notifications the owner has already seen.
//
// Notifications are generated live from current inventory on every request —
// the server stores none of them, so it cannot store read state either. Keeping
// the read ids in localStorage means a notification stays read after a reload,
// and lets the sidebar badge and the notification centre agree on the count.

const KEY = 'shelfsense-read-notifications';

// The sidebar is mounted alongside the notifications page rather than above it,
// so it cannot be told through props when something is marked read. A window
// event lets it recount the moment the page writes.
export const READ_STATE_EVENT = 'shelfsense:notifications-read';

export function loadReadIds() {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveReadIds(ids) {
  try {
    localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    // A full or blocked storage only costs us the memory of what was read.
  }
  window.dispatchEvent(new Event(READ_STATE_EVENT));
}

/** Subscribe to read-state changes. Returns the matching cleanup function. */
export function onReadStateChange(handler) {
  window.addEventListener(READ_STATE_EVENT, handler);
  return () => window.removeEventListener(READ_STATE_EVENT, handler);
}

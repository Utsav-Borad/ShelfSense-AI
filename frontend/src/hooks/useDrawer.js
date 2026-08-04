import { useEffect } from 'react';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Shared behaviour for every right-side drawer in the product.
//
// Escape closes, body scroll locks, focus moves into the panel on open and
// returns to whatever opened it on close, and Tab is trapped inside — without
// the trap a `role="dialog" aria-modal="true"` panel lets keyboard users walk
// straight out into the page behind the backdrop.
//
//   const panelRef = useRef(null);
//   useDrawer(Boolean(item), onClose, panelRef);
export default function useDrawer(open, onClose, panelRef) {
  useEffect(() => {
    if (!open) return undefined;

    const opener = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Move focus in, so the first Tab lands inside the drawer.
    const focusTimer = setTimeout(() => {
      const panel = panelRef?.current;
      if (!panel) return;
      const first = panel.querySelector(FOCUSABLE);
      (first || panel).focus?.();
    }, 60);

    function onKeyDown(event) {
      if (event.key === 'Escape') { onClose(); return; }
      if (event.key !== 'Tab') return;

      const panel = panelRef?.current;
      if (!panel) return;
      const items = Array.from(panel.querySelectorAll(FOCUSABLE)).filter((node) => node.offsetParent !== null);
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      clearTimeout(focusTimer);
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      opener?.focus?.();
    };
  }, [open, onClose, panelRef]);
}

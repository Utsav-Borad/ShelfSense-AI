import { useEffect, useState } from 'react';

// Counts from 0 to `target` on animation frames, easing out so the number
// settles rather than stopping dead. Shared by every gauge, KPI and score
// across the product.
export default function useCountUp(target, { duration = 1400, delay = 0, active = true, decimals = 0 } = {}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) { setValue(0); return undefined; }
    let frame;
    let start = null;
    const tick = (now) => {
      if (start === null) start = now;
      const elapsed = now - start - delay;
      if (elapsed < 0) { frame = requestAnimationFrame(tick); return; }
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setValue(Number((target * eased).toFixed(decimals)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, delay, active, decimals]);

  return value;
}

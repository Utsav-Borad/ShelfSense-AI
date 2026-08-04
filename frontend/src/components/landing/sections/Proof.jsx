import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Reveal, { EASE, RevealCard, cardEntrance } from './Reveal';

// NOTE: the figures and the quote below are illustrative sample data from a
// demo workspace, not measured results. They are labelled as such on the page.
const stats = [
  [42800, '₹', '', 'Dead stock identified', 'capital found sitting still'],
  [6150, '₹', '', 'Loss avoided', 'caught before the expiry date'],
  [92, '', '', 'Business health score', 'computed from ten metrics'],
  [98, '', '%', 'Top prediction confidence', 'on the reorder recommendation'],
];

function Stat({ value, prefix, suffix, label, note, delay }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: .6 });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!seen) return undefined;
    let frame; let start = null;
    const tick = (now) => {
      if (start === null) start = now;
      const p = Math.min((now - start - delay * 1000) / 1400, 1);
      if (p < 0) { frame = requestAnimationFrame(tick); return; }
      setN(Math.round(value * (1 - (1 - p) ** 3)));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [seen, value, delay]);
  return (
    <motion.div ref={ref} className="ss-stat" variants={cardEntrance} custom={delay} initial="hidden" animate={seen ? 'show' : 'hidden'} style={{ transformPerspective: 900 }}>
      <b>{prefix}{n.toLocaleString('en-IN')}{suffix}</b>
      <strong>{label}</strong>
      <small>{note}</small>
    </motion.div>
  );
}

export default function Proof() {
  return (
    <section className="ss-section ss-proof">
      <Reveal className="ss-proof-label"><i className="bi bi-info-circle" />Illustrative figures from a sample workspace</Reveal>
      <div className="ss-stat-row">
        {stats.map(([value, prefix, suffix, label, note], i) => (
          <Stat key={label} value={value} prefix={prefix} suffix={suffix} label={label} note={note} delay={i * .1} />
        ))}
      </div>

      <RevealCard className="ss-testimonial" delay={.1}>
        <i className="bi bi-quote" />
        <blockquote>
          I was not short of data. I was short of time to read it. Now the first thing I see each morning is the one decision that actually needs me — with the reason already attached.
        </blockquote>
        <footer>
          <span className="ss-testimonial-avatar">RK</span>
          <div><strong>Retail owner persona</strong><small>Grocery · sample scenario, not a real customer</small></div>
        </footer>
      </RevealCard>
    </section>
  );
}

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Reveal from './Reveal';

// ACT 5 — action.
export default function Closing() {
  return (
    <section className="ss-close" id="get-started">
      <motion.div className="ss-close-orb" animate={{ opacity: [.5, .8, .5], scale: [1, 1.06, 1] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }} aria-hidden="true" />
      <Reveal className="ss-close-inner">
        <p className="ss-eyebrow">Every recommendation carries its reason</p>
        <h2>Stop reporting the past.<br /><em>Start shaping what happens next.</em></h2>
        <p className="ss-close-sub">
          ShelfSense reads the data your business already produces and tells you what to do with it — with the confidence, the reasoning, and the expected impact attached to every word.
        </p>
        <div className="ss-close-actions">
          <Link to="/dashboard" className="ss-btn ss-btn-primary">Start free <i className="bi bi-arrow-up-right" /></Link>
          <Link to="/dashboard" className="ss-btn ss-btn-ghost">Sign in</Link>
        </div>
        <div className="ss-close-meta">
          <span><i className="bi bi-shield-check" />Private by design</span>
          <span><i className="bi bi-cpu" />Six prediction models</span>
          <span><i className="bi bi-hand-index-thumb" />Advisory, never automatic</span>
        </div>
      </Reveal>
    </section>
  );
}

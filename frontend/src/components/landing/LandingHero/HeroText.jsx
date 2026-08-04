import { Link } from 'react-router-dom';
import { motion, useTransform } from 'framer-motion';
import { T } from './timeline';

// Scene 1. The words arrive one at a time — words, never letters — then the
// whole column recedes as the device begins to rise.
const lines = [['Smarter', 'inventory.'], ['Better', 'decisions.']];

const word = { hidden: { opacity: 0, y: '0.4em', filter: 'blur(10px)' }, show: { opacity: 1, y: '0em', filter: 'blur(0px)', transition: { duration: .9, ease: [.16, 1, .3, 1] } } };

export default function HeroText({ progress }) {
  const opacity = useTransform(progress, T.HERO_TEXT_OUT, [1, 0]);
  const y = useTransform(progress, T.HERO_TEXT_OUT, [0, -60]);
  const blur = useTransform(progress, T.HERO_TEXT_OUT, ['blur(0px)', 'blur(6px)']);
  const tailOpacity = useTransform(progress, [0, 0.06, 0.14], [1, 1, 0]);

  return (
    <div className="ss-hero-text"><motion.div className="ss-hero-text-inner" style={{ opacity, y, filter: blur }}>
      <motion.p className="ss-eyebrow" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .9, delay: .35 }}>Inventory intelligence, thoughtfully made</motion.p>
      <motion.h1 initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: .14, delayChildren: .6 } } }}>
        {lines.map((row, i) => <span className="ss-hero-line" key={i}>{row.map((w) => <motion.span key={w} variants={word}>{w}</motion.span>)}</span>)}
        <span className="ss-hero-line"><motion.em variants={word}>Powered by AI.</motion.em></span>
      </motion.h1>
      <motion.div style={{ opacity: tailOpacity }}>
        <motion.p className="ss-hero-sub" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .9, delay: 1.5 }}>
          Turn inventory data into decisions you can defend. Predict demand, protect margin, and know the next right move before it becomes urgent.
        </motion.p>
        <motion.div className="ss-hero-actions" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .9, delay: 1.7 }}>
          <Link to="/dashboard" className="ss-btn ss-btn-primary">Start free <i className="bi bi-arrow-up-right" /></Link>
          <a className="ss-btn ss-btn-ghost" href="#story"><i className="bi bi-play-fill" /> See it think</a>
        </motion.div>
      </motion.div>
    </motion.div></div>
  );
}

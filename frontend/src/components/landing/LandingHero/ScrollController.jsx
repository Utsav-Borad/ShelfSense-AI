import { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import HeroText from './HeroText';
import HeroDevice from './HeroDevice';
import FloatingCards from './FloatingCards';
import QuoteSequence from './QuoteSequence';
import WorkflowReveal from './WorkflowReveal';
import { SCROLL_LENGTH, T } from './timeline';

// The orchestrator. One scroll container, one progress value, one timeline.
// No scene computes its own scroll — they all read from `progress`.

const particles = [
  [8, 16], [21, 63], [14, 84], [33, 29], [46, 74], [52, 12], [61, 47],
  [69, 88], [74, 22], [82, 58], [88, 35], [93, 78], [39, 92], [27, 44], [57, 68], [96, 15],
];

function Ambience({ progress, reduced }) {
  // Soft radial warmth that breathes with the story, then clears for the quote.
  const glow = useTransform(progress, [0, T.DEVICE_RISE[1], T.DEVICE_OUT[1], T.QUOTE_A[0]], [.5, 1, .7, .1]);
  const dust = useTransform(progress, [0, T.DEVICE_OUT[0], T.SPHERE[0]], [1, 1, 0]);
  return (
    <>
      <motion.div className="ss-glow" style={{ opacity: glow }} aria-hidden="true" />
      <motion.div className="ss-dust" style={{ opacity: dust }} aria-hidden="true">
        {particles.map(([x, y], i) => (
          <motion.i
            key={i}
            style={{ left: `${x}%`, top: `${y}%` }}
            animate={reduced ? {} : { y: [0, i % 2 ? -9 : 7, 0], opacity: [.06, .14, .06] }}
            transition={{ duration: 22 + (i % 5) * 4, repeat: Infinity, ease: 'easeInOut', delay: i * .7 }}
          />
        ))}
      </motion.div>
    </>
  );
}

export default function ScrollController() {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress: progress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const [booted, setBooted] = useState(false);

  useMotionValueEvent(progress, 'change', (v) => {
    if (v > T.DEVICE_BOOT && !booted) setBooted(true);
    else if (v < 0.02 && booted) setBooted(false);
  });

  const cueOpacity = useTransform(progress, [0, 0.025], [1, 0]);

  return (
    <div className="ss-scroll" ref={ref} id="story" style={{ height: `${SCROLL_LENGTH}vh` }}>
      {/* anchors so the navigation can jump into the right beat of the timeline */}
      <span className="ss-anchor" id="workflow" style={{ top: `${T.WORKFLOW[0] * 100}%` }} />
      <div className="ss-stage">
        <Ambience progress={progress} reduced={reduced} />
        <HeroText progress={progress} />
        <HeroDevice progress={progress} booted={booted} reduced={reduced} />
        <FloatingCards progress={progress} reduced={reduced} />
        <QuoteSequence progress={progress} />
        <WorkflowReveal progress={progress} reduced={reduced} />
        <motion.div className="ss-cue" style={{ opacity: cueOpacity }} aria-hidden="true">
          <span><i className="bi bi-chevron-down" /></span>
          <small>Scroll</small>
        </motion.div>
      </div>
    </div>
  );
}

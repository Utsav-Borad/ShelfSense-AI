import { motion, useTransform } from 'framer-motion';
import { T } from './timeline';

// Scene 6. The quote owns the screen alone — a solid scrim removes the
// ambience behind it, and nothing is ever blurred while it is readable.
// It only begins after the device has reached opacity 0.

export default function QuoteSequence({ progress }) {
  const scrim = useTransform(progress, [T.SPHERE[1] - .02, T.QUOTE_A[0], T.QUOTE_OUT[0], T.QUOTE_OUT[1]], [0, 1, 1, 0]);

  const aOpacity = useTransform(progress, [T.QUOTE_A[0], T.QUOTE_A[1], T.QUOTE_OUT[0], T.QUOTE_OUT[1]], [0, 1, 1, 0]);
  const aY = useTransform(progress, [T.QUOTE_A[0], T.QUOTE_A[1], T.QUOTE_OUT[0], T.QUOTE_OUT[1]], ['2.2rem', '0rem', '0rem', '-3.5rem']);

  const bOpacity = useTransform(progress, [T.QUOTE_B[0], T.QUOTE_B[1], T.QUOTE_OUT[0], T.QUOTE_OUT[1]], [0, 1, 1, 0]);
  const bY = useTransform(progress, [T.QUOTE_B[0], T.QUOTE_B[1], T.QUOTE_OUT[0], T.QUOTE_OUT[1]], ['1.8rem', '0rem', '0rem', '-3rem']);

  const ruleScale = useTransform(progress, [T.QUOTE_B[0] - .015, T.QUOTE_B[1]], [0, 1]);

  return (
    <div className="ss-quote-layer">
      <motion.div className="ss-quote-scrim" style={{ opacity: scrim }} aria-hidden="true" />
      <div className="ss-quote">
        <motion.blockquote style={{ opacity: aOpacity, y: aY }}>
          Every great business decision starts with understanding your inventory.
        </motion.blockquote>
        <motion.span className="ss-quote-rule" style={{ scaleX: ruleScale, opacity: bOpacity }} aria-hidden="true" />
        <motion.p style={{ opacity: bOpacity, y: bY }}>
          Data tells you what happened.<br /><em>Intelligence tells you what to do next.</em>
        </motion.p>
      </div>
    </div>
  );
}

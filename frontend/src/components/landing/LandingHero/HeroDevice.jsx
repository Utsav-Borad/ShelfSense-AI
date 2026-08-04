import { useRef } from 'react';
import { motion, useMotionValue, useMotionValueEvent, useSpring, useTransform } from 'framer-motion';
import HeroBootAnimation from './HeroBootAnimation';
import { T } from './timeline';

// Scenes 2, 4 and 5 for the device itself.
// It lies flat at 75deg in the dark, rises to vertical, holds while the mouse
// tilts it by no more than 2deg, then leaves so the quote can have the screen.

function useTilt(progress, enabled) {
  const rx = useMotionValue(0); const ry = useMotionValue(0);
  const live = useRef(false);
  const spring = { stiffness: 60, damping: 20, mass: .5 };
  const tiltX = useSpring(rx, spring); const tiltY = useSpring(ry, spring);
  useMotionValueEvent(progress, 'change', (v) => { live.current = v > T.DEVICE_HOLD[0] - .03 && v < T.DEVICE_OUT[0]; if (!live.current) { rx.set(0); ry.set(0); } });
  const onPointerMove = (e) => {
    if (!live.current || !enabled) return;
    const b = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - b.left) / b.width - .5) * 4);   // +/- 2deg, never more
    rx.set(((e.clientY - b.top) / b.height - .5) * -4);
  };
  const onPointerLeave = () => { rx.set(0); ry.set(0); };
  return { tiltX, tiltY, onPointerMove, onPointerLeave };
}

export default function HeroDevice({ progress, booted, reduced }) {
  // Scene 2: 75deg flat -> 0deg vertical, lifting out of the dark.
  const rotateX = useTransform(progress, [T.DEVICE_RISE[0], T.DEVICE_RISE[1]], [reduced ? 0 : 75, 0]);
  const y = useTransform(progress, [T.DEVICE_RISE[0], T.DEVICE_RISE[1], T.DEVICE_OUT[0], T.DEVICE_OUT[1]], ['14vh', '0vh', '0vh', '-16vh']);
  const scale = useTransform(progress, [T.DEVICE_RISE[0], T.DEVICE_RISE[1], T.DEVICE_OUT[0], T.DEVICE_OUT[1]], [.86, 1, 1, .82]);
  const opacity = useTransform(progress, [0, .06, T.DEVICE_RISE[1], T.DEVICE_OUT[0], T.DEVICE_OUT[1]], [0, .18, 1, 1, 0]);
  const screenGlow = useTransform(progress, [T.DEVICE_RISE[0], .2, T.DEVICE_RISE[1]], [0, .35, 1]);

  // The shadow tightens as the device stands up and spreads again as it lies back.
  const shadowScale = useTransform(progress, [T.DEVICE_RISE[0], T.DEVICE_RISE[1]], [1.18, .68]);
  const shadowOpacity = useTransform(progress, [T.DEVICE_RISE[0], T.DEVICE_RISE[1], T.DEVICE_OUT[0], T.DEVICE_OUT[1]], [.5, .26, .26, 0]);

  // A faint warm reflection is all that exists in scene 1.
  const reflection = useTransform(progress, [0, .05, T.DEVICE_RISE[1]], [.55, .5, 0]);

  const tilt = useTilt(progress, !reduced);

  return (
    <div className="ss-device-area" onPointerMove={tilt.onPointerMove} onPointerLeave={tilt.onPointerLeave}>
      <motion.div className="ss-device-reflection" style={{ opacity: reflection }} aria-hidden="true" />
      <motion.div className="ss-device-shadow" style={{ scaleX: shadowScale, opacity: shadowOpacity }} aria-hidden="true" />
      <motion.div
        className="ss-device"
        style={{ rotateX, rotateY: tilt.tiltY, y, scale, opacity }}
        aria-label="ShelfSense AI workspace preview"
      >
        <motion.div className="ss-device-tilt" style={{ rotateX: tilt.tiltX }}>
          <div className="ss-device-frame">
            <motion.div className="ss-device-glow" style={{ opacity: screenGlow }} aria-hidden="true" />
            <HeroBootAnimation booted={booted} />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

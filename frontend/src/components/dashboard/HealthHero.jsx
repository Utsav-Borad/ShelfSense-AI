import { motion } from 'framer-motion';
import useCountUp from '../../hooks/useCountUp';

const EASE = [.16, 1, .3, 1];
const RADIUS = 78;

// The hero. A gauge that counts 0 -> score while its arc draws, with a few
// particles orbiting the ring so the card feels alive rather than static.
export default function HealthHero({ health }) {
  const score = useCountUp(health.score, { duration: 1900, delay: 260 });
  const fraction = health.score / 100;

  return (
    <motion.section
      className="dash-card dash-hero"
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .8, delay: .12, ease: EASE }}
    >
      <div className="dash-hero-glow" aria-hidden="true" />

      <div className="dash-hero-copy">
        <p className="dash-eyebrow"><i className="bi bi-heart-pulse" aria-hidden="true" />Business health</p>
        <h2>
          Your business is <em>{health.status.toLowerCase()}</em> today.
        </h2>
        <p className="dash-hero-lead">
          Composed from the model's read on every analysed product: stock cover, expiry exposure and how right-sized your stock is.
        </p>

        <ul className="dash-factors">
          {health.factors.map(([label, value], index) => (
            <li key={label}>
              <span className="dash-factor-head"><small>{label}</small><b>{value}</b></span>
              <span className="dash-factor-track">
                <motion.i
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: value / 100 }}
                  transition={{ duration: 1.1, delay: .7 + index * .1, ease: EASE }}
                />
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="dash-gauge">
        <span className="dash-orbit" aria-hidden="true">
          {[0, 1, 2, 3].map((n) => (
            <motion.i
              key={n}
              animate={{ rotate: 360 }}
              transition={{ duration: 16 + n * 4, repeat: Infinity, ease: 'linear' }}
              style={{ transform: `rotate(${n * 90}deg)` }}
            />
          ))}
        </span>

        <svg viewBox="0 0 180 180" role="img" aria-label={`Business health score ${health.score} out of 100`}>
          <circle className="dash-gauge-track" cx="90" cy="90" r={RADIUS} />
          <motion.circle
            className="dash-gauge-arc"
            cx="90" cy="90" r={RADIUS}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: fraction }}
            transition={{ duration: 1.9, delay: .26, ease: EASE }}
          />
        </svg>

        <div className="dash-gauge-value">
          <strong>{Math.round(score)}</strong>
          <span>/100</span>
          <em className="dash-trend is-flat">{health.status}</em>
        </div>
      </div>
    </motion.section>
  );
}

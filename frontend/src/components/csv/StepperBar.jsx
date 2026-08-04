import { motion } from 'framer-motion';
import { FLOW_STEPS } from './constants';

const EASE = [.16, 1, .3, 1];

// Guided progress across the whole flow:
// Sales -> Inventory -> Purchase -> Validate -> Synchronize -> Complete
export default function StepperBar({ current }) {
  const pct = (current / (FLOW_STEPS.length - 1)) * 100;

  return (
    <nav className="csv-stepper" aria-label="Synchronization progress">
      <p className="visually-hidden" aria-live="polite">
        Step {current + 1} of {FLOW_STEPS.length}: {FLOW_STEPS[current].label}
      </p>
      <div className="csv-stepper-rail" aria-hidden="true">
        <motion.span className="csv-stepper-fill" initial={false} animate={{ width: `${pct}%` }} transition={{ duration: .6, ease: EASE }} />
      </div>
      <ol>
        {FLOW_STEPS.map((step, i) => {
          const state = i < current ? 'is-done' : i === current ? 'is-current' : '';
          return (
            <li key={step.id} className={state} aria-current={i === current ? 'step' : undefined}>
              <motion.span className="csv-stepper-dot" initial={false} animate={{ scale: i === current ? 1.12 : 1 }} transition={{ duration: .4, ease: EASE }}>
                {i < current ? <i className="bi bi-check-lg" aria-hidden="true" /> : i + 1}
              </motion.span>
              <span className="csv-stepper-label">{step.label}</span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

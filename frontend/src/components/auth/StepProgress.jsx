import { motion } from 'framer-motion';

// Progress indicator for the multi-step register and business-setup flows.
// `current` is zero-based. The whole thing is one <ol> so assistive tech reads
// it as an ordered list, with the live position announced once.
export default function StepProgress({ steps, current }) {
  const pct = steps.length > 1 ? (current / (steps.length - 1)) * 100 : 100;

  return (
    <nav className="auth-steps" aria-label="Progress">
      <p className="visually-hidden" aria-live="polite">Step {current + 1} of {steps.length}: {steps[current]}</p>
      <div className="auth-steps-rail" aria-hidden="true">
        <motion.span className="auth-steps-fill" initial={false} animate={{ width: `${pct}%` }} transition={{ duration: .5, ease: [.16, 1, .3, 1] }} />
      </div>
      <ol>
        {steps.map((label, i) => {
          const state = i < current ? 'is-done' : i === current ? 'is-current' : '';
          return (
            <li key={label} className={state} aria-current={i === current ? 'step' : undefined}>
              <motion.span className="auth-step-dot" initial={false} animate={{ scale: i === current ? 1.12 : 1 }} transition={{ duration: .35, ease: [.16, 1, .3, 1] }}>
                {i < current ? <i className="bi bi-check-lg" aria-hidden="true" /> : i + 1}
              </motion.span>
              <span className="auth-step-label">{label}</span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

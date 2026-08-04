import { motion } from 'framer-motion';

// Advisory only — the actual minimum is enforced by the field's own rules
// (8 characters, matching the backend serializer).
const checks = [
  ['At least 8 characters', (v) => v.length >= 8],
  ['One uppercase letter', (v) => /[A-Z]/.test(v)],
  ['One number', (v) => /\d/.test(v)],
  ['One symbol', (v) => /[^A-Za-z0-9]/.test(v)],
];

const labels = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'];

export default function PasswordStrength({ value = '' }) {
  const passed = checks.filter(([, test]) => test(value)).length;
  const score = value ? passed : 0;

  return (
    <div className="auth-strength" aria-live="polite">
      <div className="auth-strength-bars" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <motion.span
            key={i}
            className={i < score ? `is-on level-${score}` : ''}
            initial={false}
            animate={{ scaleX: i < score ? 1 : .35 }}
            transition={{ duration: .3, ease: [.16, 1, .3, 1] }}
          />
        ))}
      </div>
      <p className="auth-strength-label">Password strength: <strong>{labels[score]}</strong></p>
      <ul className="auth-strength-list">
        {checks.map(([label, test]) => {
          const ok = Boolean(value) && test(value);
          return (
            <li key={label} className={ok ? 'is-met' : ''}>
              <i className={`bi bi-${ok ? 'check-circle-fill' : 'circle'}`} aria-hidden="true" />
              <span>{label}</span>
              <span className="visually-hidden">{ok ? ' — met' : ' — not met'}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

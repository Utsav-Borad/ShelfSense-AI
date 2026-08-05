import { motion } from 'framer-motion';

// Reusable field for react-hook-form. Pass register()'s return value in as the
// `field` prop:
//   <FormField label="Email" field={form.register('email', rules.email)} error={…} />
//
// register() returns { name, onChange, onBlur, ref }. We pull the ref out and
// put it straight on the native <input> — a ref on a DOM element is ordinary
// JSX, so this component stays a plain function. The id is derived from
// `name` (which register() also provides), so there is nothing to keep in sync.
//
// Accessibility: label bound by id, error announced via aria-describedby +
// role="alert", aria-invalid flips with the error.
export default function FormField({
  field = {}, label, error, hint, icon, type = 'text', className = '', trailing, ...props
}) {
  const { ref, ...registered } = field;
  const name = registered.name;
  const fieldId = `field-${name}`;
  const errorId = `${fieldId}-error`;
  const hintId = `${fieldId}-hint`;
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`auth-field ${className}`}>
      {label && <label htmlFor={fieldId}>{label}</label>}
      <div className={`auth-input-shell${error ? ' is-invalid' : ''}${icon ? ' has-icon' : ''}${trailing ? ' has-trailing' : ''}`}>
        {icon && <i className={`bi ${icon} auth-input-icon`} aria-hidden="true" />}
        <input
          ref={ref}
          id={fieldId}
          type={type}
          className="auth-input"
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={describedBy}
          {...registered}
          {...props}
        />
        {trailing}
      </div>
      {hint && !error && <span className="auth-field-hint" id={hintId}>{hint}</span>}
      {error && (
        <motion.span
          className="auth-field-error"
          id={errorId}
          role="alert"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .2 }}
        >
          <i className="bi bi-exclamation-circle" aria-hidden="true" />{error}
        </motion.span>
      )}
    </div>
  );
}

import { forwardRef } from 'react';
import { motion } from 'framer-motion';

// Reusable field for react-hook-form. Pass the spread from register() in:
//   <FormField label="Email" {...form.register('email', rules.email)} error={…} />
//
// forwardRef is needed because register() hands us a ref. The id is derived
// from `name` (which register() also provides), so there is nothing extra to
// keep in sync.
//
// Accessibility: label bound by id, error announced via aria-describedby +
// role="alert", aria-invalid flips with the error.
const FormField = forwardRef(function FormField(
  { name, label, error, hint, icon, type = 'text', className = '', trailing, ...props },
  ref,
) {
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
          name={name}
          type={type}
          className="auth-input"
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={describedBy}
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
});

export default FormField;

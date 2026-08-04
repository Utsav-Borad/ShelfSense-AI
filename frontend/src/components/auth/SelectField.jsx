import { forwardRef } from 'react';
import { motion } from 'framer-motion';

const SelectField = forwardRef(function SelectField(
  { name, label, error, hint, options = [], placeholder, className = '', ...props },
  ref,
) {
  const fieldId = `field-${name}`;
  const errorId = `${fieldId}-error`;
  const hintId = `${fieldId}-hint`;
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`auth-field ${className}`}>
      {label && <label htmlFor={fieldId}>{label}</label>}
      <div className={`auth-input-shell is-select${error ? ' is-invalid' : ''}`}>
        <select ref={ref} id={fieldId} name={name} className="auth-input" aria-invalid={error ? 'true' : 'false'} aria-describedby={describedBy} {...props}>
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => {
            const value = typeof option === 'string' ? option : option.value;
            const text = typeof option === 'string' ? option : option.label;
            return <option key={value} value={value}>{text}</option>;
          })}
        </select>
        <i className="bi bi-chevron-down auth-select-caret" aria-hidden="true" />
      </div>
      {hint && !error && <span className="auth-field-hint" id={hintId}>{hint}</span>}
      {error && (
        <motion.span className="auth-field-error" id={errorId} role="alert" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .2 }}>
          <i className="bi bi-exclamation-circle" aria-hidden="true" />{error}
        </motion.span>
      )}
    </div>
  );
});

export default SelectField;

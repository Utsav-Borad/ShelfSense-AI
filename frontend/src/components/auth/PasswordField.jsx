import { forwardRef, useState } from 'react';
import FormField from './FormField';

// Password input with a visibility toggle. The toggle is a real button so it
// is reachable by keyboard, and aria-pressed reports the state.
const PasswordField = forwardRef(function PasswordField({ label = 'Password', ...props }, ref) {
  const [visible, setVisible] = useState(false);

  return (
    <FormField
      ref={ref}
      label={label}
      type={visible ? 'text' : 'password'}
      icon="bi-lock"
      trailing={(
        <button
          type="button"
          className="auth-input-toggle"
          onClick={() => setVisible(!visible)}
          aria-pressed={visible}
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          <i className={`bi bi-eye${visible ? '-slash' : ''}`} aria-hidden="true" />
        </button>
      )}
      {...props}
    />
  );
});

export default PasswordField;

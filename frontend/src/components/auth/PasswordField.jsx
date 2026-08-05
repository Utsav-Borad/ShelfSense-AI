import { useState } from 'react';
import FormField from './FormField';

// Password input with a visibility toggle. The toggle is a real button so it
// is reachable by keyboard, and aria-pressed reports the state.
// The `field` prop from register() rides along in ...props down to FormField.
export default function PasswordField({ label = 'Password', ...props }) {
  const [visible, setVisible] = useState(false);

  return (
    <FormField
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
}

import { forwardRef } from 'react';
const Input = forwardRef(({ label, id, error, ...props }, ref) => <div className="field">{label && <label htmlFor={id}>{label}</label>}<input ref={ref} id={id} className="form-control app-input" aria-invalid={Boolean(error)} {...props}/>{error && <span className="field-error">{error}</span>}</div>);
export default Input;

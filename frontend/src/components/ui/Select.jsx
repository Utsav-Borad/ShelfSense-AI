import { forwardRef } from 'react';
const Select = forwardRef(({ label, id, children, ...props }, ref) => <div className="field">{label && <label htmlFor={id}>{label}</label>}<select ref={ref} id={id} className="form-select app-input" {...props}>{children}</select></div>);
export default Select;

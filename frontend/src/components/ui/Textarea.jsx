import { forwardRef } from 'react';
const Textarea = forwardRef(({ label, id, ...props }, ref) => <div className="field">{label && <label htmlFor={id}>{label}</label>}<textarea ref={ref} id={id} className="form-control app-input" {...props}/></div>);
export default Textarea;

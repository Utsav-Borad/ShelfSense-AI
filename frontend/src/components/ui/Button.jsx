import { forwardRef, memo } from 'react';
import { motion } from 'framer-motion';

const Button = forwardRef(({ children, variant = 'primary', className = '', type = 'button', ...props }, ref) => (
  <motion.button ref={ref} type={type} className={`btn app-btn app-btn-${variant} ${className}`} whileTap={{ scale: 0.98 }} {...props}>{children}</motion.button>
));
export default memo(Button);

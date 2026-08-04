import { memo } from 'react';
import { motion } from 'framer-motion';
const Card = ({ children, className = '', ...props }) => <motion.section initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={`app-card ${className}`} {...props}>{children}</motion.section>;
export default memo(Card);

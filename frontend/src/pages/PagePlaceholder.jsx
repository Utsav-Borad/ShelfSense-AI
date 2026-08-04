import { motion } from 'framer-motion';
import SectionHeader from '../components/ui/SectionHeader';
export default function PagePlaceholder({ title, description }) { return <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .22 }}><SectionHeader title={title} description={description}/></motion.div>; }

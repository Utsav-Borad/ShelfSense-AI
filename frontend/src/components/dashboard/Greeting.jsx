import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';

const EASE = [.16, 1, .3, 1];

function partOfDay(hour) {
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

// Fades in first, before anything else on the page.
export default function Greeting() {
  const { user, business } = useAuth();
  const now = new Date();
  const firstName = user?.full_name ? user.full_name.split(' ')[0] : null;
  const today = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <motion.header
      className="dash-greeting"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .75, ease: EASE }}
    >
      <div>
        <p className="dash-eyebrow">Your decision center</p>
        <h1>{partOfDay(now.getHours())}{firstName ? `, ${firstName}` : ''}.</h1>
        <p className="dash-greeting-sub">
          {business?.shop_name ? `${business.shop_name} · ` : ''}{today} · last synchronized at 09:12
        </p>
      </div>
      <motion.span
        className="dash-sync-badge"
        initial={{ opacity: 0, scale: .94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: .6, delay: .25, ease: EASE }}
      >
        <i className="bi bi-check-circle" aria-hidden="true" />
        Up to date
      </motion.span>
    </motion.header>
  );
}

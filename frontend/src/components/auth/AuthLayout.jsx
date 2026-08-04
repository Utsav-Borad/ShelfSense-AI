import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';
import '../../styles/auth.css';

// Split-screen shell: branding on the left, form on the right. On mobile the
// branding panel collapses to a compact header so the form is above the fold.
const EASE = [.16, 1, .3, 1];

const highlights = [
  ['bi-cpu', 'Six prediction models', 'Demand, dead stock, loss, discount, reorder and supplier scoring.'],
  ['bi-shield-check', 'Advisory, never automatic', 'Nothing is ordered or discounted without you.'],
  ['bi-clock-history', 'Act while there is time', 'Risk surfaces days before it costs you margin.'],
];

export default function AuthLayout({ children, side = 'default' }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="auth-shell">
      <motion.aside className="auth-brand-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .7, ease: EASE }}>
        <div className="auth-brand-glow" aria-hidden="true" />
        <div className="auth-brand-top">
          <Link to="/" className="auth-brand-logo">
            <span aria-hidden="true"><i className="bi bi-layers-fill" /></span>ShelfSense <b>AI</b>
          </Link>
        </div>

        <motion.div className="auth-brand-body" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .12, ease: EASE }}>
          <h2>{side === 'setup' ? <>Nearly there.<br /><em>Let’s learn your shop.</em></> : <>Turn inventory data into<br /><em>decisions you can defend.</em></>}</h2>
          <ul className="auth-brand-list">
            {highlights.map(([icon, title, text], i) => (
              <motion.li key={title} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .6, delay: .28 + i * .09, ease: EASE }}>
                <span aria-hidden="true"><i className={`bi ${icon}`} /></span>
                <div><strong>{title}</strong><small>{text}</small></div>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <p className="auth-brand-foot">&copy; {new Date().getFullYear()} ShelfSense AI</p>
      </motion.aside>

      <main className="auth-form-panel">
        <div className="auth-form-topbar">
          <Link to="/" className="auth-back"><i className="bi bi-arrow-left" aria-hidden="true" />Back to site</Link>
          <button type="button" className="auth-theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}>
            <i className={`bi bi-${isDark ? 'sun' : 'moon-stars'}`} aria-hidden="true" />
          </button>
        </div>
        <div className="auth-form-scroll">
          <div className="auth-form-inner">{children}</div>
        </div>
      </main>
    </div>
  );
}

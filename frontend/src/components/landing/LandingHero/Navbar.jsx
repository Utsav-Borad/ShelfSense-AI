import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';

// Transparent. No background, no border, no blur — at every scroll position.
// The logo lands first; the navigation fades in only after the hero copy has
// finished speaking. A single gold hairline tracks progress through the page.
const links = [['#problem', 'Why ShelfSense'], ['#platform', 'Platform'], ['#intelligence', 'Intelligence'], ['#faq', 'FAQ']];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: .001 });

  return (
    <>
      <motion.div className="ss-progress" style={{ scaleX: progress }} aria-hidden="true" />
      <header className="ss-nav">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .15 }}>
          <Link className="ss-brand" to="/"><span><i className="bi bi-layers-fill" /></span>ShelfSense <b>AI</b></Link>
        </motion.div>
        <motion.nav initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.1, delay: 1.9 }}>
          {links.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
        </motion.nav>
        <motion.div className="ss-nav-actions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.1, delay: 2 }}>
          <Link to="/dashboard" className="ss-nav-signin">Sign in</Link>
          <button className="ss-nav-toggle" onClick={() => setOpen(!open)} aria-label="Toggle navigation" aria-expanded={open}><i className={`bi bi-${open ? 'x-lg' : 'list'}`} /></button>
        </motion.div>
      </header>
      <motion.div className="ss-drawer" initial={false} animate={{ opacity: open ? 1 : 0, y: open ? 0 : -10, pointerEvents: open ? 'auto' : 'none' }} transition={{ duration: .28 }}>
        {links.map(([href, label]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}
        <Link to="/dashboard" onClick={() => setOpen(false)}>Sign in</Link>
      </motion.div>
    </>
  );
}

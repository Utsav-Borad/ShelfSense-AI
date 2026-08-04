import { motion } from 'framer-motion';
import Reveal from './Reveal';

// The documented target market: any business whose products carry a
// manufacturing and an expiry date.
const verticals = ['Grocery', 'Medical', 'Bakery', 'Dairy', 'Cosmetic', 'Organic food', 'Frozen food', 'Pet food'];

export default function Verticals() {
  const track = [...verticals, ...verticals];
  return (
    <section className="ss-verticals">
      <Reveal as="p" className="ss-verticals-lead">
        Built for any retail business whose products carry a <em>manufacturing date</em> and an <em>expiry date</em>.
      </Reveal>
      <div className="ss-marquee" aria-hidden="true">
        <motion.div className="ss-marquee-track" animate={{ x: ['0%', '-50%'] }} transition={{ duration: 34, repeat: Infinity, ease: 'linear' }}>
          {track.map((name, i) => <span key={i}>{name}<i /></span>)}
        </motion.div>
      </div>
      <ul className="ss-visually-hidden">{verticals.map((v) => <li key={v}>{v}</li>)}</ul>
    </section>
  );
}

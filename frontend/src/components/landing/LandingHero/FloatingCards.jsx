import { motion, useTransform } from 'framer-motion';
import { T } from './timeline';

// Scene 4: they orbit the standing device at three different depths, very slowly.
// Scene 5: instead of disappearing they detach, travel to the centre, and merge
// into a single warm gold sphere.
//
// x/y are percentages of the stage. depth 1 is nearest the viewer.
const cards = [
  { id: 'health', x: 36, y: 27, depth: 1, drift: 7.4, icon: 'bi-heart-pulse', label: 'Business health', value: '92 · Excellent', tone: 'gold' },
  { id: 'confidence', x: 92, y: 21, depth: 2, drift: 8.6, icon: 'bi-graph-up-arrow', label: 'Prediction confidence', value: '98%', tone: 'sage' },
  { id: 'revenue', x: 39, y: 71, depth: 1, drift: 6.8, icon: 'bi-currency-rupee', label: 'Revenue this week', value: '₹18.2k', tone: 'gold' },
  { id: 'supplier', x: 94, y: 59, depth: 2, drift: 9.2, icon: 'bi-truck', label: 'Supplier rating', value: 'A+', tone: 'sage' },
  { id: 'inventory', x: 65, y: 93, depth: 1, drift: 7.9, icon: 'bi-box-seam', label: 'Inventory', value: 'Healthy', tone: 'sage' },
  { id: 'expiry', x: 88, y: 88, depth: 3, drift: 10.4, icon: 'bi-clock-history', label: 'Near expiry', value: '12 items', tone: 'warn' },
  { id: 'savings', x: 45, y: 10, depth: 3, drift: 9.8, icon: 'bi-shield-check', label: 'Estimated savings', value: '₹18,250', tone: 'gold' },
];

// The four the story names by name lead the merge; the rest follow a beat later.
const leads = ['health', 'revenue', 'inventory', 'confidence'];

// Depth lives in the scroll-driven scale, not in CSS — the card itself is a
// motion element and Framer owns its transform.
const depthScale = { 1: 1, 2: .88, 3: .78 };
const depthOpacity = { 1: 1, 2: .82, 3: .62 };

function FloatingCard({ card, progress, reduced, index }) {
  const lead = leads.includes(card.id);
  const mergeStart = T.CARDS_MERGE[0] + (lead ? 0 : .025);
  const mergeEnd = T.CARDS_MERGE[1] - (lead ? .02 : 0);
  const rest = depthScale[card.depth];
  const lit = depthOpacity[card.depth];

  const opacity = useTransform(progress, [T.CARDS_IN[0] + index * .006, T.CARDS_IN[1] + index * .006, mergeStart, mergeEnd - .015], [0, lit, lit, 0]);
  const x = useTransform(progress, [mergeStart, mergeEnd], ['0vw', `${(50 - card.x) * 0.92}vw`]);
  const y = useTransform(progress, [mergeStart, mergeEnd], ['0vh', `${(50 - card.y) * 0.92}vh`]);
  const scale = useTransform(progress, [T.CARDS_IN[0], T.CARDS_IN[1], mergeStart, mergeEnd], [rest * .8, rest, rest, .22]);
  const rise = useTransform(progress, [T.CARDS_IN[0] + index * .006, T.CARDS_IN[1] + index * .006], ['1.2em', '0em']);

  const drift = reduced ? {} : { y: [0, card.depth === 1 ? -12 : -7, 0], x: [0, card.depth === 3 ? 6 : 3, 0] };

  return (
    <div className="ss-card-anchor" style={{ left: `${card.x}%`, top: `${card.y}%`, zIndex: 20 - card.depth }}>
      <motion.div style={{ x, y, scale, opacity }}>
        <motion.div style={{ y: rise }}>
          <motion.div className={`ss-float-card depth-${card.depth} tone-${card.tone}`} animate={drift} transition={{ duration: card.drift, repeat: Infinity, ease: 'easeInOut', delay: index * .4 }}>
            <span className="ss-float-icon"><i className={`bi ${card.icon}`} /></span>
            <div><small>{card.label}</small><b>{card.value}</b></div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function Sphere({ progress }) {
  const opacity = useTransform(progress, [T.SPHERE[0], T.SPHERE[0] + .04, T.SPHERE[1] - .035, T.SPHERE[1]], [0, 1, 1, 0]);
  const scale = useTransform(progress, [T.SPHERE[0], T.SPHERE[0] + .05, T.SPHERE[1] - .03, T.SPHERE[1]], [.15, 1, 1.04, 1.5]);
  const halo = useTransform(progress, [T.SPHERE[0] + .02, T.SPHERE[0] + .07, T.SPHERE[1]], [0, 1, 0]);
  return (
    <div className="ss-sphere-anchor" aria-hidden="true">
      <motion.div className="ss-sphere-halo" style={{ opacity: halo, scale }} />
      <motion.div className="ss-sphere" style={{ opacity, scale }}>
        <span className="ss-sphere-core" />
      </motion.div>
    </div>
  );
}

export default function FloatingCards({ progress, reduced }) {
  return (
    <div className="ss-cards-layer" aria-hidden="true">
      {cards.map((card, i) => <FloatingCard key={card.id} card={card} index={i} progress={progress} reduced={reduced} />)}
      <Sphere progress={progress} />
    </div>
  );
}

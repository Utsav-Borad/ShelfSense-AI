import { motion } from 'framer-motion';

// Shared entrances for everything below the hero, so the whole page moves with
// one rhythm instead of each block inventing its own.
export const EASE = [.16, 1, .3, 1];

// Text and headings: a quiet lift.
export default function Reveal({ children, delay = 0, y = 26, className = '', as = 'div', ...rest }) {
  const Tag = motion[as] || motion.div;
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: .25 }}
      transition={{ duration: .7, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

// Cards: they arrive rather than just fade — rising, settling out of a slight
// recess, with the light coming up on them as they land.
export const cardEntrance = {
  hidden: { opacity: 0, y: 44, scale: .95, rotateX: 6 },
  show: (delay = 0) => ({
    opacity: 1, y: 0, scale: 1, rotateX: 0,
    transition: { duration: .85, delay, ease: EASE },
  }),
};

// Explicit props rather than variants + custom: fewer moving parts, and the
// delay is read straight off the call site.
// NOTE: the card's CSS must NOT declare `transition: transform` — a CSS
// transition on transform fights this animation frame by frame and flattens
// it. Framer owns transform here; CSS owns colour. Hover lift is `whileHover`
// for the same reason.
export function RevealCard({ children, delay = 0, className = '', lift = -6, ...rest }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 46, scale: .94, rotateX: 7 }}
      whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
      whileHover={{ y: lift, transition: { duration: .3, ease: 'easeOut' } }}
      viewport={{ once: true, amount: .2 }}
      transition={{ duration: .85, delay, ease: EASE }}
      style={{ transformPerspective: 1000 }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function SectionHead({ eyebrow, title, lead, align = 'left' }) {
  return (
    <div className={`ss-head ss-head-${align}`}>
      <Reveal as="p" className="ss-eyebrow">{eyebrow}</Reveal>
      <Reveal as="h2" delay={.06}>{title}</Reveal>
      {lead && <Reveal as="p" className="ss-head-lead" delay={.12}>{lead}</Reveal>}
    </div>
  );
}

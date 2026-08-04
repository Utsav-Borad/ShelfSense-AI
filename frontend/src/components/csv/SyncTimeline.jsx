import { AnimatePresence, motion } from 'framer-motion';
import { SYNC_STAGES } from './constants';

const EASE = [.16, 1, .3, 1];

// Gold particles travelling along a connector, representing data moving from
// one stage to the next. Only rendered on the connector currently in flight.
//
// `left`/`top` are animated rather than `x`/`y`: a percentage in `x` is
// relative to the particle's own width (a few pixels), so it would barely move.
//
// Both axes are animated so this works in either orientation without knowing
// the breakpoint — the connector is 2px thin on its cross axis, so travel along
// that axis is invisible. Horizontal on desktop, vertical on mobile, one
// animation.
function Particles({ live }) {
  if (!live) return null;
  return (
    <span className="csv-flow-particles" aria-hidden="true">
      {[0, 1, 2].map((n) => (
        <motion.i
          key={n}
          initial={{ left: '0%', top: '0%', opacity: 0 }}
          animate={{ left: ['0%', '100%'], top: ['0%', '100%'], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.9, repeat: Infinity, ease: 'linear', delay: n * 0.63 }}
        />
      ))}
    </span>
  );
}

// One node. Its icon moves through three states — idle, processing, completed —
// and the swap between them is animated rather than instant.
function StageNode({ stage, state, index }) {
  const done = state === 'done' || state === 'settling';

  return (
    <div className={`csv-node is-${state}`}>
      <motion.span
        className="csv-node-ring"
        initial={false}
        animate={state === 'active'
          ? { scale: [1, 1.08, 1], opacity: [.55, .15, .55] }
          : { scale: 1, opacity: 0 }}
        transition={state === 'active' ? { duration: 2.1, repeat: Infinity, ease: 'easeInOut' } : { duration: .3 }}
        aria-hidden="true"
      />

      {/* The brief success pulse a stage plays as it hands over. */}
      <AnimatePresence>
        {state === 'settling' && (
          <motion.span
            className="csv-node-burst"
            initial={{ scale: .6, opacity: .7 }}
            animate={{ scale: 1.85, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: .7, ease: 'easeOut' }}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <motion.span
        className="csv-node-disc"
        initial={false}
        animate={{ scale: state === 'active' ? 1.06 : 1 }}
        transition={{ duration: .45, ease: EASE }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {done ? (
            <motion.i
              key="done"
              className="bi bi-check-lg"
              initial={{ scale: 0, rotate: -25, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: .42, ease: EASE }}
            />
          ) : (
            <motion.i
              key="idle"
              className={`bi ${stage.icon}`}
              initial={{ scale: .7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: .7, opacity: 0 }}
              transition={{ duration: .3, ease: EASE }}
            />
          )}
        </AnimatePresence>
      </motion.span>

      <span className="csv-node-text">
        <strong>{stage.label}</strong>
        <small>{stage.detail}</small>
      </span>
      <span className="visually-hidden">
        {state === 'done' || state === 'settling' ? 'completed' : state === 'active' ? 'in progress' : 'waiting'}
      </span>
      <span className="csv-node-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
    </div>
  );
}

export default function SyncTimeline({ activeIndex, phase, stageProgress }) {
  return (
    <ol className="csv-timeline">
      {SYNC_STAGES.map((stage, index) => {
        const state = phase === 'done' || index < activeIndex
          ? 'done'
          : index === activeIndex
            ? (phase === 'settling' ? 'settling' : 'active')
            : 'idle';

        // Connector between this stage and the next. `fill` is handed to CSS as
        // a custom property so the stylesheet can pick the axis — scaleX while
        // the timeline is horizontal, scaleY once it stacks on mobile.
        const fill = phase === 'done' || index < activeIndex ? 1 : index === activeIndex ? stageProgress : 0;
        const last = index === SYNC_STAGES.length - 1;

        return (
          <li key={stage.id} className="csv-timeline-item">
            <StageNode stage={stage} state={state} index={index} />
            {!last && (
              <span className="csv-connector" aria-hidden="true">
                <span className="csv-connector-track" />
                <span className="csv-connector-fill" style={{ '--fill': fill }} />
                <Particles live={fill > 0 && fill < 1} />
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}

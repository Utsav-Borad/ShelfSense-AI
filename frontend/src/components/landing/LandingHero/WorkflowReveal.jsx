import { motion, useTransform } from 'framer-motion';
import { T } from './timeline';

// Scene 7. The quote lifts away and the pipeline assembles stage by stage,
// with gold travelling along every connector.
const stages = [
  ['bi-cloud-arrow-up', 'CSV Upload', 'Your POS export'],
  ['bi-arrow-repeat', 'Synchronization', 'Validated, all or nothing'],
  ['bi-pie-chart', 'Analytics', 'Ten business metrics'],
  ['bi-cpu', 'AI Engine', 'Six prediction models'],
  ['bi-stars', 'Recommendations', 'With a reason attached'],
  ['bi-arrow-up-right-circle', 'Business Growth', 'Decisions you can defend'],
];

const [START, END] = T.WORKFLOW;
const SPAN = END - START;
const slot = (i) => [START + SPAN * (0.12 + i * 0.125), START + SPAN * (0.12 + i * 0.125) + SPAN * 0.16];

function Connector({ index, progress, reduced }) {
  const [a, b] = slot(index);
  const scale = useTransform(progress, [a + SPAN * .07, b + SPAN * .06], [0, 1]);
  return (
    <span className="ss-flow-link" aria-hidden="true">
      <motion.i className="ss-flow-line" style={{ scaleX: scale }} />
      {!reduced && [0, 1, 2].map((n) => (
        <motion.b key={n} className="ss-flow-spark" animate={{ x: ['0%', '100%'], opacity: [0, 1, 1, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'linear', delay: index * .28 + n * .8 }} />
      ))}
    </span>
  );
}

export default function WorkflowReveal({ progress, reduced }) {
  const headOpacity = useTransform(progress, [START, START + SPAN * .12], [0, 1]);
  const headY = useTransform(progress, [START, START + SPAN * .12], ['1.6rem', '0rem']);

  return (
    <div className="ss-flow-layer">
      <motion.div className="ss-flow-head" style={{ opacity: headOpacity, y: headY }}>
        <p className="ss-eyebrow">The path from data to decision</p>
        <h2>One quiet, connected flow.</h2>
      </motion.div>
      <div className="ss-flow">
        {stages.map(([icon, title, note], i) => {
          const [a, b] = slot(i);
          return (
            <Stage key={title} icon={icon} title={title} note={note} progress={progress} range={[a, b]} last={i === stages.length - 1} index={i} reduced={reduced} />
          );
        })}
      </div>
    </div>
  );
}

function Stage({ icon, title, note, progress, range, last, index, reduced }) {
  const opacity = useTransform(progress, range, [0, 1]);
  const y = useTransform(progress, range, ['2rem', '0rem']);
  const scale = useTransform(progress, range, [.86, 1]);
  return (
    <motion.div className={`ss-flow-stage${last ? ' is-final' : ''}`} style={{ opacity, y }}>
      <motion.span className="ss-flow-node" style={{ scale }}><i className={`bi ${icon}`} /></motion.span>
      <strong>{title}</strong>
      <small>{note}</small>
      {!last && <Connector index={index} progress={progress} reduced={reduced} />}
    </motion.div>
  );
}

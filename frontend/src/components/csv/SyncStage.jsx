import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SyncTimeline from './SyncTimeline';
import { REPORT_TYPES, SYNC_STAGES, TOTAL_SYNC_MS, deriveSync, statusMessage } from './constants';

const EASE = [.16, 1, .3, 1];

// The whole run is driven by one elapsed clock, ticked on animation frames.
// Every part of the view derives from it, so nothing can drift out of step and
// progress moves continuously instead of jumping between stages.
export default function SyncStage({ files, onComplete }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    let frame;
    let start = null;
    const tick = (now) => {
      if (start === null) start = now;
      const next = now - start;
      setElapsed(next);
      if (next < TOTAL_SYNC_MS) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const { index, phase, stageProgress } = deriveSync(elapsed);
  const overall = Math.min(elapsed / TOTAL_SYNC_MS, 1);
  const remaining = Math.max(Math.ceil((TOTAL_SYNC_MS - elapsed) / 1000), 0);
  const fileNames = REPORT_TYPES.map((report) => files[report.id]?.name);
  const message = statusMessage(index, stageProgress, fileNames);
  const finished = phase === 'done';

  // Hand off once the run is over, after the final stage has had a moment.
  useEffect(() => {
    if (!finished) return undefined;
    const timer = setTimeout(onComplete, 1500);
    return () => clearTimeout(timer);
  }, [finished, onComplete]);

  return (
    <div className="csv-stage csv-sync">
      <div className="csv-sync-head">
        <div>
          <span className="csv-sync-eyebrow">
            <motion.i
              className="bi bi-arrow-repeat"
              animate={finished ? { rotate: 0 } : { rotate: 360 }}
              transition={finished ? { duration: .4 } : { duration: 2.4, repeat: Infinity, ease: 'linear' }}
              aria-hidden="true"
            />
            {finished ? 'Synchronization complete' : 'Synchronizing'}
          </span>
          <h2>{finished ? 'Business Intelligence Ready.' : SYNC_STAGES[index].label}</h2>
        </div>
        <div className="csv-eta" aria-live="polite">
          {finished ? <span className="csv-eta-done"><i className="bi bi-check-lg" aria-hidden="true" />Done</span> : <><strong>~{remaining}s</strong><small>remaining</small></>}
        </div>
      </div>

      <div className="csv-progress" role="progressbar" aria-valuenow={Math.round(overall * 100)} aria-valuemin={0} aria-valuemax={100} aria-label="Synchronization progress">
        <motion.span className="csv-progress-fill" initial={false} animate={{ width: `${overall * 100}%` }} transition={{ duration: .2, ease: 'linear' }} />
      </div>

      <div className="csv-status" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={message}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: .28, ease: EASE }}
          >
            {!finished && <span className="csv-status-dot" aria-hidden="true" />}
            {message}
          </motion.p>
        </AnimatePresence>
        <span className="csv-status-pct">{Math.round(overall * 100)}%</span>
      </div>

      <SyncTimeline activeIndex={index} phase={phase} stageProgress={stageProgress} />

      <p className="csv-note">
        <i className="bi bi-shield-check" aria-hidden="true" />
        Analytics and AI only run once the database transaction has committed. Nothing is half-written.
      </p>
    </div>
  );
}

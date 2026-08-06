import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SyncTimeline from './SyncTimeline';
import { uploadCsv } from '../../services/uploadService';
import { REPORT_TYPES, SYNC_STAGES, TOTAL_SYNC_MS, UPLOAD_ORDER, deriveSync, statusMessage } from './constants';

const EASE = [.16, 1, .3, 1];

// The whole run is driven by one elapsed clock, ticked on animation frames.
// Every part of the view derives from it, so nothing can drift out of step and
// progress moves continuously instead of jumping between stages.
export default function SyncStage({ files, onComplete, onResults }) {
  const [elapsed, setElapsed] = useState(0);
  const [failed, setFailed] = useState('');
  // Read inside the animation frame, which cannot see the state value.
  const failedRef = useRef(false);
  // React.StrictMode runs every effect twice in development. Without this the
  // whole upload sequence would run twice at once, and two concurrent writes
  // deadlock SQLite ("database is locked"), failing one of them.
  const startedRef = useRef(false);

  // The real work: each selected file is posted to its own upload endpoint.
  // The animation above runs on its own clock; this decides the outcome.
  useEffect(() => {
    if (startedRef.current) return undefined;
    startedRef.current = true;

    async function send() {
      const results = [];
      try {
        // Sent one at a time, in dependency order — never in parallel.
        for (const type of UPLOAD_ORDER) {
          const entry = files[type];
          if (!entry || !entry.file) continue;
          const response = await uploadCsv(type, entry.file);
          results.push({ id: type, name: entry.name, ...response.data });
        }
        onResults?.(results);
      } catch (error) {
        failedRef.current = true;
        setFailed(error.detail || 'That file could not be imported.');
      }
    }

    send();
    return undefined;
  }, [files, onResults]);

  useEffect(() => {
    let frame;
    let start = null;
    const tick = (now) => {
      // Stop advancing on failure so the stages do not tick past the point the
      // import actually reached.
      if (failedRef.current) return;
      if (start === null) start = now;
      const next = now - start;
      setElapsed(next);
      if (next < TOTAL_SYNC_MS) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const clock = deriveSync(elapsed);
  // On failure the timeline freezes where it stands instead of running on to
  // "Business Intelligence Ready" — the screen must not claim a success the
  // server never gave us.
  const index = clock.index;
  const phase = failed ? 'error' : clock.phase;
  const stageProgress = clock.stageProgress;
  const overall = Math.min(elapsed / TOTAL_SYNC_MS, 1);
  const remaining = Math.max(Math.ceil((TOTAL_SYNC_MS - elapsed) / 1000), 0);
  const fileNames = REPORT_TYPES.map((report) => files[report.id]?.name);
  const message = failed ? failed : statusMessage(index, stageProgress, fileNames);
  const finished = !failed && clock.phase === 'done';

  // Hand off once the run is over, after the final stage has had a moment.
  useEffect(() => {
    if (!finished || failed) return undefined;
    const timer = setTimeout(onComplete, 1500);
    return () => clearTimeout(timer);
  }, [finished, failed, onComplete]);

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
            {failed ? 'Synchronization failed' : finished ? 'Synchronization complete' : 'Synchronizing'}
          </span>
          <h2>{failed ? 'Nothing was imported.' : finished ? 'Business Intelligence Ready.' : SYNC_STAGES[index].label}</h2>
        </div>
        <div className="csv-eta" aria-live="polite">
          {failed
            ? <span className="csv-eta-failed"><i className="bi bi-x-lg" aria-hidden="true" />Failed</span>
            : finished
              ? <span className="csv-eta-done"><i className="bi bi-check-lg" aria-hidden="true" />Done</span>
              : <><strong>~{remaining}s</strong><small>remaining</small></>}
        </div>
      </div>

      <div className={`csv-progress${failed ? ' is-failed' : ''}`} role="progressbar" aria-valuenow={Math.round(overall * 100)} aria-valuemin={0} aria-valuemax={100} aria-label="Synchronization progress">
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
            {!finished && !failed && <span className="csv-status-dot" aria-hidden="true" />}
            {message}
          </motion.p>
        </AnimatePresence>
        <span className="csv-status-pct">{Math.round(overall * 100)}%</span>
      </div>

      <SyncTimeline activeIndex={index} phase={phase} stageProgress={stageProgress} />

      {failed ? (
        <p className="csv-note is-error" role="alert">
          <i className="bi bi-exclamation-triangle" aria-hidden="true" />
          {failed}
        </p>
      ) : (
        <p className="csv-note">
          <i className="bi bi-shield-check" aria-hidden="true" />
          Analytics and AI only run once the database transaction has committed. Nothing is half-written.
        </p>
      )}
    </div>
  );
}

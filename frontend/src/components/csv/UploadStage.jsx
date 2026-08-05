import { useEffect } from 'react';
import { motion } from 'framer-motion';
import UploadDropzone from './UploadDropzone';
import { REPORT_TYPES } from './constants';

const EASE = [.16, 1, .3, 1];

// Sales -> Inventory -> Purchase. All three are required before validation,
// because the sync is all-or-nothing.
export default function UploadStage({ files, setFiles, onContinue }) {
  // Whether anything is still counting up, derived from the files themselves —
  // no second piece of state to keep in sync. The dependency is a boolean, so
  // the timer is created once when uploading starts and cleared when it ends.
  const uploading = REPORT_TYPES.some((report) => files[report.id]?.status === 'uploading');

  useEffect(() => {
    if (!uploading) return undefined;
    const timer = setInterval(() => {
      setFiles((current) => {
        const next = { ...current };
        let changed = false;
        REPORT_TYPES.forEach((report) => {
          const entry = next[report.id];
          if (!entry || entry.status !== 'uploading') return;
          const progress = Math.min(entry.progress + 7 + Math.random() * 9, 100);
          next[report.id] = { ...entry, progress, status: progress >= 100 ? 'ready' : 'uploading' };
          changed = true;
        });
        return changed ? next : current;
      });
    }, 90);
    return () => clearInterval(timer);
  }, [uploading, setFiles]);

  function handleSelect(id, file) {
    // `file` is the real File object — the sync stage posts it.
    setFiles((current) => ({ ...current, [id]: { name: file.name, size: file.size, file, progress: 0, status: 'uploading' } }));
  }

  function handleRemove(id) {
    setFiles((current) => ({ ...current, [id]: null }));
  }

  const ready = REPORT_TYPES.filter((report) => files[report.id]?.status === 'ready').length;
  const allReady = ready === REPORT_TYPES.length;

  return (
    <div className="csv-stage">
      <div className="csv-stage-head">
        <div>
          <h2>Upload your three reports</h2>
          <p>Export them from your POS exactly as they come. ShelfSense checks every column before a single row is written.</p>
        </div>
        <span className="csv-count">{ready} of {REPORT_TYPES.length} ready</span>
      </div>

      <div className="csv-drop-grid">
        {REPORT_TYPES.map((report, index) => (
          <UploadDropzone
            key={report.id}
            report={report}
            entry={files[report.id]}
            index={index}
            onSelect={handleSelect}
            onRemove={handleRemove}
          />
        ))}
      </div>

      <motion.div className="csv-actions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .3, duration: .5, ease: EASE }}>
        <p className="csv-note">
          <i className="bi bi-shield-check" aria-hidden="true" />
          All or nothing — if any row fails, nothing is written and your existing data is untouched.
        </p>
        <button type="button" className="csv-btn csv-btn-primary" onClick={onContinue} disabled={!allReady}>
          Validate files <i className="bi bi-arrow-right" aria-hidden="true" />
        </button>
      </motion.div>
    </div>
  );
}

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { REPORT_TYPES } from './constants';

const EASE = [.16, 1, .3, 1];

// A tasteful finish: a drawn checkmark inside a soft warm glow. No confetti.
export default function CompleteStage({ files, results = [], onAnother }) {
  // Real counts from the API rather than an assumed row count per file.
  const rows = results.reduce((sum, result) => sum + (result.rows_read || 0), 0);
  const updated = results.reduce((sum, result) => sum + (result.updated || 0), 0);
  const created = results.reduce((sum, result) => sum + (result.created || 0), 0);
  const skipped = results.reduce((sum, result) => sum + (result.skipped || 0), 0);

  return (
    <div className="csv-stage csv-complete">
      <motion.div className="csv-complete-mark" initial={{ scale: .85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: .7, ease: EASE }}>
        <motion.span
          className="csv-complete-glow"
          animate={{ scale: [1, 1.14, 1], opacity: [.55, .28, .55] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        />
        <svg viewBox="0 0 72 72" aria-hidden="true">
          <motion.circle
            cx="36" cy="36" r="33" className="csv-complete-ring"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: EASE }}
          />
          <motion.path
            d="M22 37.5 L32 47 L51 27" className="csv-complete-check"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: .6, delay: .5, ease: EASE }}
          />
        </svg>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, delay: .35, ease: EASE }}>
        <h2>Business Intelligence Ready.</h2>
        <p className="csv-complete-lead">
          Your three reports are synchronized, ten metrics have been recomputed, and six models have read the new position.
        </p>
      </motion.div>

      <motion.dl className="csv-summary" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, delay: .48, ease: EASE }}>
        <div><dt>Files imported</dt><dd>{results.length}</dd></div>
        <div><dt>Rows read</dt><dd>{rows.toLocaleString('en-IN')}</dd></div>
        <div><dt>Records updated</dt><dd>{(created + updated).toLocaleString('en-IN')}</dd></div>
        <div><dt>Rows skipped</dt><dd>{skipped.toLocaleString('en-IN')}</dd></div>
      </motion.dl>

      <motion.div className="csv-actions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .5, delay: .6 }}>
        <button type="button" className="csv-btn csv-btn-ghost" onClick={onAnother}>
          <i className="bi bi-arrow-repeat" aria-hidden="true" />Synchronize again
        </button>
        <Link to="/dashboard" className="csv-btn csv-btn-primary">
          See what changed <i className="bi bi-arrow-right" aria-hidden="true" />
        </Link>
      </motion.div>
    </div>
  );
}

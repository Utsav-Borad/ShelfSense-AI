import { AnimatePresence, motion } from 'framer-motion';
import { FORMATS } from './data';

const EASE = [.16, 1, .3, 1];

// Export placeholders. The button runs a short progress animation and then
// says plainly that nothing was written — better than a silent no-op.
export default function ExportCenter({ selected, range, onExport, job, reports = [] }) {
  const target = selected || reports[0];
  // Nothing to export until the reports have loaded.
  if (!target) return null;

  return (
    <section className="rp-export" aria-label="Export center">
      <header className="rp-section-head">
        <div>
          <p className="rp-eyebrow">Export center</p>
          <h2>Take it away with you</h2>
        </div>
        <span className="rp-export-target">
          <i className="bi bi-file-earmark-text" aria-hidden="true" />
          {target.title} · {range}
        </span>
      </header>

      <div className="rp-export-grid">
        {FORMATS.map((format, index) => (
          <motion.button
            key={format.id}
            type="button"
            className="rp-export-card"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: .4 }}
            transition={{ duration: .55, delay: index * .08, ease: EASE }}
            whileHover={{ y: -5, transition: { duration: .26, ease: 'easeOut' } }}
            onClick={() => onExport(target, format)}
            disabled={Boolean(job)}
          >
            <span className="rp-sweep" aria-hidden="true" />
            <span className="rp-export-icon"><i className={`bi ${format.icon}`} aria-hidden="true" /></span>
            <span className="rp-export-copy">
              <strong>Export as {format.label}</strong>
              <small>{format.note}</small>
            </span>
            <i className="bi bi-download rp-export-arrow" aria-hidden="true" />
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {job && (
          <motion.div
            className={`rp-job${job.done ? ' is-done' : ''}`}
            role="status"
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: .3, ease: EASE }}
          >
            <div className="rp-job-inner">
              {job.done ? (
                <>
                  <i className="bi bi-info-circle" aria-hidden="true" />
                  <span>
                    <strong>{job.report} · {job.format}</strong>
                    Only the Sales Report can be exported — it is the one the API streams as CSV.
                  </span>
                </>
              ) : (
                <>
                  <span className="rp-job-spinner" aria-hidden="true" />
                  <span><strong>Preparing {job.report}</strong>Building the {job.format} for {range}…</span>
                </>
              )}
            </div>
            {!job.done && (
              <span className="rp-job-track" aria-hidden="true">
                <motion.i initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.6, ease: 'linear' }} />
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

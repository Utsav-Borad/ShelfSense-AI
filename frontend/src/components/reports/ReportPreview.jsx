import { AnimatePresence, motion } from 'framer-motion';
import EmptyState from '../ui/EmptyState';
import { FORMATS } from './data';

const EASE = [.16, 1, .3, 1];

// Slides in beside the report categories once one is chosen. A representative
// first page rather than the whole document — enough to know it is the right
// report before exporting it.
export default function ReportPreview({ report, range, onExport, onClose }) {
  return (
    <div className="rp-preview-shell">
      <AnimatePresence mode="wait" initial={false}>
        {report ? (
          <motion.section
            key={report.id}
            className="rp-preview"
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: .38, ease: EASE }}
            aria-label={`${report.title} preview`}
          >
            <header className="rp-preview-head">
              <div>
                <p className="rp-eyebrow">Report preview</p>
                <h3>{report.title}</h3>
                <small>{range} · {report.pages} pages</small>
              </div>
              <button type="button" className="rp-preview-close" onClick={onClose} aria-label="Close preview">
                <i className="bi bi-x-lg" aria-hidden="true" />
              </button>
            </header>

            {/* The mock document page. */}
            <div className="rp-page">
              <div className="rp-page-head">
                <span className="rp-page-brand"><i className="bi bi-layers-fill" aria-hidden="true" />ShelfSense AI</span>
                <span className="rp-page-range">{range}</span>
              </div>

              <h4>{report.title}</h4>

              <div className="rp-page-headline">
                {report.headline.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: .4, delay: .12 + index * .07, ease: EASE }}
                  >
                    <small>{item.label}</small>
                    <strong>{item.value}</strong>
                  </motion.div>
                ))}
              </div>

              <table className="rp-page-table">
                <thead>
                  <tr>{report.columns.map((column) => <th key={column}>{column}</th>)}</tr>
                </thead>
                <tbody>
                  {report.rows.map((row, index) => (
                    <motion.tr
                      key={row[0]}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: .3, delay: .3 + index * .05 }}
                    >
                      {row.map((cell, cellIndex) => <td key={cellIndex} className={cellIndex ? 'is-numeric' : ''}>{cell}</td>)}
                    </motion.tr>
                  ))}
                </tbody>
              </table>

              <p className="rp-page-more">…and {report.pages - 1} more pages</p>
            </div>

            <section className="rp-sections">
              <h5>Included in this report</h5>
              <ul>
                {report.sections.map((section, index) => (
                  <motion.li
                    key={section}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: .35, delay: .4 + index * .05, ease: EASE }}
                  >
                    <i className="bi bi-check-lg" aria-hidden="true" />{section}
                  </motion.li>
                ))}
              </ul>
            </section>

            <footer className="rp-preview-foot">
              <span>Export this report</span>
              <div className="rp-format-row">
                {FORMATS.map((format) => (
                  <button key={format.id} type="button" className="rp-format" onClick={() => onExport(report, format)}>
                    <i className={`bi ${format.icon}`} aria-hidden="true" />{format.label}
                  </button>
                ))}
              </div>
            </footer>
          </motion.section>
        ) : (
          <motion.div
            key="empty"
            className="rp-preview is-empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: .3 }}
          >
            <EmptyState
              icon="bi-file-earmark-text"
              title="Choose a report to preview"
              description="Select any report on the left and its first page appears here before you export it."
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

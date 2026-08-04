import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RANGES } from './data';

const EASE = [.16, 1, .3, 1];

export default function TimeRange({ range, onRange }) {
  const [exportOpen, setExportOpen] = useState(false);

  return (
    <div className="an-controls">
      <div className="an-range" role="group" aria-label="Time range">
        {RANGES.map((option) => (
          <button
            key={option.id}
            type="button"
            className={range === option.id ? 'is-active' : ''}
            onClick={() => onRange(option.id)}
            aria-pressed={range === option.id}
          >
            {range === option.id && <motion.span className="an-range-pill" layoutId="an-range-pill" transition={{ duration: .32, ease: EASE }} />}
            <span>{option.label}</span>
          </button>
        ))}
      </div>

      <div className="an-export-wrap">
        <button type="button" className="an-export" onClick={() => setExportOpen(!exportOpen)} aria-expanded={exportOpen}>
          <i className="bi bi-download" aria-hidden="true" />Export
        </button>
        <AnimatePresence>
          {exportOpen && (
            <motion.div
              className="an-export-menu"
              initial={{ opacity: 0, y: -8, scale: .97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: .97 }}
              transition={{ duration: .24, ease: EASE }}
            >
              <p>Export this view</p>
              <button type="button" disabled><i className="bi bi-filetype-csv" aria-hidden="true" />CSV</button>
              <button type="button" disabled><i className="bi bi-filetype-pdf" aria-hidden="true" />PDF</button>
              <small><i className="bi bi-info-circle" aria-hidden="true" />Placeholder — export arrives with the reports endpoint.</small>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { formatBytes } from './constants';

const EASE = [.16, 1, .3, 1];

// One drag-and-drop card per report type. It reads name/size/type only —
// nothing is parsed here.
export default function UploadDropzone({ report, entry, onSelect, onRemove, index }) {
  const [dragging, setDragging] = useState(false);
  const [rejected, setRejected] = useState('');
  const inputId = `csv-input-${report.id}`;

  function accept(fileList) {
    const file = fileList && fileList[0];
    if (!file) return;
    const isCsv = file.name.toLowerCase().endsWith('.csv') || file.type === 'text/csv';
    if (!isCsv) { setRejected('That is not a .csv file. Export the report from your POS and try again.'); return; }
    setRejected('');
    onSelect(report.id, file);
  }

  function handleDrop(event) {
    event.preventDefault();
    setDragging(false);
    accept(event.dataTransfer.files);
  }

  const state = entry?.status || 'empty';

  return (
    <motion.div
      className={`csv-drop${dragging ? ' is-dragging' : ''}${state === 'ready' ? ' is-ready' : ''}${rejected ? ' is-rejected' : ''}`}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .6, delay: index * .08, ease: EASE }}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <div className="csv-drop-head">
        <span className="csv-drop-icon"><i className={`bi ${report.icon}`} aria-hidden="true" /></span>
        <div>
          <strong>{report.label}</strong>
          <small>{report.hint}</small>
        </div>
        {state === 'ready' && (
          <motion.span className="csv-drop-tick" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: .4, ease: EASE }} aria-hidden="true">
            <i className="bi bi-check-lg" />
          </motion.span>
        )}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {!entry ? (
          <motion.div key="empty" className="csv-drop-body" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .22 }}>
            <i className="bi bi-cloud-arrow-up csv-drop-cloud" aria-hidden="true" />
            <p>Drag your file here, or <label htmlFor={inputId} className="csv-drop-browse" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); document.getElementById(inputId).click(); } }}>browse</label></p>
            <span className="csv-drop-expect">Expects <code>{report.file}</code></span>
            <input id={inputId} type="file" accept=".csv,text/csv" className="visually-hidden" onChange={(e) => accept(e.target.files)} />
          </motion.div>
        ) : (
          <motion.div key="file" className="csv-file" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .3, ease: EASE }}>
            <i className="bi bi-filetype-csv" aria-hidden="true" />
            <div className="csv-file-meta">
              <strong title={entry.name}>{entry.name}</strong>
              <small>{formatBytes(entry.size)} · {state === 'uploading' ? `${Math.round(entry.progress)}%` : 'Ready to validate'}</small>
              <span className="csv-file-bar" aria-hidden="true">
                <motion.i initial={false} animate={{ width: `${entry.progress}%` }} transition={{ duration: .25, ease: 'linear' }} />
              </span>
            </div>
            <button type="button" className="csv-file-remove" onClick={() => onRemove(report.id)} aria-label={`Remove ${entry.name}`}>
              <i className="bi bi-x-lg" aria-hidden="true" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {rejected && <p className="csv-drop-error" role="alert"><i className="bi bi-exclamation-circle" aria-hidden="true" />{rejected}</p>}
    </motion.div>
  );
}

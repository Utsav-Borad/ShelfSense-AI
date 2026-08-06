import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { REPORT_TYPES, validateFile } from './constants';

const EASE = [.16, 1, .3, 1];
const TONE_ICON = { success: 'bi-check-circle-fill', warning: 'bi-exclamation-triangle-fill', error: 'bi-x-circle-fill' };
const TONE_TEXT = { success: 'Passed', warning: 'Passed with notes', error: 'Failed' };

// The validate step. validateFile() reads each file and checks it against the
// columns and cell types the server requires, so a file that would be rejected
// during synchronization is stopped here instead — nothing is uploaded until
// all three reports pass.
export default function ValidationStage({ files, onBack, onSynchronize }) {
  const [checking, setChecking] = useState(true);
  const [results, setResults] = useState({});

  // Check the three reports one after another so the panel fills in visibly
  // rather than appearing complete all at once.
  useEffect(() => {
    setChecking(true);
    setResults({});
    let active = true;
    const timers = REPORT_TYPES.map((report, index) => setTimeout(async () => {
      const result = await validateFile(report.id, files[report.id]);
      if (!active) return;
      setResults((current) => ({ ...current, [report.id]: result }));
      if (index === REPORT_TYPES.length - 1) setChecking(false);
    }, 700 + index * 650));

    return () => {
      active = false;
      timers.forEach(clearTimeout);
    };
  }, [files]);

  const done = Object.values(results);
  const blocked = done.some((result) => !result.valid);
  const totalRows = done.reduce((sum, result) => sum + result.source_rows, 0);
  const acceptedRows = done.reduce((sum, result) => sum + result.accepted_rows, 0);

  return (
    <div className="csv-stage">
      <div className="csv-stage-head">
        <div>
          <h2>{checking ? 'Checking your files' : blocked ? 'We found a problem' : 'Everything checks out'}</h2>
          <p>
            {checking
              ? 'Columns, data types, dates, negative values and duplicate rows.'
              : blocked
                ? 'Nothing has been written. Correct the file and upload it again — your existing data is untouched.'
                : `${acceptedRows} of ${totalRows} rows are ready to synchronize.`}
          </p>
        </div>
        {!checking && (
          <span className={`csv-verdict tone-${blocked ? 'error' : 'success'}`}>
            <i className={`bi ${blocked ? 'bi-x-circle' : 'bi-check-circle'}`} aria-hidden="true" />
            {blocked ? 'Blocked' : 'Ready'}
          </span>
        )}
      </div>

      <div className="csv-validate-list">
        {REPORT_TYPES.map((report, index) => {
          const result = results[report.id];
          return (
            <motion.article
              key={report.id}
              className={`csv-validate-row${result ? ` tone-${result.level}` : ' is-pending'}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: .5, delay: index * .06, ease: EASE }}
            >
              <span className="csv-validate-icon">
                <AnimatePresence mode="wait" initial={false}>
                  {result ? (
                    <motion.i key="done" className={`bi ${TONE_ICON[result.level]}`} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: .35, ease: EASE }} />
                  ) : (
                    <motion.span key="spin" className="csv-mini-spinner" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
                  )}
                </AnimatePresence>
              </span>

              <div className="csv-validate-main">
                <div className="csv-validate-title">
                  <strong>{report.label}</strong>
                  <code>{files[report.id]?.name}</code>
                </div>

                {!result && <small className="csv-validate-status">Checking file structure…</small>}

                {result && (
                  <>
                    <small className="csv-validate-status">
                      {result.valid
                        ? `${result.accepted_rows} of ${result.source_rows} rows accepted`
                        : `0 of ${result.source_rows} rows accepted — nothing was written`}
                    </small>
                    {result.errors?.map((issue) => (
                      <p className="csv-issue tone-error" key={issue.code}>
                        <code>{issue.code}</code> {issue.message} <span>column <code>{issue.column}</code> · row{issue.rows.length > 1 ? 's' : ''} {issue.rows.join(', ')}</span>
                      </p>
                    ))}
                    {result.warnings?.map((issue) => (
                      <p className="csv-issue tone-warning" key={issue.code}>
                        <code>{issue.code}</code> {issue.message} <span>column <code>{issue.column}</code> · row{issue.rows.length > 1 ? 's' : ''} {issue.rows.join(', ')}</span>
                      </p>
                    ))}
                  </>
                )}
              </div>

              {result && <span className={`csv-validate-tag tone-${result.level}`}>{TONE_TEXT[result.level]}</span>}
            </motion.article>
          );
        })}
      </div>

      <div className="csv-actions">
        <button type="button" className="csv-btn csv-btn-ghost" onClick={onBack}>
          <i className="bi bi-arrow-left" aria-hidden="true" />{blocked ? 'Replace files' : 'Back'}
        </button>
        <button type="button" className="csv-btn csv-btn-primary" onClick={onSynchronize} disabled={checking || blocked}>
          {checking ? 'Checking…' : 'Synchronize now'} <i className="bi bi-arrow-right" aria-hidden="true" />
        </button>
      </div>

      <p className="csv-demo-note">
        <i className="bi bi-info-circle" aria-hidden="true" />
        Every file is read and checked here before anything is sent. The server checks it again on arrival, and imports each file in one transaction — all rows, or none.
      </p>
    </div>
  );
}

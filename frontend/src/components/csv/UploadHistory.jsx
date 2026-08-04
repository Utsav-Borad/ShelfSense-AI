import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Table from '../ui/Table';
import Badge from '../ui/Badge';
import EmptyState from '../ui/EmptyState';
import { HISTORY_ROWS, REPORT_TYPES } from './constants';

const EASE = [.16, 1, .3, 1];
const FILTERS = [['all', 'All'], ['success', 'Successful'], ['warning', 'With notes'], ['failed', 'Failed']];
const TONE = { success: 'success', warning: 'warning', failed: 'danger' };
const LABEL = { success: 'Synchronized', warning: 'Synchronized with notes', failed: 'Failed' };

const typeLabel = (id) => REPORT_TYPES.find((report) => report.id === id)?.label.replace(' report', '').replace(' snapshot', '').replace(' history', '') || id;

export default function UploadHistory() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState('all');
  const [retrying, setRetrying] = useState('');

  // Placeholder fetch, so the skeleton state is real rather than decorative.
  useEffect(() => {
    const timer = setTimeout(() => { setRows(HISTORY_ROWS); setLoading(false); }, 1100);
    return () => clearTimeout(timer);
  }, []);

  // Retrying a failed run flips it to successful after a short delay.
  function handleRetry(id) {
    setRetrying(id);
    setTimeout(() => {
      setRows((current) => current.map((row) => (
        row.id === id ? { ...row, status: 'success', accepted: row.rows, duration: '22s', reason: undefined } : row
      )));
      setRetrying('');
    }, 1900);
  }

  const visible = filter === 'all' ? rows : rows.filter((row) => row.status === filter);

  return (
    <section className="csv-history">
      <div className="csv-stage-head">
        <div>
          <h2>Recent synchronizations</h2>
          <p>Every run, what it accepted, and why it stopped if it did.</p>
        </div>
        <div className="csv-filters" role="group" aria-label="Filter synchronizations">
          {FILTERS.map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={filter === value ? 'is-active' : ''}
              onClick={() => setFilter(value)}
              aria-pressed={filter === value}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="csv-skeletons" aria-busy="true" aria-label="Loading synchronization history">
          {[0, 1, 2, 3, 4].map((n) => <span className="csv-skeleton-row" key={n} />)}
        </div>
      )}

      {!loading && visible.length === 0 && (
        <EmptyState
          icon="bi-clock-history"
          title="Nothing to show here"
          description={filter === 'all' ? 'Your first synchronization will appear here.' : 'No runs match this filter yet.'}
        />
      )}

      {!loading && visible.length > 0 && (
        <Table columns={['Run', 'When', 'Reports', 'Rows accepted', 'Duration', 'Status', '']}>
          <AnimatePresence initial={false}>
            {visible.map((row, index) => (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: .35, delay: index * .04, ease: EASE }}
              >
                <td><code className="csv-run-id">{row.id}</code></td>
                <td className="csv-nowrap">{row.date}</td>
                <td>
                  <span className="csv-type-tags">
                    {row.types.map((type) => <em key={type}>{typeLabel(type)}</em>)}
                  </span>
                </td>
                <td>
                  {row.accepted} / {row.rows}
                  {row.reason && <small className="csv-row-reason">{row.reason}</small>}
                </td>
                <td className="csv-nowrap">{row.duration}</td>
                <td><Badge variant={TONE[row.status]}>{LABEL[row.status]}</Badge></td>
                <td className="csv-row-action">
                  {row.status === 'failed' && (
                    <button type="button" className="csv-retry" onClick={() => handleRetry(row.id)} disabled={retrying === row.id}>
                      {retrying === row.id
                        ? <><span className="csv-mini-spinner" aria-hidden="true" />Retrying…</>
                        : <><i className="bi bi-arrow-clockwise" aria-hidden="true" />Retry</>}
                    </button>
                  )}
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </Table>
      )}
    </section>
  );
}

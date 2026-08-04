import { motion } from 'framer-motion';
import Table from '../ui/Table';
import Badge from '../ui/Badge';
import EmptyState from '../ui/EmptyState';
import { FORMATS } from './data';

const EASE = [.16, 1, .3, 1];
const TONE = { pdf: 'danger', excel: 'success', csv: 'neutral' };
const iconFor = (id) => FORMATS.find((format) => format.id === id)?.icon || 'bi-file-earmark';

export default function ReportHistory({ rows, loading }) {
  if (loading) {
    return (
      <section className="rp-panel" aria-label="Report history">
        <header className="rp-section-head">
          <div><p className="rp-eyebrow">Report history</p><h2>Recently generated</h2></div>
        </header>
        <div className="rp-skeletons" aria-busy="true" aria-label="Loading report history">
          {[0, 1, 2, 3, 4].map((n) => <span className="rp-sk-row" key={n} />)}
        </div>
      </section>
    );
  }

  return (
    <section className="rp-panel" aria-label="Report history">
      <header className="rp-section-head">
        <div>
          <p className="rp-eyebrow">Report history</p>
          <h2>Recently generated</h2>
        </div>
        <span className="rp-count">{rows.length} reports</span>
      </header>

      {rows.length === 0 ? (
        <EmptyState icon="bi-clock-history" title="No reports yet" description="Reports you generate will be listed here with their format and range." />
      ) : (
        <Table columns={['Reference', 'Report', 'Range', 'Format', 'Size', 'Generated', '']}>
          {rows.map((row, index) => (
            <motion.tr
              key={row.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: .35, delay: index * .04, ease: EASE }}
            >
              <td><code className="rp-ref">{row.id}</code></td>
              <td className="rp-strong">{row.report}</td>
              <td className="rp-muted">{row.range}</td>
              <td>
                <span className="rp-format-tag">
                  <i className={`bi ${iconFor(row.format)}`} aria-hidden="true" />
                  <Badge variant={TONE[row.format]}>{row.format.toUpperCase()}</Badge>
                </span>
              </td>
              <td className="rp-muted rp-nowrap">{row.size}</td>
              <td className="rp-muted rp-nowrap">{row.when}</td>
              <td className="rp-row-action">
                <button type="button" title="Download (placeholder)" aria-label={`Download ${row.report}`}>
                  <i className="bi bi-download" aria-hidden="true" />
                </button>
              </td>
            </motion.tr>
          ))}
        </Table>
      )}
    </section>
  );
}

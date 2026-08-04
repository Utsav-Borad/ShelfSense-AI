import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import EmptyState from '../../components/ui/EmptyState';
import {
  DATE_RANGES, ExecutiveSummary, ExportCenter, HISTORY, REPORTS,
  ReportCard, ReportHistory, ReportPreview,
} from '../../components/reports';
import '../../styles/reports.css';

const EASE = [.16, 1, .3, 1];

function CardSkeleton() {
  return (
    <div className="rp-card-grid" aria-busy="true" aria-label="Loading reports">
      {[0, 1, 2, 3].map((n) => <span className="rp-sk-card" key={n} />)}
    </div>
  );
}

export default function ReportsPage() {
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [range, setRange] = useState('month');
  const [selected, setSelected] = useState(null);
  const [job, setJob] = useState(null);

  // Placeholder settle once the summary has finished.
  useEffect(() => {
    if (!ready) return undefined;
    const timer = setTimeout(() => setLoading(false), 750);
    return () => clearTimeout(timer);
  }, [ready]);

  // Export runs a short progress bar, then reports honestly that it is a
  // placeholder rather than pretending a file appeared.
  useEffect(() => {
    if (!job || job.done) return undefined;
    const timer = setTimeout(() => setJob((current) => (current ? { ...current, done: true } : null)), 1700);
    return () => clearTimeout(timer);
  }, [job]);

  useEffect(() => {
    if (!job?.done) return undefined;
    const timer = setTimeout(() => setJob(null), 5200);
    return () => clearTimeout(timer);
  }, [job]);

  const rangeLabel = DATE_RANGES.find((option) => option.id === range)?.label || 'This month';
  const term = query.trim().toLowerCase();
  const visible = REPORTS.filter((report) => (
    !term || [report.title, report.summary, ...report.sections].some((field) => field.toLowerCase().includes(term))
  ));

  function handleExport(report, format) {
    setJob({ report: report.title, format: format.label, done: false });
    document.getElementById('rp-export')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  return (
    <div className="rp">
      <ExecutiveSummary onReady={() => setReady(true)} />

      <AnimatePresence>
        {ready && (
          <motion.div
            className="rp-reveal"
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .75, ease: EASE }}
          >
            <div className="rp-toolbar">
              <div className="rp-search">
                <i className="bi bi-search" aria-hidden="true" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search reports and sections"
                  aria-label="Search reports"
                />
                {query && (
                  <button type="button" onClick={() => setQuery('')} aria-label="Clear search">
                    <i className="bi bi-x-lg" aria-hidden="true" />
                  </button>
                )}
              </div>

              <div className="rp-range" role="group" aria-label="Date range">
                {DATE_RANGES.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={range === option.id ? 'is-active' : ''}
                    onClick={() => setRange(option.id)}
                    aria-pressed={range === option.id}
                  >
                    {range === option.id && <motion.span className="rp-range-pill" layoutId="rp-range-pill" transition={{ duration: .32, ease: EASE }} />}
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <section className="rp-workspace" aria-label="Report categories">
              <div className="rp-categories">
                {loading ? <CardSkeleton /> : visible.length === 0 ? (
                  <div className="rp-state">
                    <EmptyState icon="bi-search" title="No reports match" description="Try a different term — sections are searchable too." />
                    <button type="button" className="rp-btn rp-btn-ghost" onClick={() => setQuery('')}>
                      <i className="bi bi-arrow-counterclockwise" aria-hidden="true" />Clear search
                    </button>
                  </div>
                ) : (
                  <div className="rp-card-grid">
                    {visible.map((report, index) => (
                      <ReportCard
                        key={report.id}
                        report={report}
                        index={index}
                        isSelected={selected?.id === report.id}
                        onSelect={setSelected}
                      />
                    ))}
                  </div>
                )}
              </div>

              <ReportPreview
                report={selected}
                range={rangeLabel}
                onExport={handleExport}
                onClose={() => setSelected(null)}
              />
            </section>

            <div id="rp-export">
              <ExportCenter selected={selected} range={rangeLabel} onExport={handleExport} job={job} />
            </div>

            <ReportHistory rows={HISTORY} loading={loading} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

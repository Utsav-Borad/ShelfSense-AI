import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import EmptyState from '../../components/ui/EmptyState';
import {
  DATE_RANGES, ExecutiveSummary, ExportCenter,
  ReportCard, ReportHistory, ReportPreview,
} from '../../components/reports';
import {
  toAssessment, toHealth, toReports, toSummaryMetrics,
} from '../../components/reports/fromApi';
import ErrorState from '../../components/ui/ErrorState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { getRecommendations } from '../../services/aiService';
import {
  getDashboard, getInventoryAnalytics, getSupplierAnalytics,
} from '../../services/analyticsService';
import { exportReport, getReport } from '../../services/reportsService';
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
  const [range, setRange] = useState('monthly');
  const [selected, setSelected] = useState(null);
  const [job, setJob] = useState(null);
  const [reports, setReports] = useState([]);
  const [health, setHealth] = useState({ score: 0, status: '' });
  const [metrics, setMetrics] = useState([]);
  const [assessment, setAssessment] = useState('');
  const [failed, setFailed] = useState('');

  // The reporting window the API is asked for. Re-runs when it changes.
  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      try {
        const [report, dashboard, inventory, suppliers, ai] = await Promise.all([
          getReport(range), getDashboard(), getInventoryAnalytics(),
          getSupplierAnalytics(), getRecommendations(),
        ]);
        if (!active) return;
        const summary = dashboard.data;
        setHealth(toHealth(summary));
        setMetrics(toSummaryMetrics(report.data, summary));
        setAssessment(toAssessment(report.data, summary));
        setReports(toReports(report.data, summary, inventory.data, suppliers.data, ai.data.recommendations));
        setFailed('');
      } catch (failure) {
        if (active) setFailed(failure.detail || 'We could not load your reports.');
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => { active = false; };
  }, [range]);

  useEffect(() => {
    if (!job?.done) return undefined;
    const timer = setTimeout(() => setJob(null), 5200);
    return () => clearTimeout(timer);
  }, [job]);

  const rangeLabel = DATE_RANGES.find((option) => option.id === range)?.label || 'Last 30 days';
  const term = query.trim().toLowerCase();
  const visible = reports.filter((report) => (
    !term || [report.title, report.summary, ...report.sections].some((field) => field.toLowerCase().includes(term))
  ));

  // Downloads the CSV the backend streams for this window. Only the sales
  // report has an export endpoint; the others are marked exportable: false.
  async function handleExport(report, format) {
    setJob({ report: report.title, format: format.label, done: false });
    document.getElementById('rp-export')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    try {
      const csv = await exportReport(range);
      const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `shelfsense-${range}-report.csv`;
      link.click();
      URL.revokeObjectURL(url);
      setJob({ report: report.title, format: format.label, done: true });
    } catch (failure) {
      setJob({ report: report.title, format: format.label, done: true, error: failure.detail });
    }
  }

  if (loading) {
    return <div className="rp"><LoadingSpinner label="Preparing your reports" /></div>;
  }

  if (!loading && failed) {
    return (
      <div className="rp">
        <ErrorState title="We could not load your reports" description={failed} />
      </div>
    );
  }

  return (
    <div className="rp">
      <ExecutiveSummary onReady={() => setReady(true)} health={health} metrics={metrics} assessment={assessment} />

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
              <ExportCenter selected={selected} range={rangeLabel} onExport={handleExport} job={job} reports={reports} />
            </div>

            <ReportHistory rows={[]} loading={loading} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

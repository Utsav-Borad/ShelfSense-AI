// Shown while the workspace settles. Mirrors the real layout so nothing jumps
// when the content arrives.
export default function DashboardSkeleton() {
  return (
    <div className="dash-skeleton" aria-busy="true" aria-label="Loading your workspace">
      <span className="sk sk-greeting" />
      <div className="dash-hero-row">
        <span className="sk sk-hero" />
        <span className="sk sk-brief" />
      </div>
      <div className="dash-kpi-grid">
        {[0, 1, 2, 3, 4, 5].map((n) => <span className="sk sk-kpi" key={n} />)}
      </div>
      <div className="dash-charts">
        <span className="sk sk-chart is-wide" />
        <span className="sk sk-chart" />
        <span className="sk sk-chart" />
        <span className="sk sk-chart" />
      </div>
    </div>
  );
}

import Card from './Card';
export default function StatCard({ label, value, icon = 'bi-bar-chart', detail }) { return <Card className="stat-card"><div><p className="caption">{label}</p><strong>{value}</strong>{detail && <small>{detail}</small>}</div><i className={`bi ${icon}`} aria-hidden="true" /></Card>; }

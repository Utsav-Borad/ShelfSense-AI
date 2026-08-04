export default function Badge({ children, variant = 'neutral' }) { return <span className={`app-badge app-badge-${variant}`}>{children}</span>; }

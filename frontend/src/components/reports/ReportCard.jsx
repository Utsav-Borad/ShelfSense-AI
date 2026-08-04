import { motion } from 'framer-motion';

const EASE = [.16, 1, .3, 1];

export default function ReportCard({ report, index, isSelected, onSelect }) {
  return (
    <motion.article
      className={`rp-card tone-${report.tone}${isSelected ? ' is-selected' : ''}`}
      initial={{ opacity: 0, y: 24, scale: .97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: .6, delay: index * .07, ease: EASE }}
      whileHover={{ y: -5, transition: { duration: .28, ease: 'easeOut' } }}
    >
      <span className="rp-sweep" aria-hidden="true" />

      <header>
        <span className="rp-card-icon"><i className={`bi ${report.icon}`} aria-hidden="true" /></span>
        <span className="rp-card-pages">{report.pages} pages</span>
      </header>

      <h3>{report.title}</h3>
      <p>{report.summary}</p>

      <dl className="rp-card-headline">
        {report.headline.map((item) => (
          <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>
        ))}
      </dl>

      <footer>
        <span className="rp-card-last"><i className="bi bi-clock-history" aria-hidden="true" />Last run {report.lastRun}</span>
        <button type="button" className="rp-btn rp-btn-primary" onClick={() => onSelect(report)}>
          {isSelected ? 'Viewing' : 'Preview'} <i className="bi bi-arrow-right" aria-hidden="true" />
        </button>
      </footer>
    </motion.article>
  );
}

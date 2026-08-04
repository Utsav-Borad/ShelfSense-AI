import { motion } from 'framer-motion';
import useCountUp from '../../hooks/useCountUp';
import { STATUS_META } from './data';

const EASE = [.16, 1, .3, 1];

function SummaryCard({ card, index, active, onSelect }) {
  const value = useCountUp(card.value, { duration: 1300, delay: 220 + index * 90 });

  return (
    <motion.button
      type="button"
      className={`inv-summary tone-${card.tone}${active ? ' is-active' : ''}`}
      initial={{ opacity: 0, y: 22, scale: .97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: .65, delay: .1 + index * .08, ease: EASE }}
      whileHover={{ y: -4, transition: { duration: .26, ease: 'easeOut' } }}
      onClick={() => onSelect?.(card.filter)}
      aria-pressed={active}
    >
      <span className="inv-sweep" aria-hidden="true" />
      <span className="inv-summary-icon"><i className={`bi ${card.icon}`} aria-hidden="true" /></span>
      <span className="inv-summary-body">
        <small>{card.label}</small>
        <strong>{card.prefix}{Math.round(value).toLocaleString('en-IN')}</strong>
        <em>{card.note}</em>
      </span>
    </motion.button>
  );
}

export default function SummaryCards({ products, intelligence, statusFilter, onSelect }) {
  const count = (status) => products.filter((product) => product.status === status).length;

  const cards = [
    { filter: 'all', label: 'Total products', value: products.length, icon: 'bi-boxes', tone: 'primary', note: 'in the catalog' },
    { filter: 'healthy', label: STATUS_META.healthy.label, value: count('healthy'), icon: STATUS_META.healthy.icon, tone: 'success', note: 'no action needed' },
    { filter: 'low', label: STATUS_META.low.label, value: count('low'), icon: STATUS_META.low.icon, tone: 'warning', note: 'below minimum' },
    { filter: 'expiring', label: STATUS_META.expiring.label, value: count('expiring'), icon: STATUS_META.expiring.icon, tone: 'danger', note: 'within 30 days' },
    { filter: 'dead', label: STATUS_META.dead.label, value: count('dead'), icon: STATUS_META.dead.icon, tone: 'muted', note: 'no sale in 60 days' },
    { filter: 'all', label: 'Inventory value', value: Math.round(intelligence.totalValue), prefix: '₹', icon: 'bi-cash-stack', tone: 'olive', note: 'capital on the shelf' },
  ];

  return (
    <section className="inv-summary-grid" aria-label="Inventory summary">
      {cards.map((card, index) => (
        <SummaryCard
          key={card.label}
          card={card}
          index={index}
          active={statusFilter === card.filter && card.filter !== 'all'}
          onSelect={onSelect}
        />
      ))}
    </section>
  );
}

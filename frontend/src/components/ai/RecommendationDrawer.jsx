import { useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useDrawer from '../../hooks/useDrawer';
import { PRIORITY_META } from './data';

const EASE = [.16, 1, .3, 1];

const QUESTIONS = [
  { key: 'happened', label: 'What happened?', icon: 'bi-clipboard-data' },
  { key: 'why', label: 'Why did it happen?', icon: 'bi-diagram-3' },
  { key: 'next', label: 'What should I do next?', icon: 'bi-signpost-split' },
  { key: 'impact', label: 'Expected impact', icon: 'bi-graph-up-arrow' },
];

export default function RecommendationDrawer({ recommendation, onAccept, onDismiss, onClose }) {
  // Escape, scroll lock, focus trap and focus restore — shared by every drawer.
  const panelRef = useRef(null);
  useDrawer(Boolean(recommendation), onClose, panelRef);

  const meta = recommendation ? PRIORITY_META[recommendation.priority] : null;

  return (
    <AnimatePresence>
      {recommendation && (
        <>
          <motion.div
            className="ai-drawer-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: .28 }} onClick={onClose} aria-hidden="true"
          />
          <motion.aside
            ref={panelRef}
            className="ai-drawer"
            role="dialog" aria-modal="true" aria-label={`Analysis of ${recommendation.title}`}
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ duration: .42, ease: EASE }}
          >
            <header className="ai-drawer-head">
              <span className="ai-drawer-mark"><i className={`bi ${recommendation.icon}`} aria-hidden="true" /></span>
              <div>
                <span className={`ai-priority tone-${meta.tone}`}>
                  <i className={`bi ${meta.icon}`} aria-hidden="true" />{meta.label}
                </span>
                <h3>{recommendation.title}</h3>
                <p>{recommendation.category} · {recommendation.timeline}</p>
              </div>
              <button type="button" className="ai-drawer-close" onClick={onClose} aria-label="Close analysis">
                <i className="bi bi-x-lg" aria-hidden="true" />
              </button>
            </header>

            <div className="ai-drawer-body">
              <div className="ai-drawer-summary">
                <div>
                  <strong>₹{recommendation.impactValue.toLocaleString('en-IN')}</strong>
                  <small>{recommendation.impactLabel}</small>
                </div>
              </div>

              {QUESTIONS.map((question, index) => (
                <motion.section
                  key={question.key}
                  className="ai-qa"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: .5, delay: .28 + index * .11, ease: EASE }}
                >
                  <h4><i className={`bi ${question.icon}`} aria-hidden="true" />{question.label}</h4>
                  <p>{recommendation.conversation[question.key]}</p>
                </motion.section>
              ))}

              <p className="ai-drawer-note">
                <i className="bi bi-hand-index-thumb" aria-hidden="true" />
                Advisory only, and placeholder text at that. ShelfSense never places an order or changes a price — the decision is yours.
              </p>
            </div>

            <footer className="ai-drawer-foot">
              <button type="button" className="ai-btn ai-btn-primary" onClick={() => { onAccept(recommendation.id); onClose(); }}>
                <i className="bi bi-check-lg" aria-hidden="true" />Accept
              </button>
              <button type="button" className="ai-btn ai-btn-ghost" onClick={() => { onDismiss(recommendation.id); onClose(); }}>
                Dismiss
              </button>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

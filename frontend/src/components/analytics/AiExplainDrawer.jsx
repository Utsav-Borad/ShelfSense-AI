import { useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useDrawer from '../../hooks/useDrawer';

const EASE = [.16, 1, .3, 1];

// The conversational analysis. Four questions in the order a shop owner would
// actually ask them.
const QUESTIONS = [
  { key: 'happened', label: 'What happened?', icon: 'bi-clipboard-data' },
  { key: 'why', label: 'Why did it happen?', icon: 'bi-diagram-3' },
  { key: 'next', label: 'What should I do next?', icon: 'bi-signpost-split' },
  { key: 'impact', label: 'Expected impact', icon: 'bi-graph-up-arrow' },
];

export default function AiExplainDrawer({ chart, onClose }) {
  // Escape, scroll lock, focus trap and focus restore — shared by every drawer.
  const panelRef = useRef(null);
  useDrawer(Boolean(chart), onClose, panelRef);

  return (
    <AnimatePresence>
      {chart && (
        <>
          <motion.div
            className="an-drawer-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: .28 }} onClick={onClose} aria-hidden="true"
          />
          <motion.aside
            ref={panelRef}
            className="an-drawer"
            role="dialog" aria-modal="true" aria-label={`AI analysis of ${chart.title}`}
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ duration: .42, ease: EASE }}
          >
            <header className="an-drawer-head">
              <span className="an-drawer-mark"><i className="bi bi-stars" aria-hidden="true" /></span>
              <div>
                <p className="an-eyebrow">AI analysis</p>
                <h3>{chart.title}</h3>
              </div>
              <button type="button" className="an-drawer-close" onClick={onClose} aria-label="Close analysis">
                <i className="bi bi-x-lg" aria-hidden="true" />
              </button>
            </header>

            <div className="an-drawer-body">

              {QUESTIONS.map((question, index) => (
                <motion.section
                  key={question.key}
                  className="an-qa"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: .5, delay: .28 + index * .11, ease: EASE }}
                >
                  <h4><i className={`bi ${question.icon}`} aria-hidden="true" />{question.label}</h4>
                  <p>{chart.conversation[question.key]}</p>
                </motion.section>
              ))}

              <motion.p
                className="an-drawer-note"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: .5, delay: .8 }}
              >
                <i className="bi bi-hand-index-thumb" aria-hidden="true" />
                Advisory only, and placeholder text at that — no model has been consulted. Every decision stays yours.
              </motion.p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

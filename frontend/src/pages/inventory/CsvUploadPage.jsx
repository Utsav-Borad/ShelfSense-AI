import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SectionHeader from '../../components/ui/SectionHeader';
import { CompleteStage, REPORT_TYPES, StepperBar, SyncStage, UploadHistory, UploadStage, ValidationStage } from '../../components/csv';
import '../../styles/csv.css';

const EASE = [.16, 1, .3, 1];
const EMPTY_FILES = { sales: null, inventory: null, purchase: null };

// Which stepper step each phase sits on. During upload the step follows how
// many files are ready, so the indicator moves as the user works.
function stepFor(phase, files) {
  if (phase === 'validate') return 3;
  if (phase === 'sync') return 4;
  if (phase === 'complete') return 5;
  return Math.min(REPORT_TYPES.filter((report) => files[report.id]?.status === 'ready').length, 2);
}

export default function CsvUploadPage() {
  // 'upload' -> 'validate' -> 'sync' -> 'complete'
  const [phase, setPhase] = useState('upload');
  const [files, setFiles] = useState(EMPTY_FILES);
  const [view, setView] = useState('center');

  function restart() {
    setFiles(EMPTY_FILES);
    setPhase('upload');
    setView('center');
  }

  return (
    <motion.div className="csv-page" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3 }}>
      <SectionHeader
        title="Synchronization Center"
        description="Bring your POS exports in, and let the analytics and AI engines read the new position."
        action={(
          <div className="csv-tabs" role="tablist" aria-label="Synchronization views">
            <button type="button" role="tab" aria-selected={view === 'center'} className={view === 'center' ? 'is-active' : ''} onClick={() => setView('center')}>
              <i className="bi bi-cloud-arrow-up" aria-hidden="true" />Upload
            </button>
            <button type="button" role="tab" aria-selected={view === 'history'} className={view === 'history' ? 'is-active' : ''} onClick={() => setView('history')}>
              <i className="bi bi-clock-history" aria-hidden="true" />History
            </button>
          </div>
        )}
      />

      <AnimatePresence mode="wait" initial={false}>
        {view === 'history' ? (
          <motion.div key="history" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: .32, ease: EASE }}>
            <UploadHistory />
          </motion.div>
        ) : (
          <motion.div key="center" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: .32, ease: EASE }}>
            <StepperBar current={stepFor(phase, files)} />

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={phase}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: .38, ease: EASE }}
              >
                {phase === 'upload' && (
                  <UploadStage files={files} setFiles={setFiles} onContinue={() => setPhase('validate')} />
                )}
                {phase === 'validate' && (
                  <ValidationStage files={files} onBack={() => setPhase('upload')} onSynchronize={() => setPhase('sync')} />
                )}
                {phase === 'sync' && (
                  <SyncStage files={files} onComplete={() => setPhase('complete')} />
                )}
                {phase === 'complete' && (
                  <CompleteStage files={files} onAnother={restart} />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

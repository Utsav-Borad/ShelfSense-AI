import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import useCountUp from '../../hooks/useCountUp';
import {
  PRIORITY_META, greetingFor,
} from './data';

const EASE = [.16, 1, .3, 1];
const RADIUS = 68;

// The signature moment. A morning briefing rather than a dashboard: the avatar
// arrives, it thinks, then it tells you the three things that matter, scores
// the day, and offers to walk you through it.
//
// Stages: 0 avatar · 1 thinking · 2..4 highlights · 5 score · 6 button
export default function BusinessCopilot({ onStartPlan, planStarted, completedCount, total, summary }) {
  const { user } = useAuth();
  const [stage, setStage] = useState(0);

  const highlights = summary.highlights;
  const finished = stage >= 6;

  const score = useCountUp(summary.score, { duration: 1600, active: stage >= 5, delay: 200 });
  const improvement = useCountUp(summary.improvement, { duration: 1800, active: stage >= 5, delay: 320 });

  useEffect(() => {
    if (stage >= 6) return undefined;
    // The thinking beat is longer than the rest — it is doing the work.
    const delays = [700, 1500, 820, 820, 820, 700];
    const timer = setTimeout(() => setStage(stage + 1), delays[stage]);
    return () => clearTimeout(timer);
  }, [stage]);

  const firstName = user?.full_name ? user.full_name.split(' ')[0] : null;

  return (
    <motion.section
      className="ai-copilot"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .85, ease: EASE }}
      aria-labelledby="ai-copilot-title"
    >
      <span className="ai-copilot-glow" aria-hidden="true" />

      <header className="ai-copilot-head">
        <motion.span
          className="ai-avatar"
          initial={{ opacity: 0, scale: .8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: .7, ease: EASE }}
        >
          <motion.i
            className="bi bi-robot"
            animate={finished ? { scale: 1, opacity: 1 } : { scale: [1, 1.12, 1], opacity: [.75, 1, .75] }}
            transition={finished ? { duration: .4 } : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden="true"
          />
          <span className="ai-avatar-pulse" aria-hidden="true" />
        </motion.span>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .6, delay: .25, ease: EASE }}
        >
          <h2 id="ai-copilot-title">{greetingFor(new Date().getHours())}{firstName ? `, ${firstName}` : ''}.</h2>
          <AnimatePresence mode="wait" initial={false}>
            {stage < 2 ? (
              <motion.p key="thinking" className="ai-copilot-sub is-thinking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .3 }}>
                Analyzing your business
                <span className="ai-dots" aria-hidden="true"><span /><span /><span /></span>
              </motion.p>
            ) : (
              <motion.p key="done" className="ai-copilot-sub" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45, ease: EASE }}>
                I’ve analyzed your business overnight. Here’s what deserves your attention today.
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </header>

      <ol className="ai-copilot-list" aria-live="polite">
        <AnimatePresence initial={false}>
          {highlights.slice(0, Math.max(0, stage - 1)).map((item, index) => {
            const meta = PRIORITY_META[item.priority];
            return (
              <motion.li
                key={item.id}
                className={`tone-${meta.tone}`}
                initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: .55, ease: EASE }}
              >
                <motion.span
                  className={`ai-priority-dot tone-${meta.tone}`}
                  initial={{ scale: .6 }}
                  animate={{ scale: [0.6, 1.14, 1] }}
                  transition={{ duration: .7, delay: .1, ease: EASE }}
                  aria-hidden="true"
                />
                <div>
                  <strong>{item.short}</strong>
                  <small>{item.urgency}</small>
                </div>
                <span className="ai-copilot-value">
                  <b>₹{item.impactValue.toLocaleString('en-IN')}</b>
                  <em>{item.impactLabel}</em>
                </span>
                <span className="visually-hidden">Priority {meta.label}.</span>
                <span className="ai-copilot-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ol>

      <AnimatePresence>
        {stage >= 5 && (
          <motion.div
            className="ai-copilot-score"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .65, ease: EASE }}
          >
            <div className="ai-score-ring">
              <svg viewBox="0 0 160 160" role="img" aria-label={`Today's opportunity score ${summary.score} out of 100`}>
                <circle className="ai-score-track" cx="80" cy="80" r={RADIUS} />
                <motion.circle
                  className="ai-score-arc"
                  cx="80" cy="80" r={RADIUS}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: summary.score / 100 }}
                  transition={{ duration: 1.6, delay: .2, ease: EASE }}
                />
              </svg>
              <div className="ai-score-value">
                <strong>{Math.round(score)}</strong>
                <span>/100</span>
              </div>
            </div>

            <div className="ai-score-copy">
              <p className="ai-eyebrow">Today’s opportunity score</p>
              <p className="ai-improvement">+₹{Math.round(improvement).toLocaleString('en-IN')}</p>
              <small>Estimated business improvement if today’s plan is followed.</small>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {stage >= 6 && (
          <motion.div
            className="ai-copilot-actions"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .6, ease: EASE }}
          >
            {planStarted ? (
              <div className="ai-plan-progress" role="status">
                <span className="ai-plan-track" aria-hidden="true">
                  <motion.i
                    initial={false}
                    animate={{ scaleX: total ? completedCount / total : 0 }}
                    transition={{ duration: .6, ease: EASE }}
                  />
                </span>
                <strong>{completedCount} of {total} completed</strong>
              </div>
            ) : (
              <button type="button" className="ai-btn ai-btn-primary is-lg" onClick={onStartPlan}>
                <i className="bi bi-play-fill" aria-hidden="true" />Start today’s plan
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

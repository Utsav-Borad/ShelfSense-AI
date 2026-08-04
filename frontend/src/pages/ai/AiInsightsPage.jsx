import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ActionQueue, BusinessCopilot, DecisionHistory, Opportunities, PlanComplete,
  RECOMMENDATIONS, RecommendationCard, RecommendationDrawer, RiskAlerts,
} from '../../components/ai';
import '../../styles/ai.css';

const EASE = [.16, 1, .3, 1];

function RecSkeleton() {
  return (
    <div className="ai-skeletons" aria-busy="true" aria-label="Loading recommendations">
      {[0, 1, 2].map((n) => <span className="ai-sk" key={n} />)}
    </div>
  );
}

export default function AiInsightsPage() {
  const [loading, setLoading] = useState(true);
  const [revealed, setRevealed] = useState(0);

  const [planStarted, setPlanStarted] = useState(false);
  const [accepted, setAccepted] = useState([]);
  const [dismissed, setDismissed] = useState([]);
  const [focused, setFocused] = useState(null);
  const [opened, setOpened] = useState(null);

  // Placeholder settle for the recommendation list.
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Cards arrive one after another rather than all at once.
  useEffect(() => {
    if (loading || revealed >= RECOMMENDATIONS.length) return undefined;
    const timer = setTimeout(() => setRevealed(revealed + 1), 260);
    return () => clearTimeout(timer);
  }, [loading, revealed]);

  // Anything actioned — accepted or dismissed — is off the plan.
  const actioned = [...accepted, ...dismissed];
  const remaining = RECOMMENDATIONS.filter((item) => !actioned.includes(item.id));
  const planComplete = planStarted && remaining.length === 0;

  function focusOn(id) {
    setFocused(id);
    // Wait a frame so the card exists before scrolling to it.
    requestAnimationFrame(() => {
      document.getElementById(`rec-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  function startPlan() {
    setPlanStarted(true);
    const first = remaining[0];
    if (first) focusOn(first.id);
  }

  // After actioning one, move to the next still outstanding.
  function advance(id) {
    if (!planStarted) return;
    const nextUp = RECOMMENDATIONS.find((item) => item.id !== id && ![...actioned, id].includes(item.id));
    if (nextUp) setTimeout(() => focusOn(nextUp.id), 520);
    else setFocused(null);
  }

  function handleAccept(id) {
    setAccepted((current) => (current.includes(id) ? current : [...current, id]));
    advance(id);
  }

  function handleDismiss(id) {
    setDismissed((current) => (current.includes(id) ? current : [...current, id]));
    advance(id);
  }

  return (
    <div className="ai">
      <BusinessCopilot
        onStartPlan={startPlan}
        planStarted={planStarted}
        completedCount={actioned.length}
        total={RECOMMENDATIONS.length}
      />

      <AnimatePresence>
        {planComplete && (
          <PlanComplete
            completed={actioned.length}
            total={RECOMMENDATIONS.length}
            onReview={() => document.getElementById('ai-recommendations')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          />
        )}
      </AnimatePresence>

      <section className="ai-section" id="ai-recommendations">
        <header className="ai-section-head">
          <div>
            <p className="ai-eyebrow">Priority recommendations</p>
            <h2>Today’s decisions, in order</h2>
          </div>
          {planStarted && !planComplete && (
            <span className="ai-section-progress">
              <i className="bi bi-list-check" aria-hidden="true" />
              {actioned.length} of {RECOMMENDATIONS.length} completed
            </span>
          )}
        </header>

        {loading ? <RecSkeleton /> : (
          <motion.div className="ai-rec-list" layout transition={{ duration: .4, ease: EASE }}>
            {RECOMMENDATIONS.map((recommendation, index) => (
              <RecommendationCard
                key={recommendation.id}
                recommendation={recommendation}
                index={index}
                revealed={revealed > index}
                isFocused={focused === recommendation.id}
                isCompleted={accepted.includes(recommendation.id)}
                isDismissed={dismissed.includes(recommendation.id)}
                onAccept={handleAccept}
                onDismiss={handleDismiss}
                onLearnMore={setOpened}
              />
            ))}
          </motion.div>
        )}
      </section>

      <div className="ai-columns">
        <Opportunities />
        <RiskAlerts />
      </div>

      <div className="ai-columns">
        <ActionQueue accepted={accepted} onOpen={setOpened} />
        <DecisionHistory />
      </div>

      <RecommendationDrawer
        recommendation={opened}
        onAccept={handleAccept}
        onDismiss={handleDismiss}
        onClose={() => setOpened(null)}
      />
    </div>
  );
}

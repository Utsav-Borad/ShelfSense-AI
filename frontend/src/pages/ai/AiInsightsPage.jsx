import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ActionQueue, BusinessCopilot, DecisionHistory, Opportunities, PlanComplete,
  RecommendationCard, RecommendationDrawer, RiskAlerts,
} from '../../components/ai';
import {
  toCopilotSummary, toDecisions, toOpportunities, toRisks,
} from '../../components/ai/fromApi';
import ErrorState from '../../components/ui/ErrorState';
import { getRecommendations } from '../../services/aiService';
import { getDashboard } from '../../services/analyticsService';
import { getProducts } from '../../services/inventoryService';
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
  const [error, setError] = useState('');
  const [revealed, setRevealed] = useState(0);
  const [decisions, setDecisions] = useState([]);
  const [risks, setRisks] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [copilot, setCopilot] = useState({ score: 0, improvement: 0, highlights: [] });

  const [planStarted, setPlanStarted] = useState(false);
  const [accepted, setAccepted] = useState([]);
  const [dismissed, setDismissed] = useState([]);
  const [focused, setFocused] = useState(null);
  const [opened, setOpened] = useState(null);

  // The engine's recommendations, priced from the product list, plus the
  // dashboard counts that the risk panel reads.
  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [ai, products, dashboard] = await Promise.all([
          getRecommendations(), getProducts(), getDashboard(),
        ]);
        if (!active) return;
        const list = toDecisions(ai.data.recommendations, products.data);
        setDecisions(list);
        setRisks(toRisks(dashboard.data));
        setOpportunities(toOpportunities(list));
        setCopilot(toCopilotSummary(list, dashboard.data));
      } catch (failure) {
        if (active) setError(failure.detail || 'We could not load your recommendations.');
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => { active = false; };
  }, []);

  // Cards arrive one after another rather than all at once.
  useEffect(() => {
    if (loading || revealed >= decisions.length) return undefined;
    const timer = setTimeout(() => setRevealed(revealed + 1), 260);
    return () => clearTimeout(timer);
  }, [loading, revealed]);

  // Anything actioned — accepted or dismissed — is off the plan.
  const actioned = [...accepted, ...dismissed];
  // Nothing is persisted server-side, so the log covers this session only.
  const history = actioned.map((id) => {
    const decision = decisions.find((item) => item.id === id);
    return {
      id,
      decision: decision ? decision.title : id,
      outcome: accepted.includes(id) ? 'accepted' : 'dismissed',
      result: decision ? decision.impact : '',
      when: 'This session',
    };
  });
  const remaining = decisions.filter((item) => !actioned.includes(item.id));
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
    const nextUp = decisions.find((item) => item.id !== id && ![...actioned, id].includes(item.id));
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

  if (!loading && error) {
    return (
      <div className="ai">
        <ErrorState title="We could not load your recommendations" description={error} />
      </div>
    );
  }

  return (
    <div className="ai">
      <BusinessCopilot
        onStartPlan={startPlan}
        planStarted={planStarted}
        completedCount={actioned.length}
        total={decisions.length}
        summary={copilot}
      />

      <AnimatePresence>
        {planComplete && (
          <PlanComplete
            completed={actioned.length}
            total={decisions.length}
            improvement={copilot.improvement}
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
              {actioned.length} of {decisions.length} completed
            </span>
          )}
        </header>

        {loading ? <RecSkeleton /> : (
          <motion.div className="ai-rec-list" layout transition={{ duration: .4, ease: EASE }}>
            {decisions.map((recommendation, index) => (
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
        <Opportunities opportunities={opportunities} />
        <RiskAlerts risks={risks} />
      </div>

      <div className="ai-columns">
        <ActionQueue accepted={accepted} onOpen={setOpened} decisions={decisions} />
        <DecisionHistory history={history} />
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

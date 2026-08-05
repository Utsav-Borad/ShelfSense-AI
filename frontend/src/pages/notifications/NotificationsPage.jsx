import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import EmptyState from '../../components/ui/EmptyState';
import {
  GROUP_LABELS, MorningBrief, NotificationDrawer,
  NotificationItem, NotificationToolbar,
} from '../../components/notifications';
import {
  toBriefLines, toNotifications,
} from '../../components/notifications/fromApi';
import ErrorState from '../../components/ui/ErrorState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { getRecommendations } from '../../services/aiService';
import { getDashboard } from '../../services/analyticsService';
import { getNotifications } from '../../services/notificationsService';
import '../../styles/notifications.css';

const EASE = [.16, 1, .3, 1];
const GROUP_ORDER = ['today', 'yesterday', 'earlier'];

function TimelineSkeleton() {
  return (
    <div className="nt-skeletons" aria-busy="true" aria-label="Loading notifications">
      {[0, 1, 2, 3, 4].map((n) => <span className="nt-sk" key={n} />)}
    </div>
  );
}

export default function NotificationsPage() {
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [brief, setBrief] = useState([]);
  const [failed, setFailed] = useState('');

  const [tab, setTab] = useState('critical');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [date, setDate] = useState('all');
  const [selected, setSelected] = useState([]);
  const [highlighted, setHighlighted] = useState(null);
  const [opened, setOpened] = useState(null);

  // Alerts come from the notification engine, with the recommendation output
  // supplying the stock evidence behind each one.
  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [alerts, ai, dashboard] = await Promise.all([
          getNotifications(), getRecommendations(), getDashboard(),
        ]);
        if (!active) return;
        const list = toNotifications(alerts.data.notifications, ai.data.recommendations);
        setItems(list);
        setBrief(toBriefLines(dashboard.data, list));
      } catch (failure) {
        if (active) setFailed(failure.detail || 'We could not load your notifications.');
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => { active = false; };
  }, []);

  // The jump highlight fades on its own so it reads as a flash, not a state.
  useEffect(() => {
    if (!highlighted) return undefined;
    const timer = setTimeout(() => setHighlighted(null), 2400);
    return () => clearTimeout(timer);
  }, [highlighted]);

  const unreadCount = items.filter((item) => !item.read && !item.archived).length;

  // Counts per tab, so the badges reflect what is actually behind each one.
  const counts = {
    critical: items.filter((item) => !item.archived && item.priority === 'critical').length,
    important: items.filter((item) => !item.archived && item.priority === 'important').length,
    general: items.filter((item) => !item.archived && item.priority === 'general').length,
    completed: items.filter((item) => item.archived).length,
  };

  const term = query.trim().toLowerCase();
  const visible = items.filter((item) => {
    if (tab === 'completed' ? !item.archived : item.archived || item.priority !== tab) return false;
    if (term && ![item.title, item.detail, item.meta].some((field) => field.toLowerCase().includes(term))) return false;
    if (category !== 'all' && item.type !== category) return false;
    if (date !== 'all' && item.group !== date) return false;
    return true;
  });

  const grouped = GROUP_ORDER
    .map((group) => ({ group, rows: visible.filter((item) => item.group === group) }))
    .filter((entry) => entry.rows.length > 0);

  const update = (ids, changes) => setItems((current) => current.map((item) => (
    ids.includes(item.id) ? { ...item, ...changes } : item
  )));

  function toggleRead(id) {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, read: !item.read } : item)));
  }

  function toggleArchive(id) {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, archived: !item.archived } : item)));
    setSelected((current) => current.filter((value) => value !== id));
  }

  function toggleSelect(id) {
    setSelected((current) => (current.includes(id) ? current.filter((value) => value !== id) : [...current, id]));
  }

  // Jumping from the brief switches to whichever tab holds that notification,
  // otherwise the target would be filtered out of view.
  function jumpTo(id) {
    const target = items.find((item) => item.id === id);
    if (!target) return;
    setTab(target.archived ? 'completed' : target.priority);
    setQuery('');
    setCategory('all');
    setDate('all');
    setHighlighted(id);
    setTimeout(() => {
      document.getElementById(`note-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 120);
  }

  if (loading) {
    return <div className="nt"><LoadingSpinner label="Reading your alerts" /></div>;
  }

  if (!loading && failed) {
    return (
      <div className="nt">
        <ErrorState title="We could not load your notifications" description={failed} />
      </div>
    );
  }

  return (
    <div className="nt">
      <MorningBrief lines={brief} unreadCount={unreadCount} onJump={jumpTo} onReady={() => setReady(true)} />

      <AnimatePresence>
        {ready && (
          <motion.div
            className="nt-reveal"
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .75, ease: EASE }}
          >
            <section className="nt-panel">
              <NotificationToolbar
                tab={tab}
                onTab={(next) => { setTab(next); setSelected([]); }}
                counts={counts}
                query={query}
                onQuery={setQuery}
                category={category}
                onCategory={setCategory}
                date={date}
                onDate={setDate}
                selected={selected}
                unreadCount={unreadCount}
                onBulkRead={() => { update(selected, { read: true }); setSelected([]); }}
                onBulkArchive={() => { update(selected, { archived: true }); setSelected([]); }}
                onClearSelection={() => setSelected([])}
                onMarkAllRead={() => setItems((current) => current.map((item) => ({ ...item, read: true })))}
              />

              {loading ? <TimelineSkeleton /> : grouped.length === 0 ? (
                <div className="nt-state">
                  <EmptyState
                    icon={tab === 'completed' ? 'bi-archive' : 'bi-bell-slash'}
                    title={tab === 'completed' ? 'Nothing archived yet' : 'You are all caught up'}
                    description={term || category !== 'all' || date !== 'all'
                      ? 'No notifications match these filters.'
                      : 'Nothing in this priority needs your attention right now.'}
                  />
                  {(term || category !== 'all' || date !== 'all') && (
                    <button type="button" className="nt-btn nt-btn-ghost" onClick={() => { setQuery(''); setCategory('all'); setDate('all'); }}>
                      <i className="bi bi-arrow-counterclockwise" aria-hidden="true" />Clear filters
                    </button>
                  )}
                </div>
              ) : (
                <div className="nt-timeline">
                  {grouped.map(({ group, rows }) => (
                    <section className="nt-group" key={group}>
                      <h3 className="nt-group-label">{GROUP_LABELS[group]}</h3>
                      <ol className="nt-list">
                        <motion.span
                          className="nt-rail"
                          aria-hidden="true"
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          transition={{ duration: .9, ease: EASE }}
                        />
                        <AnimatePresence initial={false}>
                          {rows.map((item, index) => (
                            <NotificationItem
                              key={item.id}
                              notification={item}
                              index={index}
                              revealed
                              isHighlighted={highlighted === item.id}
                              isSelected={selected.includes(item.id)}
                              onOpen={(target) => { setOpened(target); if (!target.read) toggleRead(target.id); }}
                              onToggleRead={toggleRead}
                              onArchive={toggleArchive}
                              onSelect={toggleSelect}
                            />
                          ))}
                        </AnimatePresence>
                      </ol>
                    </section>
                  ))}
                </div>
              )}
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      <NotificationDrawer
        notification={opened}
        onToggleRead={toggleRead}
        onArchive={toggleArchive}
        onClose={() => setOpened(null)}
      />
    </div>
  );
}

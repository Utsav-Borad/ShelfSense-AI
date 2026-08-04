import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import {
  AiPanel, AppearancePanel, BusinessPanel, DataPanel, INTEGRATIONS,
  IntegrationsPanel, NOTIFICATION_PREFS, NotificationsPanel, PersonalizationSummary,
  ProfilePanel, SECTIONS, SESSIONS, SecurityPanel, SettingsDrawer, SystemPanel,
} from '../../components/settings';
import '../../styles/settings.css';

const EASE = [.16, 1, .3, 1];

const DEFAULTS = {
  full_name: '', email: '', phone: '+91 98765 43210', role: 'Business owner',
  shop_name: 'Borad Provision Store', shop_type: 'Grocery', currency: 'INR',
  timezone: 'Asia/Kolkata (IST, GMT+5:30)', gst: '',
  themeMode: 'dark', accent: 'beige', reduceMotion: false, compact: false,
  priority: 'smart', quietStart: '22:00', quietEnd: '07:00',
  twoFactor: false,
  dailyBrief: true, briefFrequency: 'daily', sensitivity: 'balanced', confidence: 80, explain: true,
  language: 'English (India)', dateFormat: 'DD/MM/YYYY', startPage: 'Dashboard', pageSize: '25',
};

function PanelSkeleton() {
  return (
    <div className="st-skeletons" aria-busy="true" aria-label="Loading settings">
      {[0, 1, 2, 3].map((n) => <span className="st-sk" key={n} />)}
    </div>
  );
}

export default function SettingsPage() {
  const { user, business } = useAuth();
  const { theme } = useTheme();

  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [section, setSection] = useState('profile');

  const [values, setValues] = useState({
    ...DEFAULTS,
    full_name: user?.full_name || 'Utsav Borad',
    email: user?.email || 'owner@shelfsense.ai',
    shop_name: business?.shop_name || DEFAULTS.shop_name,
    shop_type: business?.shop_type || DEFAULTS.shop_type,
    themeMode: theme,
  });
  const [prefs, setPrefs] = useState(NOTIFICATION_PREFS);
  const [sessions, setSessions] = useState(SESSIONS);
  const [integrations, setIntegrations] = useState(INTEGRATIONS);

  const [dirty, setDirty] = useState(false);
  const [saveState, setSaveState] = useState('idle'); // idle | saving | saved
  const [drawer, setDrawer] = useState(null);

  useEffect(() => {
    if (!ready) return undefined;
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, [ready]);

  // The saved confirmation settles back on its own.
  useEffect(() => {
    if (saveState !== 'saved') return undefined;
    const timer = setTimeout(() => setSaveState('idle'), 2600);
    return () => clearTimeout(timer);
  }, [saveState]);

  function set(key, value) {
    setValues((current) => ({ ...current, [key]: value }));
    setDirty(true);
  }

  function togglePref(id) {
    setPrefs((current) => current.map((pref) => (pref.id === id ? { ...pref, enabled: !pref.enabled } : pref)));
    setDirty(true);
  }

  function save() {
    setSaveState('saving');
    setTimeout(() => { setSaveState('saved'); setDirty(false); }, 900);
  }

  function discard() {
    setValues({ ...DEFAULTS, full_name: user?.full_name || 'Utsav Borad', email: user?.email || 'owner@shelfsense.ai', themeMode: theme });
    setPrefs(NOTIFICATION_PREFS);
    setDirty(false);
  }

  const themeLabel = `Warm Beige (${theme === 'dark' ? 'Dark' : 'Light'})`;
  const active = SECTIONS.find((item) => item.id === section);

  function renderPanel() {
    switch (section) {
      case 'profile': return <ProfilePanel values={values} set={set} />;
      case 'business': return <BusinessPanel values={values} set={set} />;
      case 'appearance': return <AppearancePanel values={values} set={set} />;
      case 'notifications': return <NotificationsPanel values={values} set={set} prefs={prefs} onPref={togglePref} />;
      case 'security': return (
        <SecurityPanel
          values={values} set={set} sessions={sessions}
          onSignOut={(id) => setSessions((current) => current.filter((item) => item.id !== id))}
          onChangePassword={() => setDrawer('password')}
        />
      );
      case 'ai': return <AiPanel values={values} set={set} />;
      case 'data': return <DataPanel onExport={() => setDrawer('export')} onDelete={() => setDrawer('delete')} />;
      case 'integrations': return (
        <IntegrationsPanel
          integrations={integrations}
          onToggle={(id) => setIntegrations((current) => current.map((item) => (
            item.id === id ? { ...item, status: 'connected' } : item
          )))}
        />
      );
      case 'system': return <SystemPanel values={values} set={set} />;
      default: return null;
    }
  }

  return (
    <div className="st">
      <PersonalizationSummary
        themeLabel={themeLabel}
        onReady={() => setReady(true)}
        onCustomize={() => {
          setSection('ai');
          setTimeout(() => document.getElementById('st-workspace')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
        }}
      />

      <AnimatePresence>
        {ready && (
          <motion.div
            className="st-workspace"
            id="st-workspace"
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .75, ease: EASE }}
          >
            <nav className="st-nav" aria-label="Settings sections">
              {SECTIONS.map((item, index) => (
                <motion.button
                  key={item.id}
                  type="button"
                  className={`st-nav-item${section === item.id ? ' is-active' : ''}`}
                  onClick={() => setSection(item.id)}
                  aria-current={section === item.id ? 'page' : undefined}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: .45, delay: index * .05, ease: EASE }}
                >
                  {section === item.id && <motion.span className="st-nav-pill" layoutId="st-nav-pill" transition={{ duration: .32, ease: EASE }} />}
                  <i className={`bi ${item.icon}`} aria-hidden="true" />
                  <span>
                    <strong>{item.label}</strong>
                    <small>{item.hint}</small>
                  </span>
                </motion.button>
              ))}
            </nav>

            <section className="st-panel" aria-live="polite">
              {loading ? <PanelSkeleton /> : (
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={section}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: .3, ease: EASE }}
                  >
                    <header className="st-panel-head">
                      <span className="st-panel-icon"><i className={`bi ${active.icon}`} aria-hidden="true" /></span>
                      <div>
                        <h2>{active.label}</h2>
                        <p>{active.hint}</p>
                      </div>
                    </header>
                    <div className="st-panel-body">{renderPanel()}</div>
                  </motion.div>
                </AnimatePresence>
              )}
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save bar rises when something has changed, and confirms when it lands. */}
      <AnimatePresence>
        {(dirty || saveState !== 'idle') && (
          <motion.div
            className={`st-savebar${saveState === 'saved' ? ' is-saved' : ''}`}
            role="status"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: .35, ease: EASE }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {saveState === 'saved' ? (
                <motion.span key="saved" className="st-savebar-inner" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: .25 }}>
                  <motion.i className="bi bi-check-circle-fill" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: .4, ease: EASE }} aria-hidden="true" />
                  Settings saved
                </motion.span>
              ) : (
                <motion.span key="dirty" className="st-savebar-inner" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: .25 }}>
                  <i className="bi bi-pencil" aria-hidden="true" />
                  You have unsaved changes
                  <span className="st-savebar-actions">
                    <button type="button" className="st-btn st-btn-quiet" onClick={discard} disabled={saveState === 'saving'}>Discard</button>
                    <button type="button" className="st-btn st-btn-primary" onClick={save} disabled={saveState === 'saving'}>
                      {saveState === 'saving' ? <><span className="st-spinner" aria-hidden="true" />Saving…</> : 'Save changes'}
                    </button>
                  </span>
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <SettingsDrawer kind={drawer} onClose={() => setDrawer(null)} onConfirm={() => setSaveState('saved')} />
    </div>
  );
}

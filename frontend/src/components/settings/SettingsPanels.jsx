import { motion } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';
import { Field, OptionCards, SelectInput, SettingRow, TextInput, Toggle } from './Controls';
import {
  ACCENTS, BRIEF_FREQUENCY, DATE_FORMATS, INTEGRATIONS, LANGUAGES,
  NOTIFICATION_PRIORITY, SENSITIVITY, SESSIONS, SHOP_TYPES, START_PAGES, TIMEZONES,
} from './data';

const EASE = [.16, 1, .3, 1];

const THEME_MODES = [
  { id: 'light', label: 'Light', detail: 'Cream and warm brown.', icon: 'bi-sun' },
  { id: 'dark', label: 'Dark', detail: 'The default. Warm dark brown.', icon: 'bi-moon-stars' },
  { id: 'system', label: 'System', detail: 'Follow your device setting.', icon: 'bi-circle-half' },
];

export function ProfilePanel({ values, set }) {
  const initials = (values.full_name || 'SS').split(' ').slice(0, 2).map((word) => word[0]).join('').toUpperCase();

  return (
    <>
      <div className="st-avatar-row">
        <span className="st-profile-avatar">{initials}</span>
        <div>
          <strong>Profile photo</strong>
          <small>A generated monogram is used until you upload an image.</small>
          <div className="st-avatar-actions">
            <button type="button" className="st-btn st-btn-ghost" disabled><i className="bi bi-upload" aria-hidden="true" />Upload</button>
            <button type="button" className="st-btn st-btn-quiet" disabled>Remove</button>
          </div>
        </div>
      </div>

      <div className="st-grid-2">
        <Field label="Full name">
          <TextInput icon="bi-person" value={values.full_name} onChange={(e) => set('full_name', e.target.value)} />
        </Field>
        <Field label="Email address" hint="You sign in with this address.">
          <TextInput icon="bi-envelope" type="email" value={values.email} onChange={(e) => set('email', e.target.value)} />
        </Field>
        <Field label="Phone">
          <TextInput icon="bi-telephone" inputMode="tel" value={values.phone} onChange={(e) => set('phone', e.target.value)} />
        </Field>
        <Field label="Role" hint="Roles are assigned by an administrator.">
          <TextInput icon="bi-shield-lock" value={values.role} readOnly disabled />
        </Field>
      </div>
    </>
  );
}

export function BusinessPanel({ values, set }) {
  return (
    <div className="st-grid-2">
      <Field label="Business name">
        <TextInput icon="bi-shop" value={values.shop_name} onChange={(e) => set('shop_name', e.target.value)} />
      </Field>
      <Field label="Business type">
        <SelectInput value={values.shop_type} onChange={(e) => set('shop_type', e.target.value)} options={SHOP_TYPES} />
      </Field>
      <Field label="Currency" hint="Only INR is supported at the moment.">
        <SelectInput value={values.currency} onChange={(e) => set('currency', e.target.value)} options={[{ value: 'INR', label: '₹ Indian Rupee' }]} />
      </Field>
      <Field label="Timezone">
        <SelectInput value={values.timezone} onChange={(e) => set('timezone', e.target.value)} options={TIMEZONES} />
      </Field>
      <Field label="GST number" hint="Optional. Leave blank if not registered." wide>
        <TextInput icon="bi-receipt" value={values.gst} onChange={(e) => set('gst', e.target.value.toUpperCase())} placeholder="Optional" />
      </Field>
    </div>
  );
}

export function AppearancePanel({ values, set }) {
  const { theme, setTheme } = useTheme();

  // Light and dark apply immediately. "System" resolves the device preference
  // once and applies it — the app theme is stored as a concrete value, so it
  // will not keep following the OS after this.
  function chooseMode(mode) {
    set('themeMode', mode);
    if (mode === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    } else {
      setTheme(mode);
    }
  }

  return (
    <>
      <SettingRow title="Theme" detail={`Currently showing the ${theme} theme.`}>
        <span className="st-row-value">{theme === 'dark' ? 'Dark' : 'Light'}</span>
      </SettingRow>
      <OptionCards name="theme" options={THEME_MODES} value={values.themeMode} onChange={chooseMode} />

      <div className="st-divider" />

      <SettingRow title="Accent theme" detail="Warm Beige is the ShelfSense default and the only palette wired up so far." index={1} />
      <OptionCards name="accent" options={ACCENTS} value={values.accent} onChange={(id) => set('accent', id)} columns={4} />

      <div className="st-divider" />

      <SettingRow title="Reduce motion" detail="Shorten animations across the application." index={2}>
        <Toggle checked={values.reduceMotion} onChange={(next) => set('reduceMotion', next)} label="Reduce motion" />
      </SettingRow>
      <SettingRow title="Compact density" detail="Tighter spacing in tables and lists." index={3}>
        <Toggle checked={values.compact} onChange={(next) => set('compact', next)} label="Compact density" />
      </SettingRow>
    </>
  );
}

export function NotificationsPanel({ values, set, prefs, onPref }) {
  return (
    <>
      {prefs.map((pref, index) => (
        <SettingRow key={pref.id} title={pref.label} detail={pref.detail} index={index}>
          <Toggle checked={pref.enabled} onChange={() => onPref(pref.id)} label={pref.label} />
        </SettingRow>
      ))}

      <div className="st-divider" />

      <SettingRow title="Notification priority" detail="How much reaches you, and how quickly." index={4} />
      <OptionCards name="priority" options={NOTIFICATION_PRIORITY} value={values.priority} onChange={(id) => set('priority', id)} />

      <div className="st-divider" />

      <div className="st-grid-2">
        <Field label="Quiet hours start">
          <TextInput icon="bi-moon" type="time" value={values.quietStart} onChange={(e) => set('quietStart', e.target.value)} />
        </Field>
        <Field label="Quiet hours end">
          <TextInput icon="bi-sun" type="time" value={values.quietEnd} onChange={(e) => set('quietEnd', e.target.value)} />
        </Field>
      </div>
    </>
  );
}

export function SecurityPanel({ values, set, sessions, onSignOut, onChangePassword }) {
  return (
    <>
      <SettingRow title="Password" detail="Last changed 3 months ago.">
        <button type="button" className="st-btn st-btn-ghost" onClick={onChangePassword}>
          <i className="bi bi-key" aria-hidden="true" />Change password
        </button>
      </SettingRow>

      <SettingRow title="Two-factor authentication" detail="Require a one-time code from an authenticator app at sign-in." index={1}>
        <Toggle checked={values.twoFactor} onChange={(next) => set('twoFactor', next)} label="Two-factor authentication" />
      </SettingRow>

      {values.twoFactor && (
        <motion.div
          className="st-note"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: .3, ease: EASE }}
        >
          <i className="bi bi-info-circle" aria-hidden="true" />
          Interface only — no authenticator is enrolled and no codes are required. This arrives with the backend.
        </motion.div>
      )}

      <div className="st-divider" />

      <SettingRow title="Active sessions" detail={`${sessions.length} devices are signed in to this account.`} index={2} />
      <ul className="st-sessions">
        {sessions.map((session, index) => (
          <motion.li
            key={session.id}
            className={session.current ? 'is-current' : ''}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .4, delay: index * .06, ease: EASE }}
          >
            <span className="st-session-icon"><i className={`bi bi-${session.device.includes('iPhone') || session.device.includes('Android') ? 'phone' : 'laptop'}`} aria-hidden="true" /></span>
            <div>
              <strong>{session.device}{session.current && <em>This device</em>}</strong>
              <small>{session.location} · {session.ip} · {session.when}</small>
            </div>
            {!session.current && (
              <button type="button" className="st-btn st-btn-quiet is-danger" onClick={() => onSignOut(session.id)}>
                Sign out
              </button>
            )}
          </motion.li>
        ))}
      </ul>
    </>
  );
}

export function AiPanel({ values, set }) {
  return (
    <>
      <SettingRow title="Daily business brief" detail="A short summary of what changed overnight." >
        <Toggle checked={values.dailyBrief} onChange={(next) => set('dailyBrief', next)} label="Daily business brief" />
      </SettingRow>
      <OptionCards name="frequency" options={BRIEF_FREQUENCY} value={values.briefFrequency} onChange={(id) => set('briefFrequency', id)} />

      <div className="st-divider" />

      <SettingRow title="Recommendation sensitivity" detail="How much evidence the models want before they speak up." index={1} />
      <OptionCards name="sensitivity" options={SENSITIVITY} value={values.sensitivity} onChange={(id) => set('sensitivity', id)} />

      <div className="st-divider" />

      <SettingRow
        title="Minimum forecast confidence"
        detail="Recommendations below this threshold are held back rather than shown."
        index={2}
      >
        <span className="st-row-value is-strong">{values.confidence}%</span>
      </SettingRow>
      <div className="st-slider">
        <input
          type="range"
          min="50" max="99" step="1"
          value={values.confidence}
          onChange={(e) => set('confidence', Number(e.target.value))}
          aria-label="Minimum forecast confidence"
        />
        <div className="st-slider-scale"><span>50%</span><span>75%</span><span>99%</span></div>
        <p className="st-slider-note">
          {values.confidence >= 90
            ? 'Only high-certainty recommendations. You will see fewer, and miss some early signals.'
            : values.confidence >= 70
              ? 'A balanced threshold. Most actionable recommendations reach you.'
              : 'Everything reaches you, including low-confidence guesses worth checking yourself.'}
        </p>
      </div>

      <div className="st-divider" />

      <SettingRow title="Explain every recommendation" detail="Always include the reasoning and expected impact." index={3}>
        <Toggle checked={values.explain} onChange={(next) => set('explain', next)} label="Explain every recommendation" />
      </SettingRow>
      <div className="st-note is-locked">
        <i className="bi bi-hand-index-thumb" aria-hidden="true" />
        ShelfSense never places an order, applies a discount or edits inventory. That is fixed by design and cannot be turned off.
      </div>
    </>
  );
}

export function DataPanel({ onExport, onDelete }) {
  return (
    <>
      <SettingRow title="Export your data" detail="Everything ShelfSense holds for your business, as CSV files in a single archive.">
        <button type="button" className="st-btn st-btn-ghost" onClick={onExport}>
          <i className="bi bi-download" aria-hidden="true" />Export
        </button>
      </SettingRow>

      <SettingRow title="Data retention" detail="Synchronized records are kept for 24 months, then aggregated." index={1}>
        <span className="st-row-value">24 months</span>
      </SettingRow>

      <SettingRow title="Analytics sharing" detail="ShelfSense does not sell or share your business data. Ever." index={2}>
        <span className="st-row-value is-good"><i className="bi bi-shield-check" aria-hidden="true" />Never shared</span>
      </SettingRow>

      <div className="st-divider" />

      <div className="st-danger">
        <div>
          <strong>Delete account</strong>
          <small>Permanently removes your account, your business and every synchronized record. This cannot be undone.</small>
        </div>
        <button type="button" className="st-btn st-btn-danger" onClick={onDelete}>
          <i className="bi bi-trash3" aria-hidden="true" />Delete account
        </button>
      </div>
    </>
  );
}

export function IntegrationsPanel({ integrations, onToggle }) {
  return (
    <ul className="st-integrations">
      {integrations.map((item, index) => (
        <motion.li
          key={item.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .45, delay: index * .06, ease: EASE }}
        >
          <span className={`st-int-icon${item.status === 'connected' ? ' is-connected' : ''}`}>
            <i className={`bi ${item.icon}`} aria-hidden="true" />
          </span>
          <div>
            <strong>{item.name}</strong>
            <small>{item.detail}</small>
          </div>
          {item.status === 'connected' ? (
            <span className="st-int-tag"><i className="bi bi-check-circle" aria-hidden="true" />Connected</span>
          ) : (
            <button type="button" className="st-btn st-btn-ghost" onClick={() => onToggle(item.id)}>Connect</button>
          )}
        </motion.li>
      ))}
    </ul>
  );
}

export function SystemPanel({ values, set }) {
  return (
    <div className="st-grid-2">
      <Field label="Language" hint="Interface language.">
        <SelectInput value={values.language} onChange={(e) => set('language', e.target.value)} options={LANGUAGES} />
      </Field>
      <Field label="Date format">
        <SelectInput value={values.dateFormat} onChange={(e) => set('dateFormat', e.target.value)} options={DATE_FORMATS} />
      </Field>
      <Field label="Start page" hint="Where ShelfSense opens after sign-in.">
        <SelectInput value={values.startPage} onChange={(e) => set('startPage', e.target.value)} options={START_PAGES} />
      </Field>
      <Field label="Rows per page">
        <SelectInput value={values.pageSize} onChange={(e) => set('pageSize', e.target.value)} options={['10', '25', '50', '100']} />
      </Field>
    </div>
  );
}

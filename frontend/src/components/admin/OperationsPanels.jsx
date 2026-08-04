import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, LineChart } from '../charts';
import EmptyState from '../ui/EmptyState';
import {
  ACTIVITY, ANALYTICS, AUDIT_LOGS, BACKUPS, ROLES, SETTINGS, SUPPORT,
} from './data';

const EASE = [.16, 1, .3, 1];

// The supporting panels. Grouped in one file because they share a shape and
// none is large enough to earn its own.

export function ActivityFeed() {
  return (
    <section className="ad-panel" aria-label="System activity">
      <header className="ad-section-head">
        <div>
          <p className="ad-eyebrow">System activity</p>
          <h2>What the platform is doing</h2>
        </div>
        <span className="ad-live"><span className="ad-live-dot" aria-hidden="true" />Live</span>
      </header>

      <ol className="ad-feed">
        <motion.span
          className="ad-feed-rail"
          aria-hidden="true"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.1, ease: EASE }}
        />
        {ACTIVITY.map((event, index) => (
          <motion.li
            key={event.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .45, delay: index * .07, ease: EASE }}
          >
            <span className={`ad-feed-dot tone-${event.tone}`}><i className={`bi ${event.icon}`} aria-hidden="true" /></span>
            <div>
              <strong>{event.title}</strong>
              <small>{event.detail}</small>
            </div>
            <time>{event.time}</time>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}

export function RolesPanel() {
  return (
    <section className="ad-panel" aria-label="Roles and permissions">
      <header className="ad-section-head">
        <div>
          <p className="ad-eyebrow">Roles &amp; permissions</p>
          <h2>Who can do what</h2>
        </div>
      </header>

      <div className="ad-roles">
        {ROLES.map((role, index) => (
          <motion.article
            key={role.id}
            className={`ad-role-card tone-${role.tone}`}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: .3 }}
            transition={{ duration: .55, delay: index * .1, ease: EASE }}
          >
            <header>
              <span className={`ad-role tone-${role.tone}`}>{role.label}</span>
              <span className="ad-role-count">{role.users.toLocaleString('en-IN')} users</span>
            </header>
            <p>{role.description}</p>
            <ul className="ad-perms">
              {role.permissions.map((permission) => (
                <li key={permission}><i className="bi bi-check-lg" aria-hidden="true" />{permission}</li>
              ))}
              {role.denied?.map((permission) => (
                <li className="is-denied" key={permission}><i className="bi bi-x-lg" aria-hidden="true" />{permission}</li>
              ))}
            </ul>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

export function PlatformAnalytics() {
  return (
    <section className="ad-panel" aria-label="Platform analytics">
      <header className="ad-section-head">
        <div>
          <p className="ad-eyebrow">Platform analytics</p>
          <h2>Growth and load this week</h2>
        </div>
      </header>

      <div className="ad-analytics">
        <div className="ad-chart-block">
          <h4>New registrations</h4>
          <LineChart id="ad-signups" values={ANALYTICS.signups.values} labels={ANALYTICS.signups.labels} tone="gold" />
        </div>
        <div className="ad-chart-block">
          <h4>Synchronizations per day</h4>
          <BarChart values={ANALYTICS.syncs.values} labels={ANALYTICS.syncs.labels} />
        </div>
      </div>
    </section>
  );
}

export function AuditLogs() {
  return (
    <section className="ad-panel" aria-label="Audit logs">
      <header className="ad-section-head">
        <div>
          <p className="ad-eyebrow">Audit logs</p>
          <h2>Every change, and who made it</h2>
        </div>
      </header>

      <ol className="ad-logs">
        {AUDIT_LOGS.map((log, index) => (
          <motion.li
            key={log.id}
            className={`tone-${log.tone}`}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: .3 }}
            transition={{ duration: .45, delay: index * .05, ease: EASE }}
          >
            <code className="ad-log-action">{log.action}</code>
            <div>
              <strong>{log.detail}</strong>
              <small>{log.actor} → {log.target}</small>
            </div>
            <time>{log.time}</time>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}

export function SystemSettings() {
  const [settings, setSettings] = useState(SETTINGS);

  const toggle = (id) => setSettings((current) => current.map((setting) => (
    setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
  )));

  return (
    <section className="ad-panel" aria-label="System settings">
      <header className="ad-section-head">
        <div>
          <p className="ad-eyebrow">System settings</p>
          <h2>Platform-wide switches</h2>
        </div>
      </header>

      <ul className="ad-settings">
        {settings.map((setting, index) => (
          <motion.li
            key={setting.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: .3 }}
            transition={{ duration: .45, delay: index * .06, ease: EASE }}
          >
            <div>
              <strong>{setting.label}</strong>
              <small>{setting.detail}</small>
            </div>
            <button
              type="button"
              className={`ad-toggle${setting.enabled ? ' is-on' : ''}`}
              onClick={() => toggle(setting.id)}
              role="switch"
              aria-checked={setting.enabled}
              aria-label={setting.label}
            >
              <motion.span layout transition={{ duration: .26, ease: EASE }} />
            </button>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}

export function MaintenancePanel() {
  return (
    <section className="ad-panel" aria-label="Backup and maintenance">
      <header className="ad-section-head">
        <div>
          <p className="ad-eyebrow">Backup &amp; maintenance</p>
          <h2>Snapshots and scheduled work</h2>
        </div>
        <button type="button" className="ad-btn ad-btn-ghost" disabled>
          <i className="bi bi-database-down" aria-hidden="true" />Run backup
        </button>
      </header>

      <ul className="ad-backups">
        {BACKUPS.map((backup, index) => (
          <motion.li
            key={backup.id}
            className={`tone-${backup.state === 'success' ? 'success' : 'danger'}`}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: .3 }}
            transition={{ duration: .45, delay: index * .06, ease: EASE }}
          >
            <span className="ad-backup-icon">
              <i className={`bi bi-${backup.state === 'success' ? 'database-check' : 'database-x'}`} aria-hidden="true" />
            </span>
            <div>
              <strong>{backup.label}</strong>
              <small>{backup.when}</small>
            </div>
            <span className="ad-backup-size">{backup.size}</span>
          </motion.li>
        ))}
      </ul>

      <p className="ad-panel-note">
        <i className="bi bi-info-circle" aria-hidden="true" />
        Backup controls are placeholders — no job is queued and nothing is written.
      </p>
    </section>
  );
}

export function SupportPanel() {
  return (
    <section className="ad-panel" aria-label="Support dashboard">
      <header className="ad-section-head">
        <div>
          <p className="ad-eyebrow">Support</p>
          <h2>Open conversations</h2>
        </div>
        <span className="ad-count">Median response {SUPPORT.medianResponse}</span>
      </header>

      <div className="ad-support-stats">
        {[['Open', SUPPORT.open, 'warning'], ['Waiting on user', SUPPORT.waiting, 'olive'], ['Resolved today', SUPPORT.resolvedToday, 'success']].map(([label, value, tone]) => (
          <div className={`tone-${tone}`} key={label}>
            <strong>{value}</strong>
            <small>{label}</small>
          </div>
        ))}
      </div>

      {SUPPORT.tickets.length === 0 ? (
        <EmptyState icon="bi-chat-dots" title="No open tickets" description="Support conversations will appear here." />
      ) : (
        <ul className="ad-tickets">
          {SUPPORT.tickets.map((ticket, index) => (
            <motion.li
              key={ticket.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: .3 }}
              transition={{ duration: .45, delay: index * .06, ease: EASE }}
            >
              <code>{ticket.id}</code>
              <div>
                <strong>{ticket.subject}</strong>
                <small>{ticket.business}</small>
              </div>
              <span className={`ad-ticket-priority is-${ticket.priority}`}>{ticket.priority}</span>
              <time>{ticket.age}</time>
            </motion.li>
          ))}
        </ul>
      )}
    </section>
  );
}

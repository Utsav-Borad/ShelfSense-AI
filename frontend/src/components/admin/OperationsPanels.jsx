import { motion } from 'framer-motion';
import { LineChart } from '../charts';
import { ROLES } from './data';

const EASE = [.16, 1, .3, 1];

// The supporting panels. Grouped in one file because they share a shape and
// neither is large enough to earn its own.
//
// The activity feed, audit log, backup list, support queue and system-settings
// switches that used to sit here are gone: nothing records platform events,
// runs backups or stores platform-wide settings, so every row in them was
// written by hand and none of the controls did anything.

export function RolesPanel({ counts }) {
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
              <span className="ad-role-count">
                {(counts[role.id] || 0).toLocaleString('en-IN')} {counts[role.id] === 1 ? 'account' : 'accounts'}
              </span>
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

export function PlatformAnalytics({ signups }) {
  return (
    <section className="ad-panel" aria-label="Platform analytics">
      <header className="ad-section-head">
        <div>
          <p className="ad-eyebrow">Platform growth</p>
          <h2>Registrations this week</h2>
        </div>
      </header>

      <div className="ad-chart-block">
        <h4>New accounts per day</h4>
        <LineChart id="ad-signups" values={signups.values} labels={signups.labels} tone="gold" />
      </div>
    </section>
  );
}

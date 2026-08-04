import { motion } from 'framer-motion';

const EASE = [.16, 1, .3, 1];

// The small shared controls every settings panel is built from.

export function Field({ label, hint, children, wide }) {
  return (
    <label className={`st-field${wide ? ' is-wide' : ''}`}>
      <span className="st-field-label">{label}</span>
      {children}
      {hint && <small className="st-field-hint">{hint}</small>}
    </label>
  );
}

export function TextInput({ icon, ...props }) {
  return (
    <span className={`st-input${icon ? ' has-icon' : ''}`}>
      {icon && <i className={`bi ${icon}`} aria-hidden="true" />}
      <input {...props} />
    </span>
  );
}

export function SelectInput({ options, ...props }) {
  return (
    <span className="st-input is-select">
      <select {...props}>
        {options.map((option) => {
          const value = typeof option === 'string' ? option : option.value;
          const label = typeof option === 'string' ? option : option.label;
          return <option key={value} value={value}>{label}</option>;
        })}
      </select>
      <i className="bi bi-chevron-down" aria-hidden="true" />
    </span>
  );
}

export function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`st-toggle${checked ? ' is-on' : ''}`}
      onClick={() => onChange(!checked)}
    >
      <motion.span layout transition={{ duration: .26, ease: EASE }} />
    </button>
  );
}

// A row with a description on the left and a control on the right.
export function SettingRow({ title, detail, children, index = 0 }) {
  return (
    <motion.div
      className="st-row"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .45, delay: index * .05, ease: EASE }}
    >
      <div>
        <strong>{title}</strong>
        {detail && <small>{detail}</small>}
      </div>
      {children}
    </motion.div>
  );
}

// A set of mutually exclusive cards — used wherever a radio group would be
// too plain for the weight of the choice.
export function OptionCards({ options, value, onChange, name, columns = 3 }) {
  return (
    <div className={`st-options cols-${columns}`} role="radiogroup" aria-label={name}>
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          role="radio"
          aria-checked={value === option.id}
          className={`st-option${value === option.id ? ' is-active' : ''}${option.available === false ? ' is-locked' : ''}`}
          onClick={() => option.available !== false && onChange(option.id)}
          disabled={option.available === false}
        >
          {option.swatch && <span className="st-swatch" style={{ background: option.swatch }} aria-hidden="true" />}
          {option.icon && <span className="st-option-icon"><i className={`bi ${option.icon}`} aria-hidden="true" /></span>}
          <span className="st-option-body">
            <strong>{option.label}</strong>
            {option.detail && <small>{option.detail}</small>}
          </span>
          {value === option.id && (
            <motion.span className="st-option-tick" layoutId={`st-tick-${name}`} transition={{ duration: .3, ease: EASE }}>
              <i className="bi bi-check-lg" aria-hidden="true" />
            </motion.span>
          )}
          {option.available === false && <span className="st-option-soon">Soon</span>}
        </button>
      ))}
    </div>
  );
}

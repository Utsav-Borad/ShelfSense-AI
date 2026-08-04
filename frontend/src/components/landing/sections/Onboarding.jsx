import { RevealCard, SectionHead } from './Reveal';

const steps = [
  ['bi-person-plus', 'Create your account', 'Name, email, password. Nothing else is asked for and no card is needed.'],
  ['bi-shop', 'Add your business', 'Shop name, type, address and GST number. This scopes every product, supplier and metric to you.'],
  ['bi-cloud-arrow-up', 'Upload your first CSV', 'Export from your POS and drop it in. The dashboard fills itself the moment the sync commits.'],
];

export default function Onboarding() {
  return (
    <section className="ss-section ss-onboarding" id="start">
      <SectionHead
        align="center"
        eyebrow="Getting started"
        title={<>Three steps between here<br />and your <em>first recommendation</em>.</>}
      />
      <div className="ss-steps">
        {steps.map(([icon, title, text], i) => (
          <RevealCard className="ss-step" key={title} delay={i * .12}>
            <span className="ss-step-num">{String(i + 1).padStart(2, '0')}</span>
            <span className="ss-step-icon"><i className={`bi ${icon}`} /></span>
            <h3>{title}</h3>
            <p>{text}</p>
          </RevealCard>
        ))}
      </div>
    </section>
  );
}

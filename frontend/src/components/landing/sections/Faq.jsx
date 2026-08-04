import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Reveal, { EASE, SectionHead } from './Reveal';

const faqs = [
  ['Does ShelfSense replace my billing or POS software?', 'No, and it is not trying to. ShelfSense begins after billing. You keep the system you already use for sales and invoicing; ShelfSense reads what it exports and works out what you should do about it.'],
  ['Will it change my stock or place orders automatically?', 'Never. Every output is advisory. ShelfSense will tell you to reorder 24 units and explain exactly why, but the order, the discount and the final decision remain yours.'],
  ['What data does it actually need?', 'Three CSV exports: a sales report, an inventory snapshot, and a purchase history. Those are standard exports from almost any POS, and templates for all three are provided.'],
  ['What happens if my file has an error in it?', 'Nothing is written. The synchronization is all-or-nothing inside a single transaction. You get back the error code, the column, and the exact row numbers so you can correct the file and upload it again.'],
  ['How does it justify a recommendation?', 'Every prediction carries four things: the prediction itself, a confidence score, the reasoning behind it, and the estimated financial impact. If you disagree with the reasoning, you can ignore the advice.'],
  ['Which kinds of business is this built for?', 'Retail businesses whose products carry a manufacturing date and an expiry date — grocery, medical, bakery, dairy, cosmetic, organic food, frozen food and pet food shops.'],
];

function Item({ q, a, open, onToggle, index }) {
  return (
    <Reveal className={`ss-faq-item${open ? ' is-open' : ''}`} delay={index * .05}>
      <button onClick={onToggle} aria-expanded={open}>
        <span>{q}</span>
        <motion.i className="bi bi-plus-lg" animate={{ rotate: open ? 45 : 0 }} transition={{ duration: .3, ease: EASE }} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="a" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .35, ease: EASE }}>
            <p>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </Reveal>
  );
}

export default function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="ss-section ss-faq" id="faq">
      <SectionHead align="center" eyebrow="Questions worth asking" title={<>Before you upload<br />a single <em>file</em>.</>} />
      <div className="ss-faq-list">
        {faqs.map(([q, a], i) => <Item key={q} q={q} a={a} index={i} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />)}
      </div>
    </section>
  );
}

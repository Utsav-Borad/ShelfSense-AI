import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Reveal, { EASE, SectionHead } from './Reveal';

// The three canonical report formats, with the exact column headers the
// validation engine expects.
const reports = {
  sales: { label: 'Sales report', icon: 'bi-receipt', columns: ['invoice_number', 'barcode', 'sale_date', 'quantity_sold', 'selling_price', 'discount', 'total_amount'] },
  inventory: { label: 'Inventory snapshot', icon: 'bi-boxes', columns: ['barcode', 'product_name', 'available_quantity', 'reserved_quantity', 'damaged_quantity'] },
  purchase: { label: 'Purchase history', icon: 'bi-bag-check', columns: ['invoice_number', 'barcode', 'product_name', 'supplier_name', 'purchase_date', 'purchase_price', 'quantity', 'batch_number', 'expiry_date'] },
};

export default function CsvFlow() {
  const [type, setType] = useState('sales');
  const report = reports[type];

  return (
    <section className="ss-section ss-csv" id="sync">
      <div className="ss-csv-grid">
        <div className="ss-csv-copy">
          <SectionHead
            eyebrow="Synchronization"
            title={<>Three files.<br />Nothing to <em>re-type</em>.</>}
            lead="Export the reports your POS already produces and upload them. ShelfSense validates every column, type, date and duplicate before a single row reaches the database."
          />
          <Reveal className="ss-csv-points" delay={.14}>
            <p><i className="bi bi-shield-check" /><span><strong>All or nothing.</strong> If any row fails, nothing is written. Your data is never left half-synchronized.</span></p>
            <p><i className="bi bi-list-columns" /><span><strong>Row-level errors.</strong> You get the column, the reason and the exact row numbers — not "upload failed".</span></p>
            <p><i className="bi bi-arrow-repeat" /><span><strong>Analytics follow the commit.</strong> Metrics and predictions recompute only once the sync has safely landed.</span></p>
          </Reveal>
        </div>

        <Reveal className="ss-csv-panel" delay={.1}>
          <div className="ss-csv-tabs">
            {Object.entries(reports).map(([key, r]) => (
              <button key={key} className={key === type ? 'is-active' : ''} onClick={() => setType(key)} aria-pressed={key === type}>
                <i className={`bi ${r.icon}`} />{r.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={type} className="ss-csv-file" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .32, ease: EASE }}>
              <div className="ss-csv-file-head"><i className="bi bi-filetype-csv" />{type}_report.csv<span>required columns</span></div>
              <div className="ss-csv-cols">
                {report.columns.map((c, i) => (
                  <motion.code key={c} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .04, duration: .3, ease: EASE }}>{c}</motion.code>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="ss-csv-result">
            <span className="ss-csv-result-ok"><i className="bi bi-check-circle-fill" />124 of 124 rows accepted</span>
            <span className="ss-csv-result-bad"><i className="bi bi-x-circle-fill" /><code>invalid_dates</code> · column <code>sale_date</code> · rows 3, 41</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

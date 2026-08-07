import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthLayout, FormAlert, FormField, SelectField, StepProgress, SubmitButton, SHOP_TYPES, composeAddress, rules, PINCODE_PATTERN } from '../../components/auth';
import { useAuth } from '../../hooks/useAuth';
import { createBusiness } from '../../services/businessService';
import { UnknownPincode, lookupPincode } from '../../services/pincodeService';

const EASE = [.16, 1, .3, 1];
const STEPS = ['Business details', 'Preferences', 'All set'];
const STEP_FIELDS = [['shop_name', 'shop_type', 'address_line', 'society', 'area', 'city', 'state', 'pincode', 'phone', 'gst_number'], ['currency', 'low_stock_threshold', 'expiry_window'], []];

// What the PIN field says about itself, per lookup state.
const PIN_HINT = {
  idle: 'City and state are filled in from your PIN code.',
  loading: 'Checking this PIN code…',
  found: 'PIN code verified.',
  unknown: '',
  failed: '',
};

// The tick / spinner / cross inside the PIN field.
function PinStatus({ status }) {
  if (status === 'loading') {
    return (
      <motion.i
        className="bi bi-arrow-repeat auth-input-trailing"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        aria-label="Checking PIN code"
      />
    );
  }
  if (status === 'found') {
    return <i className="bi bi-check-circle-fill auth-input-trailing is-ok" aria-label="PIN code verified" />;
  }
  if (status === 'unknown' || status === 'failed') {
    return <i className="bi bi-exclamation-circle-fill auth-input-trailing is-bad" aria-label="PIN code not verified" />;
  }
  return null;
}

const variants = {
  enter: (dir) => ({ opacity: 0, x: dir > 0 ? 34 : -34 }),
  center: { opacity: 1, x: 0 },
  exit: (dir) => ({ opacity: 0, x: dir > 0 ? -34 : 34 }),
};

export default function BusinessSetupPage() {
  const { user, completeBusinessSetup } = useAuth();
  const navigate = useNavigate();
  const [[step, direction], setStep] = useState([0, 0]);
  const [formError, setFormError] = useState('');

  const {
    register, handleSubmit, trigger, getValues, setValue, watch,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onTouched',
    defaultValues: {
      shop_name: '', shop_type: '', phone: '', gst_number: '',
      address_line: '', society: '', area: '', city: '', state: '', pincode: '',
      currency: 'INR', low_stock_threshold: '10', expiry_window: '30',
      email_reports: true, ai_alerts: true,
    },
  });

  // --- PIN code verification -------------------------------------------
  // City and state are never typed. They arrive from India Post's directory,
  // and the form refuses to move on until the PIN entered has been confirmed
  // to exist — so an address can't be saved with a city that isn't in it.
  const pincode = watch('pincode');
  const [lookup, setLookup] = useState({ status: 'idle', pincode: '', message: '' });
  // Every post office India Post lists under the verified PIN. One PIN usually
  // covers several localities, so this becomes the Area dropdown rather than
  // being guessed at in a text box.
  const [localities, setLocalities] = useState([]);
  // Read inside the validation rule, which react-hook-form may call with a
  // stale closure otherwise.
  const verifiedRef = useRef('');

  useEffect(() => {
    const value = String(pincode || '').trim();

    // Anything that isn't a complete PIN clears whatever was filled in, so a
    // half-edited code can never leave last attempt's city behind.
    if (!PINCODE_PATTERN.test(value)) {
      verifiedRef.current = '';
      setLookup({ status: 'idle', pincode: '', message: '' });
      setLocalities([]);
      if (getValues('city') || getValues('state') || getValues('area')) {
        setValue('city', '');
        setValue('state', '');
        setValue('area', '');
      }
      return undefined;
    }

    if (verifiedRef.current === value) return undefined;

    let active = true;
    setLookup({ status: 'loading', pincode: value, message: '' });

    async function find() {
      try {
        const place = await lookupPincode(value);
        if (!active) return;
        setValue('city', place.city, { shouldValidate: true });
        setValue('state', place.state, { shouldValidate: true });
        setLocalities(place.localities);
        // A single-locality PIN has nothing to choose, so choose it for them.
        setValue(
          'area',
          place.localities.length === 1 ? place.localities[0] : '',
          { shouldValidate: false },
        );
        verifiedRef.current = value;
        setLookup({ status: 'found', pincode: value, message: `${place.city}, ${place.state}` });
        trigger('pincode');
      } catch (error) {
        if (!active) return;
        verifiedRef.current = '';
        setValue('city', '');
        setValue('state', '');
        setValue('area', '');
        setLocalities([]);
        setLookup({
          status: error instanceof UnknownPincode ? 'unknown' : 'failed',
          pincode: value,
          message: error.message,
        });
        trigger('pincode');
      }
    }

    // A short pause so a lookup isn't fired on every keystroke of the sixth
    // digit being corrected.
    const timer = setTimeout(find, 250);
    return () => { active = false; clearTimeout(timer); };
  }, [pincode, setValue, getValues, trigger]);

  // The gate. Even if every other rule passes, an unverified PIN blocks the
  // step — this is what makes "wrong data is never accepted" true rather than
  // just likely.
  const pincodeRules = {
    ...rules.pincode,
    validate: (value) => (
      verifiedRef.current === String(value || '').trim()
        || 'Wait for this PIN code to be verified, or correct it.'
    ),
  };

  // The area has to be one India Post actually lists under that PIN. A stale
  // value left over from a previous code is rejected here, not just hidden.
  const areaRules = {
    required: 'Please choose your area.',
    validate: (value) => (
      localities.includes(value) || 'Choose an area from the list.'
    ),
  };

  const goNext = async () => {
    const valid = await trigger(STEP_FIELDS[step], { shouldFocus: true });
    if (valid) setStep([step + 1, 1]);
  };
  const goBack = () => setStep([Math.max(step - 1, 0), -1]);

  // Only the documented Business fields go to the API; the preferences are
  // held locally until a settings endpoint exists for them.
  const onSubmit = async (values) => {
    setFormError('');
    // Last line of defence: the submit handler itself will not send an address
    // whose PIN was not confirmed by the lookup.
    if (verifiedRef.current !== String(values.pincode || '').trim()) {
      setFormError('Please enter a PIN code we can verify before saving.');
      setStep([0, -1]);
      return;
    }
    try {
      const response = await createBusiness({
        shop_name: values.shop_name.trim(),
        shop_type: values.shop_type,
        address: composeAddress(values),
        phone: values.phone.trim(),
        gst_number: values.gst_number?.trim().toUpperCase() || null,
      });
      completeBusinessSetup({
        ...response.data,
        preferences: {
          currency: values.currency,
          low_stock_threshold: Number(values.low_stock_threshold),
          expiry_window: Number(values.expiry_window),
          email_reports: values.email_reports,
          ai_alerts: values.ai_alerts,
        },
      });
      setStep([2, 1]);
    } catch (error) {
      setFormError(error.detail || 'We could not save your business. Please try again.');
      setStep([0, -1]);
    }
  };

  const values = getValues();

  return (
    <AuthLayout side="setup">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, ease: EASE }}>
        <header className="auth-header">
          <h1>{step === 2 ? 'You’re ready' : `Welcome${user?.full_name ? `, ${user.full_name.split(' ')[0]}` : ''}`}</h1>
          <p>{step === 2 ? 'Your workspace is set up and waiting for its first upload.' : 'Tell us about your shop so every metric and recommendation is scoped to you.'}</p>
        </header>

        <StepProgress steps={STEPS} current={step} />
        <FormAlert message={formError} />

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="auth-step-viewport">
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <motion.div key={step} custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: .34, ease: EASE }}>
                {step === 0 && (
                  <>
                    <FormField label="Shop name" icon="bi-shop" placeholder="Borad Provision Store" autoFocus error={errors.shop_name?.message} field={register('shop_name', rules.shopName)} />
                    <SelectField label="Type of shop" placeholder="Select the closest match" options={SHOP_TYPES} error={errors.shop_type?.message} field={register('shop_type', rules.shopType)} />
                    <fieldset className="auth-fieldset">
                      <legend>Business address</legend>
                      <div className="auth-grid-2">
                        <FormField label="Flat / House / Shop no." icon="bi-house" placeholder="B-402" error={errors.address_line?.message} field={register('address_line', rules.addressLine)} />
                        <FormField label="Building / Society" icon="bi-buildings" placeholder="Shanti Residency" error={errors.society?.message} field={register('society', rules.society)} />
                      </div>
                      {/* The PIN code drives the three fields under it. */}
                      <FormField
                        label="PIN code"
                        icon="bi-mailbox"
                        placeholder="380015"
                        inputMode="numeric"
                        maxLength={6}
                        autoComplete="postal-code"
                        hint={PIN_HINT[lookup.status] || PIN_HINT.idle}
                        error={errors.pincode?.message || (lookup.status === 'unknown' || lookup.status === 'failed' ? lookup.message : '')}
                        trailing={<PinStatus status={lookup.status} />}
                        field={register('pincode', pincodeRules)}
                      />
                      {/* Every post office under that PIN. Choosing from the
                          list means the locality always belongs to the code
                          above it, which typing could never guarantee. */}
                      <SelectField
                        label="Area / Locality"
                        placeholder={localities.length ? 'Choose your area' : 'Enter a PIN code first'}
                        options={localities}
                        disabled={localities.length === 0}
                        hint={localities.length > 1 ? `${localities.length} areas under this PIN code.` : ''}
                        error={errors.area?.message}
                        field={register('area', areaRules)}
                      />
                      <div className="auth-grid-2">
                        {/* Read-only on purpose: these come from India Post, so
                            they cannot disagree with the PIN code above. */}
                        <FormField
                          label="City"
                          icon="bi-geo-alt"
                          placeholder="Filled from your PIN code"
                          readOnly
                          tabIndex={-1}
                          error={errors.city?.message}
                          field={register('city', rules.city)}
                        />
                        <FormField
                          label="State"
                          icon="bi-map"
                          placeholder="Filled from your PIN code"
                          readOnly
                          tabIndex={-1}
                          error={errors.state?.message}
                          field={register('state', rules.state)}
                        />
                      </div>
                    </fieldset>
                    <div className="auth-grid-2">
                      <FormField label="Contact number" icon="bi-telephone" placeholder="+91 98765 43210" inputMode="tel" error={errors.phone?.message} field={register('phone', rules.phone)} />
                      <FormField label="GST number" icon="bi-receipt" placeholder="Optional" hint="Leave blank if not registered." error={errors.gst_number?.message} field={register('gst_number', rules.gstNumber)} />
                    </div>
                  </>
                )}

                {step === 1 && (
                  <>
                    <div className="auth-grid-2">
                      <SelectField label="Currency" options={[{ value: 'INR', label: '₹ Indian Rupee' }]} field={register('currency')} />
                      <FormField label="Low stock threshold" type="number" min="1" icon="bi-box-seam" hint="Flag a product below this count." field={register('low_stock_threshold')} />
                    </div>
                    <FormField label="Near-expiry window (days)" type="number" min="1" icon="bi-clock-history" hint="How far ahead expiry risk should surface." field={register('expiry_window')} />
                    <fieldset className="auth-fieldset">
                      <legend>What should reach you</legend>
                      <label className="auth-checkbox auth-checkbox-block">
                        <input type="checkbox" {...register('email_reports')} />
                        <span><strong>Email reports</strong><small>Daily, weekly and monthly summaries.</small></span>
                      </label>
                      <label className="auth-checkbox auth-checkbox-block">
                        <input type="checkbox" {...register('ai_alerts')} />
                        <span><strong>AI recommendations</strong><small>Notify me when an action needs attention.</small></span>
                      </label>
                    </fieldset>
                  </>
                )}

                {step === 2 && (
                  <div className="auth-success">
                    <motion.span className="auth-icon-badge tone-success" initial={{ scale: .8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: .5, delay: .1, ease: EASE }}>
                      <i className="bi bi-check-lg" aria-hidden="true" />
                    </motion.span>
                    <dl className="auth-review">
                      <div><dt>Shop</dt><dd>{values.shop_name}</dd></div>
                      <div><dt>Type</dt><dd>{values.shop_type}</dd></div>
                      <div><dt>Address</dt><dd>{composeAddress(values)}</dd></div>
                      <div><dt>Contact</dt><dd>{values.phone}</dd></div>
                    </dl>
                    <p className="auth-success-next">
                      <i className="bi bi-cloud-arrow-up" aria-hidden="true" />
                      Next: upload your first CSV export and the dashboard fills itself.
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="auth-actions">
            {step > 0 && step < 2 && (
              <button type="button" className="auth-btn-ghost" onClick={goBack}><i className="bi bi-arrow-left" aria-hidden="true" />Back</button>
            )}
            {step === 0 && <button type="button" className="auth-submit" onClick={goNext}>Continue <i className="bi bi-arrow-right" aria-hidden="true" /></button>}
            {step === 1 && <SubmitButton loading={isSubmitting}>Finish setup <i className="bi bi-arrow-right" aria-hidden="true" /></SubmitButton>}
            {step === 2 && (
              <button type="button" className="auth-submit" onClick={() => navigate('/dashboard', { replace: true })}>
                Continue to dashboard <i className="bi bi-arrow-right" aria-hidden="true" />
              </button>
            )}
          </div>
        </form>
      </motion.div>
    </AuthLayout>
  );
}

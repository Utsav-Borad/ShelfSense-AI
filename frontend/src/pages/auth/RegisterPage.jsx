import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthLayout, FormAlert, FormField, PasswordField, PasswordStrength, StepProgress, SubmitButton, rules } from '../../components/auth';
import { useAuth } from '../../hooks/useAuth';
import { login as loginRequest, register as registerRequest } from '../../services/authService';

const EASE = [.16, 1, .3, 1];
const STEPS = ['Your details', 'Security', 'Confirm'];
// Which fields each step owns, so we only validate what is on screen.
const STEP_FIELDS = [['full_name', 'email'], ['password', 'password_confirmation'], ['terms']];

// Direction-aware slide: forward moves left, back moves right.
const variants = {
  enter: (dir) => ({ opacity: 0, x: dir > 0 ? 34 : -34 }),
  center: { opacity: 1, x: 0 },
  exit: (dir) => ({ opacity: 0, x: dir > 0 ? -34 : 34 }),
};

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [[step, direction], setStep] = useState([0, 0]);
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState(false);

  const form = useForm({
    mode: 'onTouched',
    defaultValues: { full_name: '', email: '', password: '', password_confirmation: '', terms: false },
  });
  const { register, handleSubmit, trigger, watch, setError, getValues, formState: { errors, isSubmitting } } = form;

  const password = watch('password');

  const goNext = async () => {
    const valid = await trigger(STEP_FIELDS[step], { shouldFocus: true });
    if (valid) setStep([Math.min(step + 1, STEPS.length - 1), 1]);
  };
  const goBack = () => setStep([Math.max(step - 1, 0), -1]);

  const onSubmit = async (values) => {
    setFormError('');
    try {
      await registerRequest({
        full_name: values.full_name.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
        password_confirmation: values.password_confirmation,
      });
      // Register returns the user but no tokens, so sign in straight after.
      const session = await loginRequest({ email: values.email.trim().toLowerCase(), password: values.password });
      setSuccess(true);
      login(session.data.user, { access: session.data.access, refresh: session.data.refresh });
      setTimeout(() => navigate('/business-setup', { replace: true }), 600);
    } catch (error) {
      if (error.fields) {
        Object.entries(error.fields).forEach(([field, message]) => setError(field, { type: 'server', message }));
        // Send the user back to the step that owns the failing field.
        const failing = Object.keys(error.fields)[0];
        const owner = STEP_FIELDS.findIndex((fields) => fields.includes(failing));
        if (owner >= 0 && owner !== step) setStep([owner, -1]);
      } else setFormError(error.detail || 'We could not create your account. Please try again.');
    }
  };

  const values = getValues();

  return (
    <AuthLayout>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, ease: EASE }}>
        <header className="auth-header">
          <h1>Create your account</h1>
          <p>Three short steps. Nothing to install, no card needed.</p>
        </header>

        <StepProgress steps={STEPS} current={step} />
        <FormAlert message={formError} />

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="auth-step-viewport">
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <motion.div
                key={step}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: .34, ease: EASE }}
              >
                {step === 0 && (
                  <>
                    <FormField
                      label="Full name"
                      icon="bi-person"
                      placeholder="Utsav Borad"
                      autoComplete="name"
                      autoFocus
                      error={errors.full_name?.message}
                      field={register('full_name', rules.fullName)}
                    />
                    <FormField
                      label="Email address"
                      type="email"
                      icon="bi-envelope"
                      placeholder="you@yourshop.com"
                      autoComplete="email"
                      hint="You will sign in with this address."
                      error={errors.email?.message}
                      field={register('email', rules.email)}
                    />
                  </>
                )}

                {step === 1 && (
                  <>
                    <PasswordField
                      placeholder="At least 8 characters"
                      autoComplete="new-password"
                      autoFocus
                      error={errors.password?.message}
                      field={register('password', rules.password)}
                    />
                    <PasswordStrength value={password} />
                    <PasswordField
                      label="Confirm password"
                      placeholder="Re-enter your password"
                      autoComplete="new-password"
                      error={errors.password_confirmation?.message}
                      field={register('password_confirmation', rules.confirmPassword(() => getValues('password')))}
                    />
                  </>
                )}

                {step === 2 && (
                  <>
                    <dl className="auth-review">
                      <div><dt>Name</dt><dd>{values.full_name}</dd></div>
                      <div><dt>Email</dt><dd>{values.email}</dd></div>
                      <div><dt>Password</dt><dd>{'•'.repeat(Math.min(values.password?.length || 0, 14))}</dd></div>
                    </dl>
                    <label className="auth-checkbox auth-checkbox-block">
                      <input type="checkbox" {...register('terms', rules.terms)} aria-invalid={errors.terms ? 'true' : 'false'} />
                      <span>I understand ShelfSense gives advice, and that every ordering and pricing decision stays mine.</span>
                    </label>
                    {errors.terms && <span className="auth-field-error" role="alert"><i className="bi bi-exclamation-circle" aria-hidden="true" />{errors.terms.message}</span>}
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="auth-actions">
            {step > 0 && (
              <button type="button" className="auth-btn-ghost" onClick={goBack}>
                <i className="bi bi-arrow-left" aria-hidden="true" />Back
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button type="button" className="auth-submit" onClick={goNext}>
                Continue <i className="bi bi-arrow-right" aria-hidden="true" />
              </button>
            ) : (
              <SubmitButton loading={isSubmitting} success={success} successLabel="Account created">
                Create account <i className="bi bi-arrow-right" aria-hidden="true" />
              </SubmitButton>
            )}
          </div>
        </form>

        <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
      </motion.div>
    </AuthLayout>
  );
}

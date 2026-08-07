import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AuthLayout, FormAlert, FormField, PasswordField, PasswordStrength,
  SubmitButton, rules,
} from '../../components/auth';
import {
  requestPasswordReset, resetPassword, verifyResetCode,
} from '../../services/authService';

const EASE = [.16, 1, .3, 1];

// Resets happen on one screen in three steps: ask for the email, type the code
// that arrives, choose the new password.
//
// Nothing is emailed but the code — no link. A link in an inbox can be opened
// by anyone who reaches that inbox; a code has to be typed back into the same
// browser that asked for it, and it expires in ten minutes.
//
// One page rather than three routes because the email and the code have to
// survive between steps, and a page reload should lose them.
const STEP = { EMAIL: 0, CODE: 1, PASSWORD: 2, DONE: 3 };

// Long enough that a slow inbox isn't a dead end, short enough to discourage
// hammering the send button.
const RESEND_SECONDS = 30;

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(STEP.EMAIL);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [formError, setFormError] = useState('');
  // Set only when the backend has no SMTP credentials, in which case it returns
  // the code instead of sending it. Shown so development is not blocked.
  const [devCode, setDevCode] = useState('');
  const [cooldown, setCooldown] = useState(0);

  const emailForm = useForm({ mode: 'onTouched', defaultValues: { email: '' } });
  const codeForm = useForm({ mode: 'onTouched', defaultValues: { code: '' } });
  const passwordForm = useForm({
    mode: 'onTouched',
    defaultValues: { password: '', password_confirmation: '' },
  });
  const password = passwordForm.watch('password');

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  // Step 1 — ask for a code. The answer is the same whether or not the address
  // is registered, so this screen cannot be used to find out who has an account.
  async function sendCode(address) {
    const response = await requestPasswordReset({ email: address });
    setEmail(address);
    setDevCode(response.data?.code || '');
    setCooldown(RESEND_SECONDS);
  }

  const onEmail = async (values) => {
    setFormError('');
    const address = values.email.trim().toLowerCase();
    try {
      await sendCode(address);
      setStep(STEP.CODE);
    } catch (error) {
      setFormError(error.detail || 'We could not send the code. Please try again.');
    }
  };

  const onResend = async () => {
    if (cooldown > 0) return;
    setFormError('');
    codeForm.reset({ code: '' });
    try {
      await sendCode(email);
    } catch (error) {
      setFormError(error.detail || 'We could not send another code.');
    }
  };

  // Step 2 — check the code before asking for a password, so a wrong code is
  // caught here rather than after the user has typed one in twice.
  const onCode = async (values) => {
    setFormError('');
    try {
      await verifyResetCode({ email, code: values.code });
      setCode(values.code);
      setStep(STEP.PASSWORD);
    } catch (error) {
      const detail = error.fields?.code?.[0] || error.detail;
      codeForm.setError('code', { type: 'server', message: detail || 'That code is not valid.' });
    }
  };

  // Step 3 — spend the code and set the password.
  const onPassword = async (values) => {
    setFormError('');
    try {
      await resetPassword({
        email,
        code,
        password: values.password,
        password_confirmation: values.password_confirmation,
      });
      setStep(STEP.DONE);
      setTimeout(() => navigate('/login', { replace: true }), 1600);
    } catch (error) {
      // The code can expire between step 2 and step 3, so send them back to
      // the code screen rather than leaving them stuck on a dead form.
      if (error.fields?.code) {
        setFormError(error.fields.code[0]);
        setStep(STEP.CODE);
        return;
      }
      setFormError(error.detail || 'We could not reset your password. Please try again.');
    }
  };

  return (
    <AuthLayout>
      <AnimatePresence mode="wait" initial={false}>

        {step === STEP.EMAIL && (
          <motion.div key="email" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: .45, ease: EASE }}>
            <header className="auth-header">
              <h1>Forgot your password?</h1>
              <p>Enter the email you signed up with and we’ll send you a 6-digit code.</p>
            </header>

            <FormAlert message={formError} />

            <form onSubmit={emailForm.handleSubmit(onEmail)} noValidate>
              <FormField
                label="Email address"
                type="email"
                icon="bi-envelope"
                placeholder="you@yourshop.com"
                autoComplete="email"
                autoFocus
                error={emailForm.formState.errors.email?.message}
                field={emailForm.register('email', rules.email)}
              />
              <SubmitButton loading={emailForm.formState.isSubmitting}>
                Send code <i className="bi bi-arrow-right" aria-hidden="true" />
              </SubmitButton>
            </form>

            <p className="auth-switch">Remembered it? <Link to="/login">Back to sign in</Link></p>
          </motion.div>
        )}

        {step === STEP.CODE && (
          <motion.div key="code" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: .45, ease: EASE }}>
            <motion.span className="auth-icon-badge" initial={{ scale: .8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: .5, delay: .1, ease: EASE }}>
              <i className="bi bi-shield-lock" aria-hidden="true" />
            </motion.span>
            <header className="auth-header">
              <h1>Enter your code</h1>
              <p>
                If an account exists for <strong>{email}</strong>, a 6-digit code is on its
                way. It expires in 10 minutes.
              </p>
            </header>

            <FormAlert message={formError} />

            {devCode && (
              <p className="auth-field-hint" role="status">
                <i className="bi bi-info-circle" aria-hidden="true" />{' '}
                Email is not configured on this server, so the code is shown here: <strong>{devCode}</strong>
              </p>
            )}

            <form onSubmit={codeForm.handleSubmit(onCode)} noValidate>
              <FormField
                label="6-digit code"
                icon="bi-123"
                placeholder="000000"
                inputMode="numeric"
                maxLength={6}
                autoComplete="one-time-code"
                autoFocus
                error={codeForm.formState.errors.code?.message}
                field={codeForm.register('code', rules.otp)}
              />
              <SubmitButton loading={codeForm.formState.isSubmitting}>
                Verify code <i className="bi bi-arrow-right" aria-hidden="true" />
              </SubmitButton>
            </form>

            <p className="auth-switch">
              {cooldown > 0 ? (
                <>You can ask for another code in {cooldown}s.</>
              ) : (
                <>Didn’t get it? <button type="button" className="auth-linkbutton" onClick={onResend}>Send a new code</button></>
              )}
            </p>
            <p className="auth-switch">
              <button type="button" className="auth-linkbutton" onClick={() => { setStep(STEP.EMAIL); setFormError(''); }}>
                Use a different email
              </button>
            </p>
          </motion.div>
        )}

        {step === STEP.PASSWORD && (
          <motion.div key="password" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: .45, ease: EASE }}>
            <header className="auth-header">
              <h1>Set a new password</h1>
              <p>Choose something you haven’t used before.</p>
            </header>

            <FormAlert message={formError} />

            <form onSubmit={passwordForm.handleSubmit(onPassword)} noValidate>
              <PasswordField
                label="New password"
                placeholder="At least 8 characters"
                autoComplete="new-password"
                autoFocus
                error={passwordForm.formState.errors.password?.message}
                field={passwordForm.register('password', rules.password)}
              />
              <PasswordStrength value={password} />
              <PasswordField
                label="Confirm new password"
                placeholder="Re-enter your new password"
                autoComplete="new-password"
                error={passwordForm.formState.errors.password_confirmation?.message}
                field={passwordForm.register(
                  'password_confirmation',
                  rules.confirmPassword(() => passwordForm.getValues('password')),
                )}
              />
              <SubmitButton loading={passwordForm.formState.isSubmitting}>
                Update password <i className="bi bi-arrow-right" aria-hidden="true" />
              </SubmitButton>
            </form>
          </motion.div>
        )}

        {step === STEP.DONE && (
          <motion.div key="done" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: .45, ease: EASE }}>
            <motion.span className="auth-icon-badge tone-success" initial={{ scale: .8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: .5, delay: .1, ease: EASE }}>
              <i className="bi bi-check-lg" aria-hidden="true" />
            </motion.span>
            <header className="auth-header">
              <h1>Password updated</h1>
              <p>You can sign in with your new password now. Taking you to the sign-in screen…</p>
            </header>
            <div className="auth-actions">
              <Link to="/login" className="auth-submit auth-submit-link">
                Sign in <i className="bi bi-arrow-right" aria-hidden="true" />
              </Link>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </AuthLayout>
  );
}

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthLayout, FormAlert, FormField, SubmitButton, rules } from '../../components/auth';
import { requestPasswordReset } from '../../services/authService';

const EASE = [.16, 1, .3, 1];

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState('');
  const { register, handleSubmit, getValues, formState: { errors, isSubmitting } } = useForm({ mode: 'onTouched', defaultValues: { email: '' } });

  const onSubmit = async (values) => {
    setFormError('');
    try {
      await requestPasswordReset({ email: values.email.trim().toLowerCase() });
      setSent(true);
    } catch (error) {
      setFormError(error.detail || 'We could not send the reset link. Please try again.');
    }
  };

  return (
    <AuthLayout>
      <AnimatePresence mode="wait" initial={false}>
        {sent ? (
          <motion.div key="sent" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: .45, ease: EASE }}>
            <motion.span className="auth-icon-badge" initial={{ scale: .8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: .5, delay: .1, ease: EASE }}>
              <i className="bi bi-envelope-check" aria-hidden="true" />
            </motion.span>
            <header className="auth-header">
              <h1>Check your inbox</h1>
              <p>If an account exists for <strong>{getValues('email')}</strong>, a reset link is on its way. The link expires in 30 minutes.</p>
            </header>
            <div className="auth-actions">
              <Link to="/login" className="auth-submit auth-submit-link"><i className="bi bi-arrow-left" aria-hidden="true" />Back to sign in</Link>
            </div>
            <p className="auth-switch">
              Didn’t get it? <button type="button" className="auth-linkbutton" onClick={() => setSent(false)}>Try another address</button>
            </p>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: .45, ease: EASE }}>
            <header className="auth-header">
              <h1>Forgot your password?</h1>
              <p>Enter the email you signed up with and we’ll send you a link to set a new one.</p>
            </header>

            <FormAlert message={formError} />

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <FormField
                label="Email address"
                type="email"
                icon="bi-envelope"
                placeholder="you@yourshop.com"
                autoComplete="email"
                autoFocus
                error={errors.email?.message}
                field={register('email', rules.email)}
              />
              <SubmitButton loading={isSubmitting}>Send reset link <i className="bi bi-arrow-right" aria-hidden="true" /></SubmitButton>
            </form>

            <p className="auth-switch">Remembered it? <Link to="/login">Back to sign in</Link></p>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
}

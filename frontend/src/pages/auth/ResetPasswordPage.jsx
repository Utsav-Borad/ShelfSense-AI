import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthLayout, FormAlert, PasswordField, PasswordStrength, SubmitButton, rules } from '../../components/auth';
import { resetPassword } from '../../services/authService';

const EASE = [.16, 1, .3, 1];

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const navigate = useNavigate();
  const [done, setDone] = useState(false);
  const [formError, setFormError] = useState('');

  const { register, handleSubmit, watch, getValues, formState: { errors, isSubmitting } } = useForm({
    mode: 'onTouched',
    defaultValues: { password: '', password_confirmation: '' },
  });
  const password = watch('password');

  const onSubmit = async (values) => {
    setFormError('');
    try {
      await resetPassword({ token, password: values.password, password_confirmation: values.password_confirmation });
      setDone(true);
      setTimeout(() => navigate('/login', { replace: true }), 1600);
    } catch (error) {
      setFormError(error.detail || 'We could not reset your password. Please try again.');
    }
  };

  // A reset screen reached without a token cannot do anything useful.
  if (!token) {
    return (
      <AuthLayout>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5, ease: EASE }}>
          <span className="auth-icon-badge tone-warn"><i className="bi bi-link-45deg" aria-hidden="true" /></span>
          <header className="auth-header">
            <h1>This link isn’t valid</h1>
            <p>The reset link is missing its token. It may have been copied incompletely, or it has already been used.</p>
          </header>
          <div className="auth-actions">
            <Link to="/forgot-password" className="auth-submit auth-submit-link">Request a new link <i className="bi bi-arrow-right" aria-hidden="true" /></Link>
          </div>
          <p className="auth-switch">Or <Link to="/login">go back to sign in</Link></p>
        </motion.div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <AnimatePresence mode="wait" initial={false}>
        {done ? (
          <motion.div key="done" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: .45, ease: EASE }}>
            <motion.span className="auth-icon-badge tone-success" initial={{ scale: .8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: .5, delay: .1, ease: EASE }}>
              <i className="bi bi-check-lg" aria-hidden="true" />
            </motion.span>
            <header className="auth-header">
              <h1>Password updated</h1>
              <p>You can sign in with your new password now. Taking you to the sign-in screen…</p>
            </header>
            <div className="auth-actions">
              <Link to="/login" className="auth-submit auth-submit-link">Sign in <i className="bi bi-arrow-right" aria-hidden="true" /></Link>
            </div>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: .45, ease: EASE }}>
            <header className="auth-header">
              <h1>Set a new password</h1>
              <p>Choose something you haven’t used before. You’ll be logged out everywhere else.</p>
            </header>

            <FormAlert message={formError} />

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <PasswordField
                label="New password"
                placeholder="At least 8 characters"
                autoComplete="new-password"
                autoFocus
                error={errors.password?.message}
                field={register('password', rules.password)}
              />
              <PasswordStrength value={password} />
              <PasswordField
                label="Confirm new password"
                placeholder="Re-enter your new password"
                autoComplete="new-password"
                error={errors.password_confirmation?.message}
                field={register('password_confirmation', rules.confirmPassword(() => getValues('password')))}
              />
              <SubmitButton loading={isSubmitting}>Update password <i className="bi bi-arrow-right" aria-hidden="true" /></SubmitButton>
            </form>

          </motion.div>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
}

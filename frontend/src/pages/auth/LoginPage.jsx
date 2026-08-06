import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthLayout, FormAlert, FormField, PasswordField, SubmitButton, rules } from '../../components/auth';
import { useAuth } from '../../hooks/useAuth';
import { login as loginRequest } from '../../services/authService';
import { homeFor } from '../../routes/home';

const EASE = [.16, 1, .3, 1];

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm({
    mode: 'onTouched',
    defaultValues: { email: '', password: '', remember: true },
  });

  const onSubmit = async (values) => {
    setFormError('');
    try {
      const response = await loginRequest({ email: values.email.trim().toLowerCase(), password: values.password });
      const { user, access, refresh } = response.data;
      setSuccess(true);
      // Awaited so the business is known before we navigate — otherwise the
      // route guard would send an existing owner to /business-setup.
      const shop = await login(user, { access, refresh });
      setTimeout(() => navigate(homeFor(user, shop), { replace: true }), 550);
    } catch (error) {
      // Field-level errors from the API map onto the form; anything else
      // becomes a form-level banner.
      if (error.fields) Object.entries(error.fields).forEach(([field, message]) => setError(field, { type: 'server', message }));
      else setFormError(error.detail || 'We could not sign you in. Please try again.');
    }
  };

  return (
    <AuthLayout>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, ease: EASE }}>
        <header className="auth-header">
          <h1>Welcome back</h1>
          <p>Sign in to see what your inventory is telling you today.</p>
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

          <PasswordField
            placeholder="Enter your password"
            autoComplete="current-password"
            error={errors.password?.message}
            field={register('password', rules.loginPassword)}
          />

          <div className="auth-row-between">
            <label className="auth-checkbox">
              <input type="checkbox" {...register('remember')} />
              <span>Keep me signed in</span>
            </label>
            <Link to="/forgot-password" className="auth-link">Forgot password?</Link>
          </div>

          <SubmitButton loading={isSubmitting} success={success} successLabel="Signed in">
            Sign in <i className="bi bi-arrow-right" aria-hidden="true" />
          </SubmitButton>
        </form>

        <p className="auth-switch">New to ShelfSense? <Link to="/register">Create an account</Link></p>
      </motion.div>
    </AuthLayout>
  );
}

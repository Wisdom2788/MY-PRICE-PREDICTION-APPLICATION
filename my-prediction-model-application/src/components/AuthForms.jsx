// AuthForms component: Provides Register and Sign In forms with client-side validation
// Uses React hooks (useState) to manage form state and toggling between modes

import { useState } from 'react';
import { registerUser, signInUser } from '../lib/api.js';

export default function AuthForms({ onAuthSuccess }) {
  // mode determines which form is visible: 'signIn' or 'register'
  const [mode, setMode] = useState('signIn');

  // Local form state for both forms
  const [registerForm, setRegisterForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [signInForm, setSignInForm] = useState({ email: '', password: '' });

  // UI state for feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle submit for Register
  async function handleRegister(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!registerForm.firstName || !registerForm.lastName || !registerForm.email || !registerForm.password) {
      setError('Please fill in all registration fields.');
      return;
    }
    setLoading(true);
    try {
      const res = await registerUser({
        firstName: registerForm.firstName.trim(),
        lastName: registerForm.lastName.trim(),
        email: registerForm.email.trim(),
        password: registerForm.password,
      });
      // If backend (or mock) returned a user object, inform parent and mark as authed
      if (res?.user) {
        setSuccess('Registration successful. Signed in automatically.');
        onAuthSuccess?.(res.user);
      } else {
        setSuccess('Registration successful. You can now sign in.');
        setMode('signIn');
      }
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  }

  // Handle submit for Sign In
  async function handleSignIn(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!signInForm.email || !signInForm.password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      const res = await signInUser({ email: signInForm.email.trim(), password: signInForm.password });
      setSuccess('Signed in successfully.');
      // If the backend returned a user object, pass it to parent so we can show a personalized greeting
      if (res?.user) {
        onAuthSuccess?.(res.user);
      } else {
        onAuthSuccess?.();
      }
    } catch (err) {
      setError(err.message || 'Sign in failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-panel">
      {/* Simple tab-like buttons to switch forms */}
      <div className="auth-tabs">
        <button
          type="button"
          className={mode === 'signIn' ? 'tab-button active' : 'tab-button'}
          onClick={() => { setMode('signIn'); setError(''); setSuccess(''); }}
        >
          Sign In
        </button>
        <button
          type="button"
          className={mode === 'register' ? 'tab-button active' : 'tab-button'}
          onClick={() => { setMode('register'); setError(''); setSuccess(''); }}
        >
          Register
        </button>
      </div>

      {mode === 'signIn' ? (
        <form className="form" onSubmit={handleSignIn}>
          <div className="form-row">
            <label className="form-label" htmlFor="signin-email">Email address</label>
            <input
              id="signin-email"
              className="form-input"
              type="email"
              value={signInForm.email}
              onChange={(e) => setSignInForm({ ...signInForm, email: e.target.value })}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="form-row">
            <label className="form-label" htmlFor="signin-password">Password</label>
            <input
              id="signin-password"
              className="form-input"
              type="password"
              value={signInForm.password}
              onChange={(e) => setSignInForm({ ...signInForm, password: e.target.value })}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="form-error" role="alert">{error}</p>}
          {success && <p className="form-success">{success}</p>}

          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      ) : (
        <form className="form" onSubmit={handleRegister}>
          <div className="form-grid-2">
            <div className="form-row">
              <label className="form-label" htmlFor="reg-firstname">Firstname</label>
              <input
                id="reg-firstname"
                className="form-input"
                type="text"
                value={registerForm.firstName}
                onChange={(e) => setRegisterForm({ ...registerForm, firstName: e.target.value })}
                placeholder="Ada"
                required
              />
            </div>
            <div className="form-row">
              <label className="form-label" htmlFor="reg-lastname">Lastname</label>
              <input
                id="reg-lastname"
                className="form-input"
                type="text"
                value={registerForm.lastName}
                onChange={(e) => setRegisterForm({ ...registerForm, lastName: e.target.value })}
                placeholder="Obi"
                required
              />
            </div>
          </div>
          <div className="form-row">
            <label className="form-label" htmlFor="reg-email">Email address</label>
            <input
              id="reg-email"
              className="form-input"
              type="email"
              value={registerForm.email}
              onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="form-row">
            <label className="form-label" htmlFor="reg-password">Password</label>
            <input
              id="reg-password"
              className="form-input"
              type="password"
              value={registerForm.password}
              onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
              placeholder="Create a strong password"
              required
            />
          </div>

          {error && <p className="form-error" role="alert">{error}</p>}
          {success && <p className="form-success">{success}</p>}

          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? 'Registering…' : 'Create Account'}
          </button>
        </form>
      )}
    </section>
  );
}

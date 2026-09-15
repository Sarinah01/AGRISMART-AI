import React, { useState, useEffect, useRef } from 'react';
import { loginApi, registerApi, googleAuthApi } from '../../services/api';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '794206114572-o0espebqkcgrs9cjpjvh9msb4u32nh0t.apps.googleusercontent.com';

export default function LoginPage({ onLoginSuccess, onNavigateToRegister, onReturnToDashboard }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const googleBtnRef = useRef(null);

  useEffect(() => {
    // Initialize Google Identity Services if loaded in browser
    if (window.google?.accounts?.id && googleBtnRef.current) {
      try {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        });
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'continue_with',
          shape: 'pill',
        });
      } catch (err) {
        console.warn("Google Sign-In initialization note:", err);
      }
    }
  }, []);

  const handleGoogleResponse = async (response) => {
    if (!response.credential) return;
    setError('');
    setIsLoading(true);

    try {
      const res = await googleAuthApi(response.credential);
      setIsLoading(false);
      onLoginSuccess(res.user);
    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'Google authentication failed.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await loginApi(email, password);
      setIsLoading(false);
      onLoginSuccess(res.user);
    } catch (err) {
      // If demo evaluator credentials used and account doesn't exist yet, register auto
      if (email.toLowerCase() === 'evaluator@agrismart.ai') {
        try {
          const regRes = await registerApi({
            email: 'evaluator@agrismart.ai',
            password: password || 'hackathon2026',
            name: 'Hackathon Evaluator',
            role: 'Hackathon Evaluator',
            farm_name: 'AgriSmart Experimental Farm'
          });
          setIsLoading(false);
          onLoginSuccess(regRes.user);
          return;
        } catch (regErr) {
          // ignore
        }
      }
      setIsLoading(false);
      setError(err.message || 'Invalid email or password.');
    }
  };

  const handleDemoFill = () => {
    setEmail('evaluator@agrismart.ai');
    setPassword('hackathon2026');
    setError('');
  };

  return (
    <div className="bg-surface-container-lowest dark:bg-[#112117] rounded-3xl p-6 sm:p-8 border border-[#14532d]/15 dark:border-emerald-800/30 shadow-2xl space-y-6 transition-colors duration-200">
      {/* Auth Navigation Switcher (Sign In vs Register) */}
      <div className="flex rounded-2xl bg-[#f4f7f4] dark:bg-[#0c1811] p-1.5 border border-outline-variant/30 dark:border-emerald-900/40">
        <button
          type="button"
          className="flex-1 py-2 rounded-xl text-label-md font-bold transition-all bg-white dark:bg-[#162a1e] text-primary dark:text-primary-fixed shadow-sm"
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={onNavigateToRegister}
          className="flex-1 py-2 rounded-xl text-label-md font-medium text-on-surface-variant dark:text-emerald-300/70 hover:text-primary dark:hover:text-primary-fixed transition-all"
        >
          Create Account
        </button>
      </div>

      {/* Card Header */}
      <div>
        <h2 className="text-headline-md font-headline-md font-extrabold text-on-surface dark:text-[#ecfdf5]">
          Welcome Back
        </h2>
        <p className="text-body-sm font-body-sm text-on-surface-variant dark:text-emerald-200/70 mt-1">
          Access your farm foliar diagnostics and FastAPI JWT session
        </p>
      </div>

      {/* Google Sign-In Container */}
      <div className="space-y-2">
        <div ref={googleBtnRef} className="w-full flex justify-center min-h-[44px]"></div>
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-outline-variant/30 dark:border-emerald-900/40"></div>
          <span className="flex-shrink mx-3 text-[11px] text-on-surface-variant/70 dark:text-emerald-300/50 font-bold uppercase">or email authentication</span>
          <div className="flex-grow border-t border-outline-variant/30 dark:border-emerald-900/40"></div>
        </div>
      </div>

      {/* 1-Click Hackathon Evaluator Quick-Fill */}
      <div className="p-3.5 rounded-2xl bg-[#ecfdf5] dark:bg-[#162c1e] border border-[#10b981]/30 dark:border-emerald-700/40 flex items-center justify-between">
        <div className="text-xs">
          <p className="font-bold text-primary dark:text-primary-fixed">Hackathon Evaluator Access</p>
          <p className="text-on-surface-variant dark:text-emerald-300/70">1-click test credentials</p>
        </div>
        <button
          type="button"
          onClick={handleDemoFill}
          className="px-3 py-1.5 rounded-xl bg-primary-container text-white text-xs font-bold hover:bg-[#14532d] transition-all shadow-sm active:scale-95 flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-sm" data-icon="bolt">bolt</span>
          <span>Auto Fill</span>
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 text-red-800 dark:text-red-300 text-xs flex items-start gap-2 animate-shake">
          <span className="material-symbols-outlined text-base mt-0.5 flex-shrink-0" data-icon="error">error</span>
          <span>{error}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-label-sm font-label-sm font-bold text-on-surface dark:text-[#ecfdf5]">
            Email Address
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-emerald-300/70 text-lg">
              mail
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="evaluator@agrismart.ai"
              className="w-full h-12 pl-11 pr-4 rounded-xl bg-white dark:bg-[#162a1e] border border-[#14532d]/20 dark:border-emerald-700/40 text-body-md font-body-md text-on-surface dark:text-[#ecfdf5] focus:border-primary dark:focus:border-emerald-400 focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-label-sm font-label-sm font-bold text-on-surface dark:text-[#ecfdf5]">
              Password
            </label>
            <button
              type="button"
              className="text-xs text-primary dark:text-primary-fixed hover:underline font-semibold"
              onClick={() => alert("For this hackathon demo, you can use any password with evaluator@agrismart.ai, or register a new user.")}
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-emerald-300/70 text-lg">
              lock
            </span>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-12 pl-11 pr-11 rounded-xl bg-white dark:bg-[#162a1e] border border-[#14532d]/20 dark:border-emerald-700/40 text-body-md font-body-md text-on-surface dark:text-[#ecfdf5] focus:border-primary dark:focus:border-emerald-400 focus:ring-1 focus:ring-primary transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-emerald-300/70 text-lg hover:text-primary"
            >
              {showPassword ? "visibility_off" : "visibility"}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-13 py-3.5 rounded-xl bg-primary-container hover:bg-[#14532d] text-white font-label-lg shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 mt-2"
        >
          {isLoading ? (
            <>
              <span className="material-symbols-outlined animate-spin text-lg" data-icon="progress_activity">progress_activity</span>
              <span>Authenticating with FastAPI...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-lg" data-icon="login">login</span>
              <span>Sign In to AgriSmart AI</span>
            </>
          )}
        </button>
      </form>

      {/* Footer Info */}
      <div className="pt-3 border-t border-outline-variant/20 dark:border-emerald-900/30 text-center text-xs text-on-surface-variant/80 dark:text-emerald-300/60">
        <span>Protected by FastAPI JWT authentication &amp; SQLite database</span>
      </div>
    </div>
  );
}

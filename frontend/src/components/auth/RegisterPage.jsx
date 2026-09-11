import React, { useState } from 'react';
import { registerUser, computeInitials } from '../../utils/userStore';

export default function RegisterPage({ onRegisterSuccess, onNavigateToLogin, onReturnToDashboard }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [farmName, setFarmName] = useState('');
  const [role, setRole] = useState('Agronomist');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const initials = computeInitials(name);
      const newUser = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
        farmName: farmName.trim() || "Independent Agricultural Site",
        initials,
        location: "Primary Research Unit",
        phone: "+91 98765 00000",
        bio: `${role} managing smart crop diagnostics.`,
        isLoggedIn: true
      };

      const res = registerUser(newUser);
      if (res.success) {
        onRegisterSuccess(newUser);
      } else {
        setError(res.message);
      }
    }, 400);
  };

  return (
    <div className="bg-surface-container-lowest dark:bg-[#112117] rounded-3xl p-6 sm:p-8 border border-[#14532d]/15 dark:border-emerald-800/30 shadow-2xl space-y-6 transition-colors duration-200">
      {/* Auth Navigation Switcher (Sign In vs Register) */}
      <div className="flex rounded-2xl bg-[#f4f7f4] dark:bg-[#0c1811] p-1.5 border border-outline-variant/30 dark:border-emerald-900/40">
        <button
          type="button"
          onClick={onNavigateToLogin}
          className="flex-1 py-2 rounded-xl text-label-md font-medium text-on-surface-variant dark:text-emerald-300/70 hover:text-primary dark:hover:text-primary-fixed transition-all"
        >
          Sign In
        </button>
        <button
          type="button"
          className="flex-1 py-2 rounded-xl text-label-md font-bold transition-all bg-white dark:bg-[#162a1e] text-primary dark:text-primary-fixed shadow-sm"
        >
          Create Account
        </button>
      </div>

      {/* Card Header */}
      <div>
        <h2 className="text-headline-md font-headline-md font-extrabold text-on-surface dark:text-[#ecfdf5]">
          Join AgriSmart AI
        </h2>
        <p className="text-body-sm font-body-sm text-on-surface-variant dark:text-emerald-200/70 mt-1">
          Set up your profile to start logging leaf disease inspections
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 text-red-800 dark:text-red-300 text-xs flex items-start gap-2 animate-shake">
          <span className="material-symbols-outlined text-base mt-0.5 flex-shrink-0" data-icon="error">error</span>
          <span>{error}</span>
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="space-y-1.5">
            <label className="text-label-sm font-label-sm font-bold text-on-surface dark:text-[#ecfdf5]">
              Full Name
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-emerald-300/70 text-lg">
                person
              </span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Vikram Sharma"
                className="w-full h-11 pl-11 pr-3.5 rounded-xl bg-white dark:bg-[#162a1e] border border-[#14532d]/20 dark:border-emerald-700/40 text-body-md font-body-md text-on-surface dark:text-[#ecfdf5] focus:border-primary dark:focus:border-emerald-400 focus:ring-1 focus:ring-primary transition-all text-sm"
              />
            </div>
          </div>

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
                placeholder="vikram@farmtech.org"
                className="w-full h-11 pl-11 pr-3.5 rounded-xl bg-white dark:bg-[#162a1e] border border-[#14532d]/20 dark:border-emerald-700/40 text-body-md font-body-md text-on-surface dark:text-[#ecfdf5] focus:border-primary dark:focus:border-emerald-400 focus:ring-1 focus:ring-primary transition-all text-sm"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="space-y-1.5">
            <label className="text-label-sm font-label-sm font-bold text-on-surface dark:text-[#ecfdf5]">
              Farm or Organization
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-emerald-300/70 text-lg">
                agriculture
              </span>
              <input
                type="text"
                value={farmName}
                onChange={(e) => setFarmName(e.target.value)}
                placeholder="Punjab Organic Farms"
                className="w-full h-11 pl-11 pr-3.5 rounded-xl bg-white dark:bg-[#162a1e] border border-[#14532d]/20 dark:border-emerald-700/40 text-body-md font-body-md text-on-surface dark:text-[#ecfdf5] focus:border-primary dark:focus:border-emerald-400 focus:ring-1 focus:ring-primary transition-all text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-label-sm font-label-sm font-bold text-on-surface dark:text-[#ecfdf5]">
              Primary Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full h-11 px-3 rounded-xl bg-white dark:bg-[#162a1e] border border-[#14532d]/20 dark:border-emerald-700/40 text-on-surface dark:text-[#ecfdf5] focus:border-primary dark:focus:border-emerald-400 focus:ring-1 focus:ring-primary transition-all text-sm"
            >
              <option value="Agronomist">Agronomist</option>
              <option value="Farmer / Grower">Farmer / Grower</option>
              <option value="Agricultural Researcher">Agricultural Researcher</option>
              <option value="Hackathon Evaluator">Hackathon Evaluator</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="space-y-1.5">
            <label className="text-label-sm font-label-sm font-bold text-on-surface dark:text-[#ecfdf5]">
              Password
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-emerald-300/70 text-lg">
                lock
              </span>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 chars"
                className="w-full h-11 pl-11 pr-10 rounded-xl bg-white dark:bg-[#162a1e] border border-[#14532d]/20 dark:border-emerald-700/40 text-body-md font-body-md text-on-surface dark:text-[#ecfdf5] focus:border-primary dark:focus:border-emerald-400 focus:ring-1 focus:ring-primary transition-all text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-emerald-300/70 text-lg hover:text-primary"
              >
                {showPassword ? "visibility_off" : "visibility"}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-label-sm font-label-sm font-bold text-on-surface dark:text-[#ecfdf5]">
              Confirm Password
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-emerald-300/70 text-lg">
                check_circle
              </span>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-type password"
                className="w-full h-11 pl-11 pr-3.5 rounded-xl bg-white dark:bg-[#162a1e] border border-[#14532d]/20 dark:border-emerald-700/40 text-body-md font-body-md text-on-surface dark:text-[#ecfdf5] focus:border-primary dark:focus:border-emerald-400 focus:ring-1 focus:ring-primary transition-all text-sm"
              />
            </div>
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
              <span>Creating your account...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-lg" data-icon="person_add">person_add</span>
              <span>Register Account</span>
            </>
          )}
        </button>
      </form>

      {/* Footer */}
      <div className="pt-3 border-t border-outline-variant/20 dark:border-emerald-900/30 text-center text-xs text-on-surface-variant/80 dark:text-emerald-300/60">
        <span>By signing up, you gain instant access to student AI vision models.</span>
      </div>
    </div>
  );
}

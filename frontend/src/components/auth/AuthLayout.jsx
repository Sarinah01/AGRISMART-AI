import React from 'react';
import { HERO_BG_IMAGE } from '../../constants/data';

export default function AuthLayout({
  children,
  darkMode,
  onToggleTheme,
  onReturnToDashboard,
  title,
  subtitle
}) {
  return (
    <div className="min-h-screen bg-[#f4f7f4] dark:bg-[#07110a] text-on-surface dark:text-[#ecfdf5] flex flex-col transition-colors duration-200">
      {/* Dedicated Auth Top Bar */}
      <header className="w-full bg-surface-container-lowest/80 dark:bg-[#0d1c13]/80 backdrop-blur-md border-b border-outline-variant/20 dark:border-emerald-900/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand Anchor */}
          <button
            type="button"
            onClick={onReturnToDashboard}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-sm shadow-primary/20 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-2xl" data-icon="spa" style={{ fontVariationSettings: "'FILL' 1" }}>
                spa
              </span>
            </div>
            <div>
              <span className="text-headline-sm font-headline-sm font-extrabold text-primary dark:text-primary-fixed tracking-tight block leading-tight">
                AgriSmart AI
              </span>
              <span className="text-label-sm font-label-sm text-on-surface-variant/80 dark:text-emerald-300/70 hidden sm:block">
                Crop Disease Intelligence
              </span>
            </div>
          </button>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-outline-variant/30 hover:bg-surface-container dark:hover:bg-[#193222] text-on-surface dark:text-[#ecfdf5] transition-all duration-200 active:scale-95 text-label-md font-label-md shadow-sm bg-white dark:bg-[#122419] dark:border-emerald-800/50 group"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              type="button"
              onClick={onToggleTheme}
              aria-label="Toggle dark/light mode"
              id="auth-theme-toggle-btn"
            >
              <span
                className="material-symbols-outlined text-lg transition-transform duration-500 group-hover:rotate-[360deg] text-amber-500 dark:text-emerald-300"
                data-icon={darkMode ? "light_mode" : "dark_mode"}
              >
                {darkMode ? "light_mode" : "dark_mode"}
              </span>
              <span className="hidden sm:inline font-bold text-xs">
                {darkMode ? "Light" : "Dark"}
              </span>
            </button>

            {/* Back to Dashboard */}
            <button
              type="button"
              onClick={onReturnToDashboard}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary-container/10 dark:bg-emerald-950/50 hover:bg-primary-container/20 text-primary dark:text-primary-fixed font-semibold text-label-md transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-base" data-icon="dashboard">dashboard</span>
              <span className="hidden sm:inline">Return to Dashboard</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Full-Screen Split Container */}
      <div className="flex-1 flex w-full max-w-7xl mx-auto overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Side: Modern Agricultural AI Visual Showcase (Hidden on Mobile) */}
          <div className="hidden lg:flex lg:col-span-6 flex-col justify-between h-full min-h-[640px] rounded-3xl relative overflow-hidden p-8 text-white shadow-2xl border border-white/10 dark:border-emerald-800/30 bg-inverse-surface">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
              <img
                src={HERO_BG_IMAGE}
                alt="AgriSmart Smart Agriculture Drone Field"
                className="w-full h-full object-cover opacity-35 mix-blend-overlay"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07110a] via-[#07110a]/60 to-transparent"></div>
            </div>

            {/* Top Showcase Badge */}
            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-emerald-200 text-label-sm font-semibold">
                <span className="material-symbols-outlined text-sm text-emerald-300" data-icon="smart_toy">smart_toy</span>
                <span>Autonomous Foliar Pathology Pipeline</span>
              </div>
              <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight leading-tight text-white">
                Empowering precision agriculture with real-time vision AI.
              </h1>
              <p className="text-emerald-100/90 text-sm leading-relaxed max-w-lg">
                Detect early foliar blights, assess class severity, and access verified agronomic mitigation protocols before crop damage spreads.
              </p>
            </div>

            {/* Floating Glassmorphism Feature Cards */}
            <div className="relative z-10 space-y-3 pt-6">
              {/* Feature 1 */}
              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-3.5 shadow-lg">
                <div className="w-10 h-10 rounded-xl bg-primary-container text-white flex items-center justify-center flex-shrink-0 shadow-md">
                  <span className="material-symbols-outlined text-xl" data-icon="biotech">biotech</span>
                </div>
                <div className="text-xs">
                  <p className="font-bold text-white text-sm">ResNet-50 Neural Classifier</p>
                  <p className="text-emerald-200/80">Trained on multi-class leaf lesion datasets for rapid triage</p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-3.5 shadow-lg">
                <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                  <span className="material-symbols-outlined text-xl" data-icon="verified">verified</span>
                </div>
                <div className="text-xs">
                  <p className="font-bold text-white text-sm">Actionable Mitigation Advisory</p>
                  <p className="text-emerald-200/80">Immediate cultural and irrigation precautions to halt fungal spread</p>
                </div>
              </div>
            </div>

            {/* Bottom Quote Pill */}
            <div className="relative z-10 pt-4 border-t border-white/15 text-xs text-emerald-200/80 flex items-center justify-between">
              <span>Student Hackathon Project · Sandbox API</span>
              <span className="font-mono text-[11px] text-emerald-300">POST /api/predict</span>
            </div>
          </div>

          {/* Right Side: The Authentication Canvas */}
          <div className="lg:col-span-6 w-full flex justify-center">
            <div className="w-full max-w-md">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

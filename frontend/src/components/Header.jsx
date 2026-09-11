import React, { useState } from 'react';
import { computeInitials } from '../utils/userStore';

export default function Header({
  darkMode,
  onToggleTheme,
  onToggleDrawer,
  onNavigate,
  user
}) {
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('EN');
  const [showNotification, setShowNotification] = useState(false);

  const triggerNotification = () => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3500);
  };

  const userInitials = user?.initials || computeInitials(user?.name) || 'HP';

  const languages = [
    { code: 'EN', name: 'English' },
    { code: 'ES', name: 'Español' },
    { code: 'HI', name: 'हिन्दी' }
  ];

  return (
    <header className="bg-surface-container-lowest dark:bg-[#0d1c13] border-b border-outline-variant/20 dark:border-emerald-900/30 shadow-sm sticky top-0 z-50 transition-colors duration-200 backdrop-blur-md">
      <div className="flex justify-between items-center w-full px-4 sm:px-6 py-3 max-w-[1440px] mx-auto h-16">
        {/* Left: Mobile Menu Toggle & Brand Anchor */}
        <div className="flex items-center gap-3">
          <button
            aria-label="Toggle navigation drawer"
            className="lg:hidden p-2 text-on-surface-variant dark:text-emerald-200 hover:text-primary dark:hover:text-primary-fixed transition-all duration-200 active:scale-95 rounded-xl hover:bg-surface-container/50 dark:hover:bg-[#152e20]"
            id="mobile-drawer-toggle"
            type="button"
            onClick={onToggleDrawer}
          >
            <span className="material-symbols-outlined" data-icon="menu">menu</span>
          </button>

          <div
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => onNavigate('Dashboard')}
          >
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-md shadow-primary/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 relative overflow-hidden">
              <span className="material-symbols-outlined text-2xl transition-transform duration-300 group-hover:scale-110" data-icon="spa" style={{ fontVariationSettings: "'FILL' 1" }}>
                spa
              </span>
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div>
              <span className="text-headline-sm font-headline-sm font-extrabold text-primary dark:text-primary-fixed tracking-tight block leading-tight group-hover:translate-x-0.5 transition-transform">
                AgriSmart AI
              </span>
              <span className="text-label-sm font-label-sm text-on-surface-variant/80 dark:text-emerald-300/70 hidden sm:block">
                Student Hackathon Project
              </span>
            </div>
          </div>
        </div>

        {/* Middle: Honest Demo Environment Context Badges */}
        <div className="hidden md:flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ecfdf5] dark:bg-emerald-950/60 border border-[#10b981]/40 dark:border-emerald-700/50 text-[#065f46] dark:text-emerald-300 text-label-md font-label-md shadow-sm hover:border-emerald-500/60 transition-all">
            <span className="material-symbols-outlined text-sm text-[#10b981] dark:text-emerald-400 animate-pulse" data-icon="science">science</span>
            <span>Demo Environment · Tomato &amp; Potato Classifiers</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f0f9ff] dark:bg-sky-950/50 border border-[#0284c7]/30 dark:border-sky-700/40 text-[#075985] dark:text-sky-300 text-label-md font-label-md shadow-sm hover:border-sky-400/50 transition-all">
            <span className="relative flex h-2 w-2">
              <span className="animate-radar-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>API: Ready</span>
          </div>
        </div>

        {/* Right Trailing Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Theme Toggle Button with 360 spin */}
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-outline-variant/30 hover:bg-surface-container dark:hover:bg-[#193222] text-on-surface dark:text-[#ecfdf5] transition-all duration-300 active:scale-90 text-label-md font-label-md shadow-sm bg-white dark:bg-[#122419] dark:border-emerald-800/50 group relative overflow-hidden"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            type="button"
            onClick={onToggleTheme}
            aria-label="Toggle dark/light mode"
            id="theme-toggle-btn"
          >
            <span
              className="material-symbols-outlined text-lg transition-transform duration-500 group-hover:rotate-[360deg] text-amber-500 dark:text-emerald-300"
              data-icon={darkMode ? "light_mode" : "dark_mode"}
            >
              {darkMode ? "light_mode" : "dark_mode"}
            </span>
            <span className="hidden sm:inline font-bold text-xs tracking-wide">
              {darkMode ? "Light" : "Dark"}
            </span>
          </button>

          {/* Language Switcher */}
          <div className="relative">
            <button
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-on-surface-variant dark:text-emerald-200 hover:bg-surface-container-low dark:hover:bg-[#173021] hover:text-primary dark:hover:text-primary-fixed transition-all duration-200 active:scale-95 text-label-md font-label-md"
              title="Change Language"
              type="button"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            >
              <span className="material-symbols-outlined text-lg" data-icon="translate">translate</span>
              <span className="hidden sm:inline font-semibold">{selectedLang}</span>
              <span className={`material-symbols-outlined text-sm transition-transform duration-200 ${langDropdownOpen ? 'rotate-180' : ''}`} data-icon="expand_more">expand_more</span>
            </button>
            {langDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setLangDropdownOpen(false)}
                ></div>
                <div className="absolute right-0 top-full mt-1.5 w-36 bg-surface-container-lowest dark:bg-[#122419] rounded-2xl shadow-xl border border-outline-variant/30 dark:border-emerald-800/50 py-1.5 z-50 animate-slide-down">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      className={`w-full text-left px-3.5 py-2 text-body-sm font-body-sm hover:bg-surface-container-low dark:hover:bg-[#1b3424] flex items-center justify-between transition-colors ${selectedLang === l.code ? 'text-primary dark:text-primary-fixed font-bold bg-primary/5' : 'text-on-surface-variant dark:text-emerald-100'
                        }`}
                      onClick={() => {
                        setSelectedLang(l.code);
                        setLangDropdownOpen(false);
                      }}
                    >
                      {l.name}
                      {selectedLang === l.code && (
                        <span className="material-symbols-outlined text-xs text-primary dark:text-primary-fixed" data-icon="check">check</span>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Code / Hackathon repo pill */}
          <button
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-outline-variant/40 dark:border-emerald-800/40 hover:bg-surface-container dark:hover:bg-[#173021] text-on-surface-variant dark:text-emerald-200 hover:text-primary dark:hover:text-primary-fixed transition-all text-label-sm font-label-sm hover:shadow-sm active:scale-95 group"
            onClick={() => onNavigate('Disease Detection')}
            type="button"
          >
            <span className="material-symbols-outlined text-base group-hover:scale-110 transition-transform" data-icon="terminal">terminal</span>
            <span className="font-mono">/api/predict</span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              className="relative p-2 rounded-xl text-on-surface-variant dark:text-emerald-200 hover:bg-surface-container-low dark:hover:bg-[#173021] hover:text-primary dark:hover:text-primary-fixed transition-all duration-200 active:scale-90"
              title="Demo Notifications"
              type="button"
              onClick={triggerNotification}
            >
              <span className="material-symbols-outlined text-xl" data-icon="notifications">notifications</span>
              <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary ring-2 ring-surface-container-lowest dark:ring-[#0d1c13]"></span>
              </span>
            </button>
            {showNotification && (
              <div className="absolute right-0 top-full mt-2 w-72 p-3 bg-surface-container-lowest dark:bg-[#122419] rounded-2xl shadow-xl border border-[#10b981]/40 dark:border-emerald-800/60 z-50 animate-slide-down text-xs">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-primary dark:text-primary-fixed text-base mt-0.5" data-icon="verified">verified</span>
                  <div>
                    <p className="font-bold text-on-surface dark:text-[#ecfdf5]">Inference Model Online</p>
                    <p className="text-on-surface-variant dark:text-emerald-300/70 mt-0.5">ResNet-50 weights loaded. Diagnostic sandbox operational.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar & Name (CLICKABLE -> Opens Profile) with animated ring glow */}
          <button
            type="button"
            onClick={() => onNavigate('Profile')}
            className="flex items-center gap-2 pl-2 border-l border-outline-variant/30 dark:border-emerald-900/40 text-left hover:opacity-90 transition-all cursor-pointer group active:scale-95"
            title="Click to view and edit profile"
            id="header-user-profile-btn"
          >
            <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary flex items-center justify-center text-label-md font-label-md font-bold shadow-sm ring-2 ring-primary/20 dark:ring-primary-fixed/30 group-hover:scale-110 group-hover:ring-primary group-hover:shadow-[0_0_12px_rgba(16,185,129,0.3)] transition-all flex-shrink-0">
              {userInitials}
            </div>
            <div className="hidden xl:block text-left leading-tight">
              <p className="text-label-md font-label-md font-bold text-on-surface dark:text-[#ecfdf5] group-hover:text-primary dark:group-hover:text-primary-fixed transition-colors truncate max-w-[140px]">
                {user?.name || 'Hackathon Evaluator'}
              </p>
              <p className="text-label-sm font-label-sm text-on-surface-variant dark:text-emerald-300/70 truncate max-w-[140px]">
                {user?.role || 'Demo Sandbox Mode'}
              </p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}

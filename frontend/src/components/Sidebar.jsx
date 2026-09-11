import React from 'react';
import { computeInitials } from '../utils/userStore';

export default function Sidebar({
  activeTab,
  onSelectTab,
  isMobileOpen,
  onCloseMobile,
  darkMode,
  onToggleTheme,
  user
}) {
  const userInitials = user?.initials || computeInitials(user?.name) || 'HP';

  const navItems = [
    { id: 'Dashboard', label: 'Dashboard', icon: 'space_dashboard' },
    { id: 'Disease Detection', label: 'Disease Detection', icon: 'biotech', badge: 'Core AI', badgeClass: 'bg-primary-fixed text-on-primary-fixed animate-pulse', isCore: true },
    { id: 'Scan History', label: 'Scan History', icon: 'history' },
    { id: 'Crop Recommendation', label: 'Crop Recommendation', icon: 'psychology', badge: 'Prototype', badgeClass: 'bg-stone-100 dark:bg-emerald-950/60 text-stone-600 dark:text-emerald-300 border border-stone-200 dark:border-emerald-800/40' },
    { id: 'Smart Irrigation', label: 'Smart Irrigation', icon: 'water_drop', badge: 'Prototype', badgeClass: 'bg-stone-100 dark:bg-emerald-950/60 text-stone-600 dark:text-emerald-300 border border-stone-200 dark:border-emerald-800/40' },
    { id: 'Weather Intelligence', label: 'Weather Intelligence', icon: 'routine', badge: 'Coming Soon', badgeClass: 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40' },
    { id: 'Sustainability', label: 'Sustainability', icon: 'eco', badge: 'Prototype', badgeClass: 'bg-stone-100 dark:bg-emerald-950/60 text-stone-600 dark:text-emerald-300 border border-stone-200 dark:border-emerald-800/40' },
    { id: 'AI Farmer Assistant', label: 'AI Farmer Assistant', icon: 'smart_toy', badge: 'Prototype', badgeClass: 'bg-stone-100 dark:bg-emerald-950/60 text-stone-600 dark:text-emerald-300 border border-stone-200 dark:border-emerald-800/40' },
    { id: 'Profile', label: 'User Profile', icon: 'account_circle' },
    { id: 'Farm Settings', label: 'Demo Settings', icon: 'tune' },
  ];

  return (
    <>
      {/* DESKTOP SIDE NAVIGATION BAR */}
      <aside
        className="w-72 flex-shrink-0 bg-surface dark:bg-[#0a170f] border-r border-outline-variant/20 dark:border-emerald-900/30 p-4 hidden lg:flex flex-col justify-between z-30 min-h-[calc(100vh-4rem)] transition-colors duration-200"
        id="side-navigation"
      >
        <div className="space-y-4">
          {/* Brand Header Unit inside Sidebar */}
          <div className="px-3 py-2 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-lg animate-float-slow" data-icon="energy_savings_leaf">
                energy_savings_leaf
              </span>
            </div>
            <div>
              <h2 className="text-label-lg font-label-lg font-bold text-on-surface dark:text-[#ecfdf5]">AgriSmart AI</h2>
              <p className="text-label-sm font-label-sm text-on-surface-variant dark:text-emerald-300/70">Student Hackathon Project</p>
            </div>
          </div>

          {/* Rapid Disease Scan Call to Action Button with Shimmer */}
          <div className="pt-1 pb-2">
            <button
              className="w-full relative overflow-hidden flex items-center justify-center gap-2.5 bg-primary-container hover:bg-[#14532d] text-on-primary font-label-lg py-3.5 px-4 rounded-2xl shadow-md transition-all duration-300 active:scale-[0.97] hover:shadow-[0_4px_20px_rgba(21,128,61,0.4)] group"
              onClick={() => onSelectTab('Disease Detection')}
              type="button"
            >
              {/* Shimmer light sweep */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              <span className="material-symbols-outlined text-xl group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" data-icon="add_a_photo">add_a_photo</span>
              <span className="font-bold tracking-wide">Detect Crop Disease</span>
            </button>
          </div>

          {/* Navigation Tabs */}
          <nav className="space-y-1.5" id="nav-tabs-container">
            {navItems.map((item) => {
              const isActive = activeTab === item.id || (item.id === 'Disease Detection' && activeTab === 'Disease-Result');
              return (
                <button
                  key={item.id}
                  className={`w-full text-left transition-all duration-200 active:scale-[0.98] flex items-center justify-between rounded-xl px-3.5 py-2.5 group relative ${
                    isActive
                      ? 'font-bold bg-primary-container text-on-primary-container shadow-md shadow-primary/10 translate-x-1'
                      : 'font-medium text-on-surface-variant dark:text-emerald-100/80 hover:bg-surface-container dark:hover:bg-[#132a1c] hover:text-primary dark:hover:text-primary-fixed hover:translate-x-1'
                  }`}
                  data-nav-tab={item.id}
                  onClick={() => onSelectTab(item.id)}
                  type="button"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`material-symbols-outlined transition-transform duration-200 group-hover:scale-110 ${
                        item.isCore && !isActive ? 'text-primary dark:text-primary-fixed' : ''
                      }`}
                      data-icon={item.icon}
                    >
                      {item.icon}
                    </span>
                    <span className={`text-label-md font-label-md transition-colors ${
                      item.isCore && !isActive ? 'font-bold text-on-surface dark:text-[#ecfdf5]' : ''
                    }`}>
                      {item.label}
                    </span>
                  </div>
                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-full tracking-wider shadow-sm transition-transform group-hover:scale-105 ${
                        item.badgeClass || ''
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Tabs */}
        <div className="pt-4 border-t border-outline-variant/20 dark:border-emerald-900/30 space-y-2.5">
          {/* User Profile quick link with hover lift */}
          <button
            type="button"
            onClick={() => onSelectTab('Profile')}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low dark:bg-[#122419] border border-outline-variant/20 dark:border-emerald-800/30 hover:bg-surface-container dark:hover:bg-[#183223] transition-all text-left group hover:shadow-sm active:scale-95"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center text-xs font-bold shadow-sm group-hover:scale-110 transition-transform">
                {userInitials}
              </div>
              <div className="leading-tight">
                <p className="text-label-sm font-bold text-on-surface dark:text-[#ecfdf5] group-hover:text-primary dark:group-hover:text-primary-fixed transition-colors truncate max-w-[120px]">
                  {user?.name || 'Evaluator'}
                </p>
                <p className="text-[11px] text-on-surface-variant dark:text-emerald-300/70 truncate max-w-[120px]">
                  View Profile
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-sm text-on-surface-variant dark:text-emerald-300/70 group-hover:translate-x-1 transition-transform" data-icon="chevron_right">chevron_right</span>
          </button>

          <div className="px-3 py-1 text-xs text-on-surface-variant/70 dark:text-emerald-300/70 flex items-center justify-between">
            <span>Computer Vision Pipeline</span>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-radar-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <button
            className="w-full flex items-center gap-3 text-on-surface-variant dark:text-emerald-200 hover:bg-surface-container dark:hover:bg-[#132a1c] hover:text-primary dark:hover:text-primary-fixed rounded-xl px-4 py-2 text-label-md font-label-md transition-all duration-200 active:scale-95"
            onClick={() => alert('Student Demo Pipeline: ResNet-50 PyTorch backend with mock inference delay.')}
            type="button"
          >
            <span className="material-symbols-outlined text-lg" data-icon="info">info</span>
            <span>Pipeline Details</span>
          </button>
        </div>
      </aside>

      {/* MOBILE DRAWER MODAL OVERLAY */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-[#07110a]/60 backdrop-blur-sm z-50 lg:hidden transition-opacity"
          id="mobile-drawer"
          onClick={onCloseMobile}
        >
          <div
            className="w-72 bg-surface dark:bg-[#0b1810] border-r border-outline-variant/20 dark:border-emerald-900/40 h-full p-4 flex flex-col justify-between shadow-2xl transition-colors duration-200 animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20 dark:border-emerald-900/40">
                <div className="flex items-center gap-2">
                  <span
                    className="material-symbols-outlined text-primary dark:text-primary-fixed text-2xl"
                    data-icon="spa"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    spa
                  </span>
                  <span className="text-headline-sm font-headline-sm font-extrabold text-primary dark:text-primary-fixed">
                    AgriSmart AI
                  </span>
                </div>
                <button
                  className="p-1.5 text-on-surface-variant dark:text-emerald-200 hover:text-primary active:scale-90 transition-transform"
                  id="mobile-drawer-close"
                  type="button"
                  onClick={onCloseMobile}
                >
                  <span className="material-symbols-outlined" data-icon="close">close</span>
                </button>
              </div>

              {/* Theme Toggle Button inside Mobile Drawer */}
              <button
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-outline-variant/30 dark:border-emerald-800/40 bg-white dark:bg-[#122419] text-on-surface dark:text-[#ecfdf5] text-label-md font-semibold active:scale-95 shadow-sm"
                onClick={onToggleTheme}
                type="button"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-amber-500 dark:text-emerald-300 animate-spin-slow" data-icon={darkMode ? "light_mode" : "dark_mode"}>
                    {darkMode ? "light_mode" : "dark_mode"}
                  </span>
                  <span>{darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}</span>
                </div>
                <span className="text-xs text-primary dark:text-primary-fixed font-bold uppercase">{darkMode ? "Light" : "Dark"}</span>
              </button>

              {/* User Profile Pill inside Mobile Drawer */}
              <button
                type="button"
                onClick={() => {
                  onSelectTab('Profile');
                  onCloseMobile();
                }}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-surface-container-low dark:bg-[#122419] border border-outline-variant/20 dark:border-emerald-800/30 text-left active:scale-95 transition-all"
              >
                <div className="w-9 h-9 rounded-lg bg-primary-container text-on-primary flex items-center justify-center text-sm font-bold shadow-sm">
                  {userInitials}
                </div>
                <div className="leading-tight flex-1">
                  <p className="text-label-md font-bold text-on-surface dark:text-[#ecfdf5] truncate">
                    {user?.name || 'Evaluator'}
                  </p>
                  <p className="text-xs text-on-surface-variant dark:text-emerald-300/70">
                    Edit Profile Details
                  </p>
                </div>
                <span className="material-symbols-outlined text-sm text-on-surface-variant" data-icon="edit">edit</span>
              </button>

              <button
                className="w-full flex items-center justify-center gap-2 bg-primary-container text-on-primary font-label-md py-3 rounded-xl shadow active:scale-95 transition-transform"
                onClick={() => {
                  onSelectTab('Disease Detection');
                  onCloseMobile();
                }}
                type="button"
              >
                <span className="material-symbols-outlined" data-icon="add_a_photo">add_a_photo</span>
                <span>Detect Crop Disease</span>
              </button>

              <nav className="space-y-1 mobile-nav-list max-h-[45vh] overflow-y-auto">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    className={`w-full text-left flex items-center justify-between rounded-xl px-4 py-2.5 font-medium transition-colors ${
                      activeTab === item.id
                        ? 'bg-primary-container text-on-primary-container font-semibold'
                        : 'text-on-surface dark:text-emerald-100 hover:bg-surface-container dark:hover:bg-[#132a1c]'
                    }`}
                    onClick={() => {
                      onSelectTab(item.id);
                      onCloseMobile();
                    }}
                    type="button"
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary dark:text-primary-fixed" data-icon={item.icon}>
                        {item.icon}
                      </span>
                      <span className="text-label-md">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${item.badgeClass || ''}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

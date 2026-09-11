import React, { useState } from 'react';
import { SAMPLE_SCANS } from '../../constants/data';

export default function HistoryTab({ onShowResult }) {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredScans = SAMPLE_SCANS.filter((scan) => {
    if (activeFilter === 'diseased') return scan.badgeType === 'warning' || scan.badgeType === 'error';
    if (activeFilter === 'healthy') return scan.badgeType === 'success';
    return true;
  });

  return (
    <section className="tab-content space-y-6" id="tab-Scan History">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-label-sm font-label-sm mb-2 shadow-sm">
            <span className="material-symbols-outlined text-sm" data-icon="dataset">dataset</span>
            <span>Ground Truth Validation Set</span>
          </div>
          <h2 className="text-headline-lg font-headline-lg text-on-surface dark:text-[#ecfdf5] font-extrabold">Demonstration Scan Records</h2>
          <p className="text-body-md font-body-md text-on-surface-variant dark:text-emerald-200/80">
            Sample validation set records for hackathon evaluation and model verification.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-surface-container dark:bg-[#162a1e] border border-outline-variant/30 dark:border-emerald-800/30">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-label-sm font-semibold transition-all duration-200 ${
              activeFilter === 'all'
                ? 'bg-primary-container text-white shadow-sm'
                : 'text-on-surface-variant dark:text-emerald-300/70 hover:text-primary dark:hover:text-primary-fixed'
            }`}
          >
            All (3)
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('diseased')}
            className={`px-3.5 py-1.5 rounded-xl text-label-sm font-semibold transition-all duration-200 ${
              activeFilter === 'diseased'
                ? 'bg-primary-container text-white shadow-sm'
                : 'text-on-surface-variant dark:text-emerald-300/70 hover:text-primary dark:hover:text-primary-fixed'
            }`}
          >
            Diseased (2)
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('healthy')}
            className={`px-3.5 py-1.5 rounded-xl text-label-sm font-semibold transition-all duration-200 ${
              activeFilter === 'healthy'
                ? 'bg-primary-container text-white shadow-sm'
                : 'text-on-surface-variant dark:text-emerald-300/70 hover:text-primary dark:hover:text-primary-fixed'
            }`}
          >
            Healthy (1)
          </button>
        </div>
      </div>

      {/* Record List Container */}
      <div className="bg-surface-container-lowest dark:bg-[#112117] rounded-3xl border border-[#14532d]/15 dark:border-emerald-800/30 shadow-md overflow-hidden transition-colors duration-200">
        <div className="divide-y divide-outline-variant/20 dark:divide-emerald-900/30">
          {filteredScans.map((scan) => {
            const numericConfidence = parseInt(scan.confidence) || 90;
            return (
              <div
                key={scan.id}
                className="group p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#f4f7f4]/90 dark:hover:bg-[#162c1e]/70 transition-all duration-300 border-l-4 border-l-transparent hover:border-l-emerald-500 hover:shadow-sm"
              >
                <div className="flex items-center gap-4">
                  {/* Image with zoom and ring glow */}
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 ring-2 ring-emerald-500/20 group-hover:ring-emerald-500/50 transition-all shadow-sm">
                    {scan.image ? (
                      <img
                        alt={scan.condition}
                        className="w-full h-full object-cover group-hover:scale-115 group-hover:rotate-1 transition-transform duration-500"
                        src={scan.image}
                      />
                    ) : scan.isLeafIcon ? (
                      <div className="w-full h-full bg-surface-container dark:bg-[#183424] flex items-center justify-center text-primary dark:text-primary-fixed group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-3xl" data-icon="eco">eco</span>
                      </div>
                    ) : (
                      <div className="w-full h-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center text-error dark:text-red-400 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-3xl" data-icon="coronavirus">coronavirus</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-label-lg font-label-lg font-bold text-on-surface dark:text-[#ecfdf5] group-hover:text-primary dark:group-hover:text-primary-fixed transition-colors">
                        {scan.condition}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold transition-all shadow-xs ${
                          scan.badgeType === 'warning'
                            ? 'bg-[#fffbeb] dark:bg-amber-950/60 text-[#92400e] dark:text-amber-300 border border-[#f59e0b] dark:border-amber-600/50'
                            : scan.badgeType === 'success'
                            ? 'bg-[#ecfdf5] dark:bg-emerald-950/70 text-[#065f46] dark:text-emerald-300 border border-[#10b981] dark:border-emerald-700/50'
                            : 'bg-[#fef2f2] dark:bg-red-950/50 text-[#991b1b] dark:text-red-300 border border-[#ef4444] dark:border-red-700/50'
                        }`}
                      >
                        {scan.badge}
                      </span>
                    </div>
                    <p className="text-body-sm font-body-sm text-on-surface-variant dark:text-emerald-200/70">
                      Validation Set #{scan.id} · Model: <span className="font-mono text-xs">{scan.model}</span>
                    </p>
                    <div className="flex items-center gap-2 pt-0.5">
                      <span className="text-xs text-stone-400 dark:text-emerald-300/50">Timestamp: 2024-03-29 14:22 UTC</span>
                      <span className="text-stone-300 dark:text-stone-700">·</span>
                      <span className="text-xs text-primary dark:text-primary-fixed font-medium">Spot Treatment Tagged</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-5 self-end sm:self-center">
                  {/* Visual Confidence Bar */}
                  <div className="text-right min-w-[90px]">
                    <span className="text-label-sm font-label-sm text-on-surface-variant dark:text-emerald-300/80 block font-medium">Confidence</span>
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-2 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            scan.badgeType === 'error' ? 'bg-red-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${numericConfidence}%` }}
                        ></div>
                      </div>
                      <span className={`text-label-md font-label-md font-bold ${scan.badgeType === 'error' ? 'text-error dark:text-red-400' : 'text-primary dark:text-primary-fixed'}`}>
                        {scan.confidence}
                      </span>
                    </div>
                  </div>

                  {/* Interactive Button */}
                  {scan.id === '01' ? (
                    <button
                      className="hover-lift active:scale-95 h-10 px-5 rounded-xl bg-gradient-to-r from-primary-container to-[#14532d] hover:from-[#14532d] hover:to-[#0f3d21] text-on-primary text-label-md font-label-md shadow-[0_4px_12px_rgba(16,185,129,0.25)] flex items-center gap-1.5 transition-all"
                      onClick={onShowResult}
                      type="button"
                    >
                      <span>View Diagnosis</span>
                      <span className="material-symbols-outlined text-sm" data-icon="chevron_right">chevron_right</span>
                    </button>
                  ) : scan.id === '02' ? (
                    <button
                      className="hover-lift active:scale-95 h-10 px-4 rounded-xl border border-outline-variant/50 dark:border-emerald-800/50 text-on-surface-variant dark:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-[#183223] text-label-md font-label-md transition-all flex items-center gap-1"
                      type="button"
                      onClick={() => alert("Validation Record #02: Sweet corn canopy exhibiting normal cellular turgor and chlorophyll density.")}
                    >
                      <span className="material-symbols-outlined text-sm text-emerald-600" data-icon="check_circle">check_circle</span>
                      <span>Healthy Leaf</span>
                    </button>
                  ) : (
                    <button
                      className="hover-lift active:scale-95 h-10 px-4 rounded-xl border border-outline-variant/50 dark:border-emerald-800/50 text-on-surface-variant dark:text-emerald-200 hover:bg-red-50 dark:hover:bg-red-950/30 text-label-md font-label-md transition-all flex items-center gap-1"
                      type="button"
                      onClick={() => alert("Validation Record #03: Potato late blight (Phytophthora infestans) benchmark test record.")}
                    >
                      <span className="material-symbols-outlined text-sm text-red-500" data-icon="warning">warning</span>
                      <span>View Log</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

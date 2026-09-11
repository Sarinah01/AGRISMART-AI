import React, { useState } from 'react';
import { DEFAULT_LEAF_IMAGE } from '../../constants/data';

export default function ResultTab({ onNavigate }) {
  const [savedScanToast, setSavedScanToast] = useState(false);

  const handleSave = () => {
    setSavedScanToast(true);
    setTimeout(() => setSavedScanToast(false), 3000);
  };

  return (
    <section className="tab-content space-y-6 animate-fade-in-up" id="tab-Disease-Result">
      {/* Breadcrumb navigation back */}
      <div className="flex items-center justify-between">
        <button
          className="inline-flex items-center gap-1.5 text-label-md font-label-md text-primary dark:text-primary-fixed hover:underline group"
          onClick={() => onNavigate('Dashboard')}
          type="button"
        >
          <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform" data-icon="arrow_back">arrow_back</span>
          <span>Back to Dashboard</span>
        </button>
        <div className="flex items-center gap-2.5">
          <button
            className="px-4 py-2 rounded-2xl bg-white dark:bg-[#162a1e] border border-[#14532d]/20 dark:border-emerald-700/40 text-on-surface dark:text-[#ecfdf5] font-label-md flex items-center gap-1.5 hover:bg-surface-container dark:hover:bg-[#1c3627] transition-all shadow-sm active:scale-95 hover:shadow-md"
            onClick={handleSave}
            type="button"
          >
            <span className="material-symbols-outlined text-base text-primary dark:text-primary-fixed" data-icon={savedScanToast ? "check_circle" : "bookmark_add"}>
              {savedScanToast ? "check_circle" : "bookmark_add"}
            </span>
            <span>{savedScanToast ? "Scan Saved!" : "Save Demo Scan"}</span>
          </button>
          <button
            className="px-4 py-2 rounded-2xl bg-primary-container text-on-primary font-label-md flex items-center gap-1.5 shadow hover:bg-[#14532d] hover:shadow-lg transition-all active:scale-95"
            onClick={() => onNavigate('Disease Detection')}
            type="button"
          >
            <span className="material-symbols-outlined text-base" data-icon="add_photo_alternate">add_photo_alternate</span>
            <span>Analyze Another Image</span>
          </button>
        </div>
      </div>

      {/* Alert Notification Bar with soft warning pulse */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#fffbeb] dark:bg-amber-950/40 border border-[#f59e0b] dark:border-amber-600/50 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors duration-200">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#f59e0b] dark:bg-amber-600 text-white flex items-center justify-center flex-shrink-0 shadow-md animate-bounce">
            <span className="material-symbols-outlined text-2xl" data-icon="warning">warning</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full text-label-sm font-label-sm font-bold bg-[#fef3c7] dark:bg-amber-900/60 text-[#92400e] dark:text-amber-200 border border-[#f59e0b] dark:border-amber-600/60 shadow-sm animate-pulse">
                Possible disease detected
              </span>
              <span className="text-body-sm font-body-sm text-on-surface-variant dark:text-emerald-300/70">Crop: Tomato</span>
            </div>
            <p className="text-label-lg font-label-lg font-bold text-[#92400e] dark:text-amber-300 mt-0.5">
              Tomato Early Blight (Alternaria solani) — Moderate Severity
            </p>
          </div>
        </div>
        <button
          className="h-11 px-5 rounded-2xl bg-[#92400e] dark:bg-amber-700 text-white font-label-md flex items-center gap-2 flex-shrink-0 hover:bg-[#78350f] dark:hover:bg-amber-800 transition-colors shadow-md hover:shadow-lg active:scale-95"
          onClick={() => onNavigate('AI Farmer Assistant')}
          type="button"
        >
          <span className="material-symbols-outlined text-sm" data-icon="chat">chat</span>
          <span>Ask AI Assistant Prototype</span>
        </button>
      </div>

      {/* Main Diagnostic 2-Column Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Analyzed Visual Sample (5 cols) with Pulsating Foliar Target Bounding Box */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-surface-container-lowest dark:bg-[#112117] rounded-3xl p-6 border border-[#14532d]/10 dark:border-emerald-800/30 shadow-md space-y-4 transition-colors duration-200 hover-lift">
            <div className="flex items-center justify-between">
              <span className="text-label-lg font-label-lg font-bold text-on-surface dark:text-[#ecfdf5]">Computer Vision Analysis</span>
              <span className="text-label-sm font-label-sm text-primary dark:text-primary-fixed font-bold bg-primary/10 dark:bg-primary-fixed/20 px-2.5 py-0.5 rounded-md">ResNet Classifier</span>
            </div>

            {/* Image with Animated Pulsating Bounding Box Overlay */}
            <div className="relative rounded-2xl overflow-hidden bg-black/5 dark:bg-black/40 border border-outline-variant/40 dark:border-emerald-800/40 flex items-center justify-center group">
              <img
                alt="Analyzed Tomato Leaf with Early Blight lesions"
                className="w-full max-h-[380px] object-cover rounded-xl group-hover:scale-105 transition-transform duration-700"
                src={DEFAULT_LEAF_IMAGE}
              />
              {/* Dynamic Lesion Target Bounding Box */}
              <div className="absolute top-[36%] left-[40%] w-[26%] h-[24%] border-2 border-dashed border-red-500 bg-red-500/20 rounded-lg pointer-events-none flex flex-col justify-between p-1 animate-target-box z-10">
                <div className="bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded w-fit uppercase tracking-wider shadow-sm">
                  Lesion Area
                </div>
                <div className="text-[9px] text-red-900 bg-white/90 font-mono px-1 rounded w-fit font-bold">
                  Concentric Spot
                </div>
              </div>
              <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full text-white text-[11px] font-medium flex items-center gap-1.5 z-20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                <span>Tomato Leaflet Specimen</span>
              </div>
            </div>

            {/* Diagnostics Summary Strip */}
            <div className="grid grid-cols-2 gap-3.5 pt-1">
              <div className="p-3.5 rounded-2xl bg-[#ecfdf5] dark:bg-[#152a1d] border border-[#14532d]/10 dark:border-emerald-700/40 hover-lift">
                <span className="text-label-sm font-label-sm text-on-surface-variant dark:text-emerald-300/80">Model Confidence</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-headline-md font-headline-md font-bold text-primary dark:text-primary-fixed">91%</span>
                  <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">Confidence</span>
                </div>
                <div className="w-full bg-surface-container-high dark:bg-[#0c1811] h-2 rounded-full mt-2 overflow-hidden border border-transparent dark:border-emerald-800/30">
                  <div className="bg-gradient-to-r from-emerald-500 to-primary-container h-full rounded-full" style={{ width: '91%' }}></div>
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#fffbeb] dark:bg-amber-950/30 border border-[#f59e0b]/30 dark:border-amber-700/40 hover-lift">
                <span className="text-label-sm font-label-sm text-[#92400e] dark:text-amber-300">Severity Stage</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-headline-md font-headline-md font-bold text-[#b45309] dark:text-amber-400">Moderate</span>
                </div>
                <p className="text-[11px] font-medium text-[#92400e] dark:text-amber-300 mt-1">Isolated foliar spread</p>
              </div>
            </div>
          </div>

          {/* Clear Mandatory Disclaimer */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 flex items-start gap-3 shadow-sm">
            <span className="material-symbols-outlined text-amber-800 dark:text-amber-400 text-lg mt-0.5 flex-shrink-0 animate-bounce" data-icon="warning">warning</span>
            <p className="text-label-sm font-label-sm text-amber-900 dark:text-amber-200 leading-relaxed">
              <strong>Disclaimer:</strong> ⚠️ AI-generated prediction. Results should be verified with appropriate agricultural expertise before treatment decisions.
            </p>
          </div>
        </div>

        {/* Right: Recommended Precautions & Practical Steps (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Disease Biology Card */}
          <div className="bg-surface-container-lowest dark:bg-[#112117] rounded-3xl p-6 sm:p-7 border border-[#14532d]/10 dark:border-emerald-800/30 shadow-md space-y-3 transition-colors duration-200 hover-lift">
            <div className="flex items-center justify-between border-b border-outline-variant/20 dark:border-emerald-900/30 pb-3.5">
              <div>
                <h3 className="text-headline-md font-headline-md font-bold text-on-surface dark:text-[#ecfdf5]">Tomato Early Blight</h3>
                <p className="text-body-sm font-body-sm italic text-on-surface-variant dark:text-emerald-300/70 font-mono">Alternaria solani</p>
              </div>
              <span className="px-3 py-1 rounded-full text-label-sm font-label-sm bg-[#fffbeb] dark:bg-amber-950/50 text-[#92400e] dark:text-amber-300 border border-[#f59e0b] dark:border-amber-600/50 font-bold">
                Possible Pathogen
              </span>
            </div>
            <p className="text-body-md font-body-md text-on-surface-variant dark:text-emerald-200/80 leading-relaxed">
              Early blight is characterized by concentric brown spots surrounded by chlorotic yellow halos. It is commonly triggered by high moisture and moderate temperature fluctuations. Prompt cultural practices and foliage aeration help prevent upward canopy migration.
            </p>
          </div>

          {/* Practical Precautions with sequential hover illumination */}
          <div className="bg-surface-container-lowest dark:bg-[#112117] rounded-3xl p-6 sm:p-7 border border-[#14532d]/10 dark:border-emerald-800/30 shadow-md space-y-3.5 transition-colors duration-200">
            <h4 className="text-label-lg font-label-lg font-bold text-on-surface dark:text-[#ecfdf5] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#d97706] dark:text-amber-400" data-icon="task_alt">task_alt</span>
              <span>Recommended Precautions</span>
            </h4>
            <div className="space-y-3">
              {[
                { title: 'Remove visibly affected leaves', desc: 'Snip off diseased foliage near the base to prevent air/waterborne spore release to upper canopy leaves.' },
                { title: 'Avoid unnecessary overhead watering', desc: 'Fungal spores need free surface water to germinate. Switch strictly to drip irrigation at root zones.' },
                { title: 'Monitor nearby plants', desc: 'Check adjacent tomato and potato plants daily for early sign of concentric brown lesion formation.' },
                { title: 'Consult local agricultural guidance if symptoms spread', desc: 'Consult certified extension personnel or local crop specialists to select safe organic or chemical treatments.' }
              ].map((step, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#f4f7f4] dark:bg-[#15271c] border border-[#14532d]/10 dark:border-emerald-800/30 flex items-start gap-3.5 hover:border-primary dark:hover:border-emerald-500 hover:shadow-sm transition-all group"
                >
                  <div className="w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-115 transition-transform">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="text-label-md font-label-md font-bold text-on-surface dark:text-[#ecfdf5] group-hover:text-primary dark:group-hover:text-primary-fixed transition-colors">
                      {step.title}
                    </p>
                    <p className="text-body-sm font-body-sm text-on-surface-variant dark:text-emerald-200/70 mt-0.5">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              className="flex-1 py-3.5 px-5 rounded-2xl bg-primary-container text-on-primary font-label-md flex items-center justify-center gap-2 shadow hover:bg-[#14532d] hover:shadow-lg transition-all active:scale-95"
              onClick={() => onNavigate('AI Farmer Assistant')}
              type="button"
            >
              <span className="material-symbols-outlined" data-icon="smart_toy">smart_toy</span>
              <span>Ask AI Assistant Prototype</span>
            </button>
            <button
              className="py-3.5 px-5 rounded-2xl border border-primary dark:border-emerald-600 text-primary dark:text-primary-fixed font-label-md hover:bg-surface-container dark:hover:bg-[#162c1e] flex items-center gap-2 transition-all shadow-sm active:scale-95"
              onClick={() => onNavigate('Disease Detection')}
              type="button"
            >
              <span className="material-symbols-outlined" data-icon="refresh">refresh</span>
              <span>Analyze Another Image</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

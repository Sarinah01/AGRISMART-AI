import React, { useState } from 'react';
import { recommendCrops, evaluateIrrigation } from '../../services/api';

export function CropRecommendationTab({ onReturn }) {
  const [soilType, setSoilType] = useState('Loamy');
  const [ph, setPh] = useState(6.5);
  const [temperature, setTemperature] = useState(28);
  const [humidity, setHumidity] = useState(70);
  const [rainfall, setRainfall] = useState(150);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleRecommend = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await recommendCrops({
        soil_type: soilType,
        ph: Number(ph),
        temperature: Number(temperature),
        humidity: Number(humidity),
        rainfall: Number(rainfall),
        region: "North India",
        season: "Kharif"
      });
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="tab-content space-y-6" id="tab-Crop Recommendation">
      <div className="bg-surface-container-lowest dark:bg-[#112117] rounded-3xl p-6 sm:p-8 border border-[#14532d]/15 dark:border-emerald-800/30 shadow-lg max-w-4xl mx-auto space-y-6 my-4 transition-all duration-300">
        <div className="text-center space-y-2">
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-[#162c1e] dark:to-[#0f2316] text-primary dark:text-primary-fixed flex items-center justify-center mx-auto shadow-md">
            <span className="material-symbols-outlined text-3xl" data-icon="psychology">psychology</span>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase border border-emerald-200 dark:border-emerald-800/50">
            <span>Bonus Module A: Crop Recommendation (POST /api/recommend)</span>
          </span>
          <h3 className="text-headline-md font-headline-md font-extrabold text-on-surface dark:text-[#ecfdf5]">
            Crop Recommendation Intelligence
          </h3>
          <p className="text-body-sm font-body-sm text-on-surface-variant dark:text-emerald-200/80 max-w-xl mx-auto">
            Recommends resilient crop cultivars and seed varieties based on soil pH, temperature, rainfall, and pathogen resistance.
          </p>
        </div>

        {/* Interactive Input Form */}
        <form onSubmit={handleRecommend} className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#f4f7f4] dark:bg-[#15271c] p-5 rounded-2xl border border-outline-variant/20 dark:border-emerald-800/30">
          <div className="space-y-1">
            <label className="text-xs font-bold text-on-surface dark:text-[#ecfdf5]">Soil Type</label>
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="w-full h-10 rounded-xl bg-white dark:bg-[#162a1e] border border-outline-variant/30 dark:border-emerald-700/40 px-3 text-xs font-medium text-on-surface dark:text-[#ecfdf5]"
            >
              <option value="Loamy">Loamy Soil</option>
              <option value="Clay">Clay Soil</option>
              <option value="Sandy">Sandy Soil</option>
              <option value="Alluvial">Alluvial Soil</option>
              <option value="Black Soil">Black Cotton Soil</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-on-surface dark:text-[#ecfdf5]">Soil pH ({ph})</label>
            <input
              type="range"
              min="4.5"
              max="9.0"
              step="0.1"
              value={ph}
              onChange={(e) => setPh(e.target.value)}
              className="w-full h-2 bg-stone-200 dark:bg-stone-700 rounded-lg accent-emerald-600 mt-2"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-on-surface dark:text-[#ecfdf5]">Temperature (°C)</label>
            <input
              type="number"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              className="w-full h-10 rounded-xl bg-white dark:bg-[#162a1e] border border-outline-variant/30 dark:border-emerald-700/40 px-3 text-xs font-medium text-on-surface dark:text-[#ecfdf5]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-on-surface dark:text-[#ecfdf5]">Humidity (%)</label>
            <input
              type="number"
              value={humidity}
              onChange={(e) => setHumidity(e.target.value)}
              className="w-full h-10 rounded-xl bg-white dark:bg-[#162a1e] border border-outline-variant/30 dark:border-emerald-700/40 px-3 text-xs font-medium text-on-surface dark:text-[#ecfdf5]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-on-surface dark:text-[#ecfdf5]">Annual Rainfall (mm)</label>
            <input
              type="number"
              value={rainfall}
              onChange={(e) => setRainfall(e.target.value)}
              className="w-full h-10 rounded-xl bg-white dark:bg-[#162a1e] border border-outline-variant/30 dark:border-emerald-700/40 px-3 text-xs font-medium text-on-surface dark:text-[#ecfdf5]"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 rounded-xl bg-primary-container hover:bg-[#14532d] text-white text-xs font-bold transition-all shadow flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm" data-icon="travel_explore">travel_explore</span>
              <span>{loading ? "Evaluating..." : "Generate Recommendation"}</span>
            </button>
          </div>
        </form>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs">
            Error calling /api/recommend: {error}
          </div>
        )}

        {/* Results Output */}
        {result && (
          <div className="space-y-4 pt-2 text-left animate-fade-in-up">
            <div className="p-4 rounded-2xl bg-[#ecfdf5] dark:bg-[#152a1d] border border-emerald-500/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">Top Recommendation</span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary text-white">
                  {result.top_recommendation.suitability_percentage} Suitability
                </span>
              </div>
              <h4 className="text-headline-sm font-bold text-primary dark:text-primary-fixed mt-1">
                {result.top_recommendation.crop_name}
              </h4>
              <p className="text-xs text-on-surface-variant dark:text-emerald-200/80 mt-1">
                <strong>Reasoning:</strong> {result.top_recommendation.reasoning}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-md bg-white dark:bg-[#0c1811] text-emerald-700 dark:text-emerald-300 border border-emerald-700/30 font-medium">
                  {result.top_recommendation.pathogen_resistance}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-500/30 font-medium">
                  {result.top_recommendation.estimated_yield_boost}
                </span>
              </div>
            </div>

            <p className="text-xs text-on-surface-variant dark:text-emerald-300/70 font-mono">
              💡 {result.explainable_logic}
            </p>
          </div>
        )}

        <button
          className="hover-lift active:scale-95 group px-6 py-2.5 rounded-2xl border border-primary text-primary dark:text-primary-fixed hover:bg-surface-container dark:hover:bg-[#162c1e] text-xs font-bold flex items-center justify-center gap-2 mx-auto transition-all"
          onClick={onReturn}
          type="button"
        >
          <span className="material-symbols-outlined text-base group-hover:-translate-x-1 transition-transform" data-icon="arrow_back">arrow_back</span>
          <span>Return to Dashboard</span>
        </button>
      </div>
    </section>
  );
}

export function SmartIrrigationTab({ onReturn }) {
  const [moisture, setMoisture] = useState(35);
  const [cropType, setCropType] = useState('Tomato');
  const [growthStage, setGrowthStage] = useState('Vegetative');
  const [rainForecast, setRainForecast] = useState('High');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleEvaluate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await evaluateIrrigation({
        soil_moisture: Number(moisture),
        crop_type: cropType,
        growth_stage: growthStage,
        rain_forecast: rainForecast,
      });
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="tab-content space-y-6" id="tab-Smart Irrigation">
      <div className="bg-surface-container-lowest dark:bg-[#112117] rounded-3xl p-6 sm:p-8 border border-[#14532d]/15 dark:border-emerald-800/30 shadow-lg max-w-4xl mx-auto space-y-6 my-4 transition-all duration-300">
        <div className="text-center space-y-2">
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-100 to-blue-200 dark:from-[#0d2836] dark:to-[#081a24] text-sky-600 dark:text-sky-300 flex items-center justify-center mx-auto shadow-md">
            <span className="material-symbols-outlined text-3xl" data-icon="water_drop">water_drop</span>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/70 text-sky-800 dark:text-sky-300 text-xs font-bold uppercase border border-sky-200 dark:border-sky-800/50">
            <span>Bonus Module B: Smart Irrigation (POST /api/irrigation)</span>
          </span>
          <h3 className="text-headline-md font-headline-md font-extrabold text-on-surface dark:text-[#ecfdf5]">
            Smart Irrigation &amp; Blight Prevention
          </h3>
          <p className="text-body-sm font-body-sm text-on-surface-variant dark:text-emerald-200/80 max-w-xl mx-auto">
            Automates water control and suspends overhead watering when foliar fungal spores are at high risk.
          </p>
        </div>

        {/* Interactive Form */}
        <form onSubmit={handleEvaluate} className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-[#f4f7f4] dark:bg-[#15271c] p-5 rounded-2xl border border-outline-variant/20 dark:border-emerald-800/30">
          <div className="space-y-1">
            <label className="text-xs font-bold text-on-surface dark:text-[#ecfdf5]">Soil Moisture ({moisture}%)</label>
            <input
              type="range"
              min="10"
              max="90"
              value={moisture}
              onChange={(e) => setMoisture(e.target.value)}
              className="w-full h-2 bg-stone-200 dark:bg-stone-700 rounded-lg accent-sky-600 mt-2"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-on-surface dark:text-[#ecfdf5]">Crop Type</label>
            <select
              value={cropType}
              onChange={(e) => setCropType(e.target.value)}
              className="w-full h-10 rounded-xl bg-white dark:bg-[#162a1e] border border-outline-variant/30 dark:border-emerald-700/40 px-3 text-xs font-medium text-on-surface dark:text-[#ecfdf5]"
            >
              <option value="Tomato">Tomato</option>
              <option value="Potato">Potato</option>
              <option value="Corn">Sweet Corn</option>
              <option value="Pepper Bell">Pepper Bell</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-on-surface dark:text-[#ecfdf5]">Rain Forecast</label>
            <select
              value={rainForecast}
              onChange={(e) => setRainForecast(e.target.value)}
              className="w-full h-10 rounded-xl bg-white dark:bg-[#162a1e] border border-outline-variant/30 dark:border-emerald-700/40 px-3 text-xs font-medium text-on-surface dark:text-[#ecfdf5]"
            >
              <option value="High">High Rain Probability</option>
              <option value="Moderate">Moderate Rain</option>
              <option value="Low">Low Rain</option>
              <option value="None">Clear Sky / Dry</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-all shadow flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm" data-icon="opacity">opacity</span>
              <span>{loading ? "Evaluating..." : "Check Irrigation"}</span>
            </button>
          </div>
        </form>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs">
            Error calling /api/irrigation: {error}
          </div>
        )}

        {/* Results Output */}
        {result && (
          <div className="space-y-3 pt-2 text-left animate-fade-in-up">
            <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-300 dark:border-sky-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-800 dark:text-sky-300">Irrigation Decision</span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-600 text-white">
                  Urgency: {result.urgency}
                </span>
              </div>
              <h4 className="text-headline-sm font-bold text-sky-900 dark:text-sky-200 mt-1">
                {result.action}
              </h4>
              <p className="text-xs text-on-surface-variant dark:text-emerald-200/80 mt-1">
                <strong>Reasoning:</strong> {result.reasoning}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-md bg-white dark:bg-[#0c1811] text-sky-700 dark:text-sky-300 border border-sky-700/30 font-medium">
                  {result.foliar_blight_risk}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 font-medium">
                  Solenoid: {result.solenoid_zone_recommendation}
                </span>
              </div>
            </div>
          </div>
        )}

        <button
          className="hover-lift active:scale-95 group px-6 py-2.5 rounded-2xl border border-primary text-primary dark:text-primary-fixed hover:bg-surface-container dark:hover:bg-[#162c1e] text-xs font-bold flex items-center justify-center gap-2 mx-auto transition-all"
          onClick={onReturn}
          type="button"
        >
          <span className="material-symbols-outlined text-base group-hover:-translate-x-1 transition-transform" data-icon="arrow_back">arrow_back</span>
          <span>Return to Dashboard</span>
        </button>
      </div>
    </section>
  );
}

export function WeatherIntelligenceTab({ onReturn }) {
  return (
    <section className="tab-content space-y-6" id="tab-Weather Intelligence">
      <div className="bg-surface-container-lowest dark:bg-[#112117] rounded-3xl p-8 sm:p-10 border border-[#14532d]/15 dark:border-emerald-800/30 shadow-lg text-center max-w-2xl mx-auto space-y-6 my-6 transition-all duration-300 hover-lift">
        {/* Animated Floating Icon */}
        <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-100 to-amber-200 dark:from-[#2e1d09] dark:to-[#1a1104] text-amber-600 dark:text-amber-300 flex items-center justify-center mx-auto ring-8 ring-amber-500/10 dark:ring-amber-500/20 shadow-md animate-float">
          <span className="material-symbols-outlined text-4xl" data-icon="cloud">cloud</span>
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 border-2 border-white dark:border-[#112117] animate-ping"></span>
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 text-xs font-bold uppercase border border-amber-200 dark:border-amber-800/50 shadow-xs">
            <span className="material-symbols-outlined text-xs" data-icon="thermostat">thermostat</span>
            <span>Hyperlocal Microclimate API</span>
          </span>
          <h3 className="text-headline-md font-headline-md font-extrabold text-on-surface dark:text-[#ecfdf5]">
            Weather Intelligence &amp; Spore Dispersion
          </h3>
          <p className="text-body-md font-body-md text-on-surface-variant dark:text-emerald-200/80 max-w-lg mx-auto">
            Correlates barometric pressure drops, dew point condensation, and wind currents to forecast airborne fungal dissemination 48 hours in advance.
          </p>
        </div>

        {/* Telemetry preview cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left pt-2">
          <div className="p-3.5 rounded-2xl bg-[#f4f7f4] dark:bg-[#15271c] border border-outline-variant/30 dark:border-emerald-800/30 hover-lift transition-all">
            <p className="text-xs text-on-surface-variant dark:text-emerald-300/70 font-semibold">Relative Humidity</p>
            <p className="text-sm font-bold text-amber-600 dark:text-amber-400 mt-1">78% (Elevated)</p>
            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-mono">Favorable for spores</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#f4f7f4] dark:bg-[#15271c] border border-outline-variant/30 dark:border-emerald-800/30 hover-lift transition-all">
            <p className="text-xs text-on-surface-variant dark:text-emerald-300/70 font-semibold">Dew Point Window</p>
            <p className="text-sm font-bold text-on-surface dark:text-[#ecfdf5] mt-1">04:00 - 07:30 AM</p>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">Prevent foliar contact</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#f4f7f4] dark:bg-[#15271c] border border-outline-variant/30 dark:border-emerald-800/30 hover-lift transition-all">
            <p className="text-xs text-on-surface-variant dark:text-emerald-300/70 font-semibold">Wind Vector</p>
            <p className="text-sm font-bold text-on-surface dark:text-[#ecfdf5] mt-1">8 km/h NW</p>
            <span className="text-[11px] text-stone-500 dark:text-emerald-300/60 font-mono">Low dispersion threat</span>
          </div>
        </div>

        <button
          className="hover-lift active:scale-95 group px-6 py-3 rounded-2xl bg-gradient-to-r from-primary-container to-[#14532d] hover:from-[#14532d] hover:to-[#0f3d21] text-white font-label-md flex items-center justify-center gap-2 mx-auto shadow-[0_4px_16px_rgba(16,185,129,0.3)] transition-all"
          onClick={onReturn}
          type="button"
        >
          <span className="material-symbols-outlined text-base group-hover:-translate-x-1 transition-transform" data-icon="arrow_back">arrow_back</span>
          <span>Return to Core Disease Scanner</span>
        </button>
      </div>
    </section>
  );
}

export function SustainabilityTab({ onReturn }) {
  return (
    <section className="tab-content space-y-6" id="tab-Sustainability">
      <div className="bg-surface-container-lowest dark:bg-[#112117] rounded-3xl p-8 sm:p-10 border border-[#14532d]/15 dark:border-emerald-800/30 shadow-lg text-center max-w-2xl mx-auto space-y-6 my-6 transition-all duration-300 hover-lift">
        {/* Animated Floating Icon */}
        <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-100 to-teal-200 dark:from-[#0f2d24] dark:to-[#091b15] text-teal-700 dark:text-teal-300 flex items-center justify-center mx-auto ring-8 ring-teal-500/10 dark:ring-teal-500/20 shadow-md animate-float-slow">
          <span className="material-symbols-outlined text-4xl" data-icon="eco">eco</span>
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-teal-400 border-2 border-white dark:border-[#112117] animate-ping"></span>
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 text-xs font-bold uppercase border border-teal-200 dark:border-teal-800/50 shadow-xs">
            <span className="material-symbols-outlined text-xs" data-icon="nest_eco_leaf">nest_eco_leaf</span>
            <span>Carbon &amp; Chemical Reduction</span>
          </span>
          <h3 className="text-headline-md font-headline-md font-extrabold text-on-surface dark:text-[#ecfdf5]">
            Fungicide Abatement &amp; Sustainability
          </h3>
          <p className="text-body-md font-body-md text-on-surface-variant dark:text-emerald-200/80 max-w-lg mx-auto">
            Quantifying chemical run-off savings by restricting fungicide applications exclusively to AI-targeted coordinates rather than blanket spraying entire field sectors.
          </p>
        </div>

        {/* Telemetry preview cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left pt-2">
          <div className="p-3.5 rounded-2xl bg-[#f4f7f4] dark:bg-[#15271c] border border-outline-variant/30 dark:border-emerald-800/30 hover-lift transition-all">
            <p className="text-xs text-on-surface-variant dark:text-emerald-300/70 font-semibold">Chemical Reduction</p>
            <p className="text-sm font-bold text-teal-600 dark:text-teal-400 mt-1">-58.2% Spray Vol</p>
            <span className="text-[11px] text-teal-600 dark:text-teal-400 font-mono">Spot treatment target</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#f4f7f4] dark:bg-[#15271c] border border-outline-variant/30 dark:border-emerald-800/30 hover-lift transition-all">
            <p className="text-xs text-on-surface-variant dark:text-emerald-300/70 font-semibold">Soil Microbiome</p>
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1">94% Retention</p>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">Beneficial fungi intact</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#f4f7f4] dark:bg-[#15271c] border border-outline-variant/30 dark:border-emerald-800/30 hover-lift transition-all">
            <p className="text-xs text-on-surface-variant dark:text-emerald-300/70 font-semibold">Cost Savings</p>
            <p className="text-sm font-bold text-on-surface dark:text-[#ecfdf5] mt-1">₹14,200 / Acre</p>
            <span className="text-[11px] text-stone-500 dark:text-emerald-300/60 font-mono">Reduced input costs</span>
          </div>
        </div>

        <button
          className="hover-lift active:scale-95 group px-6 py-3 rounded-2xl bg-gradient-to-r from-primary-container to-[#14532d] hover:from-[#14532d] hover:to-[#0f3d21] text-white font-label-md flex items-center justify-center gap-2 mx-auto shadow-[0_4px_16px_rgba(16,185,129,0.3)] transition-all"
          onClick={onReturn}
          type="button"
        >
          <span className="material-symbols-outlined text-base group-hover:-translate-x-1 transition-transform" data-icon="arrow_back">arrow_back</span>
          <span>Return to Core Disease Scanner</span>
        </button>
      </div>
    </section>
  );
}

export function FarmSettingsTab() {
  const [enableHdInference, setEnableHdInference] = useState(true);
  const [autoFlagAlerts, setAutoFlagAlerts] = useState(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState(75);
  const [copiedKey, setCopiedKey] = useState(false);

  const handleCopyKey = () => {
    navigator.clipboard?.writeText('sk_hackathon_demo_live_eval_9941x');
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <section className="tab-content space-y-6 max-w-3xl mx-auto" id="tab-Farm Settings">
      <div className="bg-surface-container-lowest dark:bg-[#112117] rounded-3xl p-6 sm:p-8 border border-[#14532d]/15 dark:border-emerald-800/30 shadow-md space-y-6 transition-colors duration-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-label-sm font-label-sm mb-2 shadow-sm">
            <span className="material-symbols-outlined text-sm" data-icon="tune">tune</span>
            <span>Inference API &amp; Model Hyperparameters</span>
          </div>
          <h3 className="text-headline-md font-headline-md font-extrabold text-on-surface dark:text-[#ecfdf5]">
            Agronomic Inference Settings
          </h3>
          <p className="text-body-sm font-body-sm text-on-surface-variant dark:text-emerald-200/70">
            Tune computer vision thresholds, batch inference endpoints, and hardware acceleration for field edge devices.
          </p>
        </div>

        <div className="space-y-4">
          {/* Mock API Key with copy */}
          <div className="p-4 rounded-2xl bg-[#f4f7f4] dark:bg-[#15271c] border border-outline-variant/30 dark:border-emerald-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-label-md font-bold text-on-surface dark:text-[#ecfdf5]">API Gateway Authorization</p>
              <p className="text-xs text-on-surface-variant dark:text-emerald-300/70">Bearer token for REST foliar inference endpoint</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono bg-white dark:bg-[#162a1e] px-3 py-1.5 rounded-xl border border-outline-variant/30 dark:border-emerald-700/40 text-primary dark:text-primary-fixed shadow-xs">
                sk_hackathon_demo...9941x
              </span>
              <button
                type="button"
                onClick={handleCopyKey}
                className="hover-lift active:scale-95 px-3 py-1.5 rounded-xl bg-primary-container text-white text-xs font-medium flex items-center gap-1 shadow-sm transition-all"
              >
                <span className="material-symbols-outlined text-sm" data-icon={copiedKey ? "check" : "content_copy"}>
                  {copiedKey ? "check" : "content_copy"}
                </span>
                <span>{copiedKey ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>

          {/* Interactive Confidence Threshold Slider */}
          <div className="p-4 rounded-2xl bg-[#f4f7f4] dark:bg-[#15271c] border border-outline-variant/30 dark:border-emerald-800/30 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-label-md font-bold text-on-surface dark:text-[#ecfdf5]">Confidence Cutoff Threshold</p>
                <p className="text-xs text-on-surface-variant dark:text-emerald-300/70">Flag predictions below this limit for second-opinion manual agronomist audit</p>
              </div>
              <span className="text-sm font-bold text-primary dark:text-primary-fixed bg-white dark:bg-[#162a1e] px-3 py-1 rounded-xl border border-outline-variant/30 dark:border-emerald-700/40 shadow-xs">
                {confidenceThreshold}%
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              value={confidenceThreshold}
              onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
              className="w-full h-2 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
          </div>

          {/* Smooth Toggle 1 */}
          <div className="p-4 rounded-2xl bg-[#f4f7f4] dark:bg-[#15271c] border border-outline-variant/30 dark:border-emerald-800/30 flex items-center justify-between gap-4">
            <div>
              <p className="text-label-md font-bold text-on-surface dark:text-[#ecfdf5]">Ultra-Resolution Foliar Tile Slicing</p>
              <p className="text-xs text-on-surface-variant dark:text-emerald-300/70">Sub-slices 4K field photos into overlapping 512x512 inference patches</p>
            </div>
            <button
              type="button"
              onClick={() => setEnableHdInference(!enableHdInference)}
              className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none ${enableHdInference ? 'bg-emerald-600' : 'bg-stone-300 dark:bg-stone-700'}`}
            >
              <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${enableHdInference ? 'right-1' : 'left-1'}`}></span>
            </button>
          </div>

          {/* Smooth Toggle 2 */}
          <div className="p-4 rounded-2xl bg-[#f4f7f4] dark:bg-[#15271c] border border-outline-variant/30 dark:border-emerald-800/30 flex items-center justify-between gap-4">
            <div>
              <p className="text-label-md font-bold text-on-surface dark:text-[#ecfdf5]">Critical Blight SMS Alerting</p>
              <p className="text-xs text-on-surface-variant dark:text-emerald-300/70">Instantly dispatches SMS broadcasts when epidemic potential exceeds 85%</p>
            </div>
            <button
              type="button"
              onClick={() => setAutoFlagAlerts(!autoFlagAlerts)}
              className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none ${autoFlagAlerts ? 'bg-emerald-600' : 'bg-stone-300 dark:bg-stone-700'}`}
            >
              <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${autoFlagAlerts ? 'right-1' : 'left-1'}`}></span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

import React from 'react';
import { Sparkles, ShieldCheck, Zap, HeartHandshake, CheckCircle } from 'lucide-react';
import type { PacingCalculation, UserFinancialProfile } from '../types';
import { formatINR } from '../utils/pacingEngine';

interface HeroDailyGaugeProps {
  pacing: PacingCalculation;
  profile: UserFinancialProfile;
  onToggleWeekendBuffer: () => void;
}

export const HeroDailyGauge: React.FC<HeroDailyGaugeProps> = ({
  pacing,
  profile,
  onToggleWeekendBuffer,
}) => {
  const percentSpent = Math.min(100, Math.round((pacing.todaySpent / (pacing.todayAllowance || 1)) * 100));

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-700/80 p-6 md:p-8 shadow-2xl">
      {/* Background radial glow */}
      <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20 opacity-25 ${
        pacing.isOverspentToday ? 'bg-indigo-600' : 'bg-sky-500'
      }`} />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left Column: Big Daily Target */}
        <div className="flex-1 w-full text-center lg:text-left space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs text-sky-400 font-semibold">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>TODAY'S GUILT-FREE ALLOWANCE</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">Day {profile.currentDay} of 30</span>
          </div>

          <div>
            <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tight">
              {formatINR(pacing.todayAllowance)}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 font-normal">
              Spend this freely today on coffee, food, or shopping. <strong className="text-emerald-400">Your savings are already protected.</strong>
            </p>
          </div>

          {/* Today's Spend vs Remaining */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl px-5 py-3 text-left">
              <p className="text-[11px] text-slate-400 font-medium">Spent So Far Today</p>
              <p className="text-xl font-bold text-slate-100">{formatINR(pacing.todaySpent)}</p>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl px-5 py-3 text-left">
              <p className="text-[11px] text-slate-400 font-medium">
                {pacing.isOverspentToday ? 'Deficit Auto-Absorbed' : 'Remaining For Today'}
              </p>
              <p className={`text-xl font-bold ${
                pacing.isOverspentToday ? 'text-indigo-400' : 'text-emerald-400'
              }`}>
                {pacing.isOverspentToday ? `+${formatINR(pacing.todayOverspentDelta)}` : formatINR(pacing.todayRemaining)}
              </p>
            </div>

            {/* Weekend Buffer Toggle */}
            <button
              onClick={onToggleWeekendBuffer}
              title="Give yourself extra spending room on Saturdays & Sundays"
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-semibold border transition ${
                profile.isWeekendBufferEnabled
                  ? 'bg-sky-500/10 border-sky-500/40 text-sky-300 shadow-sm'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className={`w-4 h-4 ${profile.isWeekendBufferEnabled ? 'text-sky-400 fill-sky-400' : ''}`} />
              <span>Weekend Extra Budget: {profile.isWeekendBufferEnabled ? 'ON (+40%)' : 'OFF'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Visual Gauge & Real-Time Status */}
        <div className="w-full lg:w-88 bg-slate-950/80 p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium">Daily Budget Meter</span>
            <span className={`font-bold ${
              pacing.isOverspentToday ? 'text-indigo-400' : percentSpent > 75 ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {percentSpent}% Used
            </span>
          </div>

          {/* Visual Bar */}
          <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden p-0.5">
            <div
              style={{ width: `${percentSpent}%` }}
              className={`h-full rounded-full transition-all duration-500 ${
                pacing.isOverspentToday
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500'
                  : percentSpent > 75
                  ? 'bg-gradient-to-r from-emerald-500 via-amber-500 to-orange-500'
                  : 'bg-gradient-to-r from-teal-400 to-emerald-400'
              }`}
            />
          </div>

          {/* Friendly Status Explanation */}
          <div className="pt-2">
            {pacing.isOverspentToday ? (
              <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-1.5 text-left text-xs">
                <div className="flex items-center gap-1.5 text-indigo-300 font-bold">
                  <HeartHandshake className="w-4 h-4" />
                  <span>Self-Balancing Recalibration Active</span>
                </div>
                <p className="text-slate-200 text-[11px] leading-relaxed">
                  You spent {formatINR(pacing.todayOverspentDelta)} extra today. <strong>No stress!</strong> We gently reduced future days to <strong>{formatINR(pacing.adjustedFutureDailyAllowance)}/day</strong>.
                </p>
                <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium pt-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>₹30,000 Savings Vault 100% Untouched</span>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-1 text-left text-xs">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>You're Pacing Safely!</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  You still have <strong>{formatINR(pacing.todayRemaining)}</strong> to spend today. If you don't spend it, it will carry forward to boost tomorrow!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

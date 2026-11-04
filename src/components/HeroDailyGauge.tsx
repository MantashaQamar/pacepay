import React from 'react';
import { Sparkles, AlertTriangle, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
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
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-slate-700/60 p-6 md:p-8 shadow-2xl">
      {/* Background radial glow */}
      <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20 opacity-30 ${pacing.isOverspentToday ? 'bg-indigo-600' : 'bg-sky-500'
        }`} />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left Column: The Big Metrics */}
        <div className="flex-1 w-full text-center lg:text-left space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Today's Adaptive Spending Float</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">Day {profile.currentDay}</span>
          </div>

          <div>
            <div className="flex items-baseline justify-center lg:justify-start gap-3">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Today's Allowance</span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {profile.isWeekendBufferEnabled ? 'Weekend Weighted' : 'Evenly Paced'}
              </span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight mt-1">
              {formatINR(pacing.todayAllowance)}
            </h1>
          </div>

          {/* Sub-allowance Status */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-2 text-left">
              <p className="text-[11px] text-slate-400">Spent Today</p>
              <p className="text-lg font-bold text-slate-100">{formatINR(pacing.todaySpent)}</p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-2 text-left">
              <p className="text-[11px] text-slate-400">
                {pacing.isOverspentToday ? 'Deficit Auto-Recalibrated' : 'Safe to Spend Today'}
              </p>
              <p className={`text-lg font-bold ${pacing.isOverspentToday ? 'text-indigo-400' : 'text-emerald-400'
                }`}>
                {pacing.isOverspentToday ? `+${formatINR(pacing.todayOverspentDelta)}` : formatINR(pacing.todayRemaining)}
              </p>
            </div>

            {/* Weekend Buffer Pill Toggle */}
            <button
              onClick={onToggleWeekendBuffer}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition ${profile.isWeekendBufferEnabled
                  ? 'bg-sky-500/10 border-sky-500/30 text-sky-300'
                  : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-slate-300'
                }`}
            >
              <Zap className={`w-3.5 h-3.5 ${profile.isWeekendBufferEnabled ? 'text-sky-400 fill-sky-400' : ''}`} />
              <span>Weekend Cushion {profile.isWeekendBufferEnabled ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Visual Progress Circle / Dynamic Pacing Card */}
        <div className="w-full lg:w-80 flex flex-col items-center justify-center bg-slate-950/60 p-6 rounded-2xl border border-slate-800 shadow-inner">
          {/* Circular/Linear Visual Bar */}
          <div className="w-full space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Daily Pacing Gauge</span>
              <span className={`font-semibold ${pacing.isOverspentToday ? 'text-indigo-400' : percentSpent > 75 ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                {percentSpent}% Used
              </span>
            </div>

            {/* Progress Track */}
            <div className="h-4 w-full bg-slate-800/90 rounded-full overflow-hidden p-0.5">
              <div
                style={{ width: `${percentSpent}%` }}
                className={`h-full rounded-full transition-all duration-500 ${pacing.isOverspentToday
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500'
                    : percentSpent > 75
                      ? 'bg-gradient-to-r from-emerald-500 via-amber-500 to-orange-500'
                      : 'bg-gradient-to-r from-teal-400 to-emerald-500'
                  }`}
              />
            </div>
          </div>

          {/* Real-time Status Card */}
          <div className="w-full mt-5 pt-4 border-t border-slate-800/80">
            {pacing.isOverspentToday ? (
              <div className="space-y-2 text-left">
                <div className="flex items-center gap-1.5 text-indigo-400 text-xs font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Self-Healing Recalibration Active</span>
                </div>
                <p className="text-[12px] text-slate-300 leading-relaxed">
                  Overspent by <strong>{formatINR(pacing.todayOverspentDelta)}</strong>. The engine amortized this across remaining days to <strong>{formatINR(pacing.adjustedFutureDailyAllowance)}/day</strong>.
                </p>
                <div className="flex items-center gap-1 text-[11px] text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>₹30,000 Savings Vault 100% Intact</span>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5 text-left">
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Guilt-Free Spending Active</span>
                </div>
                <p className="text-[12px] text-slate-300 leading-relaxed">
                  You have <strong>{formatINR(pacing.todayRemaining)}</strong> to spend freely today without guilt, second-guessing, or affecting future days.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic Recalibration Banner (If overspent or near limit) */}
      {pacing.isOverspentToday && (
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-indigo-950/40 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <p className="text-slate-200">
              <strong className="text-indigo-300">Why this matters:</strong> Unlike traditional apps that mark you as "Failed", PacePay simply recalibrates future days so you never touch your protected savings.
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-1 text-indigo-300 font-medium">
            <span>Tomorrow's target: {formatINR(pacing.adjustedFutureDailyAllowance)}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      )}
    </div>
  );
};

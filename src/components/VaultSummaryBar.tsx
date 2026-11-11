import React from 'react';
import { Lock, FileText, Flame, Shield, Info } from 'lucide-react';
import type { PacingCalculation } from '../types';
import { formatINR } from '../utils/pacingEngine';

interface VaultSummaryBarProps {
  pacing: PacingCalculation;
}

export const VaultSummaryBar: React.FC<VaultSummaryBarProps> = ({ pacing }) => {

  return (
    <div className="space-y-3">
      {/* Beginner-friendly explanation banner */}
      <div className="bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-sky-400 shrink-0" />
          <span>
            <strong className="text-white">How your salary is divided:</strong> Your <strong>{formatINR(pacing.vaultedSavings)}</strong> savings and <strong>{formatINR(pacing.fixedBillsTotal)}</strong> rent are locked first. Your daily budget is made <em>only</em> from the remaining <strong>{formatINR(pacing.remainingPool)}</strong>.
          </span>
        </div>
        <span className="hidden md:inline-block text-[11px] text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 shrink-0">
          Savings 100% Intact
        </span>
      </div>

      {/* The 3 Clean Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Protected Savings Vault */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/40 p-5 shadow-lg">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Lock className="w-5 h-5" />
            </div>
            <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Shield className="w-3 h-3" />
              100% Protected
            </span>
          </div>

          <div className="mt-3">
            <p className="text-xs font-semibold text-slate-300">1. Locked Savings Vault</p>
            <p className="text-2xl font-extrabold text-white tracking-tight mt-0.5">
              {formatINR(pacing.vaultedSavings)}
            </p>
          </div>

          <p className="mt-2 text-[11px] text-emerald-300/90 leading-tight">
            Ring-fenced on Day 1. Cannot be accidentally spent on food or shopping.
          </p>
        </div>

        {/* Card 2: Fixed Commitments */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-amber-950/30 via-slate-900 to-slate-900 border border-amber-500/30 p-5 shadow-lg">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Auto-Reserved
            </span>
          </div>

          <div className="mt-3">
            <p className="text-xs font-semibold text-slate-300">2. Fixed Bills & Rent</p>
            <p className="text-2xl font-extrabold text-white tracking-tight mt-0.5">
              {formatINR(pacing.fixedBillsTotal)}
            </p>
          </div>

          <p className="mt-2 text-[11px] text-amber-300/90 leading-tight">
            Rent, EMIs, and utilities kept aside so you never miss a payment.
          </p>
        </div>

        {/* Card 3: Discretionary Burn Pool */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-sky-950/40 via-slate-900 to-slate-900 border border-sky-500/40 p-5 shadow-lg">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Flame className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
              Safe to Spend Pool
            </span>
          </div>

          <div className="mt-3">
            <p className="text-xs font-semibold text-slate-300">3. Monthly Spending Float</p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <p className="text-2xl font-extrabold text-white tracking-tight">
                {formatINR(pacing.remainingPool)}
              </p>
              <span className="text-xs text-slate-400">left of {formatINR(pacing.discretionaryPoolTotal)}</span>
            </div>
          </div>

          <p className="mt-2 text-[11px] text-sky-300/90 leading-tight">
            Paced across remaining {pacing.daysRemaining} days to generate your daily budget.
          </p>
        </div>
      </div>
    </div>
  );
};

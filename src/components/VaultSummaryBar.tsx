import React from 'react';
import { Lock, FileText, Flame, Shield, ArrowUpRight } from 'lucide-react';
import type { PacingCalculation } from '../types';
import { formatINR } from '../utils/pacingEngine';

interface VaultSummaryBarProps {
  pacing: PacingCalculation;
}

export const VaultSummaryBar: React.FC<VaultSummaryBarProps> = ({ pacing }) => {
  const savingsPercent = Math.round((pacing.vaultedSavings / pacing.totalIncome) * 100);
  const fixedPercent = Math.round((pacing.fixedBillsTotal / pacing.totalIncome) * 100);
  const poolPercent = 100 - savingsPercent - fixedPercent;

  return (
    <div className="space-y-3">
      {/* Visual Income Distribution Bar */}
      <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span>Income Architecture ({formatINR(pacing.totalIncome)})</span>
          <span className="text-slate-300 font-medium">Day-1 Automated Partition</span>
        </div>
        <div className="h-3.5 w-full bg-slate-800 rounded-full overflow-hidden flex p-0.5 gap-0.5">
          <div 
            style={{ width: `${savingsPercent}%` }} 
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-l-full relative group cursor-pointer transition-all duration-500"
            title={`Savings Vault: ${formatINR(pacing.vaultedSavings)} (${savingsPercent}%)`}
          />
          <div 
            style={{ width: `${fixedPercent}%` }} 
            className="h-full bg-gradient-to-r from-amber-500 to-orange-400 relative group cursor-pointer transition-all duration-500"
            title={`Fixed Bills: ${formatINR(pacing.fixedBillsTotal)} (${fixedPercent}%)`}
          />
          <div 
            style={{ width: `${poolPercent}%` }} 
            className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-r-full relative group cursor-pointer transition-all duration-500"
            title={`Discretionary Pool: ${formatINR(pacing.discretionaryPoolTotal)} (${poolPercent}%)`}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] mt-2 text-slate-400 flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400 inline-block"></span>
            <span>Vaulted Savings: <strong className="text-emerald-300">{savingsPercent}%</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-400 inline-block"></span>
            <span>Fixed Bills: <strong className="text-amber-300">{fixedPercent}%</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-sky-400 inline-block"></span>
            <span>Discretionary Pool: <strong className="text-sky-300">{poolPercent}%</strong></span>
          </div>
        </div>
      </div>

      {/* The 3 Partition Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Protected Savings Vault */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-emerald-950/40 via-slate-900 to-slate-900/90 border border-emerald-500/30 p-5 shadow-lg shadow-emerald-950/20">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Lock className="w-5 h-5" />
            </div>
            <span className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              <Shield className="w-3 h-3" />
              100% Protected
            </span>
          </div>

          <div className="mt-4">
            <p className="text-xs font-medium text-slate-400">Guaranteed Savings Vault</p>
            <p className="text-2xl font-bold text-white tracking-tight mt-0.5">
              {formatINR(pacing.vaultedSavings)}
            </p>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-emerald-400/90">
            <span>Ring-fenced on Day 1</span>
            <span className="text-[11px] text-slate-500">Untouchable by daily burn</span>
          </div>
        </div>

        {/* Card 2: Fixed Commitments */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-amber-950/30 via-slate-900 to-slate-900/90 border border-amber-500/25 p-5 shadow-lg">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
              Auto-Reserved
            </span>
          </div>

          <div className="mt-4">
            <p className="text-xs font-medium text-slate-400">Committed Essentials & Bills</p>
            <p className="text-2xl font-bold text-white tracking-tight mt-0.5">
              {formatINR(pacing.fixedBillsTotal)}
            </p>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-amber-400/90">
            <span>Rent, EMIs, Utilities</span>
            <span className="text-[11px] text-slate-500">Excluded from daily spend</span>
          </div>
        </div>

        {/* Card 3: Discretionary Burn Pool */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-sky-950/40 via-slate-900 to-slate-900/90 border border-sky-500/30 p-5 shadow-lg shadow-sky-950/20">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Flame className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/20">
              Active Float
            </span>
          </div>

          <div className="mt-4">
            <p className="text-xs font-medium text-slate-400">Remaining Discretionary Pool</p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <p className="text-2xl font-bold text-white tracking-tight">
                {formatINR(pacing.remainingPool)}
              </p>
              <span className="text-xs text-slate-400">of {formatINR(pacing.discretionaryPoolTotal)}</span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-sky-400/90">
            <span>{pacing.daysRemaining} days remaining in cycle</span>
            <span className="flex items-center text-[11px] text-slate-400">
              Fluid Pacing <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

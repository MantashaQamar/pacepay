import React from 'react';
import { ShieldCheck, Sliders, RotateCcw, BookOpen } from 'lucide-react';
import type { UserFinancialProfile } from '../types';

interface NavbarProps {
  profile: UserFinancialProfile;
  onOpenSettings: () => void;
  onOpenGuide: () => void;
  onResetDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ profile, onOpenSettings, onOpenGuide, onResetDemo }) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-white">
                Pace<span className="text-sky-400">Pay</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-sky-400 border border-sky-500/20">
                AI Copilot
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Save first. Pace the rest.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Guide / How It Works Button (Prominent for new users) */}
          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-500/20 to-blue-500/20 hover:from-sky-500/30 hover:to-blue-500/30 text-sky-300 text-xs font-semibold border border-sky-500/40 shadow-sm transition active:scale-95"
          >
            <BookOpen className="w-3.5 h-3.5 text-sky-400" />
            <span>How PacePay Works</span>
          </button>

          {/* Day progress indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-200 font-medium">Day {profile.currentDay} of {profile.cycleDays}</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">{profile.cycleDays - profile.currentDay + 1} days left</span>
          </div>

          {/* Profile config button */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Customize Plan</span>
          </button>

          {/* Reset button */}
          <button
            onClick={onResetDemo}
            title="Reset to default ₹1 Lakh salary demo"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800/50 hover:bg-slate-700/80 text-slate-400 hover:text-slate-200 text-xs border border-slate-700/50 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
};

import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, ShieldCheck, Lock, Flame, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS = [
  {
    step: 1,
    title: 'Why Most People Run Out of Money',
    subtitle: 'The 30-Day Salary Illusion',
    icon: Flame,
    color: 'from-orange-500 to-rose-500',
    content: (
      <div className="space-y-3 text-xs text-slate-300">
        <p>
          If you earn <strong className="text-white">₹1,00,000</strong> a month, you have <strong className="text-white">₹3,333 every single day</strong>. Sounds like plenty, right?
        </p>
        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1.5 font-mono text-[11px]">
          <div className="flex justify-between text-slate-400"><span>☕ Morning Coffee:</span> <span className="text-rose-400">-₹250</span></div>
          <div className="flex justify-between text-slate-400"><span>⚡ Blinkit Groceries:</span> <span className="text-rose-400">-₹600</span></div>
          <div className="flex justify-between text-slate-400"><span>🛵 Swiggy Lunch:</span> <span className="text-rose-400">-₹500</span></div>
          <div className="flex justify-between text-slate-400"><span>📦 Amazon Impulse Buy:</span> <span className="text-rose-400">-₹1,400</span></div>
          <div className="pt-1.5 border-t border-slate-800 flex justify-between font-bold text-white">
            <span>Spent before 6:00 PM:</span> <span className="text-rose-400">-₹2,750</span>
          </div>
        </div>
        <p className="text-slate-400 italic">
          "I'll invest whatever is left at the end of the month." — Result: <strong>₹0 saved</strong>.
        </p>
      </div>
    ),
  },
  {
    step: 2,
    title: 'Step 1: Pay Yourself First',
    subtitle: 'Day-1 Automated Ring-Fencing',
    icon: Lock,
    color: 'from-emerald-500 to-teal-500',
    content: (
      <div className="space-y-3 text-xs text-slate-300">
        <p>
          PacePay flips budgeting upside down. The moment your salary arrives, we automatically split it into <strong className="text-white">3 clean buckets</strong>:
        </p>
        <div className="space-y-2">
          <div className="p-2.5 bg-emerald-950/30 border border-emerald-500/30 rounded-xl flex items-center justify-between">
            <div>
              <span className="font-semibold text-emerald-400 text-xs">🔒 Savings Vault (₹30,000)</span>
              <p className="text-[11px] text-slate-400">Locked on Day 1. Untouchable by everyday spending.</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Protected</span>
          </div>
          <div className="p-2.5 bg-amber-950/30 border border-amber-500/30 rounded-xl flex items-center justify-between">
            <div>
              <span className="font-semibold text-amber-400 text-xs">🧾 Fixed Essentials (₹27,000)</span>
              <p className="text-[11px] text-slate-400">Rent, WiFi, EMIs reserved before you spend a rupee.</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">Reserved</span>
          </div>
          <div className="p-2.5 bg-sky-950/30 border border-sky-500/30 rounded-xl flex items-center justify-between">
            <div>
              <span className="font-semibold text-sky-400 text-xs">💸 Discretionary Float (₹43,000)</span>
              <p className="text-[11px] text-slate-400">The ONLY money used to calculate your daily budget.</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300">Your Spend Pool</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    step: 3,
    title: 'Step 2: Know Your Daily Number',
    subtitle: 'Zero Guilt. Zero Math.',
    icon: Sparkles,
    color: 'from-sky-500 to-blue-500',
    content: (
      <div className="space-y-3 text-xs text-slate-300">
        <p>
          Instead of looking at an ambiguous bank balance and feeling anxious, PacePay gives you <strong className="text-white">one simple number every morning</strong>:
        </p>
        <div className="p-4 bg-slate-950 border border-sky-500/30 rounded-2xl text-center space-y-1">
          <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Today's Guilt-Free Allowance</p>
          <p className="text-3xl font-extrabold text-sky-400">₹1,466</p>
          <p className="text-[11px] text-slate-400">
            Spend it on coffee, dining, movies, or groceries. You are 100% free to enjoy it without hurting your savings.
          </p>
        </div>
        <p className="text-slate-400 text-[11px]">
          ✨ <strong>Bonus:</strong> Turn on <strong>"Weekend Cushion"</strong> and the app will automatically budget 40% more for your Saturday & Sunday outings!
        </p>
      </div>
    ),
  },
  {
    step: 4,
    title: 'Step 3: Self-Healing Recalibration',
    subtitle: 'What happens if you overspend today?',
    icon: ShieldCheck,
    color: 'from-indigo-500 to-purple-500',
    content: (
      <div className="space-y-3 text-xs text-slate-300">
        <p>
          Other apps shout at you in red: <em>"Over Budget! Failed!"</em> — and you end up quitting.
        </p>
        <div className="p-3 bg-indigo-950/40 border border-indigo-500/40 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-indigo-300 font-semibold text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>PacePay Self-Heals Automatically:</span>
          </div>
          <p className="text-[11px] text-slate-200 leading-relaxed">
            If your allowance was <strong className="text-white">₹1,466</strong> and you spent <strong className="text-white">₹2,500</strong> on dinner with friends:
          </p>
          <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-1 pl-1">
            <li>We do <strong>NOT</strong> touch your ₹30,000 savings vault.</li>
            <li>The extra ₹1,034 is gently spread across the remaining 18 days (~₹57 less per day).</li>
            <li>Tomorrow you simply get a slightly adjusted target. You stay on track effortlessly!</li>
          </ul>
        </div>
      </div>
    ),
  },
];

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const stepData = STEPS[currentStep];
  const Icon = stepData.icon;

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl p-6 md:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-sky-400 border border-sky-500/20">
              Interactive Guide ({currentStep + 1} of {STEPS.length})
            </span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Visual Title */}
        <div className="flex items-start gap-3.5">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${stepData.color} flex items-center justify-center text-white shrink-0 shadow-lg`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{stepData.title}</h2>
            <p className="text-xs text-sky-400 font-medium">{stepData.subtitle}</p>
          </div>
        </div>

        {/* Content Box */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
          {stepData.content}
        </div>

        {/* Step Dots & Navigation Buttons */}
        <div className="flex items-center justify-between pt-2">
          {/* Step indicators */}
          <div className="flex items-center gap-1.5">
            {STEPS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentStep ? 'w-6 bg-sky-400' : 'w-2 bg-slate-700 hover:bg-slate-600'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white text-xs font-bold shadow-lg shadow-blue-500/25 flex items-center gap-1.5 transition"
            >
              <span>{currentStep === STEPS.length - 1 ? 'Start Using PacePay' : 'Next'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

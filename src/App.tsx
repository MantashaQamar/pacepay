import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Navbar } from './components/Navbar';
import { VaultSummaryBar } from './components/VaultSummaryBar';
import { HeroDailyGauge } from './components/HeroDailyGauge';
import { QuickExpenseBar } from './components/QuickExpenseBar';
import { LiveExpenseList } from './components/LiveExpenseList';
import { AIPanel } from './components/AIPanel';
import { ProfileModal } from './components/ProfileModal';
import { GuideModal } from './components/GuideModal';
import type { UserFinancialProfile, Expense } from './types';
import { calculatePacing } from './utils/pacingEngine';
import { Sparkles, Shield, ArrowUpRight, HelpCircle } from 'lucide-react';

const INITIAL_PROFILE: UserFinancialProfile = {
  monthlyIncome: 100000,
  savingsGoal: 30000,
  fixedBills: [
    { id: '1', name: 'Apartment Rent', amount: 20000, category: 'bills', dueDate: 5, isPaid: true },
    { id: '2', name: 'Broadband & Utilities', amount: 2000, category: 'bills', dueDate: 10, isPaid: true },
    { id: '3', name: 'Health & Life Term EMI', amount: 5000, category: 'bills', dueDate: 8, isPaid: true },
  ],
  cycleDays: 30,
  currentDay: 12,
  isWeekendBufferEnabled: true,
  weekendMultiplier: 1.4,
};

const INITIAL_EXPENSES: Expense[] = [
  // Past days baseline
  { id: 'p1', merchant: 'Cult.fit Gym Monthly', amount: 2200, category: 'health', timestamp: 'Day 2, 11:30 AM', channel: 'UPI', day: 2 },
  { id: 'p2', merchant: 'Nature Basket Groceries', amount: 3400, category: 'groceries', timestamp: 'Day 4, 06:15 PM', channel: 'Card', day: 4 },
  { id: 'p3', merchant: 'Uber Commute', amount: 850, category: 'commute', timestamp: 'Day 6, 09:20 AM', channel: 'UPI', day: 6 },
  { id: 'p4', merchant: 'Weekend Dinner & Drinks', amount: 3200, category: 'food', timestamp: 'Day 7, 09:45 PM', channel: 'Card', day: 7 },
  { id: 'p5', merchant: 'BookMyShow Movies', amount: 900, category: 'entertainment', timestamp: 'Day 8, 04:30 PM', channel: 'UPI', day: 8 },
  { id: 'p6', merchant: 'Amazon Household Essentials', amount: 2450, category: 'shopping', timestamp: 'Day 10, 02:10 PM', channel: 'Card', day: 10 },

  // Today (Day 12)
  { id: 't1', merchant: 'Blue Tokai Cold Brew', amount: 260, category: 'food', timestamp: '10:15 AM', channel: 'UPI', day: 12 },
  { id: 't2', merchant: 'Blinkit 10-min Groceries', amount: 580, category: 'groceries', timestamp: '01:40 PM', channel: 'UPI', day: 12 },
];

export function App() {
  const [profile, setProfile] = useState<UserFinancialProfile>(INITIAL_PROFILE);
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Check if first-time visitor
  useEffect(() => {
    const hasSeenGuide = localStorage.getItem('pacepay_guide_seen');
    if (!hasSeenGuide) {
      setIsGuideOpen(true);
      localStorage.setItem('pacepay_guide_seen', 'true');
    }
  }, []);

  // Compute pacing
  const pacing = calculatePacing(profile, expenses);
  const todayExpenses = expenses.filter(e => e.day === profile.currentDay);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleAddExpense = (expenseData: Omit<Expense, 'id' | 'timestamp'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: String(Date.now()),
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    setExpenses(prev => [newExpense, ...prev]);

    // Check if overspent
    if (pacing.todayRemaining - expenseData.amount < 0) {
      showToast(`⚡ Overspent by ₹${expenseData.amount}. Dynamic engine auto-amortized deficit across future days!`);
    } else {
      showToast(`✅ Logged ${expenseData.merchant} (-₹${expenseData.amount}). Pacing stays on target.`);
    }
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    showToast('Transaction removed from ledger.');
  };

  const handleSimulatePayPalStream = () => {
    const simulatedMerchants = [
      { name: 'PayPal: Airbnb Booking Split', amount: 2400, cat: 'entertainment' as const },
      { name: 'PayPal: Steam Game Store', amount: 1299, cat: 'entertainment' as const },
      { name: 'PayPal: Uber International', amount: 750, cat: 'commute' as const },
    ];
    const picked = simulatedMerchants[Math.floor(Math.random() * simulatedMerchants.length)];

    const simExpense: Expense = {
      id: String(Date.now()),
      merchant: picked.name,
      amount: picked.amount,
      category: picked.cat,
      channel: 'PayPal',
      day: profile.currentDay,
      timestamp: 'Just now (Webhook)',
      note: 'Captured in real-time via PayPal Webhook Event',
    };

    setExpenses(prev => [simExpense, ...prev]);
    showToast(`🔔 PayPal Webhook: Received ${picked.name} (-₹${picked.amount}). Balance recalibrated!`);
  };

  const handleToggleWeekendBuffer = () => {
    setProfile(prev => ({
      ...prev,
      isWeekendBufferEnabled: !prev.isWeekendBufferEnabled,
    }));
    showToast(`Weekend Cushioning ${!profile.isWeekendBufferEnabled ? 'Enabled (1.4x boost)' : 'Disabled'}`);
  };

  const handleResetDemo = () => {
    setProfile(INITIAL_PROFILE);
    setExpenses(INITIAL_EXPENSES);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    showToast('Reset to default ₹1 Lakh salary demo state.');
  };

  const handleSaveProfile = (updated: UserFinancialProfile) => {
    setProfile(updated);
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    showToast('Financial profile updated successfully!');
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col selection:bg-sky-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-sky-500/40 text-slate-100 text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-bounce">
          <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        profile={profile}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        onResetDemo={handleResetDemo}
      />

      {/* First-timer Welcome Banner */}
      <div className="bg-gradient-to-r from-sky-950/40 via-blue-900/20 to-indigo-950/40 border-b border-slate-800/80 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping"></span>
            <span>
              <strong>New to PacePay?</strong> We automatically lock your savings on Day 1 and calculate what you can safely spend today without guilt.
            </span>
          </div>
          <button
            onClick={() => setIsGuideOpen(true)}
            className="flex items-center gap-1 text-sky-400 hover:text-sky-300 font-semibold underline underline-offset-2 shrink-0 transition"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Read 1-Minute Visual Guide</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-8">
        {/* Row 1: The Three Partition Vaults (Pay Yourself First) */}
        <VaultSummaryBar pacing={pacing} />

        {/* Row 2: Central Hero Dynamic Daily Gauge */}
        <HeroDailyGauge
          pacing={pacing}
          profile={profile}
          onToggleWeekendBuffer={handleToggleWeekendBuffer}
        />

        {/* Row 3: Interactive Quick-Spend Simulator */}
        <QuickExpenseBar
          currentDay={profile.currentDay}
          onAddExpense={handleAddExpense}
          onSimulatePayPalStream={handleSimulatePayPalStream}
        />

        {/* Row 4: Two Columns: Live Ledger Activity & AI Copilot Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Column: Live Activity Feed */}
          <LiveExpenseList
            expenses={todayExpenses}
            currentDay={profile.currentDay}
            onDeleteExpense={handleDeleteExpense}
          />

          {/* Right Column: AI Financial Copilot */}
          <AIPanel
            pacing={pacing}
            profile={profile}
            todayExpenses={todayExpenses}
            allExpenses={expenses}
          />
        </div>

        {/* Explanatory Banner for Hackathon Judges */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-950/30 via-slate-900 to-indigo-950/30 border border-slate-800 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-slate-200">Built for the PayPal AI Hackathon</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                PacePay demonstrates dynamic liquidity pacing, automated Day-1 savings vaulting, and deterministic agentic recalibration.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 font-medium transition"
          >
            <span>Test Different Incomes</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <p>PacePay: Save first. Pace the rest. • Powered by AI Copilot & Dynamic Liquidity Pacing</p>
      </footer>

      {/* Profile / Architecture Modal */}
      <ProfileModal
        profile={profile}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveProfile}
      />

      {/* First-Timer Visual Guide Modal */}
      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}

export default App;

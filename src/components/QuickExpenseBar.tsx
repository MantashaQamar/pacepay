import React, { useState } from 'react';
import { Coffee, ShoppingCart, ShoppingBag, Plus, CreditCard, Sparkles, Wallet } from 'lucide-react';
import type { ExpenseCategory, Expense } from '../types';
import { formatINR } from '../utils/pacingEngine';

interface QuickExpenseBarProps {
  currentDay: number;
  onAddExpense: (expense: Omit<Expense, 'id' | 'timestamp'>) => void;
  onSimulatePayPalStream: () => void;
  onOpenPayPalSandbox: () => void;
}

const PRESET_EXPENSES = [
  { merchant: 'Blue Tokai Coffee', amount: 250, category: 'food' as ExpenseCategory, channel: 'UPI' as const, icon: Coffee, desc: 'Small daily spend' },
  { merchant: 'Blinkit Instant Mart', amount: 600, category: 'groceries' as ExpenseCategory, channel: 'UPI' as const, icon: ShoppingCart, desc: 'Grocery run' },
  { merchant: 'Zepto Quick Snacks', amount: 400, category: 'groceries' as ExpenseCategory, channel: 'UPI' as const, icon: ShoppingCart, desc: 'Snack craving' },
  { merchant: 'Swiggy Dinner Feast', amount: 500, category: 'food' as ExpenseCategory, channel: 'PayPal' as const, icon: ShoppingBag, desc: 'Dining order' },
  { merchant: 'Amazon Impulse Deal', amount: 1850, category: 'shopping' as ExpenseCategory, channel: 'Card' as const, icon: CreditCard, highlight: true, desc: 'Simulate overspending' },
];

export const QuickExpenseBar: React.FC<QuickExpenseBarProps> = ({
  currentDay,
  onAddExpense,
  onSimulatePayPalStream,
  onOpenPayPalSandbox,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customMerchant, setCustomMerchant] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [customCategory, setCustomCategory] = useState<ExpenseCategory>('food');
  const [customChannel, setCustomChannel] = useState<'UPI' | 'PayPal' | 'Card'>('UPI');

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(customAmount);
    if (!customMerchant || isNaN(amountNum) || amountNum <= 0) return;

    onAddExpense({
      merchant: customMerchant,
      amount: amountNum,
      category: customCategory,
      channel: customChannel,
      day: currentDay,
      note: 'Manually logged via PacePay',
    });

    setCustomMerchant('');
    setCustomAmount('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-white">
            👇 Test The App (Click any item to spend):
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 font-medium">
            Live Interactive Simulator
          </span>
        </div>

        {/* PayPal Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenPayPalSandbox}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition active:scale-95"
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>Pay with PayPal Sandbox SDK</span>
          </button>

          <button
            onClick={onSimulatePayPalStream}
            className="flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 font-semibold transition px-2 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">PayPal Webhook Test</span>
          </button>
        </div>
      </div>

      {/* Preset Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {PRESET_EXPENSES.map((preset, idx) => {
          const Icon = preset.icon;
          return (
            <button
              key={idx}
              onClick={() =>
                onAddExpense({
                  merchant: preset.merchant,
                  amount: preset.amount,
                  category: preset.category,
                  channel: preset.channel,
                  day: currentDay,
                })
              }
              className={`flex flex-col items-start p-3 rounded-2xl border text-left transition-all transform active:scale-95 shadow-sm hover:shadow-md ${
                preset.highlight
                  ? 'bg-gradient-to-b from-indigo-950/60 to-slate-900 border-indigo-500/50 hover:border-indigo-400 text-indigo-200'
                  : 'bg-slate-900/90 hover:bg-slate-800 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  preset.highlight ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-400'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-white">
                  -{formatINR(preset.amount)}
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-200 truncate w-full">{preset.merchant}</span>
              <span className="text-[10px] text-slate-400 mt-0.5">{preset.desc}</span>
            </button>
          );
        })}

        {/* Custom button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 hover:border-blue-500/50 text-sky-400 transition"
        >
          <Plus className="w-5 h-5 mb-1 text-sky-400" />
          <span className="text-xs font-semibold">Custom Expense</span>
          <span className="text-[10px] text-slate-400 mt-0.5">Enter any amount</span>
        </button>
      </div>

      {/* Custom Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Log Custom Expense</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCustomSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Merchant / What did you buy?</label>
                <input
                  type="text"
                  placeholder="e.g. Zara Sale, Fuel, Movie"
                  value={customMerchant}
                  onChange={e => setCustomMerchant(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Amount (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 1500"
                  value={customAmount}
                  onChange={e => setCustomAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white text-base font-bold focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Category</label>
                  <select
                    value={customCategory}
                    onChange={e => setCustomCategory(e.target.value as ExpenseCategory)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="food">Food & Dining</option>
                    <option value="groceries">Groceries / Quick Commerce</option>
                    <option value="shopping">Shopping</option>
                    <option value="commute">Commute / Fuel</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="health">Health & Medical</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Payment Mode</label>
                  <select
                    value={customChannel}
                    onChange={e => setCustomChannel(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="PayPal">PayPal Developer Sandbox</option>
                    <option value="UPI">UPI (GPay / PhonePe)</option>
                    <option value="Card">Credit / Debit Card</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition"
                >
                  Add To Today
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

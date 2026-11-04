import React, { useState } from 'react';
import { Coffee, ShoppingCart, ShoppingBag, Plus, CreditCard, Sparkles } from 'lucide-react';
import type { ExpenseCategory, Expense } from '../types';
import { formatINR } from '../utils/pacingEngine';

interface QuickExpenseBarProps {
  currentDay: number;
  onAddExpense: (expense: Omit<Expense, 'id' | 'timestamp'>) => void;
  onSimulatePayPalStream: () => void;
}

const PRESET_EXPENSES = [
  { merchant: 'Blue Tokai Coffee', amount: 250, category: 'food' as ExpenseCategory, channel: 'UPI' as const, icon: Coffee },
  { merchant: 'Blinkit 10-min Mart', amount: 600, category: 'groceries' as ExpenseCategory, channel: 'UPI' as const, icon: ShoppingCart },
  { merchant: 'Zepto Quick Snacks', amount: 400, category: 'groceries' as ExpenseCategory, channel: 'UPI' as const, icon: ShoppingCart },
  { merchant: 'Swiggy Gourmet Dinner', amount: 500, category: 'food' as ExpenseCategory, channel: 'PayPal' as const, icon: ShoppingBag },
  { merchant: 'Amazon Impulse Order', amount: 1850, category: 'shopping' as ExpenseCategory, channel: 'Card' as const, icon: CreditCard, highlight: true },
];

export const QuickExpenseBar: React.FC<QuickExpenseBarProps> = ({
  currentDay,
  onAddExpense,
  onSimulatePayPalStream,
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
            Interactive Spend Simulator
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
            Test Live Recalibration
          </span>
        </div>

        <button
          onClick={onSimulatePayPalStream}
          className="flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 font-medium transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Simulate PayPal Webhook</span>
        </button>
      </div>

      {/* Preset Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
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
              className={`shrink-0 flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-medium transition-all transform active:scale-95 ${
                preset.highlight
                  ? 'bg-gradient-to-r from-indigo-900/40 to-slate-900 border-indigo-500/40 text-indigo-200 hover:border-indigo-400'
                  : 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${preset.highlight ? 'text-indigo-400' : 'text-slate-400'}`} />
              <span>{preset.merchant}</span>
              <span className="font-bold text-slate-100">-{formatINR(preset.amount)}</span>
            </button>
          );
        })}

        {/* Custom button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="shrink-0 flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs font-medium transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Custom Expense</span>
        </button>
      </div>

      {/* Custom Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-semibold text-white">Log Custom Transaction</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCustomSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Merchant / Description</label>
                <input
                  type="text"
                  placeholder="e.g. Zara Weekend Sale, PVR Cinema"
                  value={customMerchant}
                  onChange={e => setCustomMerchant(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Amount (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 1200"
                  value={customAmount}
                  onChange={e => setCustomAmount(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-base font-semibold focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <select
                    value={customCategory}
                    onChange={e => setCustomCategory(e.target.value as ExpenseCategory)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="food">Food & Dining</option>
                    <option value="groceries">Groceries / Quick Commerce</option>
                    <option value="shopping">Shopping & Apparel</option>
                    <option value="commute">Commute / Fuel</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="health">Health & Medical</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Payment Method</label>
                  <select
                    value={customChannel}
                    onChange={e => setCustomChannel(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="UPI">UPI (GooglePay/PhonePe)</option>
                    <option value="PayPal">PayPal Balance / Card</option>
                    <option value="Card">Credit / Debit Card</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition"
                >
                  Log Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

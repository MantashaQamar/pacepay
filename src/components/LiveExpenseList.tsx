import React from 'react';
import { ShoppingBag, Coffee, ShoppingCart, CreditCard, Trash2, Shield, Calendar } from 'lucide-react';
import type { Expense } from '../types';
import { formatINR } from '../utils/pacingEngine';

interface LiveExpenseListProps {
  expenses: Expense[];
  currentDay: number;
  onDeleteExpense: (id: string) => void;
}

export const LiveExpenseList: React.FC<LiveExpenseListProps> = ({
  expenses,
  currentDay,
  onDeleteExpense,
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'food':
        return <Coffee className="w-4 h-4 text-orange-400" />;
      case 'groceries':
        return <ShoppingCart className="w-4 h-4 text-emerald-400" />;
      case 'shopping':
        return <ShoppingBag className="w-4 h-4 text-pink-400" />;
      default:
        return <CreditCard className="w-4 h-4 text-sky-400" />;
    }
  };

  const getChannelBadge = (channel: string) => {
    switch (channel) {
      case 'PayPal':
        return (
          <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-semibold">
            PayPal
          </span>
        );
      case 'UPI':
        return (
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold">
            UPI
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 text-[10px] font-semibold">
            {channel}
          </span>
        );
    }
  };

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-sky-400" />
          <h3 className="text-sm font-semibold text-white">Today's Ledger Activity</h3>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
            {expenses.filter(e => e.day === currentDay).length} transactions
          </span>
        </div>
        <span className="text-xs text-slate-400">Dynamic Amortization Active</span>
      </div>

      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {expenses.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs">
            No expenses logged yet today. Your entire daily allowance is available!
          </div>
        ) : (
          expenses.map(expense => (
            <div
              key={expense.id}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 hover:bg-slate-950 border border-slate-800/60 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-800/80 flex items-center justify-center shrink-0">
                  {getCategoryIcon(expense.category)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold text-slate-200">{expense.merchant}</p>
                    {getChannelBadge(expense.channel)}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {expense.timestamp} • Day {expense.day}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-100">
                  -{formatINR(expense.amount)}
                </span>
                <button
                  onClick={() => onDeleteExpense(expense.id)}
                  className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 p-1 transition"
                  title="Remove transaction"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center gap-1">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          Transactions automatically deduct from daily discretionary pool
        </span>
        <span>Auto-synced</span>
      </div>
    </div>
  );
};

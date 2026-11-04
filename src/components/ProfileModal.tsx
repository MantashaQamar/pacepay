import React, { useState } from 'react';
import { X, Lock, Sliders, Plus, Trash2, ShieldCheck } from 'lucide-react';
import type { UserFinancialProfile, FixedBill } from '../types';
import { formatINR } from '../utils/pacingEngine';

interface ProfileModalProps {
  profile: UserFinancialProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: UserFinancialProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  profile,
  isOpen,
  onClose,
  onSave,
}) => {
  const [income, setIncome] = useState(profile.monthlyIncome);
  const [savings, setSavings] = useState(profile.savingsGoal);
  const [bills, setBills] = useState<FixedBill[]>(profile.fixedBills);
  const [currentDay, setCurrentDay] = useState(profile.currentDay);

  const [newBillName, setNewBillName] = useState('');
  const [newBillAmount, setNewBillAmount] = useState('');

  if (!isOpen) return null;

  const totalBills = bills.reduce((sum, b) => sum + b.amount, 0);
  const discretionaryPool = Math.max(0, income - savings - totalBills);

  const handleAddBill = () => {
    const amt = parseFloat(newBillAmount);
    if (!newBillName || isNaN(amt) || amt <= 0) return;

    setBills([
      ...bills,
      {
        id: String(Date.now()),
        name: newBillName,
        amount: amt,
        category: 'bills',
        dueDate: 5,
        isPaid: true,
      },
    ]);
    setNewBillName('');
    setNewBillAmount('');
  };

  const handleDeleteBill = (id: string) => {
    setBills(bills.filter(b => b.id !== id));
  };

  const handleSave = () => {
    onSave({
      ...profile,
      monthlyIncome: income,
      savingsGoal: savings,
      fixedBills: bills,
      currentDay: currentDay,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-sky-400 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Financial Architecture</h2>
              <p className="text-xs text-slate-400">Configure income, Day-1 savings vault & obligations</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Monthly Income Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium">Monthly Inflow (Salary)</span>
            <span className="text-base font-bold text-white">{formatINR(income)}</span>
          </div>
          <input
            type="range"
            min={30000}
            max={300000}
            step={5000}
            value={income}
            onChange={e => setIncome(Number(e.target.value))}
            className="w-full accent-sky-400 cursor-pointer"
          />
        </div>

        {/* 2. Guaranteed Savings Vault Slider */}
        <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-emerald-300 font-semibold">
              <Lock className="w-3.5 h-3.5" /> Day-1 Savings Vault ({Math.round((savings / (income || 1)) * 100)}%)
            </span>
            <span className="text-base font-bold text-emerald-400">{formatINR(savings)}</span>
          </div>
          <input
            type="range"
            min={5000}
            max={income * 0.7}
            step={2000}
            value={savings}
            onChange={e => setSavings(Number(e.target.value))}
            className="w-full accent-emerald-400 cursor-pointer"
          />
          <p className="text-[11px] text-slate-400">
            This amount is ring-fenced on Day 1. It is never factored into your daily spending allowance.
          </p>
        </div>

        {/* 3. Fixed Bills & Obligations */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium">Reserved Fixed Commitments</span>
            <span className="font-bold text-amber-400">{formatINR(totalBills)}</span>
          </div>

          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {bills.map(b => (
              <div
                key={b.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs"
              >
                <span className="text-slate-200">{b.name}</span>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-slate-100">{formatINR(b.amount)}</span>
                  <button
                    onClick={() => handleDeleteBill(b.id)}
                    className="text-slate-500 hover:text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Bill Form */}
          <div className="flex items-center gap-2 pt-1 text-xs">
            <input
              type="text"
              placeholder="e.g. WiFi / Gym / EMI"
              value={newBillName}
              onChange={e => setNewBillName(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
            <input
              type="number"
              placeholder="₹ Amount"
              value={newBillAmount}
              onChange={e => setNewBillAmount(e.target.value)}
              className="w-28 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
            <button
              onClick={handleAddBill}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4. Current Day Simulator */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-300 font-medium">Simulate Billing Cycle Day</span>
            <span className="font-bold text-sky-400">Day {currentDay} of 30</span>
          </div>
          <input
            type="range"
            min={1}
            max={30}
            value={currentDay}
            onChange={e => setCurrentDay(Number(e.target.value))}
            className="w-full accent-sky-400 cursor-pointer"
          />
        </div>

        {/* Calculated Result Preview */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400">Resulting Discretionary Float</span>
            <p className="text-base font-bold text-sky-400 mt-0.5">{formatINR(discretionaryPool)}</p>
          </div>
          <div className="text-right">
            <span className="text-slate-400">Estimated Daily Pace</span>
            <p className="text-base font-bold text-white mt-0.5">
              ~{formatINR(Math.round(discretionaryPool / 30))}/day
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white text-xs font-bold shadow-lg shadow-blue-500/25 flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            Apply Financial Architecture
          </button>
        </div>
      </div>
    </div>
  );
};

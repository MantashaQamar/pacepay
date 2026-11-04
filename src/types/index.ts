export type ExpenseCategory = 
  | 'food' 
  | 'groceries' 
  | 'shopping' 
  | 'bills' 
  | 'commute' 
  | 'entertainment' 
  | 'health' 
  | 'other';

export interface FixedBill {
  id: string;
  name: string;
  amount: number;
  category: ExpenseCategory;
  dueDate: number; // day of month (e.g. 5)
  isPaid: boolean;
}

export interface Expense {
  id: string;
  merchant: string;
  amount: number;
  category: ExpenseCategory;
  timestamp: string;
  channel: 'UPI' | 'PayPal' | 'Card' | 'NetBanking';
  day: number;
  note?: string;
}

export interface UserFinancialProfile {
  monthlyIncome: number;
  savingsGoal: number;
  fixedBills: FixedBill[];
  cycleDays: number;
  currentDay: number;
  isWeekendBufferEnabled: boolean;
  weekendMultiplier: number; // e.g. 1.4 for 40% higher weekend budget
}

export interface DayBudget {
  dayNumber: number;
  isWeekend: boolean;
  baseAllowance: number;
  spent: number;
  status: 'past' | 'today' | 'future';
}

export interface PacingCalculation {
  totalIncome: number;
  vaultedSavings: number;
  fixedBillsTotal: number;
  discretionaryPoolTotal: number;
  discretionarySpentTotal: number;
  remainingPool: number;
  daysRemaining: number;
  todayAllowance: number;
  todaySpent: number;
  todayRemaining: number;
  isOverspentToday: boolean;
  todayOverspentDelta: number;
  adjustedFutureDailyAllowance: number;
  paceStatus: 'safe' | 'caution' | 'overspent';
  savingsIntegrityPercent: number; // 100% unless pool is entirely depleted
}

export type CopilotTone = 'supportive' | 'bro' | 'auditor';


import type { UserFinancialProfile, Expense, PacingCalculation } from '../types';

export function calculatePacing(
  profile: UserFinancialProfile,
  expenses: Expense[]
): PacingCalculation {
  const { monthlyIncome, savingsGoal, fixedBills, cycleDays, currentDay, isWeekendBufferEnabled, weekendMultiplier } = profile;

  // 1. Calculate Fixed Commitments
  const fixedBillsTotal = fixedBills.reduce((acc, bill) => acc + bill.amount, 0);

  // 2. Discretionary Pool = Income - Savings - Fixed Bills
  const discretionaryPoolTotal = Math.max(0, monthlyIncome - savingsGoal - fixedBillsTotal);

  // 3. Separate expenses: past days vs today
  const pastExpenses = expenses.filter(e => e.day < currentDay);
  const todayExpenses = expenses.filter(e => e.day === currentDay);

  const pastSpent = pastExpenses.reduce((sum, e) => sum + e.amount, 0);
  const todaySpent = todayExpenses.reduce((sum, e) => sum + e.amount, 0);
  const discretionarySpentTotal = pastSpent + todaySpent;

  // Remaining pool at the start of today
  const poolAtStartOfToday = Math.max(0, discretionaryPoolTotal - pastSpent);

  // Remaining pool right now
  const remainingPool = Math.max(0, discretionaryPoolTotal - discretionarySpentTotal);

  // Days count
  const daysRemaining = Math.max(1, cycleDays - currentDay + 1);
  const futureDaysCount = Math.max(1, cycleDays - currentDay);

  // Helper to determine if day is weekend (assuming Day 1 is Monday for clean demo)
  const isWeekendDay = (day: number) => {
    const dayOfWeek = (day - 1) % 7; // 0=Mon, 4=Fri, 5=Sat, 6=Sun
    return dayOfWeek === 5 || dayOfWeek === 6; // Sat or Sun
  };

  // 4. Calculate Today's Base Allowance
  let todayAllowance = 0;

  if (isWeekendBufferEnabled && daysRemaining > 1) {
    // Weighted allocation
    let totalWeight = 0;
    let todayWeight = 1.0;

    for (let d = currentDay; d <= cycleDays; d++) {
      const weight = isWeekendDay(d) ? weekendMultiplier : 1.0;
      if (d === currentDay) todayWeight = weight;
      totalWeight += weight;
    }

    todayAllowance = Math.round((poolAtStartOfToday * todayWeight) / (totalWeight || 1));
  } else {
    // Flat daily pacing
    todayAllowance = Math.round(poolAtStartOfToday / daysRemaining);
  }

  // 5. Today's Net Position
  const todayRemaining = todayAllowance - todaySpent;
  const isOverspentToday = todayRemaining < 0;
  const todayOverspentDelta = isOverspentToday ? Math.abs(todayRemaining) : 0;

  // 6. Recalculate future daily allowance if user overspent/underspent today
  let adjustedFutureDailyAllowance = 0;
  if (futureDaysCount > 0) {
    adjustedFutureDailyAllowance = Math.round(remainingPool / futureDaysCount);
  } else {
    adjustedFutureDailyAllowance = remainingPool;
  }

  // 7. Status Pill
  let paceStatus: 'safe' | 'caution' | 'overspent' = 'safe';
  if (isOverspentToday) {
    paceStatus = 'overspent';
  } else if (todayRemaining < todayAllowance * 0.25) {
    paceStatus = 'caution';
  }

  // 8. Savings Integrity: 100% as long as discretionary pool hasn't turned negative
  const netSurplus = monthlyIncome - fixedBillsTotal - discretionarySpentTotal;
  const savingsIntegrityPercent = netSurplus >= savingsGoal 
    ? 100 
    : Math.max(0, Math.round((netSurplus / (savingsGoal || 1)) * 100));

  return {
    totalIncome: monthlyIncome,
    vaultedSavings: savingsGoal,
    fixedBillsTotal,
    discretionaryPoolTotal,
    discretionarySpentTotal,
    remainingPool,
    daysRemaining,
    todayAllowance,
    todaySpent,
    todayRemaining,
    isOverspentToday,
    todayOverspentDelta,
    adjustedFutureDailyAllowance,
    paceStatus,
    savingsIntegrityPercent,
  };
}

export function formatINR(val: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(val);
}

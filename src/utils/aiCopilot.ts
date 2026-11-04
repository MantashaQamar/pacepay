import type { CopilotTone, Expense, PacingCalculation, UserFinancialProfile } from '../types';
import { formatINR } from './pacingEngine';

export interface CopilotResponse {
  headline: string;
  body: string;
  tag: string;
  actionableTip?: string;
}

export function generateNightlyDigest(
  pacing: PacingCalculation,
  _todayExpenses: Expense[],
  tone: CopilotTone
): CopilotResponse {
  const { todaySpent, todayAllowance, todayRemaining, isOverspentToday, todayOverspentDelta, vaultedSavings, adjustedFutureDailyAllowance } = pacing;

  if (isOverspentToday) {
    if (tone === 'bro') {
      return {
        headline: `Bro... we went a little rogue today 😅`,
        body: `Your daily target was ${formatINR(todayAllowance)}, but we clocked in at ${formatINR(todaySpent)} (over by ${formatINR(todayOverspentDelta)}). The quick-commerce impulse got us! But relax: PacePay's dynamic engine auto-amortized the ${formatINR(todayOverspentDelta)} deficit across the remaining days (${formatINR(adjustedFutureDailyAllowance)}/day from tomorrow). Your ${formatINR(vaultedSavings)} savings vault is STILL 100% untouched.`,
        tag: 'Auto-Recalibrated',
        actionableTip: 'Keep tomorrow light on Swiggy to let the pace settle.'
      };
    } else if (tone === 'auditor') {
      return {
        headline: `Variance Alert: +${Math.round((todayOverspentDelta / (todayAllowance || 1)) * 100)}% Discretionary Breach`,
        body: `Daily budget was set at ${formatINR(todayAllowance)}; realized spend reached ${formatINR(todaySpent)}. The deficit of ${formatINR(todayOverspentDelta)} has been absorbed by down-adjusting forward daily allowances to ${formatINR(adjustedFutureDailyAllowance)}. Capital reserve integrity of ${formatINR(vaultedSavings)} remains intact.`,
        tag: 'Deficit Absorbed',
        actionableTip: 'Impose a 24-hour moratorium on discretionary merchant checkouts.'
      };
    } else {
      // supportive
      return {
        headline: `A higher spend day, but you're still completely in control! ✨`,
        body: `You spent ${formatINR(todaySpent)} against your target of ${formatINR(todayAllowance)}. Life happens—and the beauty of PacePay is you don't have to stress. We’ve gently adjusted future days to ${formatINR(adjustedFutureDailyAllowance)}/day so your ${formatINR(vaultedSavings)} savings goal stays right on schedule.`,
        tag: 'Goal Safe & Sound',
        actionableTip: 'Tomorrow is a fresh canvas with a balanced daily target.'
      };
    }
  }

  // Under budget / on track
  if (tone === 'bro') {
    return {
      headline: `Chef's kiss! You won today 👑`,
      body: `Target was ${formatINR(todayAllowance)}, you only spent ${formatINR(todaySpent)}. You've got ${formatINR(todayRemaining)} left in the tank! This surplus rolls forward to boost your upcoming weekend fund. Your ${formatINR(vaultedSavings)} savings are flexing in the vault.`,
      tag: 'Surplus Unlocked',
      actionableTip: 'You earned guilt-free coffee rights tomorrow.'
    };
  } else if (tone === 'auditor') {
    return {
      headline: `Daily Efficiency: +${Math.round((todayRemaining / (todayAllowance || 1)) * 100)}% Positive Drift`,
      body: `Discretionary throughput stayed disciplined at ${formatINR(todaySpent)} against ${formatINR(todayAllowance)} ceiling. ${formatINR(todayRemaining)} retained capital will be compounded into secondary reserve buffers. Target yield for ${formatINR(vaultedSavings)} remains optimal.`,
      tag: 'Target Optimized',
      actionableTip: 'Maintain current velocity through mid-cycle.'
    };
  } else {
    return {
      headline: `Fantastic pacing today! You're thriving 🌟`,
      body: `You stayed under budget with ${formatINR(todayRemaining)} to spare from today's ${formatINR(todayAllowance)} allowance. You are maintaining healthy spending discipline without depriving yourself, and your ${formatINR(vaultedSavings)} savings are rock solid.`,
      tag: 'On Track',
      actionableTip: 'Enjoy the peace of mind knowing your monthly target is secure.'
    };
  }
}

export function detectSpendingLeaks(expenses: Expense[]): {
  detected: boolean;
  leakTitle: string;
  leakDescription: string;
  totalLeakAmount: number;
} {
  const quickCommerce = expenses.filter(
    e => e.merchant.toLowerCase().includes('blinkit') ||
         e.merchant.toLowerCase().includes('zepto') ||
         e.merchant.toLowerCase().includes('instamart')
  );

  const total = quickCommerce.reduce((sum, e) => sum + e.amount, 0);

  if (quickCommerce.length >= 2) {
    return {
      detected: true,
      leakTitle: '⚡ Quick-Commerce Micro-Leak Detected',
      leakDescription: `You placed ${quickCommerce.length} instant grocery orders totaling ${formatINR(total)}. Frequent small orders average ₹40-₹65 in surge & delivery fees each time. Batching orders can preserve ~₹600/month.`,
      totalLeakAmount: total,
    };
  }

  return {
    detected: false,
    leakTitle: 'No critical leaks identified',
    leakDescription: 'Your spending distribution is well-balanced across categories.',
    totalLeakAmount: 0,
  };
}

export function answerFinancialQuery(
  query: string,
  pacing: PacingCalculation,
  profile: UserFinancialProfile
): string {
  const q = query.toLowerCase();

  if (q.includes('afford') || q.includes('buy') || q.includes('trip') || q.includes('dinner')) {
    // Extract potential amount from query if mentioned
    const match = q.match(/\d[\d,]*/);
    const amount = match ? parseInt(match[0].replace(/,/g, ''), 10) : 2500;

    const remainingDiscretionary = pacing.remainingPool;
    const futureDays = Math.max(1, profile.cycleDays - profile.currentDay);

    if (amount <= pacing.todayRemaining) {
      return `✅ Absolutely! You have ${formatINR(pacing.todayRemaining)} remaining in today's guilt-free allowance. An expense of ${formatINR(amount)} fits right in with zero impact on future days or your ${formatINR(profile.savingsGoal)} savings!`;
    } else if (amount <= remainingDiscretionary) {
      const newFutureAllowance = Math.round((remainingDiscretionary - amount) / futureDays);
      return `⚠️ You can afford it, but it will cause a daily pace recalibration. Spending ${formatINR(amount)} exceeds today's limit, which will reduce your future daily allowance from ${formatINR(pacing.todayAllowance)} down to ${formatINR(newFutureAllowance)}/day for the next ${futureDays} days. However, your ${formatINR(profile.savingsGoal)} savings vault remains 100% protected!`;
    } else {
      return `🛑 Not recommended. Spending ${formatINR(amount)} exceeds your entire remaining discretionary pool of ${formatINR(remainingDiscretionary)} for this month. Doing so would force a withdrawal from your ${formatINR(profile.savingsGoal)} protected savings vault.`;
    }
  }

  if (q.includes('save') || q.includes('goal') || q.includes('vault')) {
    return `🔒 Your savings goal is set to ${formatINR(profile.savingsGoal)} (${Math.round((profile.savingsGoal / profile.monthlyIncome) * 100)}% of your income). Because PacePay vaults this amount on Day 1, this money is isolated from day-to-day burn. Your savings integrity is currently at 100%!`;
  }

  if (q.includes('weekend') || q.includes('saturday') || q.includes('sunday')) {
    return `🎉 Weekend Cushioning is currently ${profile.isWeekendBufferEnabled ? 'ENABLED' : 'DISABLED'}. When enabled, PacePay automatically weights weekend days with a 1.4x allowance multiplier, ensuring you have extra room for dining and outings without starving your weekdays.`;
  }

  return `💡 PacePay's core principle: Your ${formatINR(profile.savingsGoal)} savings and ${formatINR(pacing.fixedBillsTotal)} fixed bills are ring-fenced first. That leaves you with ${formatINR(pacing.remainingPool)} for flexible living over the remaining ${pacing.daysRemaining} days. You can spend up to ${formatINR(pacing.todayRemaining)} today guilt-free!`;
}

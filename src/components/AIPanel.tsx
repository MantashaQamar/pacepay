import React, { useState } from 'react';
import { Bot, Sparkles, Send, HelpCircle, CheckCircle2, Cpu } from 'lucide-react';
import type { CopilotTone, Expense, PacingCalculation, UserFinancialProfile } from '../types';
import { detectSpendingLeaks } from '../utils/aiCopilot';
import { queryAIPersonalAdvisor, generateAINightlyDigest } from '../services/aiService';

interface AIPanelProps {
  pacing: PacingCalculation;
  profile: UserFinancialProfile;
  todayExpenses: Expense[];
  allExpenses: Expense[];
}

export const AIPanel: React.FC<AIPanelProps> = ({
  pacing,
  profile,
  todayExpenses,
  allExpenses,
}) => {
  const [tone, setTone] = useState<CopilotTone>('bro');
  const [chatInput, setChatInput] = useState('');
  const [isAskingAI, setIsAskingAI] = useState(false);
  const [chatLog, setChatLog] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: `Hey! I'm your PaceAI Copilot powered by OpenAI GPT-4o. Your ₹${(profile.savingsGoal).toLocaleString('en-IN')} savings are 100% safeguarded in Day-1 vaults. Ask me anything like "Can I afford a ₹2,500 dinner tonight?" or check your Nightly Digest below.`,
    },
  ]);

  const [nightlyDigest, setNightlyDigest] = useState<{
    headline: string;
    body: string;
    tag: string;
    actionableTip?: string;
  }>({
    headline: `Daily Pacing Synchronized (OpenAI GPT-4o)`,
    body: `Target burn velocity is active. Your ₹${(profile.savingsGoal).toLocaleString('en-IN')} savings vault is 100% protected.`,
    tag: 'GPT-4o Engine Active',
    actionableTip: 'Log daily expenses or trigger PayPal Sandbox checkout to view live recalibration.',
  });

  // Re-generate digest when tone or spend changes
  React.useEffect(() => {
    generateAINightlyDigest(pacing, todayExpenses, tone).then(digest => {
      setNightlyDigest(digest);
    });
  }, [tone, pacing.todaySpent, pacing.todayRemaining]);

  const spendingLeak = detectSpendingLeaks(allExpenses);

  const handleAskQuestion = async (question: string) => {
    const q = question || chatInput;
    if (!q.trim() || isAskingAI) return;

    setChatLog(prev => [...prev, { sender: 'user', text: q }]);
    setChatInput('');
    setIsAskingAI(true);

    try {
      const answer = await queryAIPersonalAdvisor(q, pacing, profile);
      setChatLog(prev => [...prev, { sender: 'ai', text: answer }]);
    } catch {
      setChatLog(prev => [
        ...prev,
        {
          sender: 'ai',
          text: `[OpenAI Engine] You have ₹${pacing.todayRemaining.toLocaleString('en-IN')} left in today's allowance with ₹${profile.savingsGoal.toLocaleString('en-IN')} safeguarded in your vault.`,
        },
      ]);
    } finally {
      setIsAskingAI(false);
    }
  };

  const sampleQuestions = [
    'Can I afford a ₹2,500 weekend dinner?',
    'What if I order ₹600 on Blinkit right now?',
    'Is my ₹30,000 savings goal at risk?',
  ];

  return (
    <div className="space-y-6">
      {/* 1. Nightly Digest Generator Card */}
      <div className="rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/90 border border-slate-800 p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-white">Daily AI Nightly Digest</h3>
                <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  <Cpu className="w-3 h-3" /> OpenAI GPT-4o
                </span>
              </div>
              <p className="text-[11px] text-slate-400">End-of-day behavioral feedback & velocity check</p>
            </div>
          </div>

          {/* Tone Selector */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px]">
            <button
              onClick={() => setTone('bro')}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                tone === 'bro' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🤙 Bro / Casual
            </button>
            <button
              onClick={() => setTone('supportive')}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                tone === 'supportive' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🌱 Supportive
            </button>
            <button
              onClick={() => setTone('auditor')}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                tone === 'auditor' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              📊 Strict Auditor
            </button>
          </div>
        </div>

        {/* Generated Digest Content */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white tracking-wide">{nightlyDigest.headline}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium">
              {nightlyDigest.tag}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">{nightlyDigest.body}</p>

          {nightlyDigest.actionableTip && (
            <div className="pt-2 border-t border-slate-800/60 flex items-center gap-1.5 text-[11px] text-sky-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span><strong>Recommendation:</strong> {nightlyDigest.actionableTip}</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Spending Leak Radar (If detected) */}
      {spendingLeak.detected && (
        <div className="rounded-2xl bg-amber-950/20 border border-amber-500/30 p-4 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold">
            <span>{spendingLeak.leakTitle}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{spendingLeak.leakDescription}</p>
        </div>
      )}

      {/* 3. Interactive Copilot Chat */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Ask PaceAI Copilot (OpenAI GPT-4o Model)
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Grounded in Deterministic Ledger
          </span>
        </div>

        {/* Chat History */}
        <div className="max-h-56 overflow-y-auto space-y-2.5 pr-1">
          {chatLog.map((msg, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-blue-600/20 border border-blue-500/30 text-white ml-8'
                  : 'bg-slate-950/80 border border-slate-800/80 text-slate-300 mr-4'
              }`}
            >
              <div className="text-[10px] text-slate-400 mb-1 font-semibold uppercase">
                {msg.sender === 'user' ? 'You' : 'PaceAI Advisor (GPT-4o)'}
              </div>
              {msg.text}
            </div>
          ))}
          {isAskingAI && (
            <div className="p-3 rounded-xl text-xs bg-slate-950/80 border border-slate-800/80 text-sky-400 animate-pulse">
              PaceAI is calculating financial impact...
            </div>
          )}
        </div>

        {/* Sample Question Chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleAskQuestion(q)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition"
            >
              <HelpCircle className="w-3 h-3 inline mr-1 text-slate-400" />
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleAskQuestion(chatInput);
          }}
          className="flex items-center gap-2 pt-1"
        >
          <input
            type="text"
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
            placeholder="Ask if you can afford a purchase or impact on future days..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
          <button
            type="submit"
            disabled={isAskingAI}
            className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition shrink-0 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

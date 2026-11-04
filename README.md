# 🛡️ PacePay — Save First. Pace the Rest.
> **An AI Personal Finance Copilot built for the PayPal AI Hackathon.**  
> Automatically vaults savings on Day 1, ring-fences fixed obligations, and dynamically paces daily spending to keep you debt-free.

---

## 📌 Problem: The 30-Day Lump Sum Trap
If you earn **₹1,00,000 / month**, that's theoretically **₹3,333 / day**. Sounds comfortable—until modern quick-commerce and impulse checkouts kick in:
- ☕ Morning Coffee: **₹250**
- ⚡ Blinkit 10-min groceries: **₹600**
- 🛵 Zepto snack run: **₹400**
- 🍕 Swiggy dinner: **₹500**
- 📦 Amazon impulse deal: **₹1,400**

Before 6:00 PM, over **₹3,150 is gone**. By day 15, half the paycheck has evaporated, and the common promise to *"invest whatever is left over at month-end"* results in **₹0 saved**.

The human brain cannot intuitively pace a 30-day lump sum. Traditional budgeting apps only give retrospective guilt trips through pie charts after the damage is done.

---

## 🚀 The Solution: Dynamic Liquidity Pacing
**PacePay** flips budgeting upside down by automating the golden rule of wealth: **Pay yourself first.**

1. 🔒 **Day-1 Savings Vault:** The moment salary lands (₹1,00,000), PacePay immediately ring-fences your committed savings target (e.g., ₹30,000) and reserves fixed commitments (rent, EMIs, utilities).
2. ⚡ **Dynamic Discretionary Pool:** Only the remaining liquid float is distributed across the remaining cycle days.
3. 🔄 **Self-Balancing Recalibration:** If you overspend today, PacePay does not shame you or break your budget. It dynamically amortizes the deficit across future days (-₹35/day), ensuring your **₹30,000 savings vault stays 100% untouched**.
4. 🤖 **AI Financial Copilot:** Powered by an agentic intelligence layer that provides Daily Nightly Digests (Bro, Supportive, or Auditor tone), detects micro-spending leaks, and answers real-time affordability questions (*"Can I afford a ₹2,500 dinner tonight?"*).

---

## 📐 Mathematical Pacing Model

PacePay divides your monthly income $I$ into three strict partitions:

$$\text{Discretionary Pool } D = \max\left(0, I - S_{\text{vault}} - \sum B_{\text{fixed}}\right)$$

At any given day $t$ with $N$ total cycle days and remaining pool $D_{\text{rem}}(t)$:

$$\text{Daily Allowance}(t) = \frac{D_{\text{rem}}(t) \cdot w(t)}{\sum_{d=t}^{N} w(d)}$$

*Where $w(d)$ is the dynamic weighting factor ($1.4\times$ for weekend cushioning, $1.0\times$ for weekdays).*

When actual spend $E(t) > \text{Daily Allowance}(t)$:

$$\text{Adjusted Future Allowance} = \frac{D_{\text{rem}}(t) - E(t)}{N - t}$$

---

## 🛠️ Tech Stack & Architecture

- **Frontend & UI:** React 19, TypeScript, TailwindCSS v4, Lucide Icons, Canvas Confetti
- **Deterministic Engine:** Custom dynamic amortization & multi-bucket liquidity manager
- **AI Intelligence Layer:** Agentic prompt & function-calling harness for contextual financial advice
- **Financial Integrations:** Simulated PayPal Webhook & REST event streams for instant transaction capture

---

## ⚡ Quick Start (Run Locally)

```bash
# 1. Clone the repository
git clone https://github.com/your-username/pacepay.git
cd pacepay

# 2. Install dependencies
npm install

# 3. Launch development server
npm run dev
```

Open `http://localhost:5173` to interact with the dashboard.

---

## 🏆 Key Features Demonstrated

- [x] **Day-1 Automated Savings Vault (100% Protected)**
- [x] **Real-Time Dynamic Daily Allowance Gauge**
- [x] **One-Click Interactive Spend Simulator (Blinkit, Swiggy, Amazon)**
- [x] **Simulated PayPal Webhook Stream with Live Recalibration**
- [x] **AI Nightly Digest Generator with Multi-Tone Selection**
- [x] **Quick-Commerce Micro-Leak Detection Radar**
- [x] **Interactive "Ask PaceAI" Affordability Advisor**
- [x] **Custom Financial Architecture Configurator (Income, Savings, Bills)**

---
*Built with ❤️ for the PayPal AI Hackathon.*

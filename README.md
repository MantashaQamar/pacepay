# 🛡️ PacePay — Save First. Pace the Rest.
> **An AI Personal Finance Copilot built for the PayPal AI Hackathon.**  
> Built with the **PayPal Developer Platform (Sandbox Environment)** and **OpenAI GPT-4o**.  
> Automatically vaults savings on Day 1, ring-fences fixed obligations, and dynamically paces daily spending to keep you debt-free.

---

## 🚀 PayPal Developer Platform & AI Integration Proof

### 1. PayPal Developer Platform (Sandbox Environment)
- **Official SDK:** Integrated using `@paypal/react-paypal-js` (`^10.6.1`).
- **Sandbox Client ID:** Configured for PayPal Developer Sandbox (`clientId: "test"`).
- **Interactive Sandbox Checkout:** Users can click **"Pay with PayPal Sandbox SDK"** to launch the live PayPal Sandbox Checkout modal, create orders, and capture payments via PayPal Sandbox APIs (`https://api-m.sandbox.paypal.com/v2/checkout/orders`).
- **Webhook Ingestion:** Modeled on PayPal's `PAYMENT.CAPTURE.COMPLETED` webhook schema (`src/services/paypalService.ts`), automatically parsing real-time transaction metadata into the ledger.

### 2. AI Model Integration (OpenAI GPT-4o)
- **Official SDK:** Integrated using the official `openai` (`^6.49.0`) library.
- **Service Layer:** `src/services/aiService.ts` connects directly to OpenAI's API.
- **Capabilities:**
  1. **Behavioral Quick-Commerce Leak Detection:** Analyzes transaction clusters (Blinkit, Zepto, Swiggy) to quantify monthly fee wastage.
  2. **Multi-Tone Daily Nightly Digest:** Generates end-of-day behavioral recaps across 3 distinct personas: **Bro/Casual**, **Supportive Coach**, and **Strict Wall Street Auditor**.
  3. **Affordability Q&A Copilot ("Ask PaceAI"):** Employs function-calling patterns to evaluate natural-language purchase queries (*"Can I afford a ₹2,500 dinner tonight?"*) against deterministic ledger balances without financial hallucinations.

---

## 📌 Problem: The 30-Day Lump Sum Trap
If you earn **₹1,00,000 / month**, that's theoretically **₹3,333 / day**. Sounds comfortable—until modern quick-commerce and impulse checkouts kick in:
- ☕ Morning Coffee: **₹250**
- ⚡ Blinkit 10-min groceries: **₹600**
- 🛵 Zepto snack run: **₹400**
- 🍕 Swiggy dinner: **₹500**
- 📦 Amazon impulse deal: **₹1,400**

Before 6:00 PM, over **₹3,150 is gone**. By day 15, half the paycheck has evaporated, and the common promise to *"invest whatever is left over at month-end"* results in **₹0 saved**.

---

## 🛠️ Tech Stack & Architecture

- **PayPal Platform:** `@paypal/react-paypal-js`, PayPal Sandbox Orders API v2, PayPal Webhook Event Schema
- **AI Tool:** OpenAI API (`openai`), GPT-4o / GPT-4o-mini, Agentic Prompt & Function-Calling Harness
- **Frontend & UI:** React 19, TypeScript, TailwindCSS v4, Lucide Icons, Canvas Confetti
- **Deterministic Engine:** Dynamic liquidity distribution & self-healing debt amortization

---

## ⚡ Quick Start (Run Locally)

```bash
# 1. Clone the repository
git clone https://github.com/MantashaQamar/pacepay.git
cd pacepay

# 2. Install dependencies (includes PayPal SDK & OpenAI)
npm install

# 3. Launch development server
npm run dev
```

Open `http://localhost:5173` to test the live dashboard.

---

## 🏆 Key Features Demonstrated

- [x] **Live PayPal Developer Sandbox Checkout (`<PayPalButtons />`)**
- [x] **Simulated PayPal Sandbox Webhook Stream (`PAYMENT.CAPTURE.COMPLETED`)**
- [x] **OpenAI GPT-4o Agentic Copilot & Multi-Tone Nightly Digest**
- [x] **Day-1 Automated Savings Vault (100% Protected)**
- [x] **Real-Time Dynamic Daily Allowance Gauge**
- [x] **Self-Balancing Recalibration on Overspending**
- [x] **Weekend Cushioning (1.4x Saturday/Sunday Multiplier)**
- [x] **First-Timer Interactive 4-Step Visual Guide**
- [x] **Financial Architecture Configurator (Custom Salary, Vaults, Bills)**

---
*MIT License — Built for the PayPal AI Hackathon 2026.*

# Deriv RSI Mean-Reversion Bot

A complete Deriv trading bot using an RSI mean-reversion strategy with Martingale money management and strict risk guards.

## Files

| File | Purpose |
|------|---------|
| `bot.js` | Standalone Node.js bot — connects to Deriv WebSocket API and trades live/demo |
| `strategy.xml` | Deriv Bot Builder XML — import at [bot.deriv.com](https://bot.deriv.com) for visual/no-code trading |
| `tests/bot.test.js` | Unit tests for RSI calculation, Martingale staking, and risk limits |
| `package.json` | Node.js manifest |

---

## Strategy Overview

| Parameter | Value |
|-----------|-------|
| Asset | Volatility 25 Index (`1HZ25V`) |
| Contract | Rise/Fall, 1-tick |
| Entry (CALL/Rise) | RSI(14) ≤ 30 (oversold) |
| Entry (PUT/Fall) | RSI(14) ≥ 70 (overbought) |
| Money management | Martingale ×2 on loss, reset on win |
| Initial stake | $1.00 USD |
| Max stake | $50.00 USD |
| Max consecutive losses | 6 |
| Stop-loss | 15 % of starting balance |
| Take-profit | 30 % of starting balance |

---

## Setup & Usage

### Option A — Node.js bot (live / demo)

```bash
# 1. Install dependency
cd deriv-bot
npm install

# 2. Set your Deriv API token
#    Get one at https://app.deriv.com/account/api-token
#    Use a *demo* account token for safe testing
export DERIV_API_TOKEN=your_token_here

# 3. Run
node bot.js
```

Without a token the bot runs in **dry-run mode** — it connects, computes RSI signals from live candle data, and logs what it *would* trade without placing any real orders.

### Option B — Deriv Bot Builder (visual, no-code)

1. Go to [bot.deriv.com](https://bot.deriv.com)
2. Click **Import** in the Bot Builder tab
3. Upload `strategy.xml`
4. Review the blocks, set your preferred stake, then click **Run**

---

## Running Tests

```bash
node tests/bot.test.js
```

Tests cover:

- RSI calculation (uptrend, downtrend, flat, mixed, insufficient data)
- Martingale stake progression and max-stake cap
- Risk guard stop-loss, take-profit, and max-consecutive-losses triggers

---

## Risk Disclaimer

> **Trading synthetic indices and binary options carries significant financial risk. Past performance of any strategy does not guarantee future results. Only trade with money you can afford to lose. Always test on a demo account before deploying real funds.**

---

## Configuration Reference (`CONFIG` object in `bot.js`)

```js
{
  apiToken: "",            // Deriv API token (or DERIV_API_TOKEN env var)
  symbol: "1HZ25V",        // Volatility 25 Index
  rsiPeriod: 14,           // RSI lookback period
  rsiOversold: 30,         // Buy Rise below this RSI level
  rsiOverbought: 70,       // Buy Fall above this RSI level
  initialStake: 1.00,      // Starting stake in USD
  martingaleMultiplier: 2, // Stake multiplier after a loss
  maxStake: 50.00,         // Hard cap per trade
  maxConsecutiveLosses: 6, // Halt after this many losses in a row
  stopLossPct: 0.15,       // 15 % balance drawdown → stop
  takeProfitPct: 0.30,     // 30 % balance gain   → stop
}
```

/**
 * Unit tests for the Deriv RSI bot core logic.
 * Run with: node tests/bot.test.js
 */

"use strict";

let passed = 0;
let failed = 0;

function assert(condition, label) {
  if (condition) {
    console.log(`  ✅ PASS: ${label}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${label}`);
    failed++;
  }
}

// ─── Inline the functions under test (no module export needed) ───────────────

function calculateRSI(closes, period) {
  if (closes.length < period + 1) return 50;

  let gains = 0;
  let losses = 0;
  for (let i = 1; i <= period; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff >= 0) gains += diff;
    else losses += Math.abs(diff);
  }
  let avgGain = gains / period;
  let avgLoss = losses / period;

  for (let i = period + 1; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    const gain = diff >= 0 ? diff : 0;
    const loss = diff < 0 ? Math.abs(diff) : 0;
    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
  }

  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

// Martingale stake helper
function nextStake(currentStake, isWin, initialStake, multiplier, maxStake) {
  if (isWin) return initialStake;
  return Math.min(currentStake * multiplier, maxStake);
}

// Risk guard helper
function checkRiskLimits(balance, startingBalance, totalProfit, consecutiveLosses, cfg) {
  const drawdown = startingBalance - balance;
  const drawdownPct = drawdown / startingBalance;
  const profitPct = totalProfit / startingBalance;
  if (drawdownPct >= cfg.stopLossPct) return { ok: false, reason: "stop_loss" };
  if (profitPct >= cfg.takeProfitPct) return { ok: false, reason: "take_profit" };
  if (consecutiveLosses >= cfg.maxConsecutiveLosses) return { ok: false, reason: "max_losses" };
  return { ok: true };
}

// ─── Test Suite ──────────────────────────────────────────────────────────────

console.log("\n=== RSI Calculation Tests ===");

{
  // Neutral when not enough data
  const rsi = calculateRSI([100, 101], 14);
  assert(rsi === 50, "Returns 50 (neutral) when insufficient data");
}

{
  // Continuously rising prices → RSI near 100
  const up = Array.from({ length: 20 }, (_, i) => 100 + i);
  const rsi = calculateRSI(up, 14);
  assert(rsi > 90, `Uptrend RSI > 90 (got ${rsi.toFixed(2)})`);
}

{
  // Continuously falling prices → RSI near 0
  const down = Array.from({ length: 20 }, (_, i) => 120 - i);
  const rsi = calculateRSI(down, 14);
  assert(rsi < 10, `Downtrend RSI < 10 (got ${rsi.toFixed(2)})`);
}

{
  // Mixed prices → mid-range RSI
  const mixed = [100, 102, 101, 103, 100, 99, 101, 102, 100, 103, 101, 99, 100, 102, 101, 103];
  const rsi = calculateRSI(mixed, 14);
  assert(rsi > 20 && rsi < 80, `Mixed data RSI in 20–80 range (got ${rsi.toFixed(2)})`);
}

{
  // All same prices → avgLoss = 0 → RSI = 100
  const flat = Array(16).fill(100);
  const rsi = calculateRSI(flat, 14);
  assert(rsi === 100, `Flat prices → RSI 100 (got ${rsi})`);
}

console.log("\n=== Martingale Stake Tests ===");

{
  const s = nextStake(1, true, 1, 2, 50);
  assert(s === 1, `Win resets stake to initial (${s})`);
}

{
  const s = nextStake(1, false, 1, 2, 50);
  assert(s === 2, `Loss doubles stake: 1 → 2`);
}

{
  const s = nextStake(2, false, 1, 2, 50);
  assert(s === 4, `Loss doubles stake: 2 → 4`);
}

{
  const s = nextStake(32, false, 1, 2, 50);
  assert(s === 50, `Stake capped at maxStake (got ${s})`);
}

{
  const s = nextStake(50, false, 1, 2, 50);
  assert(s === 50, `Already at max — stays capped (got ${s})`);
}

console.log("\n=== Risk Guard Tests ===");

const cfg = { stopLossPct: 0.15, takeProfitPct: 0.30, maxConsecutiveLosses: 6 };

{
  const r = checkRiskLimits(1000, 1000, 0, 0, cfg);
  assert(r.ok, "No risk limit hit initially");
}

{
  // Drawdown > 15 %
  const r = checkRiskLimits(840, 1000, -160, 0, cfg);
  assert(!r.ok && r.reason === "stop_loss", `Stop-loss triggers at 16% drawdown (reason=${r.reason})`);
}

{
  // Profit > 30 %
  const r = checkRiskLimits(1300, 1000, 300, 0, cfg);
  assert(!r.ok && r.reason === "take_profit", `Take-profit triggers at 30% gain (reason=${r.reason})`);
}

{
  // Exactly at stop-loss boundary
  const r = checkRiskLimits(850, 1000, -150, 0, cfg);
  assert(!r.ok && r.reason === "stop_loss", "Stop-loss triggers at exactly 15%");
}

{
  // Max consecutive losses
  const r = checkRiskLimits(950, 1000, -50, 6, cfg);
  assert(!r.ok && r.reason === "max_losses", `Max losses (6) triggers halt (reason=${r.reason})`);
}

{
  // Within all limits
  const r = checkRiskLimits(960, 1000, -40, 3, cfg);
  assert(r.ok, "No halt when within all limits");
}

// ─── Summary ─────────────────────────────────────────────────────────────────

console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`);
process.exit(failed > 0 ? 1 : 0);

/**
 * Deriv Trading Bot — RSI Mean-Reversion Strategy
 * ─────────────────────────────────────────────────
 * Asset      : Volatility 25 Index  (1HZ25V)
 * Contract   : Rise/Fall, 1-tick duration
 * Entry rule : RSI(14) ≤ 30  → BUY Rise (CALL)
 *              RSI(14) ≥ 70  → BUY Fall  (PUT)
 * Money mgmt : Martingale — stake ×2 after each loss, reset on win
 * Risk guards: Stop-loss  15 % of starting balance
 *              Take-profit 30 % of starting balance
 *              Max 6 consecutive losses before halting
 *
 * Usage
 * ─────
 * 1. npm install ws
 * 2. Set DERIV_API_TOKEN env var (Paper trading token is fine for testing)
 * 3. node bot.js
 *
 * Deriv WebSocket API docs: https://api.deriv.com/api-explorer
 */

"use strict";

const WebSocket = require("ws");

// ─── Configuration ──────────────────────────────────────────────────────────

const CONFIG = {
  apiToken: process.env.DERIV_API_TOKEN || "",   // set your token here or via env
  appId: 1089,                                    // official Deriv test app_id
  wsUrl: "wss://ws.binaryws.com/websockets/v3",

  // Market
  symbol: "1HZ25V",                 // Volatility 25 Index
  contractType: "CALLPUT",          // Rise / Fall
  duration: 1,
  durationUnit: "t",                // ticks
  currency: "USD",

  // Strategy
  rsiPeriod: 14,
  rsiOversold: 30,                  // signal to BUY (Rise)
  rsiOverbought: 70,                // signal to BUY (Fall)
  candleGranularity: 60,            // 1-minute candles for RSI feed
  candleCount: 50,                  // history length (≥ rsiPeriod + 1)

  // Money management
  initialStake: 1.00,               // USD
  martingaleMultiplier: 2,
  maxStake: 50.00,                  // hard cap per trade
  maxConsecutiveLosses: 6,          // stop after N losses in a row

  // Session risk limits (% of starting balance)
  stopLossPct: 0.15,                // 15 % drawdown → halt
  takeProfitPct: 0.30,              // 30 % gain    → halt
};

// ─── State ───────────────────────────────────────────────────────────────────

const state = {
  balance: 0,
  startingBalance: 0,
  currentStake: CONFIG.initialStake,
  consecutiveLosses: 0,
  totalProfit: 0,
  wins: 0,
  losses: 0,
  candles: [],                      // close prices
  running: false,
  tradeInFlight: false,
  activeContractId: null,
};

// ─── RSI Calculation ─────────────────────────────────────────────────────────

/**
 * Wilder's smoothed RSI.
 * @param {number[]} closes - Array of close prices (oldest → newest)
 * @param {number}   period
 * @returns {number} RSI value 0–100
 */
function calculateRSI(closes, period) {
  if (closes.length < period + 1) return 50; // neutral when insufficient data

  // Seed with simple average of first `period` changes
  let gains = 0;
  let losses = 0;
  for (let i = 1; i <= period; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff >= 0) gains += diff;
    else losses += Math.abs(diff);
  }
  let avgGain = gains / period;
  let avgLoss = losses / period;

  // Wilder smoothing over the rest
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

// ─── Logging helpers ─────────────────────────────────────────────────────────

function log(level, ...args) {
  const ts = new Date().toISOString();
  const prefix = { INFO: "ℹ", WARN: "⚠", ERROR: "✖", TRADE: "💱", MONEY: "💰" }[level] || "•";
  console.log(`[${ts}] ${prefix} [${level}]`, ...args);
}

function logStats() {
  const pnl = state.totalProfit.toFixed(2);
  const wr = state.wins + state.losses > 0
    ? ((state.wins / (state.wins + state.losses)) * 100).toFixed(1)
    : "n/a";
  log("MONEY",
    `Balance: $${state.balance.toFixed(2)}`,
    `| P&L: $${pnl}`,
    `| W/L: ${state.wins}/${state.losses} (${wr}%)`,
    `| Stake: $${state.currentStake.toFixed(2)}`,
    `| ConsecLoss: ${state.consecutiveLosses}`
  );
}

// ─── Risk checks ─────────────────────────────────────────────────────────────

function checkRiskLimits() {
  const drawdown = state.startingBalance - state.balance;
  const drawdownPct = drawdown / state.startingBalance;
  const profitPct = state.totalProfit / state.startingBalance;

  if (drawdownPct >= CONFIG.stopLossPct) {
    log("WARN", `Stop-loss triggered! Drawdown ${(drawdownPct * 100).toFixed(1)}% ≥ ${CONFIG.stopLossPct * 100}%`);
    return false;
  }
  if (profitPct >= CONFIG.takeProfitPct) {
    log("MONEY", `Take-profit reached! Profit ${(profitPct * 100).toFixed(1)}% ≥ ${CONFIG.takeProfitPct * 100}%`);
    return false;
  }
  if (state.consecutiveLosses >= CONFIG.maxConsecutiveLosses) {
    log("WARN", `Max consecutive losses (${CONFIG.maxConsecutiveLosses}) reached. Stopping.`);
    return false;
  }
  return true;
}

// ─── Stake management ────────────────────────────────────────────────────────

function onWin(profit) {
  state.wins++;
  state.totalProfit += profit;
  state.balance += profit;
  state.currentStake = CONFIG.initialStake;
  state.consecutiveLosses = 0;
  log("TRADE", `WIN  +$${profit.toFixed(2)}`);
}

function onLoss(loss) {
  state.losses++;
  state.totalProfit += loss; // loss is negative
  state.balance += loss;
  state.consecutiveLosses++;
  // Martingale
  state.currentStake = Math.min(
    state.currentStake * CONFIG.martingaleMultiplier,
    CONFIG.maxStake
  );
  log("TRADE", `LOSS $${loss.toFixed(2)}  → next stake $${state.currentStake.toFixed(2)}`);
}

// ─── WebSocket bot ───────────────────────────────────────────────────────────

class DerivBot {
  constructor() {
    this.ws = null;
    this.reqId = 1;
    this.pendingCalls = new Map();
  }

  connect() {
    const url = `${CONFIG.wsUrl}?app_id=${CONFIG.appId}`;
    log("INFO", `Connecting to ${url}`);
    this.ws = new WebSocket(url);

    this.ws.on("open", () => {
      log("INFO", "WebSocket connected");
      this._authorize();
    });

    this.ws.on("message", (raw) => {
      let msg;
      try { msg = JSON.parse(raw); } catch { return; }
      this._handleMessage(msg);
    });

    this.ws.on("error", (err) => {
      log("ERROR", "WebSocket error:", err.message);
    });

    this.ws.on("close", (code, reason) => {
      log("WARN", `WebSocket closed: ${code} ${reason}`);
      state.running = false;
    });
  }

  _send(payload) {
    const id = this.reqId++;
    payload.req_id = id;
    this.ws.send(JSON.stringify(payload));
    return id;
  }

  _authorize() {
    if (!CONFIG.apiToken) {
      log("WARN", "No DERIV_API_TOKEN set — running in demo/candle-only mode");
      this._subscribeCandles();
      return;
    }
    log("INFO", "Authorising…");
    this._send({ authorize: CONFIG.apiToken });
  }

  _subscribeCandles() {
    log("INFO", `Subscribing to ${CONFIG.candleGranularity}s candles for ${CONFIG.symbol}`);
    this._send({
      ticks_history: CONFIG.symbol,
      style: "candles",
      granularity: CONFIG.candleGranularity,
      count: CONFIG.candleCount,
      end: "latest",
      subscribe: 1,
    });
  }

  _handleMessage(msg) {
    if (msg.error) {
      log("ERROR", `API error [${msg.error.code}]:`, msg.error.message);
      return;
    }

    switch (msg.msg_type) {
      case "authorize":
        log("INFO", `Authorised as ${msg.authorize.loginid} | Balance: $${msg.authorize.balance}`);
        state.balance = parseFloat(msg.authorize.balance);
        state.startingBalance = state.balance;
        state.running = true;
        this._subscribeCandles();
        break;

      case "candles":
        // Initial history burst
        this._ingestCandles(msg.candles);
        break;

      case "ohlc":
        // Live candle tick — update last candle
        this._updateCandle(msg.ohlc);
        if (!state.tradeInFlight) {
          this._evaluateSignal();
        }
        break;

      case "proposal":
        this._onProposal(msg.proposal, msg.req_id);
        break;

      case "buy":
        log("TRADE", `Contract purchased: ${msg.buy.contract_id} | Price: $${msg.buy.buy_price}`);
        state.activeContractId = msg.buy.contract_id;
        break;

      case "proposal_open_contract":
        this._onContractUpdate(msg.proposal_open_contract);
        break;

      default:
        break;
    }
  }

  _ingestCandles(candles) {
    state.candles = candles.map((c) => parseFloat(c.close));
    log("INFO", `Loaded ${state.candles.length} historical candles`);
  }

  _updateCandle(ohlc) {
    const close = parseFloat(ohlc.close);
    // The last entry is the current (open) candle — update it
    if (state.candles.length > 0) {
      state.candles[state.candles.length - 1] = close;
    } else {
      state.candles.push(close);
    }
    // Trim to avoid unbounded growth
    if (state.candles.length > CONFIG.candleCount * 2) {
      state.candles.splice(0, state.candles.length - CONFIG.candleCount);
    }
  }

  _evaluateSignal() {
    if (!state.running) return;

    const rsi = calculateRSI(state.candles, CONFIG.rsiPeriod);
    log("INFO", `RSI(${CONFIG.rsiPeriod}) = ${rsi.toFixed(2)}`);

    let contractType = null;
    if (rsi <= CONFIG.rsiOversold) {
      contractType = "CALL"; // Rise — oversold, expect bounce up
    } else if (rsi >= CONFIG.rsiOverbought) {
      contractType = "PUT";  // Fall — overbought, expect reversal down
    }

    if (!contractType) return;

    if (!checkRiskLimits()) {
      log("WARN", "Risk limits hit — stopping bot");
      state.running = false;
      return;
    }

    if (!CONFIG.apiToken) {
      log("INFO", `[DRY RUN] Signal: ${contractType} | RSI: ${rsi.toFixed(2)} | Stake: $${state.currentStake.toFixed(2)}`);
      return;
    }

    log("TRADE", `Signal: ${contractType} | RSI: ${rsi.toFixed(2)} | Stake: $${state.currentStake.toFixed(2)}`);
    this._requestProposal(contractType);
  }

  _requestProposal(contractType) {
    state.tradeInFlight = true;
    this._send({
      proposal: 1,
      amount: state.currentStake.toFixed(2),
      basis: "stake",
      contract_type: contractType,
      currency: CONFIG.currency,
      duration: CONFIG.duration,
      duration_unit: CONFIG.durationUnit,
      symbol: CONFIG.symbol,
    });
  }

  _onProposal(proposal, reqId) {
    if (!proposal || !proposal.id) {
      state.tradeInFlight = false;
      return;
    }
    log("TRADE", `Proposal: payout $${proposal.payout} | ask $${proposal.ask_price}`);
    // Auto-buy
    this._send({ buy: proposal.id, price: proposal.ask_price });
    // Subscribe to contract updates
    this._send({
      proposal_open_contract: 1,
      contract_id: state.activeContractId,
      subscribe: 1,
    });
  }

  _onContractUpdate(contract) {
    if (!contract || !contract.is_sold) return;

    const profit = parseFloat(contract.profit);
    if (profit >= 0) {
      onWin(profit);
    } else {
      onLoss(profit);
    }
    logStats();

    state.tradeInFlight = false;
    state.activeContractId = null;

    if (!checkRiskLimits()) {
      log("WARN", "Risk limits hit after trade — stopping bot");
      state.running = false;
    }
  }
}

// ─── Entry point ─────────────────────────────────────────────────────────────

function main() {
  if (!CONFIG.apiToken) {
    log("WARN", "DERIV_API_TOKEN is not set.");
    log("INFO", "Bot will connect and log RSI signals without placing real trades.");
    log("INFO", "Get a demo token at https://app.deriv.com/account/api-token");
  }

  const bot = new DerivBot();
  bot.connect();

  // Graceful shutdown
  process.on("SIGINT", () => {
    log("INFO", "SIGINT received — shutting down");
    logStats();
    process.exit(0);
  });
}

main();

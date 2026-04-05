import { logger } from './lib/logger';

type ContractDirection = 'CALL' | 'PUT';
type DurationUnit = 't' | 'm' | 'h';
type TradeOutcome = 'WIN' | 'LOSS' | 'DRAW';

interface Signal {
  direction: ContractDirection;
  confidence: number;
  edge: number;
}

interface TradeOrder {
  symbol: string;
  direction: ContractDirection;
  stake: number;
  duration: number;
  durationUnit: DurationUnit;
  confidence: number;
}

interface TradeResult {
  id: string;
  stake: number;
  payout: number;
  profit: number;
  outcome: TradeOutcome;
  direction: ContractDirection;
  confidence: number;
  timestamp: Date;
}

interface DerivTradingClient {
  fetchRecentTicks(symbol: string, count: number): Promise<number[]>;
  executeTrade(order: TradeOrder): Promise<TradeResult>;
}

export interface ProfitableDerivBotConfig {
  symbol: string;
  tickLookback: number;
  pollingMs: number;
  baseStake: number;
  maxStake: number;
  payoutRatio: number;
  duration: number;
  durationUnit: DurationUnit;
  minConfidence: number;
  maxDailyLoss: number;
  takeProfit: number;
  maxConsecutiveLosses: number;
  cooldownMs: number;
}

interface BotState {
  sessionProfit: number;
  consecutiveLosses: number;
  totalTrades: number;
  wins: number;
  losses: number;
}

const DEFAULT_CONFIG: ProfitableDerivBotConfig = {
  symbol: process.env.DERIV_SYMBOL || 'R_100',
  tickLookback: Number(process.env.DERIV_TICK_LOOKBACK || 40),
  pollingMs: Number(process.env.DERIV_POLLING_MS || 8_000),
  baseStake: Number(process.env.DERIV_BASE_STAKE || 1),
  maxStake: Number(process.env.DERIV_MAX_STAKE || 10),
  payoutRatio: Number(process.env.DERIV_PAYOUT_RATIO || 0.85),
  duration: Number(process.env.DERIV_DURATION || 5),
  durationUnit: (process.env.DERIV_DURATION_UNIT as DurationUnit) || 't',
  minConfidence: Number(process.env.DERIV_MIN_CONFIDENCE || 0.58),
  maxDailyLoss: Number(process.env.DERIV_MAX_DAILY_LOSS || 50),
  takeProfit: Number(process.env.DERIV_TAKE_PROFIT || 80),
  maxConsecutiveLosses: Number(process.env.DERIV_MAX_CONSECUTIVE_LOSSES || 4),
  cooldownMs: Number(process.env.DERIV_COOLDOWN_MS || 45_000),
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function mean(values: number[]): number {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function standardDeviation(values: number[]): number {
  if (values.length <= 1) return 0;
  const avg = mean(values);
  const variance = values.reduce((acc, value) => acc + (value - avg) ** 2, 0) / (values.length - 1);
  return Math.sqrt(variance);
}

function ema(values: number[], period: number): number {
  if (!values.length) return 0;
  const smoothing = 2 / (period + 1);
  let current = values[0];
  for (let i = 1; i < values.length; i += 1) {
    current = values[i] * smoothing + current * (1 - smoothing);
  }
  return current;
}

class MockDerivClient implements DerivTradingClient {
  private price = 100;
  private drift = 0.01;
  private tradeCounter = 0;

  async fetchRecentTicks(_: string, count: number): Promise<number[]> {
    const ticks: number[] = [];
    for (let i = 0; i < count; i += 1) {
      const randomShock = (Math.random() - 0.5) * 0.45;
      this.price = Math.max(1, this.price + this.drift + randomShock);
      ticks.push(this.price);
    }

    if (Math.random() < 0.1) {
      this.drift = (Math.random() - 0.5) * 0.08;
    }
    return ticks;
  }

  async executeTrade(order: TradeOrder): Promise<TradeResult> {
    const directionalBias = order.direction === 'CALL' ? 0.02 : -0.02;
    const confidenceBonus = (order.confidence - 0.5) * 0.2;
    const winProbability = clamp(0.5 + directionalBias + confidenceBonus, 0.35, 0.75);
    const didWin = Math.random() < winProbability;
    const payout = didWin ? order.stake * (1 + DEFAULT_CONFIG.payoutRatio) : 0;
    const profit = didWin ? order.stake * DEFAULT_CONFIG.payoutRatio : -order.stake;

    this.tradeCounter += 1;
    return {
      id: `mock-trade-${this.tradeCounter}`,
      stake: order.stake,
      payout,
      profit,
      outcome: didWin ? 'WIN' : 'LOSS',
      direction: order.direction,
      confidence: order.confidence,
      timestamp: new Date(),
    };
  }
}

export class ProfitableDerivBot {
  private readonly client: DerivTradingClient;
  private readonly config: ProfitableDerivBotConfig;
  private timer: NodeJS.Timeout | null = null;
  private coolDownUntil = 0;
  private readonly state: BotState = {
    sessionProfit: 0,
    consecutiveLosses: 0,
    totalTrades: 0,
    wins: 0,
    losses: 0,
  };

  constructor(client: DerivTradingClient, config?: Partial<ProfitableDerivBotConfig>) {
    this.client = client;
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  start(): void {
    if (this.timer) {
      logger.warn('ProfitableDerivBot is already running');
      return;
    }

    logger.info(`Starting profitable Deriv bot on ${this.config.symbol}`);
    this.timer = setInterval(() => {
      this.runCycle().catch((error: unknown) => {
        logger.error('Deriv bot cycle failed', error);
      });
    }, this.config.pollingMs);
  }

  stop(): void {
    if (!this.timer) return;
    clearInterval(this.timer);
    this.timer = null;
    logger.info('ProfitableDerivBot stopped');
  }

  getState(): BotState {
    return { ...this.state };
  }

  private async runCycle(): Promise<void> {
    if (!this.canTrade()) return;

    const ticks = await this.client.fetchRecentTicks(this.config.symbol, this.config.tickLookback);
    if (ticks.length < this.config.tickLookback) {
      logger.warn('Not enough ticks to generate signal');
      return;
    }

    const signal = this.generateSignal(ticks);
    if (!signal || signal.confidence < this.config.minConfidence) {
      logger.info('Signal filtered out by confidence threshold');
      return;
    }

    const stake = this.calculateStake(signal.confidence);
    if (stake <= 0) {
      logger.warn('Stake resolved to zero, skipping trade');
      return;
    }

    const result = await this.client.executeTrade({
      symbol: this.config.symbol,
      direction: signal.direction,
      stake,
      duration: this.config.duration,
      durationUnit: this.config.durationUnit,
      confidence: signal.confidence,
    });

    this.registerTrade(result);
  }

  private canTrade(): boolean {
    if (Date.now() < this.coolDownUntil) {
      return false;
    }

    if (this.state.sessionProfit <= -this.config.maxDailyLoss) {
      logger.warn('Max daily loss reached, trading halted');
      return false;
    }

    if (this.state.sessionProfit >= this.config.takeProfit) {
      logger.info('Take-profit reached, trading halted');
      return false;
    }

    if (this.state.consecutiveLosses >= this.config.maxConsecutiveLosses) {
      logger.warn('Consecutive loss limit reached, cooling down');
      this.coolDownUntil = Date.now() + this.config.cooldownMs;
      this.state.consecutiveLosses = 0;
      return false;
    }

    return true;
  }

  private generateSignal(ticks: number[]): Signal | null {
    const shortEma = ema(ticks, 5);
    const longEma = ema(ticks, 14);
    const diff = shortEma - longEma;
    const volatility = standardDeviation(ticks);

    if (volatility <= 0) return null;

    const normalizedEdge = Math.abs(diff) / volatility;
    const confidence = clamp(normalizedEdge / 3, 0, 1);
    if (confidence === 0) return null;

    return {
      direction: diff >= 0 ? 'CALL' : 'PUT',
      confidence,
      edge: normalizedEdge,
    };
  }

  private calculateStake(confidence: number): number {
    const winRate = this.estimatedWinRate();
    const b = this.config.payoutRatio;
    const kelly = (b * winRate - (1 - winRate)) / b;
    const kellyFraction = clamp(kelly * 0.5, 0, 0.2);
    const confidenceFactor = clamp(confidence, 0.4, 1);
    const rawStake = this.config.baseStake * (1 + kellyFraction * 4 * confidenceFactor);
    return clamp(rawStake, this.config.baseStake, this.config.maxStake);
  }

  private estimatedWinRate(): number {
    if (this.state.totalTrades < 10) return 0.55;
    return clamp(this.state.wins / this.state.totalTrades, 0.35, 0.8);
  }

  private registerTrade(result: TradeResult): void {
    this.state.totalTrades += 1;
    this.state.sessionProfit += result.profit;

    if (result.outcome === 'WIN') {
      this.state.wins += 1;
      this.state.consecutiveLosses = 0;
    } else if (result.outcome === 'LOSS') {
      this.state.losses += 1;
      this.state.consecutiveLosses += 1;
    }

    logger.info(
      `[DerivBot] Trade=${result.id} outcome=${result.outcome} stake=${result.stake.toFixed(2)} profit=${result.profit.toFixed(2)} confidence=${result.confidence.toFixed(2)} pnl=${this.state.sessionProfit.toFixed(2)}`,
    );
  }
}

export function createProfitableDerivBot(config?: Partial<ProfitableDerivBotConfig>): ProfitableDerivBot {
  return new ProfitableDerivBot(new MockDerivClient(), config);
}

if (require.main === module) {
  const bot = createProfitableDerivBot();
  bot.start();

  setTimeout(() => {
    bot.stop();
    logger.info(`Deriv bot final state: ${JSON.stringify(bot.getState())}`);
  }, 60_000);
}

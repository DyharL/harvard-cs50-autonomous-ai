export interface Transaction {
  id: string;
  type: 'BUY' | 'SELL';
  symbol: string;
  shares: number;
  pricePerShare: number;
  totalAmount: number;
  timestamp: string;
}

export interface PortfolioPosition {
  symbol: string;
  shares: number;
  averageCost: number;
  currentPrice: number;
  totalValue: number;
  unrealizedPnl: number;
}

export interface PortfolioSummary {
  cash: number;
  investedValue: number;
  totalEquity: number;
  totalPnl: number;
  positions: PortfolioPosition[];
}

export class TradingPortfolio {
  private cash: number;
  private holdings: Map<string, { shares: number; totalCost: number }> = new Map();
  private transactions: Transaction[] = [];

  constructor(initialCash: number = 10000) {
    this.cash = initialCash;
  }

  public buy(symbol: string, shares: number, pricePerShare: number): Transaction {
    if (shares <= 0 || pricePerShare <= 0) {
      throw new Error('Shares and price must be strictly positive');
    }
    const totalCost = shares * pricePerShare;
    if (this.cash < totalCost) {
      throw new Error(`Insufficient funds: required $${totalCost.toFixed(2)}, available $${this.cash.toFixed(2)}`);
    }

    this.cash -= totalCost;
    const current = this.holdings.get(symbol) || { shares: 0, totalCost: 0 };
    this.holdings.set(symbol, {
      shares: current.shares + shares,
      totalCost: current.totalCost + totalCost
    });

    const tx: Transaction = {
      id: `TX-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type: 'BUY',
      symbol: symbol.toUpperCase(),
      shares,
      pricePerShare,
      totalAmount: totalCost,
      timestamp: new Date().toISOString()
    };
    this.transactions.push(tx);
    return tx;
  }

  public sell(symbol: string, shares: number, pricePerShare: number): Transaction {
    if (shares <= 0 || pricePerShare <= 0) {
      throw new Error('Shares and price must be strictly positive');
    }
    const current = this.holdings.get(symbol);
    if (!current || current.shares < shares) {
      throw new Error(`Insufficient shares: attempted to sell ${shares}, owned ${current?.shares || 0}`);
    }

    const totalProceeds = shares * pricePerShare;
    this.cash += totalProceeds;

    const costPortion = (current.totalCost / current.shares) * shares;
    const remainingShares = current.shares - shares;
    if (remainingShares === 0) {
      this.holdings.delete(symbol);
    } else {
      this.holdings.set(symbol, {
        shares: remainingShares,
        totalCost: current.totalCost - costPortion
      });
    }

    const tx: Transaction = {
      id: `TX-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type: 'SELL',
      symbol: symbol.toUpperCase(),
      shares,
      pricePerShare,
      totalAmount: totalProceeds,
      timestamp: new Date().toISOString()
    };
    this.transactions.push(tx);
    return tx;
  }

  public getSummary(currentPrices: Record<string, number>): PortfolioSummary {
    let investedValue = 0;
    const positions: PortfolioPosition[] = [];

    for (const [sym, data] of this.holdings.entries()) {
      const price = currentPrices[sym] ?? (data.totalCost / data.shares);
      const posValue = data.shares * price;
      investedValue += posValue;
      positions.push({
        symbol: sym,
        shares: data.shares,
        averageCost: Math.round((data.totalCost / data.shares) * 100) / 100,
        currentPrice: price,
        totalValue: Math.round(posValue * 100) / 100,
        unrealizedPnl: Math.round((posValue - data.totalCost) * 100) / 100
      });
    }

    const totalEquity = this.cash + investedValue;
    return {
      cash: Math.round(this.cash * 100) / 100,
      investedValue: Math.round(investedValue * 100) / 100,
      totalEquity: Math.round(totalEquity * 100) / 100,
      totalPnl: Math.round((totalEquity - 10000) * 100) / 100,
      positions
    };
  }

  public getTransactions(): Transaction[] {
    return [...this.transactions];
  }
}

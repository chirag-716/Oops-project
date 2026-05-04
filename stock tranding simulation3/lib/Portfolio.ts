import { Stock } from './Stock';

export interface Holding {
  stock: Stock;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
}

export interface PortfolioSummary {
  totalValue: number;
  totalCost: number;
  totalProfitLoss: number;
  totalProfitLossPercent: number;
  holdings: Holding[];
}

export class Portfolio {
  private readonly id: string;
  private readonly userId: string;
  private holdings: Map<string, { stock: Stock; quantity: number; avgPrice: number }>;
  private readonly createdAt: Date;

  constructor(id: string, userId: string, createdAt?: Date) {
    this.id = id;
    this.userId = userId;
    this.holdings = new Map();
    this.createdAt = createdAt || new Date();
  }

  getId(): string {
    return this.id;
  }

  getUserId(): string {
    return this.userId;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  addStock(stock: Stock, quantity: number, price: number): void {
    const stockId = stock.getId();
    const existingHolding = this.holdings.get(stockId);

    if (existingHolding) {
      // Calculate new average price
      const totalCost = existingHolding.avgPrice * existingHolding.quantity + price * quantity;
      const totalQuantity = existingHolding.quantity + quantity;
      const newAvgPrice = totalCost / totalQuantity;

      this.holdings.set(stockId, {
        stock: existingHolding.stock,
        quantity: totalQuantity,
        avgPrice: newAvgPrice
      });
    } else {
      this.holdings.set(stockId, {
        stock,
        quantity,
        avgPrice: price
      });
    }
  }

  removeStock(stockId: string, quantity: number): void {
    const holding = this.holdings.get(stockId);
    
    if (!holding) {
      throw new Error('Stock not found in portfolio');
    }

    if (quantity > holding.quantity) {
      throw new Error('Insufficient stock quantity in portfolio');
    }

    if (quantity === holding.quantity) {
      // Remove entire holding
      this.holdings.delete(stockId);
    } else {
      // Reduce quantity
      this.holdings.set(stockId, {
        stock: holding.stock,
        quantity: holding.quantity - quantity,
        avgPrice: holding.avgPrice
      });
    }
  }

  getHolding(stockId: string): { stock: Stock; quantity: number; avgPrice: number } | undefined {
    return this.holdings.get(stockId);
  }

  getStockQuantity(stockId: string): number {
    const holding = this.holdings.get(stockId);
    return holding ? holding.quantity : 0;
  }

  getAllHoldings(): { stock: Stock; quantity: number; avgPrice: number }[] {
    return Array.from(this.holdings.values());
  }

  getHoldingsWithCurrentPrices(): Holding[] {
    return this.getAllHoldings().map(holding => ({
      stock: holding.stock,
      quantity: holding.quantity,
      avgPrice: holding.avgPrice,
      currentPrice: holding.stock.getPrice()
    }));
  }

  getTotalValue(): number {
    return this.getAllHoldings().reduce((total, holding) => {
      return total + (holding.stock.getPrice() * holding.quantity);
    }, 0);
  }

  getTotalCost(): number {
    return this.getAllHoldings().reduce((total, holding) => {
      return total + (holding.avgPrice * holding.quantity);
    }, 0);
  }

  getProfitLoss(): number {
    return this.getTotalValue() - this.getTotalCost();
  }

  getProfitLossPercent(): number {
    const totalCost = this.getTotalCost();
    if (totalCost === 0) return 0;
    return (this.getProfitLoss() / totalCost) * 100;
  }

  getStockProfitLoss(stockId: string): number {
    const holding = this.holdings.get(stockId);
    if (!holding) return 0;
    
    const currentValue = holding.stock.getPrice() * holding.quantity;
    const cost = holding.avgPrice * holding.quantity;
    return currentValue - cost;
  }

  getStockProfitLossPercent(stockId: string): number {
    const holding = this.holdings.get(stockId);
    if (!holding) return 0;
    
    const cost = holding.avgPrice * holding.quantity;
    if (cost === 0) return 0;
    
    const profitLoss = this.getStockProfitLoss(stockId);
    return (profitLoss / cost) * 100;
  }

  isEmpty(): boolean {
    return this.holdings.size === 0;
  }

  getSummary(): PortfolioSummary {
    const holdings = this.getHoldingsWithCurrentPrices();
    
    return {
      totalValue: this.getTotalValue(),
      totalCost: this.getTotalCost(),
      totalProfitLoss: this.getProfitLoss(),
      totalProfitLossPercent: this.getProfitLossPercent(),
      holdings
    };
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      holdings: this.getAllHoldings().map(holding => ({
        stock: holding.stock.toJSON(),
        quantity: holding.quantity,
        avgPrice: holding.avgPrice
      })),
      createdAt: this.createdAt,
      summary: this.getSummary()
    };
  }
}

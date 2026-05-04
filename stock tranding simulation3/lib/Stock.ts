export class Stock {
  private readonly id: string;
  private symbol: string;
  private name: string;
  private price: number;
  private volatility: number;
  private readonly createdAt: Date;

  constructor(id: string, symbol: string, name: string, price: number, volatility: number, createdAt?: Date) {
    this.id = id;
    this.symbol = symbol;
    this.name = name;
    this.price = price;
    this.volatility = volatility;
    this.createdAt = createdAt || new Date();
  }

  getId(): string {
    return this.id;
  }

  getSymbol(): string {
    return this.symbol;
  }

  getName(): string {
    return this.name;
  }

  getPrice(): number {
    return this.price;
  }

  getVolatility(): number {
    return this.volatility;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  updatePrice(newPrice: number): void {
    if (newPrice <= 0) {
      throw new Error('Stock price must be positive');
    }
    this.price = newPrice;
  }

  simulatePriceChange(): number {
    const changePercent = (Math.random() - 0.5) * 2 * this.volatility;
    const newPrice = this.price * (1 + changePercent);
    
    if (newPrice > 0) {
      this.price = newPrice;
    }
    
    return this.price;
  }

  calculateTotalCost(quantity: number): number {
    return this.price * quantity;
  }

  getPriceChange(previousPrice: number): number {
    return this.price - previousPrice;
  }

  getPriceChangePercent(previousPrice: number): number {
    if (previousPrice === 0) return 0;
    return ((this.price - previousPrice) / previousPrice) * 100;
  }

  isPriceUp(previousPrice: number): boolean {
    return this.price > previousPrice;
  }

  toJSON() {
    return {
      id: this.id,
      symbol: this.symbol,
      name: this.name,
      price: this.price,
      volatility: this.volatility,
      createdAt: this.createdAt
    };
  }
}

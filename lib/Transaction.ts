import { OrderType } from './Order';

export { OrderType } from './Order';

export class Transaction {
  private readonly id: string;
  private readonly userId: string;
  private readonly stockId: string;
  private readonly type: OrderType;
  private readonly price: number;
  private readonly quantity: number;
  private readonly total: number;
  private readonly createdAt: Date;

  constructor(
    id: string,
    userId: string,
    stockId: string,
    type: OrderType,
    price: number,
    quantity: number,
    total: number,
    createdAt?: Date
  ) {
    this.id = id;
    this.userId = userId;
    this.stockId = stockId;
    this.type = type;
    this.price = price;
    this.quantity = quantity;
    this.total = total;
    this.createdAt = createdAt || new Date();
  }

  getId(): string {
    return this.id;
  }

  getUserId(): string {
    return this.userId;
  }

  getStockId(): string {
    return this.stockId;
  }

  getType(): OrderType {
    return this.type;
  }

  getPrice(): number {
    return this.price;
  }

  getQuantity(): number {
    return this.quantity;
  }

  getTotal(): number {
    return this.total;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  isBuy(): boolean {
    return this.type === OrderType.BUY;
  }

  isSell(): boolean {
    return this.type === OrderType.SELL;
  }

  getProfitLoss(currentPrice: number): number {
    if (this.isBuy()) {
      // For buy transactions, profit is based on current price vs purchase price
      return (currentPrice - this.price) * this.quantity;
    } else {
      // For sell transactions, profit is already realized
      return 0;
    }
  }

  getProfitLossPercent(currentPrice: number): number {
    if (this.isBuy()) {
      const cost = this.price * this.quantity;
      if (cost === 0) return 0;
      return ((currentPrice - this.price) / this.price) * 100;
    }
    return 0;
  }

  getValueAtPrice(price: number): number {
    return price * this.quantity;
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      stockId: this.stockId,
      type: this.type,
      price: this.price,
      quantity: this.quantity,
      total: this.total,
      createdAt: this.createdAt
    };
  }

  static createBuyTransaction(
    id: string,
    userId: string,
    stockId: string,
    price: number,
    quantity: number
  ): Transaction {
    const total = price * quantity;
    return new Transaction(id, userId, stockId, OrderType.BUY, price, quantity, total);
  }

  static createSellTransaction(
    id: string,
    userId: string,
    stockId: string,
    price: number,
    quantity: number
  ): Transaction {
    const total = price * quantity;
    return new Transaction(id, userId, stockId, OrderType.SELL, price, quantity, total);
  }
}

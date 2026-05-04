import { Stock } from './Stock';

export enum OrderType {
  BUY = 'BUY',
  SELL = 'SELL'
}

export interface OrderResult {
  success: boolean;
  message: string;
  executedPrice?: number;
  executedQuantity?: number;
  totalCost?: number;
}

export abstract class Order {
  protected readonly id: string;
  protected readonly userId: string;
  protected readonly stock: Stock;
  protected readonly quantity: number;
  protected readonly createdAt: Date;

  constructor(userId: string, stock: Stock, quantity: number, id?: string, createdAt?: Date) {
    this.id = id || this.generateId();
    this.userId = userId;
    this.stock = stock;
    this.quantity = quantity;
    this.createdAt = createdAt || new Date();
  }

  getId(): string {
    return this.id;
  }

  getUserId(): string {
    return this.userId;
  }

  getStock(): Stock {
    return this.stock;
  }

  getQuantity(): number {
    return this.quantity;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  abstract getType(): OrderType;
  abstract execute(userBalance: number, userStockQuantity: number): OrderResult;
  abstract calculateTotal(): number;
  abstract validate(userBalance: number, userStockQuantity: number): boolean;

  protected generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  protected validateQuantity(): boolean {
    return this.quantity > 0 && Number.isInteger(this.quantity);
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      stock: this.stock.toJSON(),
      quantity: this.quantity,
      type: this.getType(),
      createdAt: this.createdAt
    };
  }
}

export class BuyOrder extends Order {
  constructor(userId: string, stock: Stock, quantity: number, id?: string, createdAt?: Date) {
    super(userId, stock, quantity, id, createdAt);
  }

  getType(): OrderType {
    return OrderType.BUY;
  }

  calculateTotal(): number {
    return this.stock.calculateTotalCost(this.quantity);
  }

  validate(userBalance: number, userStockQuantity: number): boolean {
    return this.validateQuantity() && userBalance >= this.calculateTotal();
  }

  execute(userBalance: number, userStockQuantity: number): OrderResult {
    if (!this.validate(userBalance, userStockQuantity)) {
      return {
        success: false,
        message: 'Insufficient balance or invalid quantity'
      };
    }

    const executedPrice = this.stock.getPrice();
    const totalCost = this.calculateTotal();

    return {
      success: true,
      message: `stock buy successfully`,
      executedPrice,
      executedQuantity: this.quantity,
      totalCost
    };
  }
}

export class SellOrder extends Order {
  constructor(userId: string, stock: Stock, quantity: number, id?: string, createdAt?: Date) {
    super(userId, stock, quantity, id, createdAt);
  }

  getType(): OrderType {
    return OrderType.SELL;
  }

  calculateTotal(): number {
    return this.stock.calculateTotalCost(this.quantity);
  }

  validate(userBalance: number, userStockQuantity: number): boolean {
    return this.validateQuantity() && userStockQuantity >= this.quantity;
  }

  execute(userBalance: number, userStockQuantity: number): OrderResult {
    if (!this.validate(userBalance, userStockQuantity)) {
      return {
        success: false,
        message: 'Insufficient stock quantity or invalid quantity'
      };
    }

    const executedPrice = this.stock.getPrice();
    const totalRevenue = this.calculateTotal();

    return {
      success: true,
      message: `stock sell successfully`,
      executedPrice,
      executedQuantity: this.quantity,
      totalCost: totalRevenue
    };
  }
}

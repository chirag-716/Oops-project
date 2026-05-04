import { Transaction, OrderType } from '../lib/Transaction';
import { jsonDb } from '../lib/JsonDb';

export class TransactionRepository {
  constructor() {}

  async findById(id: string): Promise<Transaction | null> {
    const transactionData = jsonDb.findById('transactions', id);
    return transactionData ? this.mapToDomain(transactionData) : null;
  }

  async findByUserId(userId: string, limit?: number): Promise<Transaction[]> {
    const transactions = jsonDb.getCollection('transactions');
    const userTransactions = transactions
      .filter(t => t.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    const limited = limit ? userTransactions.slice(0, limit) : userTransactions;
    return limited.map(transaction => this.mapToDomain(transaction));
  }

  async findByStockId(stockId: string, limit?: number): Promise<Transaction[]> {
    const transactions = jsonDb.getCollection('transactions');
    const stockTransactions = transactions
      .filter(t => t.stockId === stockId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    const limited = limit ? stockTransactions.slice(0, limit) : stockTransactions;
    return limited.map(transaction => this.mapToDomain(transaction));
  }

  async findByType(type: OrderType, limit?: number): Promise<Transaction[]> {
    const transactions = jsonDb.getCollection('transactions');
    const typeTransactions = transactions
      .filter(t => t.type === type)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    const limited = limit ? typeTransactions.slice(0, limit) : typeTransactions;
    return limited.map(transaction => this.mapToDomain(transaction));
  }

  async create(data: {
    userId: string;
    stockId: string;
    type: OrderType;
    price: number;
    quantity: number;
    total: number;
  }, saveImmediately: boolean = true): Promise<Transaction> {
    const newTransactionData = jsonDb.insert('transactions', {
      userId: data.userId,
      stockId: data.stockId,
      type: data.type,
      price: data.price,
      quantity: data.quantity,
      total: data.total,
      createdAt: new Date().toISOString()
    }, saveImmediately);

    return this.mapToDomain(newTransactionData);
  }

  async createBuyTransaction(
    userId: string,
    stockId: string,
    price: number,
    quantity: number
  ): Promise<Transaction> {
    const total = price * quantity;
    return this.create({
      userId,
      stockId,
      type: OrderType.BUY,
      price,
      quantity,
      total
    });
  }

  async createSellTransaction(
    userId: string,
    stockId: string,
    price: number,
    quantity: number
  ): Promise<Transaction> {
    const total = price * quantity;
    return this.create({
      userId,
      stockId,
      type: OrderType.SELL,
      price,
      quantity,
      total
    });
  }

  async getTransactionsByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Transaction[]> {
    const transactions = jsonDb.getCollection('transactions');
    const filtered = transactions.filter(t => {
      const createdAt = new Date(t.createdAt);
      return t.userId === userId && createdAt >= startDate && createdAt <= endDate;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return filtered.map(transaction => this.mapToDomain(transaction));
  }

  async getUserTransactionStats(userId: string): Promise<{
    totalTransactions: number;
    buyTransactions: number;
    sellTransactions: number;
    totalVolume: number;
  }> {
    const transactions = jsonDb.getCollection('transactions').filter(t => t.userId === userId);

    const buyTransactions = transactions.filter(t => t.type === OrderType.BUY).length;
    const sellTransactions = transactions.filter(t => t.type === OrderType.SELL).length;
    const totalVolume = transactions.reduce((sum, t) => sum + t.total, 0);

    return {
      totalTransactions: transactions.length,
      buyTransactions,
      sellTransactions,
      totalVolume
    };
  }

  async delete(id: string): Promise<boolean> {
    return jsonDb.delete('transactions', id);
  }

  async deleteByUserId(userId: string): Promise<boolean> {
    const transactions = jsonDb.getCollection('transactions');
    const filtered = transactions.filter(t => t.userId !== userId);
    if (filtered.length !== transactions.length) {
      jsonDb.updateCollection('transactions', filtered);
      return true;
    }
    return false;
  }

  private mapToDomain(transactionData: any): Transaction {
    return new Transaction(
      transactionData.id,
      transactionData.userId,
      transactionData.stockId,
      transactionData.type as OrderType,
      transactionData.price,
      transactionData.quantity,
      transactionData.total,
      new Date(transactionData.createdAt)
    );
  }
}

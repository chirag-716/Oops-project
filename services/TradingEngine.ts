import { User } from '../lib/User';
import { Stock } from '../lib/Stock';
import { Portfolio } from '../lib/Portfolio';
import { Transaction } from '../lib/Transaction';
import { BuyOrder, SellOrder, OrderType, OrderResult } from '../lib/Order';

export interface TradingResult {
  success: boolean;
  message: string;
  updatedBalance?: number;
  portfolio?: Portfolio;
  transaction?: Transaction;
  priceUpdate?: {
    stockId: string;
    oldPrice: number;
    newPrice: number;
    changePercent: number;
  };
}

export interface MarketData {
  stocks: Stock[];
  timestamp: Date;
}

export class TradingEngine {
  private users: Map<string, User> = new Map();
  private stocks: Map<string, Stock> = new Map();
  private portfolios: Map<string, Portfolio> = new Map();
  private transactions: Transaction[] = [];

  constructor() {
    this.initializeEngine();
  }

  private initializeEngine(): void {
    // Initialize with empty data - will be populated by repositories
  }

  // User Management
  addUser(user: User): void {
    this.users.set(user.getId(), user);
  }

  getUser(userId: string): User | undefined {
    return this.users.get(userId);
  }

  updateUserBalance(userId: string, newBalance: number): void {
    const user = this.users.get(userId);
    if (user) {
      // Create a new user with updated balance
      const updatedUser = new User(
        user.getId(),
        user.getName(),
        user.getEmail(),
        newBalance,
        user.getCreatedAt()
      );
      this.users.set(userId, updatedUser);
    }
  }

  // Stock Management
  addStock(stock: Stock): void {
    this.stocks.set(stock.getId(), stock);
  }

  getStock(stockId: string): Stock | undefined {
    return this.stocks.get(stockId);
  }

  getAllStocks(): Stock[] {
    return Array.from(this.stocks.values());
  }

  updateStockPrice(stockId: string): { oldPrice: number; newPrice: number; changePercent: number } | null {
    const stock = this.stocks.get(stockId);
    if (!stock) return null;

    const oldPrice = stock.getPrice();
    const newPrice = stock.simulatePriceChange();
    const changePercent = stock.getPriceChangePercent(oldPrice);

    return { oldPrice, newPrice, changePercent };
  }

  simulateAllPrices(): Array<{ stockId: string; oldPrice: number; newPrice: number; changePercent: number }> {
    const updates: Array<{ stockId: string; oldPrice: number; newPrice: number; changePercent: number }> = [];

    this.stocks.forEach((stock, stockId) => {
      const update = this.updateStockPrice(stockId);
      if (update) {
        updates.push({ stockId, ...update });
      }
    });

    return updates;
  }

  // Portfolio Management
  addPortfolio(portfolio: Portfolio): void {
    this.portfolios.set(portfolio.getId(), portfolio);
  }

  getPortfolio(userId: string): Portfolio | undefined {
    return Array.from(this.portfolios.values()).find(p => p.getUserId() === userId);
  }

  createPortfolioForUser(userId: string, portfolioId: string): Portfolio {
    const portfolio = new Portfolio(portfolioId, userId);
    this.addPortfolio(portfolio);
    return portfolio;
  }

  // Transaction Management
  addTransaction(transaction: Transaction): void {
    this.transactions.push(transaction);
  }

  getTransactionsByUser(userId: string): Transaction[] {
    return this.transactions.filter(t => t.getUserId() === userId);
  }

  getTransactionsByStock(stockId: string): Transaction[] {
    return this.transactions.filter(t => t.getStockId() === stockId);
  }

  // Core Trading Logic
  async executeOrder(
    userId: string,
    stockId: string,
    orderType: OrderType,
    quantity: number
  ): Promise<TradingResult> {
    try {
      // Validate inputs
      if (!userId || !stockId || !orderType || quantity <= 0) {
        return {
          success: false,
          message: 'Invalid order parameters'
        };
      }

      // Get user and stock
      const user = this.getUser(userId);
      const stock = this.getStock(stockId);

      if (!user) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      if (!stock) {
        return {
          success: false,
          message: 'Stock not found'
        };
      }

      // Get or create portfolio
      let portfolio = this.getPortfolio(userId);
      if (!portfolio) {
        portfolio = this.createPortfolioForUser(userId, `portfolio_${userId}`);
      }

      // Simulate price change before execution
      const priceUpdate = this.updateStockPrice(stockId);
      const currentPrice = stock.getPrice();

      // Create order based on type
      let order: BuyOrder | SellOrder;
      let orderResult: OrderResult;

      if (orderType === OrderType.BUY) {
        order = new BuyOrder(userId, stock, quantity);
        orderResult = order.execute(user.getBalance(), portfolio.getStockQuantity(stockId));

        if (orderResult.success) {
          // Execute buy order
          const totalCost = orderResult.totalCost!;
          
          // Update user balance
          user.debit(totalCost);
          
          // Update portfolio
          portfolio.addStock(stock, quantity, currentPrice);
          
          // Create transaction
          const transaction = Transaction.createBuyTransaction(
            this.generateTransactionId(),
            userId,
            stockId,
            currentPrice,
            quantity
          );
          this.addTransaction(transaction);

          return {
            success: true,
            message: orderResult.message,
            updatedBalance: user.getBalance(),
            portfolio,
            transaction,
            priceUpdate: priceUpdate ? {
              stockId,
              oldPrice: priceUpdate.oldPrice,
              newPrice: priceUpdate.newPrice,
              changePercent: priceUpdate.changePercent
            } : undefined
          };
        }
      } else if (orderType === OrderType.SELL) {
        order = new SellOrder(userId, stock, quantity);
        orderResult = order.execute(user.getBalance(), portfolio.getStockQuantity(stockId));

        if (orderResult.success) {
          // Execute sell order
          const totalRevenue = orderResult.totalCost!;
          
          // Update user balance
          user.credit(totalRevenue);
          
          // Update portfolio
          portfolio.removeStock(stockId, quantity);
          
          // Create transaction
          const transaction = Transaction.createSellTransaction(
            this.generateTransactionId(),
            userId,
            stockId,
            currentPrice,
            quantity
          );
          this.addTransaction(transaction);

          return {
            success: true,
            message: orderResult.message,
            updatedBalance: user.getBalance(),
            portfolio,
            transaction,
            priceUpdate: priceUpdate ? {
              stockId,
              oldPrice: priceUpdate.oldPrice,
              newPrice: priceUpdate.newPrice,
              changePercent: priceUpdate.changePercent
            } : undefined
          };
        }
      } else {
        return {
          success: false,
          message: 'Invalid order type'
        };
      }

      // Return order failure result
      return {
        success: false,
        message: orderResult.message
      };

    } catch (error) {
      return {
        success: false,
        message: `Trading execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // Market Data
  getMarketData(): MarketData {
    return {
      stocks: this.getAllStocks(),
      timestamp: new Date()
    };
  }

  // Portfolio Analysis
  getPortfolioAnalysis(userId: string): Portfolio | null {
    const portfolio = this.getPortfolio(userId);
    if (!portfolio) return null;

    // Update portfolio with current stock prices
    const holdings = portfolio.getAllHoldings();
    holdings.forEach(holding => {
      const currentStock = this.getStock(holding.stock.getId());
      if (currentStock) {
        holding.stock.updatePrice(currentStock.getPrice());
      }
    });

    return portfolio;
  }

  // Utility Methods
  private generateTransactionId(): string {
    return `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Validation Methods
  validateBuyOrder(userId: string, stockId: string, quantity: number): { valid: boolean; message: string } {
    const user = this.getUser(userId);
    const stock = this.getStock(stockId);
    const portfolio = this.getPortfolio(userId);

    if (!user) {
      return { valid: false, message: 'User not found' };
    }

    if (!stock) {
      return { valid: false, message: 'Stock not found' };
    }

    if (quantity <= 0) {
      return { valid: false, message: 'Quantity must be positive' };
    }

    const totalCost = stock.getPrice() * quantity;
    if (!user.canAfford(totalCost)) {
      return { valid: false, message: 'Insufficient balance' };
    }

    return { valid: true, message: 'Buy order is valid' };
  }

  validateSellOrder(userId: string, stockId: string, quantity: number): { valid: boolean; message: string } {
    const user = this.getUser(userId);
    const stock = this.getStock(stockId);
    const portfolio = this.getPortfolio(userId);

    if (!user) {
      return { valid: false, message: 'User not found' };
    }

    if (!stock) {
      return { valid: false, message: 'Stock not found' };
    }

    if (quantity <= 0) {
      return { valid: false, message: 'Quantity must be positive' };
    }

    if (!portfolio) {
      return { valid: false, message: 'Portfolio not found' };
    }

    const currentQuantity = portfolio.getStockQuantity(stockId);
    if (currentQuantity < quantity) {
      return { valid: false, message: 'Insufficient stock quantity' };
    }

    return { valid: true, message: 'Sell order is valid' };
  }

  // Statistics
  getUserStats(userId: string): {
    balance: number;
    portfolioValue: number;
    totalValue: number;
    totalProfitLoss: number;
    transactionCount: number;
  } | null {
    const user = this.getUser(userId);
    const portfolio = this.getPortfolio(userId);
    const transactions = this.getTransactionsByUser(userId);

    if (!user) return null;

    const portfolioValue = portfolio ? portfolio.getTotalValue() : 0;
    const totalValue = user.getBalance() + portfolioValue;
    const totalProfitLoss = portfolio ? portfolio.getProfitLoss() : 0;

    return {
      balance: user.getBalance(),
      portfolioValue,
      totalValue,
      totalProfitLoss,
      transactionCount: transactions.length
    };
  }
}

import { Portfolio } from '../lib/Portfolio';
import { Stock } from '../lib/Stock';
import { jsonDb } from '../lib/JsonDb';

export class PortfolioRepository {
  constructor() {}

  async findById(id: string): Promise<Portfolio | null> {
    const portfolioData = jsonDb.findById('portfolios', id);
    if (!portfolioData) return null;

    const holdings = jsonDb.getCollection('holdings').filter(h => h.portfolioId === id);
    return this.mapToDomain({ ...portfolioData, holdings });
  }

  async findByUserId(userId: string): Promise<Portfolio | null> {
    const portfolios = jsonDb.getCollection('portfolios');
    const portfolioData = portfolios.find(p => p.userId === userId);
    if (!portfolioData) return null;

    const holdings = jsonDb.getCollection('holdings').filter(h => h.portfolioId === portfolioData.id);
    return this.mapToDomain({ ...portfolioData, holdings });
  }

  async create(userId: string): Promise<Portfolio> {
    const newPortfolioData = jsonDb.insert('portfolios', {
      userId,
      createdAt: new Date().toISOString()
    });

    return new Portfolio(newPortfolioData.id, newPortfolioData.userId, new Date(newPortfolioData.createdAt));
  }

  async addHolding(portfolioId: string, stockId: string, quantity: number, avgPrice: number, saveImmediately: boolean = true): Promise<void> {
    const holdings = jsonDb.getCollection('holdings');
    const index = holdings.findIndex(h => h.portfolioId === portfolioId && h.stockId === stockId);

    if (index !== -1) {
      const existingHolding = holdings[index];
      const totalCost = existingHolding.avgPrice * existingHolding.quantity + avgPrice * quantity;
      const totalQuantity = existingHolding.quantity + quantity;
      const newAvgPrice = totalCost / totalQuantity;

      existingHolding.quantity = totalQuantity;
      existingHolding.avgPrice = newAvgPrice;
      existingHolding.updatedAt = new Date().toISOString();
      
      jsonDb.updateCollection('holdings', holdings, saveImmediately);
    } else {
      jsonDb.insert('holdings', {
        portfolioId,
        stockId,
        quantity,
        avgPrice,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, saveImmediately);
    }
  }

  async removeHolding(portfolioId: string, stockId: string, quantity: number, saveImmediately: boolean = true): Promise<void> {
    const holdings = jsonDb.getCollection('holdings');
    const index = holdings.findIndex(h => h.portfolioId === portfolioId && h.stockId === stockId);

    if (index === -1) {
      throw new Error('Holding not found');
    }

    const existingHolding = holdings[index];
    if (quantity >= existingHolding.quantity) {
      holdings.splice(index, 1);
    } else {
      existingHolding.quantity -= quantity;
      existingHolding.updatedAt = new Date().toISOString();
    }
    
    jsonDb.updateCollection('holdings', holdings, saveImmediately);
  }

  async updateHolding(portfolioId: string, stockId: string, quantity: number, avgPrice: number, saveImmediately: boolean = true): Promise<void> {
    const holdings = jsonDb.getCollection('holdings');
    const index = holdings.findIndex(h => h.portfolioId === portfolioId && h.stockId === stockId);

    if (index !== -1) {
      holdings[index] = {
        ...holdings[index],
        quantity,
        avgPrice,
        updatedAt: new Date().toISOString()
      };
      jsonDb.updateCollection('holdings', holdings, saveImmediately);
    } else {
      jsonDb.insert('holdings', {
        portfolioId,
        stockId,
        quantity,
        avgPrice,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, saveImmediately);
    }
  }

  async getHoldings(portfolioId: string): Promise<Array<{ stock: Stock; quantity: number; avgPrice: number }>> {
    const holdings = jsonDb.getCollection('holdings').filter(h => h.portfolioId === portfolioId);
    const stocks = jsonDb.getCollection('stocks');

    return holdings.map(holding => {
      const stockData = stocks.find(s => s.id === holding.stockId);
      return {
        stock: new Stock(
          stockData.id,
          stockData.symbol,
          stockData.name,
          stockData.price,
          stockData.volatility,
          new Date(stockData.createdAt)
        ),
        quantity: holding.quantity,
        avgPrice: holding.avgPrice
      };
    });
  }

  async delete(id: string): Promise<boolean> {
    const result = jsonDb.delete('portfolios', id);
    if (result) {
      const holdings = jsonDb.getCollection('holdings').filter(h => h.portfolioId !== id);
      jsonDb.updateCollection('holdings', holdings);
    }
    return result;
  }

  private mapToDomain(portfolioData: any): Portfolio {
    const portfolio = new Portfolio(portfolioData.id, portfolioData.userId, new Date(portfolioData.createdAt));

    if (portfolioData.holdings) {
      const stocks = jsonDb.getCollection('stocks');
      portfolioData.holdings.forEach((holding: any) => {
        const stockData = stocks.find(s => s.id === holding.stockId);
        if (stockData) {
          const stock = new Stock(
            stockData.id,
            stockData.symbol,
            stockData.name,
            stockData.price,
            stockData.volatility,
            new Date(stockData.createdAt)
          );
          portfolio.addStock(stock, holding.quantity, holding.avgPrice);
        }
      });
    }

    return portfolio;
  }
}

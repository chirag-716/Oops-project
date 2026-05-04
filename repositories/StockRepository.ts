import { Stock } from '../lib/Stock';
import { jsonDb } from '../lib/JsonDb';

export class StockRepository {
  constructor() {}

  async findById(id: string): Promise<Stock | null> {
    const stockData = jsonDb.findById('stocks', id);
    return stockData ? this.mapToDomain(stockData) : null;
  }

  async findBySymbol(symbol: string): Promise<Stock | null> {
    const stocks = jsonDb.getCollection('stocks');
    const stockData = stocks.find(s => s.symbol === symbol);
    return stockData ? this.mapToDomain(stockData) : null;
  }

  async findAll(): Promise<Stock[]> {
    const stocks = jsonDb.getCollection('stocks');
    return stocks.map(stock => this.mapToDomain(stock));
  }

  async create(data: {
    symbol: string;
    name: string;
    price: number;
    volatility: number;
  }): Promise<Stock> {
    const newStockData = jsonDb.insert('stocks', {
      ...data,
      createdAt: new Date().toISOString()
    });

    return this.mapToDomain(newStockData);
  }

  async updatePrice(id: string, newPrice: number, saveImmediately: boolean = true): Promise<Stock | null> {
    const updatedData = jsonDb.update('stocks', id, { price: newPrice }, saveImmediately);
    return updatedData ? this.mapToDomain(updatedData) : null;
  }

  async updatePriceBySymbol(symbol: string, newPrice: number, saveImmediately: boolean = true): Promise<Stock | null> {
    const stock = await this.findBySymbol(symbol);
    if (!stock) return null;
    return this.updatePrice(stock.getId(), newPrice, saveImmediately);
  }

  async delete(id: string): Promise<boolean> {
    return jsonDb.delete('stocks', id);
  }

  async addPriceHistory(stockId: string, price: number, saveImmediately: boolean = true): Promise<void> {
    jsonDb.insert('priceHistory', {
      stockId,
      price,
      timestamp: new Date().toISOString()
    }, saveImmediately);
  }

  async save(): Promise<void> {
    jsonDb.save();
  }

  async getPriceHistory(stockId: string, limit?: number): Promise<Array<{ price: number; timestamp: Date }>> {
    const history = jsonDb.getCollection('priceHistory');
    const stockHistory = history
      .filter(h => h.stockId === stockId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit || 100);

    return stockHistory.map(entry => ({
      price: entry.price,
      timestamp: new Date(entry.timestamp)
    }));
  }

  async getLatestPriceHistory(stockId: string, hours: number = 24): Promise<Array<{ price: number; timestamp: Date }>> {
    const since = new Date();
    since.setHours(since.getHours() - hours);

    const history = jsonDb.getCollection('priceHistory');
    const stockHistory = history
      .filter(h => h.stockId === stockId && new Date(h.timestamp) >= since)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    return stockHistory.map(entry => ({
      price: entry.price,
      timestamp: new Date(entry.timestamp)
    }));
  }

  private mapToDomain(stockData: any): Stock {
    return new Stock(
      stockData.id,
      stockData.symbol,
      stockData.name,
      stockData.price,
      stockData.volatility,
      new Date(stockData.createdAt)
    );
  }
}

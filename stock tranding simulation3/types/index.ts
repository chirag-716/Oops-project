export enum OrderType {
  BUY = 'BUY',
  SELL = 'SELL'
}

export interface Stock {
  id: string;
  symbol: string;
  name: string;
  price: number;
  volatility: number;
  createdAt: string;
  previousPrice?: number;
  changePercent?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
  createdAt: string;
}

export interface Holding {
  stock: Stock;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
}

export interface Portfolio {
  id: string;
  userId: string;
  holdings: Holding[];
  totalValue: number;
  totalCost: number;
  totalProfitLoss: number;
  totalProfitLossPercent: number;
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  stockId: string;
  type: OrderType;
  price: number;
  quantity: number;
  total: number;
  createdAt: string;
  stock?: Stock;
}

export interface TradingRequest {
  userId: string;
  stockId: string;
  type: OrderType;
  quantity: number;
}

export interface TradingResponse {
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
  timestamp: string;
}

export interface PortfolioSummary {
  totalValue: number;
  totalCost: number;
  totalProfitLoss: number;
  totalProfitLossPercent: number;
  holdings: Holding[];
}

export interface UserStats {
  balance: number;
  portfolioValue: number;
  totalValue: number;
  totalProfitLoss: number;
  transactionCount: number;
}

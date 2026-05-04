import { NextRequest, NextResponse } from 'next/server';
import { TradingEngine, TradingResult } from '../../../services/TradingEngine';
import { UserRepository } from '../../../repositories/UserRepository';
import { StockRepository } from '../../../repositories/StockRepository';
import { PortfolioRepository } from '../../../repositories/PortfolioRepository';
import { TransactionRepository } from '../../../repositories/TransactionRepository';
import { OrderType } from '../../../lib/Order';
import { TradingRequest, TradingResponse } from '../../../types';
import { jsonDb } from '../../../lib/JsonDb';

export async function POST(request: NextRequest): Promise<NextResponse<TradingResponse>> {
  try {
    const body: TradingRequest = await request.json();

    // Validate request
    if (!body.userId || !body.stockId || !body.type || !body.quantity) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Missing required fields: userId, stockId, type, quantity' 
        },
        { status: 400 }
      );
    }

    if (!Object.values(OrderType).includes(body.type)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid order type. Must be BUY or SELL' 
        },
        { status: 400 }
      );
    }

    if (body.quantity <= 0 || !Number.isInteger(body.quantity)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Quantity must be a positive integer' 
        },
        { status: 400 }
      );
    }

    // Initialize repositories
    const userRepository = new UserRepository();
    const stockRepository = new StockRepository();
    const portfolioRepository = new PortfolioRepository();
    const transactionRepository = new TransactionRepository();

    // Initialize trading engine
    const tradingEngine = new TradingEngine();

    // Load data into engine
    const user = await userRepository.findById(body.userId);
    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'User not found' 
        },
        { status: 404 }
      );
    }

    const stock = await stockRepository.findById(body.stockId);
    if (!stock) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Stock not found' 
        },
        { status: 404 }
      );
    }

    // Get or create portfolio
    let portfolio = await portfolioRepository.findByUserId(body.userId);
    if (!portfolio) {
      portfolio = await portfolioRepository.create(body.userId);
    }

    // Load data into engine
    tradingEngine.addUser(user);
    tradingEngine.addStock(stock);
    tradingEngine.addPortfolio(portfolio);

    // Load existing transactions
    const existingTransactions = await transactionRepository.findByUserId(body.userId);
    existingTransactions.forEach(tx => tradingEngine.addTransaction(tx));

    // Execute trade
    const result: TradingResult = await tradingEngine.executeOrder(
      body.userId,
      body.stockId,
      body.type,
      body.quantity
    );

    if (result.success) {
      // Persist changes in memory
      if (result.transaction) {
        await transactionRepository.create({
          userId: result.transaction.getUserId(),
          stockId: result.transaction.getStockId(),
          type: result.transaction.getType() as any,
          price: result.transaction.getPrice(),
          quantity: result.transaction.getQuantity(),
          total: result.transaction.getTotal()
        }, false);
      }

      await userRepository.updateBalance(user.getId(), user.getBalance(), false);

      if (body.type === OrderType.BUY) {
        await portfolioRepository.addHolding(
          portfolio.getId(),
          stock.getId(),
          body.quantity,
          stock.getPrice(),
          false
        );
      } else {
        await portfolioRepository.removeHolding(
          portfolio.getId(),
          stock.getId(),
          body.quantity,
          false
        );
      }

      // Save all changes to disk once
      await jsonDb.save();

      // Return updated state
      const updatedPortfolio = await portfolioRepository.findByUserId(body.userId);
      const holdings = await portfolioRepository.getHoldings(portfolio.getId());
      
      const updatedHoldings = await Promise.all(
        holdings.map(async (h) => {
          const currentStock = await stockRepository.findById(h.stock.getId());
          const currentPrice = currentStock ? currentStock.getPrice() : h.stock.getPrice();
          return {
            stock: {
              id: h.stock.getId(),
              symbol: h.stock.getSymbol(),
              name: h.stock.getName(),
              price: currentPrice,
              volatility: h.stock.getVolatility(),
              createdAt: h.stock.getCreatedAt().toISOString()
            },
            quantity: h.quantity,
            avgPrice: h.avgPrice,
            currentPrice
          };
        })
      );

      const totalValue = updatedHoldings.reduce((sum, h) => sum + (h.currentPrice * h.quantity), 0);
      const totalCost = updatedHoldings.reduce((sum, h) => sum + (h.avgPrice * h.quantity), 0);

      return NextResponse.json({
        success: true,
        message: result.message,
        updatedBalance: user.getBalance(),
        portfolio: updatedPortfolio ? {
          id: updatedPortfolio.getId(),
          userId: updatedPortfolio.getUserId(),
          holdings: updatedHoldings,
          totalValue,
          totalCost,
          totalProfitLoss: totalValue - totalCost,
          totalProfitLossPercent: totalCost > 0 ? ((totalValue - totalCost) / totalCost) * 100 : 0,
          createdAt: updatedPortfolio.getCreatedAt().toISOString()
        } : undefined
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          message: result.message 
        },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Error executing trade:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to execute trade' 
      },
      { status: 500 }
    );
  }
}

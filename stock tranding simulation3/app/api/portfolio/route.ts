import { NextRequest, NextResponse } from 'next/server';
import { PortfolioRepository } from '../../../repositories/PortfolioRepository';
import { StockRepository } from '../../../repositories/StockRepository';
import { UserRepository } from '../../../repositories/UserRepository';
import { Portfolio } from '../../../types';

export async function GET(request: NextRequest): Promise<NextResponse<{ success: boolean; data?: Portfolio | null; error?: string }>> {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'userId parameter is required' 
        },
        { status: 400 }
      );
    }

    const portfolioRepository = new PortfolioRepository();
    const stockRepository = new StockRepository();
    const userRepository = new UserRepository();

    // Get user
    const user = await userRepository.findById(userId);
    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'User not found' 
        },
        { status: 404 }
      );
    }

    // Get or create portfolio
    let portfolio = await portfolioRepository.findByUserId(userId);
    if (!portfolio) {
      portfolio = await portfolioRepository.create(userId);
    }

    // Get holdings with current stock prices
    const holdings = await portfolioRepository.getHoldings(portfolio.getId());
    
    // Update stock prices and calculate current values
    const updatedHoldings = await Promise.all(
      holdings.map(async (holding) => {
        const currentStock = await stockRepository.findById(holding.stock.getId());
        const currentPrice = currentStock ? currentStock.getPrice() : holding.stock.getPrice();
        
        return {
          stock: {
            id: holding.stock.getId(),
            symbol: holding.stock.getSymbol(),
            name: holding.stock.getName(),
            price: currentPrice,
            volatility: holding.stock.getVolatility(),
            createdAt: holding.stock.getCreatedAt().toISOString()
          },
          quantity: holding.quantity,
          avgPrice: holding.avgPrice,
          currentPrice: currentPrice
        };
      })
    );

    // Calculate portfolio metrics
    const totalValue = updatedHoldings.reduce((sum, h) => sum + (h.currentPrice * h.quantity), 0);
    const totalCost = updatedHoldings.reduce((sum, h) => sum + (h.avgPrice * h.quantity), 0);
    const totalProfitLoss = totalValue - totalCost;
    const totalProfitLossPercent = totalCost > 0 ? (totalProfitLoss / totalCost) * 100 : 0;

    const portfolioData: Portfolio = {
      id: portfolio.getId(),
      userId: portfolio.getUserId(),
      holdings: updatedHoldings,
      totalValue,
      totalCost,
      totalProfitLoss,
      totalProfitLossPercent,
      createdAt: portfolio.getCreatedAt().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: portfolioData
    });

  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch portfolio data' 
      },
      { status: 500 }
    );
  }
}

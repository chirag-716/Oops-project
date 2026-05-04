import { NextRequest, NextResponse } from 'next/server';
import { StockRepository } from '../../../repositories/StockRepository';
import { Stock, MarketData } from '../../../types';

export async function GET(request: NextRequest): Promise<NextResponse<{ success: boolean; data?: MarketData; error?: string }>> {
  try {
    const stockRepository = new StockRepository();
    const stocks = await stockRepository.findAll();

    // Simulate price changes for all stocks
    const updatedStocks: Stock[] = stocks.map(stock => {
      const currentPrice = stock.getPrice();
      const newPrice = stock.simulatePriceChange();
      const changePercent = stock.getPriceChangePercent(currentPrice);
      
      // Update the stock price in memory, don't save yet
      stockRepository.updatePrice(stock.getId(), newPrice, false);
      
      return {
        id: stock.getId(),
        symbol: stock.getSymbol(),
        name: stock.getName(),
        price: newPrice,
        volatility: stock.getVolatility(),
        createdAt: stock.getCreatedAt().toISOString(),
        previousPrice: currentPrice,
        changePercent: changePercent
      };
    });

    // Add price history for each stock in memory
    for (const stock of stocks) {
      await stockRepository.addPriceHistory(stock.getId(), stock.getPrice(), false);
    }

    // Save all changes to disk once at the end
    await stockRepository.save();

    const marketData: MarketData = {
      stocks: updatedStocks,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: marketData
    });

  } catch (error) {
    console.error('Error fetching stocks:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch stocks data' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    
    if (!body.symbol || !body.name || !body.price || !body.volatility) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: symbol, name, price, volatility' 
        },
        { status: 400 }
      );
    }

    const stockRepository = new StockRepository();
    
    // Check if stock symbol already exists
    const existingStock = await stockRepository.findBySymbol(body.symbol);
    if (existingStock) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Stock with this symbol already exists' 
        },
        { status: 409 }
      );
    }

    const newStock = await stockRepository.create({
      symbol: body.symbol.toUpperCase(),
      name: body.name,
      price: parseFloat(body.price),
      volatility: parseFloat(body.volatility)
    });

    const stockData: Stock = {
      id: newStock.getId(),
      symbol: newStock.getSymbol(),
      name: newStock.getName(),
      price: newStock.getPrice(),
      volatility: newStock.getVolatility(),
      createdAt: newStock.getCreatedAt().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: stockData
    });

  } catch (error) {
    console.error('Error creating stock:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create stock' 
      },
      { status: 500 }
    );
  }
}

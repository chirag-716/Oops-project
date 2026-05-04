import { NextRequest, NextResponse } from 'next/server';
import { TransactionRepository } from '../../../repositories/TransactionRepository';
import { StockRepository } from '../../../repositories/StockRepository';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }

    const transactionRepository = new TransactionRepository();
    const stockRepository = new StockRepository();
    
    const transactions = await transactionRepository.findByUserId(userId, 20);
    
    // Enrich transactions with stock data
    const enrichedTransactions = await Promise.all(
      transactions.map(async (tx) => {
        const stock = await stockRepository.findById(tx.getStockId());
        return {
          id: tx.getId(),
          userId: tx.getUserId(),
          stockId: tx.getStockId(),
          type: tx.getType(),
          price: tx.getPrice(),
          quantity: tx.getQuantity(),
          total: tx.getTotal(),
          createdAt: tx.getCreatedAt().toISOString(),
          stock: stock ? {
            id: stock.getId(),
            symbol: stock.getSymbol(),
            name: stock.getName(),
            price: stock.getPrice(),
            volatility: stock.getVolatility(),
            createdAt: stock.getCreatedAt().toISOString()
          } : null
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: enrichedTransactions
    });

  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

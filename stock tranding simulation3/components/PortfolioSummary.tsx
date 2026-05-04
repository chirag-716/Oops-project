'use client';

import { Portfolio } from '@/types';

interface PortfolioSummaryProps {
  portfolio: Portfolio | null;
  userBalance: number;
}

export function PortfolioSummary({ portfolio, userBalance }: PortfolioSummaryProps) {
  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  const getProfitColor = (profit: number) => {
    if (profit > 0) return 'profit-positive';
    if (profit < 0) return 'profit-negative';
    return 'profit-neutral';
  };

  const totalValue = userBalance + (portfolio?.totalValue || 0);
  const totalProfitLoss = portfolio?.totalProfitLoss || 0;

  return (
    <div className="trading-card">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Portfolio Summary</h2>
      
      {!portfolio ? (
        <div className="text-center py-8 text-gray-500">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p className="text-sm">No portfolio yet</p>
          <p className="text-xs mt-2">Start trading to build your portfolio</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Overall Summary */}
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800 mb-1">Total Value</h3>
              <p className="text-2xl font-bold text-blue-600">
                ${formatPrice(totalValue)}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-1">Cash Balance</h3>
                <p className="text-lg font-bold text-gray-900">
                  ${formatPrice(userBalance)}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-1">Portfolio Value</h3>
                <p className="text-lg font-bold text-gray-900">
                  ${formatPrice(portfolio.totalValue)}
                </p>
              </div>
            </div>
          </div>

          {/* Profit/Loss Summary */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Performance</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total P&L:</span>
                <span className={`font-bold text-lg ${getProfitColor(totalProfitLoss)}`}>
                  {totalProfitLoss >= 0 ? '+' : ''}{formatPrice(totalProfitLoss)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Return %:</span>
                <span className={`font-medium ${getProfitColor(portfolio.totalProfitLossPercent)}`}>
                  {formatPercent(portfolio.totalProfitLossPercent)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Cost:</span>
                <span className="font-medium text-gray-900">
                  ${formatPrice(portfolio.totalCost)}
                </span>
              </div>
            </div>
          </div>

          {/* Holdings */}
          {portfolio.holdings.length > 0 && (
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Holdings ({portfolio.holdings.length})</h3>
              <div className="space-y-3">
                {portfolio.holdings.map((holding) => {
                  const profitLoss = (holding.currentPrice - holding.avgPrice) * holding.quantity;
                  const profitLossPercent = ((holding.currentPrice - holding.avgPrice) / holding.avgPrice) * 100;
                  const currentValue = holding.currentPrice * holding.quantity;
                  
                  return (
                    <div key={holding.stock.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">{holding.stock.symbol}</h4>
                          <p className="text-sm text-gray-600">{holding.stock.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            ${formatPrice(currentValue)}
                          </p>
                          <p className={`text-sm ${getProfitColor(profitLoss)}`}>
                            {profitLoss >= 0 ? '+' : ''}{formatPrice(profitLoss)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                        <div>
                          <span>Qty: {holding.quantity}</span>
                        </div>
                        <div>
                          <span>Avg: ${formatPrice(holding.avgPrice)}</span>
                        </div>
                        <div>
                          <span>Current: ${formatPrice(holding.currentPrice)}</span>
                        </div>
                      </div>
                      
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">Return:</span>
                          <span className={`text-xs font-medium ${getProfitColor(profitLossPercent)}`}>
                            {formatPercent(profitLossPercent)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

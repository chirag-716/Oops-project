'use client';

import { Stock } from '@/types';

interface MarketOverviewProps {
  stocks: Stock[];
  lastUpdate: Date;
  onRefresh: () => void;
}

export function MarketOverview({ stocks, lastUpdate, onRefresh }: MarketOverviewProps) {
  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  const getPriceColor = (changePercent?: number) => {
    if (!changePercent) return 'text-gray-600';
    return changePercent >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getPriceIcon = (changePercent?: number) => {
    if (!changePercent) return '';
    return changePercent >= 0 ? '▲' : '▼';
  };

  return (
    <div className="trading-card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Market Overview</h2>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </span>
          <button
            onClick={onRefresh}
            className="trading-button trading-button-secondary text-sm"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Market Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-blue-800 mb-1">Total Stocks</h3>
              <p className="text-2xl font-bold text-blue-600">{stocks.length}</p>
            </div>
            <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
              <span className="text-blue-600">📊</span>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-green-800 mb-1">Gainers</h3>
              <p className="text-2xl font-bold text-green-600">
                {stocks.filter(s => s.changePercent && s.changePercent > 0).length}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center">
              <span className="text-green-600">📈</span>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-red-800 mb-1">Losers</h3>
              <p className="text-2xl font-bold text-red-600">
                {stocks.filter(s => s.changePercent && s.changePercent < 0).length}
              </p>
            </div>
            <div className="w-10 h-10 bg-red-200 rounded-full flex items-center justify-center">
              <span className="text-red-600">📉</span>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-purple-800 mb-1">Market Cap</h3>
              <p className="text-2xl font-bold text-purple-600">
                ${(stocks.reduce((sum, s) => sum + s.price * 1000000, 0) / 1000000000).toFixed(1)}B
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center">
              <span className="text-purple-600">💎</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stock List */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Live Stock Prices</h3>
        {stocks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No stocks available</p>
          </div>
        ) : (
          <>
            <div className="lg:hidden space-y-3">
              {stocks.map((stock) => (
                <div key={stock.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-all duration-200">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        stock.changePercent && stock.changePercent > 0 
                          ? 'bg-green-500' 
                          : stock.changePercent && stock.changePercent < 0 
                          ? 'bg-red-500' 
                          : 'bg-gray-400'
                      }`}></div>
                      <div>
                        <div className="font-medium text-gray-900">{stock.symbol}</div>
                        <div className="text-sm text-gray-600">{stock.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">
                        ${formatPrice(stock.price)}
                      </div>
                      {stock.changePercent !== undefined ? (
                        <div className={`flex items-center ${getPriceColor(stock.changePercent)}`}>
                          <span className="mr-1 text-xs">{getPriceIcon(stock.changePercent)}</span>
                          <span className="font-medium text-xs">
                            {formatPercent(stock.changePercent)}
                          </span>
                        </div>
                      ) : (
                        <div className="text-gray-400 text-xs">-</div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">Volatility</div>
                    <div className="flex items-center space-x-2">
                      <div className="text-sm text-gray-600">
                        {(stock.volatility * 100).toFixed(1)}%
                      </div>
                      <div className={`w-8 h-2 rounded-full ${
                        stock.volatility > 0.04 ? 'bg-red-300' :
                        stock.volatility > 0.02 ? 'bg-yellow-300' : 'bg-green-300'
                      }`}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Symbol</th>
                  <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Name</th>
                  <th className="text-right py-2 px-3 text-sm font-medium text-gray-700">Price</th>
                  <th className="text-right py-2 px-3 text-sm font-medium text-gray-700">Change</th>
                  <th className="text-right py-2 px-3 text-sm font-medium text-gray-700">Volatility</th>
                </tr>
              </thead>
              <tbody>
                {stocks.map((stock) => (
                  <tr key={stock.id} className="stock-row hover:bg-gray-50 transition-all duration-200">
                    <td className="py-3 px-3">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          stock.changePercent && stock.changePercent > 0 
                            ? 'bg-green-500' 
                            : stock.changePercent && stock.changePercent < 0 
                            ? 'bg-red-500' 
                            : 'bg-gray-400'
                        }`}></div>
                        <div className="font-medium text-gray-900">{stock.symbol}</div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-sm text-gray-600">{stock.name}</div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="font-medium text-gray-900">
                        ${formatPrice(stock.price)}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {stock.changePercent !== undefined ? (
                        <div className={`flex items-center justify-end ${getPriceColor(stock.changePercent)}`}>
                          <span className="mr-1 text-sm">{getPriceIcon(stock.changePercent)}</span>
                          <span className="font-medium text-sm">
                            {formatPercent(stock.changePercent)}
                          </span>
                        </div>
                      ) : (
                        <div className="text-gray-400 text-sm">-</div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <div className="text-sm text-gray-600">
                          {(stock.volatility * 100).toFixed(1)}%
                        </div>
                        <div className={`w-8 h-2 rounded-full ${
                          stock.volatility > 0.04 ? 'bg-red-300' :
                          stock.volatility > 0.02 ? 'bg-yellow-300' : 'bg-green-300'
                        }`}></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </>
        )}
      </div>
    </div>
  );
}

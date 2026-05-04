'use client';

import { useState, useEffect } from 'react';

interface StockData {
  symbol: string;
  company: string;
  price: number;
  change: number;
  changePercent: number;
  sparkline: number[];
}

export default function WatchlistTable() {
  const [stocks, setStocks] = useState<StockData[]>([]);

  useEffect(() => {
    // Generate mock watchlist data
    const generateStockData = (): StockData[] => {
      return [
        {
          symbol: 'AAPL',
          company: 'Apple Inc.',
          price: 189.84,
          change: 2.34,
          changePercent: 1.25,
          sparkline: Array.from({ length: 20 }, () => 189.84 + (Math.random() - 0.5) * 4)
        },
        {
          symbol: 'GOOGL',
          company: 'Alphabet Inc.',
          price: 142.56,
          change: -1.23,
          changePercent: -0.85,
          sparkline: Array.from({ length: 20 }, () => 142.56 + (Math.random() - 0.5) * 3)
        },
        {
          symbol: 'MSFT',
          company: 'Microsoft Corp.',
          price: 378.91,
          change: 5.67,
          changePercent: 1.52,
          sparkline: Array.from({ length: 20 }, () => 378.91 + (Math.random() - 0.5) * 6)
        },
        {
          symbol: 'AMZN',
          company: 'Amazon.com Inc.',
          price: 156.78,
          change: -0.45,
          changePercent: -0.29,
          sparkline: Array.from({ length: 20 }, () => 156.78 + (Math.random() - 0.5) * 3)
        },
        {
          symbol: 'TSLA',
          company: 'Tesla Inc.',
          price: 234.56,
          change: 8.91,
          changePercent: 3.94,
          sparkline: Array.from({ length: 20 }, () => 234.56 + (Math.random() - 0.5) * 8)
        },
        {
          symbol: 'META',
          company: 'Meta Platforms',
          price: 487.23,
          change: -3.21,
          changePercent: -0.66,
          sparkline: Array.from({ length: 20 }, () => 487.23 + (Math.random() - 0.5) * 5)
        }
      ];
    };

    setStocks(generateStockData());

    // Simulate real-time updates
    const interval = setInterval(() => {
      setStocks(prev => 
        prev.map(stock => ({
          ...stock,
          price: stock.price + (Math.random() - 0.5) * stock.price * 0.002,
          change: stock.change + (Math.random() - 0.5) * 0.1,
          changePercent: stock.changePercent + (Math.random() - 0.5) * 0.05,
          sparkline: [
            ...stock.sparkline.slice(1),
            stock.price + (Math.random() - 0.5) * stock.price * 0.002
          ]
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const renderSparkline = (data: number[], isPositive: boolean) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((value - min) / range) * 100;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width="60" height="20" className="overflow-visible">
        <polyline
          points={points}
          fill="none"
          stroke={isPositive ? '#22C55E' : '#EF4444'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx="100"
          cy={100 - ((data[data.length - 1] - min) / range) * 100}
          r="2"
          fill={isPositive ? '#22C55E' : '#EF4444'}
        />
      </svg>
    );
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">Watchlist</h3>
        <button className="text-sm text-gray-400 hover:text-white transition-colors">
          ⚙️ Configure
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Symbol</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Company</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Price</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Change</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-gray-400">Sparkline</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock, index) => (
              <tr 
                key={stock.symbol}
                className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors cursor-pointer"
              >
                <td className="py-3 px-4">
                  <span className="font-medium text-white">{stock.symbol}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-gray-400">{stock.company}</span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="font-medium text-white">
                    ${stock.price.toFixed(2)}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className={`flex items-center justify-end space-x-1 ${
                    stock.change > 0 ? 'text-profit' : 'text-loss'
                  }`}>
                    <span className="text-sm">
                      {stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)}
                    </span>
                    <span className="text-xs">
                      ({stock.changePercent > 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex justify-center">
                    {renderSparkline(stock.sparkline, stock.change > 0)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Stock Button */}
      <div className="mt-4 flex justify-center">
        <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium">
          + Add Stock to Watchlist
        </button>
      </div>
    </div>
  );
}

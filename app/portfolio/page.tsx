'use client';

import { useState, useEffect } from 'react';

interface Position {
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
}

export default function PortfolioPage() {
  const [positions, setPositions] = useState<Position[]>([
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      quantity: 50,
      avgPrice: 185.50,
      currentPrice: 191.04,
      pnl: 277.00,
      pnlPercent: 2.99
    },
    {
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      quantity: 20,
      avgPrice: 155.00,
      currentPrice: 162.78,
      pnl: 155.60,
      pnlPercent: 5.02
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corp.',
      quantity: 30,
      avgPrice: 415.00,
      currentPrice: 429.63,
      pnl: 438.90,
      pnlPercent: 3.53
    }
  ]);

  const [totalValue, setTotalValue] = useState(125432.78);
  const [totalPnL, setTotalPnL] = useState(5432.78);
  const [totalPnLPercent, setTotalPnLPercent] = useState(4.53);

  useEffect(() => {
    // Simulate real-time price updates
    const interval = setInterval(() => {
      setPositions(prev => 
        prev.map(position => {
          const priceChange = (Math.random() - 0.5) * position.currentPrice * 0.002;
          const newPrice = position.currentPrice + priceChange;
          const newPnL = (newPrice - position.avgPrice) * position.quantity;
          const newPnLPercent = (newPnL / (position.avgPrice * position.quantity)) * 100;
          
          return {
            ...position,
            currentPrice: newPrice,
            pnl: newPnL,
            pnlPercent: newPnLPercent
          };
        })
      );
      
      setTotalValue(prev => prev + (Math.random() - 0.5) * 200);
      setTotalPnL(prev => prev + (Math.random() - 0.5) * 100);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="p-6">
        <h1 className="text-3xl font-bold text-white mb-8">Portfolio</h1>
        
        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card p-6">
            <h3 className="text-sm text-gray-400 mb-2">Total Value</h3>
            <p className="text-2xl font-bold text-white">
              ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="glass-card p-6">
            <h3 className="text-sm text-gray-400 mb-2">Total P&L</h3>
            <p className={`text-2xl font-bold ${totalPnL > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totalPnL > 0 ? '+' : ''}${totalPnL.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className={`text-sm ${totalPnLPercent > 0 ? 'text-green-400' : 'text-red-400'}`}>
              ({totalPnLPercent > 0 ? '+' : ''}{totalPnLPercent.toFixed(2)}%)
            </p>
          </div>
          <div className="glass-card p-6">
            <h3 className="text-sm text-gray-400 mb-2">Positions</h3>
            <p className="text-2xl font-bold text-white">{positions.length}</p>
          </div>
        </div>

        {/* Positions Table */}
        <div className="glass-card">
          <div className="p-6">
            <h2 className="text-xl font-bold text-white mb-6">Current Positions</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Symbol</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Name</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Quantity</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Avg Price</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Current Price</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">P&L</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">P&L %</th>
                  </tr>
                </thead>
                <tbody>
                  {positions.map((position, index) => (
                    <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-medium text-white">{position.symbol}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-400">{position.name}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-white">{position.quantity}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-white">${position.avgPrice.toFixed(2)}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-white">${position.currentPrice.toFixed(2)}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={`font-medium ${position.pnl > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {position.pnl > 0 ? '+' : ''}${position.pnl.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={`font-medium ${position.pnlPercent > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {position.pnlPercent > 0 ? '+' : ''}{position.pnlPercent.toFixed(2)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

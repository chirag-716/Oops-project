'use client';

import { useState, useEffect } from 'react';

interface MarketStock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  marketCap: string;
}

export default function MarketsPage() {
  const [selectedMarket, setSelectedMarket] = useState('stocks');
  const [stocks, setStocks] = useState<MarketStock[]>([
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: 191.04,
      change: 2.34,
      changePercent: 1.24,
      volume: '52.3M',
      marketCap: '2.98T'
    },
    {
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      price: 162.78,
      change: -1.23,
      changePercent: -0.75,
      volume: '28.7M',
      marketCap: '1.82T'
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corp.',
      price: 429.63,
      change: 5.67,
      changePercent: 1.34,
      volume: '31.2M',
      marketCap: '2.81T'
    },
    {
      symbol: 'AMZN',
      name: 'Amazon.com Inc.',
      price: 178.35,
      change: -0.45,
      changePercent: -0.25,
      volume: '45.8M',
      marketCap: '1.62T'
    },
    {
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      price: 242.84,
      change: 8.91,
      changePercent: 3.81,
      volume: '98.4M',
      marketCap: '746B'
    }
  ]);

  const [crypto, setCrypto] = useState<MarketStock[]>([
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      price: 67834.21,
      change: 1234.56,
      changePercent: 1.85,
      volume: '28.5B',
      marketCap: '1.32T'
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      price: 3456.78,
      change: -45.23,
      changePercent: -1.29,
      volume: '15.2B',
      marketCap: '415B'
    },
    {
      symbol: 'BNB',
      name: 'Binance Coin',
      price: 612.34,
      change: 5.67,
      changePercent: 0.93,
      volume: '1.8B',
      marketCap: '94B'
    }
  ]);

  useEffect(() => {
    // Simulate real-time price updates
    const interval = setInterval(() => {
      setStocks(prev => 
        prev.map(stock => ({
          ...stock,
          price: stock.price + (Math.random() - 0.5) * stock.price * 0.002,
          change: stock.change + (Math.random() - 0.5) * 0.5,
          changePercent: stock.changePercent + (Math.random() - 0.5) * 0.1
        }))
      );
      
      setCrypto(prev => 
        prev.map(coin => ({
          ...coin,
          price: coin.price + (Math.random() - 0.5) * coin.price * 0.003,
          change: coin.change + (Math.random() - 0.5) * 50,
          changePercent: coin.changePercent + (Math.random() - 0.5) * 0.2
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const currentData = selectedMarket === 'stocks' ? stocks : crypto;

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="p-6">
        <h1 className="text-3xl font-bold text-white mb-8">Markets</h1>
        
        {/* Market Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setSelectedMarket('stocks')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              selectedMarket === 'stocks'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            📈 Stocks
          </button>
          <button
            onClick={() => setSelectedMarket('crypto')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              selectedMarket === 'crypto'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            🪙 Crypto
          </button>
        </div>

        {/* Market Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glass-card p-6">
            <h3 className="text-sm text-gray-400 mb-2">Market Cap</h3>
            <p className="text-2xl font-bold text-white">
              {selectedMarket === 'stocks' ? '9.2T' : '1.2T'}
            </p>
          </div>
          <div className="glass-card p-6">
            <h3 className="text-sm text-gray-400 mb-2">24h Volume</h3>
            <p className="text-2xl font-bold text-white">
              {selectedMarket === 'stocks' ? '256B' : '45B'}
            </p>
          </div>
          <div className="glass-card p-6">
            <h3 className="text-sm text-gray-400 mb-2">Active Assets</h3>
            <p className="text-2xl font-bold text-white">{currentData.length}</p>
          </div>
          <div className="glass-card p-6">
            <h3 className="text-sm text-gray-400 mb-2">Market Trend</h3>
            <p className="text-2xl font-bold text-green-400">📈 Bullish</p>
          </div>
        </div>

        {/* Market Table */}
        <div className="glass-card">
          <div className="p-6">
            <h2 className="text-xl font-bold text-white mb-6">
              {selectedMarket === 'stocks' ? 'Stock Market' : 'Cryptocurrency Market'}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Symbol</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Name</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Price</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Change</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Change %</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Volume</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Market Cap</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((asset, index) => (
                    <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors cursor-pointer">
                      <td className="py-3 px-4">
                        <span className="font-medium text-white">{asset.symbol}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-400">{asset.name}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-white font-medium">
                          ${asset.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={`font-medium ${asset.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {asset.change > 0 ? '+' : ''}${asset.change.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className={`flex items-center justify-end space-x-1 ${
                          asset.changePercent > 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          <span className="text-xs">
                            {asset.changePercent > 0 ? '▲' : '▼'}
                          </span>
                          <span className="font-medium">
                            {Math.abs(asset.changePercent).toFixed(2)}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-gray-400">{asset.volume}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-gray-400">{asset.marketCap}</span>
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

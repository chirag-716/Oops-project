'use client';

import { useState, useEffect } from 'react';

interface CandlestickData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface Indicator {
  name: string;
  type: 'MA' | 'RSI' | 'MACD' | 'BB';
  color: string;
  enabled: boolean;
}

export default function ChartPanel() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const [selectedSymbol, setSelectedSymbol] = useState('BTC/USD');
  const [chartType, setChartType] = useState<'candles' | 'line' | 'area'>('candles');
  const [chartData, setChartData] = useState<CandlestickData[]>([]);
  const [indicators, setIndicators] = useState<Indicator[]>([
    { name: 'MA (20)', type: 'MA', color: '#3B82F6', enabled: true },
    { name: 'MA (50)', type: 'MA', color: '#8B5CF6', enabled: true },
    { name: 'RSI', type: 'RSI', color: '#F59E0B', enabled: false },
    { name: 'BB', type: 'BB', color: '#10B981', enabled: false },
  ]);

  const symbols = [
    { symbol: 'BTC/USD', price: 43256.78, change: 2.94 },
    { symbol: 'ETH/USD', price: 2834.56, change: -1.23 },
    { symbol: 'AAPL', price: 189.84, change: 1.25 },
    { symbol: 'GOOGL', price: 142.56, change: -0.85 },
  ];

  const timeframes = ['1M', '5M', '15M', '1H', '4H', '1D', '1W', '1M'];

  useEffect(() => {
    // Generate realistic candlestick data
    const generateCandlestickData = (): CandlestickData[] => {
      const data: CandlestickData[] = [];
      let basePrice = 43000;
      const dataPoints = selectedTimeframe === '1D' ? 96 : selectedTimeframe === '1W' ? 168 : selectedTimeframe === '1M' ? 720 : 50;
      
      for (let i = 0; i < dataPoints; i++) {
        const open = basePrice;
        const volatility = basePrice * 0.002; // 0.2% volatility
        const trend = Math.sin(i / 10) * 0.001; // Slight trend
        const randomWalk = (Math.random() - 0.5) * volatility;
        const close = open + randomWalk + (basePrice * trend);
        const high = Math.max(open, close) + Math.random() * volatility * 0.5;
        const low = Math.min(open, close) - Math.random() * volatility * 0.5;
        const volume = Math.random() * 1000000 + 500000;
        
        data.push({
          time: selectedTimeframe === '1D' ? `${Math.floor(i/4)}:${(i%4)*15}` : `${i}:00`,
          open,
          high,
          low,
          close,
          volume
        });
        
        basePrice = close;
      }
      
      return data;
    };

    setChartData(generateCandlestickData());
  }, [selectedTimeframe]);

  const currentSymbol = symbols.find(s => s.symbol === selectedSymbol);
  const isProfitable = currentSymbol?.change && currentSymbol.change > 0;

  const renderCandlestickChart = () => {
    if (chartData.length === 0) return null;

    const minPrice = Math.min(...chartData.map(d => d.low));
    const maxPrice = Math.max(...chartData.map(d => d.high));
    const priceRange = maxPrice - minPrice || 1;

    return (
      <div className="relative h-full">
        {/* Price Grid Lines */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-full border-t border-gray-800"
              style={{ 
                top: `${(i + 1) * 11.11}%`,
                opacity: i % 2 === 0 ? 0.3 : 0.1
              }}
            >
              <span className="absolute -left-12 -top-2 text-xs text-gray-500">
                ${(maxPrice - (priceRange * (i + 1) * 0.1111)).toFixed(0)}
              </span>
            </div>
          ))}
        </div>

        {/* Time Grid Lines */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute h-full border-l border-gray-800"
              style={{ 
                left: `${(i + 1) * 12.5}%`,
                opacity: 0.1
              }}
            />
          ))}
        </div>

        {/* Volume Bars */}
        <div className="absolute bottom-0 left-0 right-0 h-16 flex items-end justify-between px-1">
          {chartData.slice(-32).map((candle, index) => (
            <div
              key={index}
              className="flex-1 mx-0.5"
              style={{
                height: `${(candle.volume / 1500000) * 100}%`,
                backgroundColor: candle.close > candle.open ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'
              }}
            />
          ))}
        </div>

        {/* Candlesticks */}
        <div className="absolute bottom-16 left-0 right-0 h-full flex items-end justify-between px-1">
          {chartData.slice(-32).map((candle, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-end relative"
              style={{ height: '100%', minHeight: '20px' }}
            >
              {/* Wick */}
              <div
                className={`w-0.5 ${
                  candle.close > candle.open ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{
                  height: `${((candle.high - candle.low) / priceRange) * 80}%`,
                  position: 'absolute',
                  bottom: `${((candle.low - minPrice) / priceRange) * 80}%`
                }}
              />
              
              {/* Body */}
              <div
                className={`w-1 ${
                  candle.close > candle.open ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{
                  height: `${Math.abs(candle.close - candle.open) / priceRange * 80}%`,
                  minHeight: '2px',
                  position: 'absolute',
                  bottom: `${((Math.min(candle.open, candle.close) - minPrice) / priceRange) * 80}%`
                }}
              />
            </div>
          ))}
        </div>

        {/* Moving Averages */}
        {indicators.filter(ind => ind.enabled && ind.type === 'MA').map((ma, index) => (
          <div key={ma.name} className="absolute inset-0 pointer-events-none">
            <svg width="100%" height="100%" className="overflow-visible">
              <polyline
                points={chartData.slice(-32).map((candle, i) => {
                  const maValue = candle.close + (Math.random() - 0.5) * 100; // Mock MA calculation
                  const x = (i / 31) * 100;
                  const y = 100 - ((maValue - minPrice) / priceRange) * 80;
                  return `${x},${y}`;
                }).join(' ')}
                fill="none"
                stroke={ma.color}
                strokeWidth="2"
                opacity="0.8"
              />
            </svg>
          </div>
        ))}

        {/* Crosshair */}
        <div className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
          <div className="absolute w-full h-px bg-gray-400 top-1/2"></div>
          <div className="absolute h-full w-px bg-gray-400 left-1/2"></div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Advanced Chart Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center space-x-6">
          {/* Symbol Selector */}
          <div className="flex items-center space-x-4">
            <select
              value={selectedSymbol}
              onChange={(e) => setSelectedSymbol(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-white px-3 py-1 rounded text-sm"
            >
              {symbols.map(symbol => (
                <option key={symbol.symbol} value={symbol.symbol}>
                  {symbol.symbol}
                </option>
              ))}
            </select>
            
            <div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl font-bold text-white">
                  ${currentSymbol?.price.toLocaleString()}
                </span>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-md ${
                  isProfitable 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  <span className="text-sm font-bold">
                    {isProfitable ? '▲' : '▼'}
                  </span>
                  <span className="text-sm font-bold">
                    {Math.abs(currentSymbol?.change || 0).toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Chart Controls */}
        <div className="flex items-center space-x-4">
          {/* Chart Type */}
          <div className="flex bg-gray-800 rounded p-1">
            {['candles', 'line', 'area'].map(type => (
              <button
                key={type}
                onClick={() => setChartType(type as any)}
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                  chartType === type
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          {/* Timeframes */}
          <div className="flex space-x-1">
            {timeframes.map((timeframe) => (
              <button
                key={timeframe}
                onClick={() => setSelectedTimeframe(timeframe)}
                className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                  selectedTimeframe === timeframe
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {timeframe}
              </button>
            ))}
          </div>

          {/* Indicators Toggle */}
          <button className="text-xs text-gray-400 hover:text-white transition-colors">
            📈 Indicators
          </button>
        </div>
      </div>

      {/* Indicator Bar */}
      <div className="flex items-center space-x-4 px-4 py-2 border-b border-gray-800 bg-gray-900/50">
        {indicators.map(indicator => (
          <button
            key={indicator.name}
            onClick={() => setIndicators(prev => 
              prev.map(ind => 
                ind.name === indicator.name 
                  ? { ...ind, enabled: !ind.enabled }
                  : ind
              )
            )}
            className={`flex items-center space-x-2 px-3 py-1 rounded text-xs font-medium transition-all ${
              indicator.enabled
                ? 'bg-gray-800 text-white border border-gray-700'
                : 'bg-gray-900 text-gray-500 border border-gray-800'
            }`}
          >
            <div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: indicator.color }}
            />
            <span>{indicator.name}</span>
          </button>
        ))}
      </div>

      {/* Main Chart Area */}
      <div className="flex-1 p-4 relative">
        {renderCandlestickChart()}
        
        {/* Floating Toolbar */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <button className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
            📊
          </button>
          <button className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
            📐
          </button>
          <button className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
            🔍
          </button>
          <button className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
            ⚙️
          </button>
        </div>
      </div>

      {/* Advanced Footer */}
      <div className="flex items-center justify-between p-3 border-t border-gray-800 bg-gray-900/50">
        <div className="flex items-center space-x-6 text-xs text-gray-400">
          <div className="flex items-center space-x-2">
            <span>O:</span>
            <span className="text-white font-medium">{chartData[chartData.length - 1]?.open.toFixed(2)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>H:</span>
            <span className="text-white font-medium">{chartData[chartData.length - 1]?.high.toFixed(2)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>L:</span>
            <span className="text-white font-medium">{chartData[chartData.length - 1]?.low.toFixed(2)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>C:</span>
            <span className="text-white font-medium">{chartData[chartData.length - 1]?.close.toFixed(2)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>Vol:</span>
            <span className="text-white font-medium">
              {((chartData[chartData.length - 1]?.volume || 0) / 1000000).toFixed(2)}M
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="text-xs text-gray-400 hover:text-white transition-colors">
            🔄 Refresh
          </button>
          <button className="text-xs text-gray-400 hover:text-white transition-colors">
            📷 Screenshot
          </button>
          <button className="text-xs text-gray-400 hover:text-white transition-colors">
            🔗 Share
          </button>
        </div>
      </div>
    </div>
  );
}

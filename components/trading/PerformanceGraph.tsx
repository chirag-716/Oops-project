'use client';

import { useState, useEffect } from 'react';

interface PerformanceData {
  date: string;
  value: number;
}

export default function PerformanceGraph() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [totalReturn, setTotalReturn] = useState(0);

  const timeframes = ['1D', '1W', '1M', '3M', '1Y'];

  useEffect(() => {
    // Generate mock performance data
    const generatePerformanceData = (timeframe: string): PerformanceData[] => {
      const dataPoints = timeframe === '1D' ? 24 : timeframe === '1W' ? 7 : timeframe === '1M' ? 30 : timeframe === '3M' ? 90 : 365;
      const data: PerformanceData[] = [];
      let baseValue = 100000;
      
      for (let i = 0; i < dataPoints; i++) {
        const change = (Math.random() - 0.48) * baseValue * 0.02; // Slight upward bias
        baseValue += change;
        
        data.push({
          date: timeframe === '1D' ? `${i}:00` : `Day ${i}`,
          value: baseValue
        });
      }
      
      return data;
    };

    const data = generatePerformanceData(selectedTimeframe);
    setPerformanceData(data);
    
    // Calculate total return
    const initialValue = data[0]?.value || 100000;
    const currentValue = data[data.length - 1]?.value || 100000;
    const returnAmount = currentValue - initialValue;
    const returnPercentage = (returnAmount / initialValue) * 100;
    setTotalReturn(returnPercentage);
  }, [selectedTimeframe]);

  const renderLineChart = () => {
    if (performanceData.length === 0) return null;

    const minValue = Math.min(...performanceData.map(d => d.value));
    const maxValue = Math.max(...performanceData.map(d => d.value));
    const range = maxValue - minValue || 1;

    const points = performanceData.map((data, index) => {
      const x = (index / (performanceData.length - 1)) * 100;
      const y = 100 - ((data.value - minValue) / range) * 100;
      return `${x},${y}`;
    }).join(' ');

    // Create gradient area
    const areaPoints = `0,100 ${points} 100,100`;

    return (
      <svg width="100%" height="200" className="overflow-visible">
        {/* Grid Lines */}
        {[...Array(5)].map((_, i) => (
          <line
            key={i}
            x1="0"
            y1={`${(i + 1) * 20}%`}
            x2="100%"
            y2={`${(i + 1) * 20}%`}
            stroke="#374151"
            strokeWidth="1"
            opacity="0.3"
          />
        ))}

        {/* Area Fill */}
        <defs>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <polygon
          points={areaPoints}
          fill="url(#areaGradient)"
        />

        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke="#3B82F6"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Current Value Indicator */}
        <circle
          cx="100%"
          cy={100 - ((performanceData[performanceData.length - 1].value - minValue) / range) * 100}
          r="4"
          fill="#3B82F6"
        />
        <circle
          cx="100%"
          cy={100 - ((performanceData[performanceData.length - 1].value - minValue) / range) * 100}
          r="8"
          fill="#3B82F6"
          opacity="0.3"
        />
      </svg>
    );
  };

  const isProfitable = totalReturn > 0;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">Performance</h3>
        <div className="flex items-center space-x-2">
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
      </div>

      {/* Performance Summary */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">Total Return</p>
            <p className={`text-2xl font-bold ${isProfitable ? 'text-profit' : 'text-loss'}`}>
              {isProfitable ? '+' : ''}{totalReturn.toFixed(2)}%
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400 mb-1">Current Value</p>
            <p className="text-xl font-bold text-white">
              ${performanceData[performanceData.length - 1]?.value.toLocaleString('en-US', { 
                minimumFractionDigits: 0, 
                maximumFractionDigits: 0 
              }) || '100,000'}
            </p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="mb-6">
        {renderLineChart()}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-xs text-gray-400 mb-1">Best Day</p>
          <p className="text-sm font-bold text-profit">+2.34%</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1">Worst Day</p>
          <p className="text-sm font-bold text-loss">-1.67%</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1">Volatility</p>
          <p className="text-sm font-bold text-white">12.5%</p>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-4 pt-4 border-t border-gray-800">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Sharpe Ratio: 1.23</span>
          <span>Max Drawdown: -8.4%</span>
        </div>
      </div>
    </div>
  );
}

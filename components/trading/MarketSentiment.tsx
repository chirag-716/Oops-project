'use client';

import { useState, useEffect } from 'react';

export default function MarketSentiment() {
  const [sentiment, setSentiment] = useState(65); // Bullish percentage
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Simulate real-time sentiment changes
    const interval = setInterval(() => {
      setSentiment(prev => {
        const change = (Math.random() - 0.5) * 5;
        const newValue = prev + change;
        return Math.max(0, Math.min(100, newValue));
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const isBullish = sentiment > 50;
  const gaugeRotation = (sentiment / 100) * 180 - 90; // Convert to degrees (-90 to 90)

  return (
    <div className="p-6">
      <h3 className="text-lg font-bold text-white mb-6">Market Sentiment</h3>
      
      {/* Circular Gauge */}
      <div className="relative w-48 h-48 mx-auto mb-6">
        {/* Gauge Background */}
        <div className="absolute inset-0 rounded-full border-8 border-gray-800"></div>
        
        {/* Gauge Progress */}
        <div 
          className="absolute inset-0 rounded-full border-8 transition-all duration-1000 ease-out"
          style={{
            borderColor: isBullish ? '#22C55E' : '#EF4444',
            borderRightColor: '#374151',
            borderBottomColor: '#374151',
            transform: `rotate(${gaugeRotation}deg)`,
            transformOrigin: 'center'
          }}
        ></div>
        
        {/* Center Circle */}
        <div className="absolute inset-4 rounded-full bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <p className={`text-3xl font-bold ${isBullish ? 'text-profit' : 'text-loss'}`}>
              {sentiment.toFixed(0)}%
            </p>
            <p className={`text-sm font-medium ${isBullish ? 'text-green-400' : 'text-red-400'}`}>
              {isBullish ? 'Bullish' : 'Bearish'}
            </p>
          </div>
        </div>

        {/* Glow Effect */}
        {isBullish ? (
          <div className="absolute inset-0 rounded-full glow-green animate-pulse-glow"></div>
        ) : (
          <div className="absolute inset-0 rounded-full glow-red animate-pulse-glow"></div>
        )}
      </div>

      {/* Sentiment Indicators */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-400">Bullish</span>
          </div>
          <p className="text-xl font-bold text-profit">
            {sentiment.toFixed(1)}%
          </p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-400">Bearish</span>
          </div>
          <p className="text-xl font-bold text-loss">
            {(100 - sentiment).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Market Indicators */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Fear & Greed</span>
          <span className="text-sm font-medium text-white">72</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full"
            style={{ width: '72%' }}
          />
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Volume</span>
          <span className="text-sm font-medium text-white">High</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }} />
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Volatility</span>
          <span className="text-sm font-medium text-white">Medium</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div className="bg-purple-500 h-2 rounded-full" style={{ width: '45%' }} />
        </div>
      </div>

      {/* Update Time */}
      <div className="text-center mt-4 pt-4 border-t border-gray-800">
        <p className="text-xs text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}

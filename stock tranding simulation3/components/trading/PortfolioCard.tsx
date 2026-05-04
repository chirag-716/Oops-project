'use client';

import { useState, useEffect } from 'react';

interface PortfolioMetrics {
  totalBalance: number;
  dailyPL: number;
  weeklyPL: number;
  monthlyPL: number;
  yoyPL: number;
  buyingPower: number;
  investedAmount: number;
  totalReturns: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  positions: number;
  orders: number;
}

export default function PortfolioCard() {
  const [metrics, setMetrics] = useState<PortfolioMetrics>({
    totalBalance: 125432.78,
    dailyPL: 2345.67,
    weeklyPL: 8234.12,
    monthlyPL: 15678.90,
    yoyPL: 45678.34,
    buyingPower: 45678.90,
    investedAmount: 80000,
    totalReturns: 45432.78,
    sharpeRatio: 1.85,
    maxDrawdown: -8.4,
    winRate: 68.5,
    positions: 12,
    orders: 156
  });
  const [changingMetrics, setChangingMetrics] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Simulate realistic real-time updates with market movements
    const interval = setInterval(() => {
      setMetrics(prev => {
        // Simulate market volatility with realistic ranges
        const dailyVolatility = (Math.random() - 0.48) * 200; // Slight upward bias
        const weeklyVolatility = (Math.random() - 0.5) * 500;
        const monthlyVolatility = (Math.random() - 0.5) * 1000;
        const yoyVolatility = (Math.random() - 0.5) * 2000;
        
        // Calculate new values with realistic constraints
        const newDailyPL = Math.max(-5000, Math.min(10000, prev.dailyPL + dailyVolatility));
        const newWeeklyPL = Math.max(-10000, Math.min(25000, prev.weeklyPL + weeklyVolatility));
        const newMonthlyPL = Math.max(-20000, Math.min(50000, prev.monthlyPL + monthlyVolatility));
        const newYoyPL = Math.max(-30000, Math.min(80000, prev.yoyPL + yoyVolatility));
        
        // Update total balance based on daily changes
        const newTotalBalance = prev.investedAmount + newYoyPL;
        
        // Update total returns
        const newTotalReturns = newTotalBalance - prev.investedAmount;
        
        // Simulate Sharpe Ratio changes (typically ranges from -2 to 4)
        const newSharpeRatio = Math.max(-2, Math.min(4, prev.sharpeRatio + (Math.random() - 0.5) * 0.1));
        
        // Update win rate (typically ranges from 30% to 80%)
        const newWinRate = Math.max(30, Math.min(80, prev.winRate + (Math.random() - 0.5) * 2));
        
        // Update max drawdown (typically ranges from -20% to -2%)
        const newMaxDrawdown = Math.max(-20, Math.min(-2, prev.maxDrawdown + (Math.random() - 0.5) * 0.5));
        
        // Update buying power based on total balance
        const newBuyingPower = newTotalBalance * 0.35; // 35% of total as available margin
        
        // Simulate order count changes
        const newOrders = Math.max(0, prev.orders + Math.floor((Math.random() - 0.3) * 2));
        
        const newMetrics = {
          ...prev,
          totalBalance: newTotalBalance,
          dailyPL: newDailyPL,
          weeklyPL: newWeeklyPL,
          monthlyPL: newMonthlyPL,
          yoyPL: newYoyPL,
          totalReturns: newTotalReturns,
          buyingPower: newBuyingPower,
          sharpeRatio: newSharpeRatio,
          winRate: newWinRate,
          maxDrawdown: newMaxDrawdown,
          orders: newOrders
        };
        
        // Track which metrics changed for animation
        const changed = new Set<string>();
        if (Math.abs(newDailyPL - prev.dailyPL) > 10) changed.add('daily');
        if (Math.abs(newWeeklyPL - prev.weeklyPL) > 50) changed.add('weekly');
        if (Math.abs(newMonthlyPL - prev.monthlyPL) > 100) changed.add('monthly');
        if (Math.abs(newYoyPL - prev.yoyPL) > 200) changed.add('yoy');
        
        setChangingMetrics(changed);
        setTimeout(() => setChangingMetrics(new Set()), 300); // Remove animation after 300ms
        
        return newMetrics;
      });
    }, 1500); // Update every 1.5 seconds for more dynamic feel

    return () => clearInterval(interval);
  }, []);

  const returnPercentage = (metrics.totalReturns / metrics.investedAmount) * 100;
  const yoyReturnPercentage = (metrics.yoyPL / metrics.investedAmount) * 100;

  const MetricCard = ({ title, value, change, isPositive, isChanging }: {
    title: string;
    value: string;
    change?: number;
    isPositive?: boolean;
    isChanging?: boolean;
  }) => (
    <div className={`p-3 bg-gray-800/50 rounded-lg border border-gray-700/50 transition-all duration-300 ${
      isChanging ? 'scale-105 border-blue-500' : ''
    }`}>
      <p className="text-xs text-gray-400 mb-1">{title}</p>
      <p className="text-lg font-bold text-white">{value}</p>
      {change !== undefined && (
        <div className={`flex items-center space-x-1 mt-1 ${
          isPositive ? 'text-green-400' : 'text-red-400'
        }`}>
          <span className={`text-xs ${isChanging ? 'animate-pulse' : ''}`}>
            {isPositive ? '▲' : '▼'}
          </span>
          <span className="text-xs font-medium">
            {Math.abs(change).toFixed(2)}%
          </span>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">Portfolio Summary</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-glow"></div>
          <span className="text-xs text-green-400">Live</span>
        </div>
      </div>
      
      {/* Total Balance */}
      <div className="mb-6">
        <p className="text-sm text-gray-400 mb-2">Total Portfolio Value</p>
        <p className="text-3xl font-bold text-white">
          ${metrics.totalBalance.toLocaleString('en-US', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
          })}
        </p>
        <div className="flex items-center space-x-3 mt-2">
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-md ${
            returnPercentage > 0 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            <span className="text-xs font-bold">
              {returnPercentage > 0 ? '▲' : '▼'}
            </span>
            <span className="text-xs font-bold">
              {Math.abs(returnPercentage).toFixed(2)}%
            </span>
          </div>
          <span className="text-xs text-gray-400">
            Total Returns: ${metrics.totalReturns.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Performance Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <MetricCard
          title="Today"
          value={`$${Math.abs(metrics.dailyPL).toLocaleString()}`}
          change={(metrics.dailyPL / (metrics.totalBalance - metrics.dailyPL)) * 100}
          isPositive={metrics.dailyPL > 0}
          isChanging={changingMetrics.has('daily')}
        />
        <MetricCard
          title="This Week"
          value={`$${Math.abs(metrics.weeklyPL).toLocaleString()}`}
          change={(metrics.weeklyPL / metrics.investedAmount) * 100}
          isPositive={metrics.weeklyPL > 0}
          isChanging={changingMetrics.has('weekly')}
        />
        <MetricCard
          title="This Month"
          value={`$${Math.abs(metrics.monthlyPL).toLocaleString()}`}
          change={(metrics.monthlyPL / metrics.investedAmount) * 100}
          isPositive={metrics.monthlyPL > 0}
          isChanging={changingMetrics.has('monthly')}
        />
        <MetricCard
          title="Year over Year"
          value={`$${Math.abs(metrics.yoyPL).toLocaleString()}`}
          change={yoyReturnPercentage}
          isPositive={metrics.yoyPL > 0}
          isChanging={changingMetrics.has('yoy')}
        />
      </div>

      {/* Advanced Metrics */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg border border-blue-800/30">
        <h4 className="text-sm font-medium text-white mb-3">Performance Metrics</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex justify-between">
            <span className="text-xs text-gray-400">Sharpe Ratio</span>
            <span className="text-xs font-bold text-white">{metrics.sharpeRatio}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-gray-400">Max Drawdown</span>
            <span className="text-xs font-bold text-red-400">{metrics.maxDrawdown}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-gray-400">Win Rate</span>
            <span className="text-xs font-bold text-green-400">{metrics.winRate}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-gray-400">Total Trades</span>
            <span className="text-xs font-bold text-white">{metrics.orders}</span>
          </div>
        </div>
      </div>

      {/* Buying Power */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm text-gray-400">Available Margin</p>
          <p className="text-xs text-gray-500">
            {((metrics.buyingPower / metrics.totalBalance) * 100).toFixed(1)}% of portfolio
          </p>
        </div>
        <p className="text-xl font-bold text-white mb-2">
          ${metrics.buyingPower.toLocaleString('en-US', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
          })}
        </p>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(metrics.buyingPower / metrics.totalBalance) * 100}%` }}
          />
        </div>
      </div>

      {/* Positions Summary */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-800">
        <div>
          <p className="text-xs text-gray-400">Open Positions</p>
          <p className="text-lg font-bold text-white">{metrics.positions}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Active Orders</p>
          <p className="text-lg font-bold text-white">{metrics.orders}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 mt-6">
        <button className="flex-1 btn-success text-sm font-medium">
          💰 Add Funds
        </button>
        <button className="flex-1 bg-gray-800 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium">
          📊 Detailed Report
        </button>
      </div>
    </div>
  );
}

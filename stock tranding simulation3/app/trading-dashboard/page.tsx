'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/trading/Navbar';
import Sidebar from '@/components/trading/Sidebar';
import ChartPanel from '@/components/trading/ChartPanel';
import PortfolioCard from '@/components/trading/PortfolioCard';
import MarketSentiment from '@/components/trading/MarketSentiment';
import WatchlistTable from '@/components/trading/WatchlistTable';
import TradePanel from '@/components/trading/TradePanel';
import PerformanceGraph from '@/components/trading/PerformanceGraph';

export default function TradingDashboard() {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar - Hidden on mobile unless open */}
      <div className={`${isMobile ? 'fixed inset-0 z-50' : 'relative'} ${
        isMobile && !sidebarOpen ? 'hidden' : 'block'
      }`}>
        <Sidebar />
      </div>

      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Dashboard Grid */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="grid grid-cols-12 gap-6 h-full">
            
            {/* Chart Section - Takes up most space */}
            <div className="col-span-12 lg:col-span-8">
              <div className="glass-card h-full min-h-[500px] animate-slide-in">
                <ChartPanel />
              </div>
            </div>

            {/* Right Column */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              
              {/* Portfolio Overview */}
              <div className="glass-card animate-slide-in" style={{ animationDelay: '0.1s' }}>
                <PortfolioCard />
              </div>

              {/* Market Sentiment */}
              <div className="glass-card animate-slide-in" style={{ animationDelay: '0.2s' }}>
                <MarketSentiment />
              </div>

              {/* Trading Panel */}
              <div className="glass-card animate-slide-in" style={{ animationDelay: '0.3s' }}>
                <TradePanel />
              </div>

            </div>

            {/* Bottom Row */}
            <div className="col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              
              {/* Watchlist Table */}
              <div className="glass-card animate-slide-in" style={{ animationDelay: '0.4s' }}>
                <WatchlistTable />
              </div>

              {/* Performance Graph */}
              <div className="glass-card animate-slide-in" style={{ animationDelay: '0.5s' }}>
                <PerformanceGraph />
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* Mobile Menu Toggle */}
      {isMobile && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-30 p-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import { Stock, Portfolio, User, Transaction } from '@/types';
import { MarketOverview } from '@/components/MarketOverview';
import { TradingPanel } from '@/components/TradingPanel';
import { PortfolioSummary } from '@/components/PortfolioSummary';
import { TransactionHistory } from '@/components/TransactionHistory';
import Navbar from '@/components/trading/Navbar';
import { 
  SkeletonMarketOverview, 
  SkeletonTradingPanel, 
  SkeletonPortfolioSummary, 
  SkeletonTransactionHistory 
} from '@/components/SkeletonLoader';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { useToast } from '@/contexts/ToastContext';

// Mock user for demo purposes
const mockUser: User = {
  id: 'user_1',
  name: 'John Trader',
  email: 'john@trader.com',
  balance: 100000,
  createdAt: new Date().toISOString()
};

export default function Dashboard() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [user, setUser] = useState<User>(mockUser);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { showToast } = useToast();

  // Fetch market data
  const fetchMarketData = async () => {
    try {
      const response = await fetch('/api/stocks');
      const result = await response.json();
      
      if (result.success) {
        setStocks(result.data.stocks);
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error('Error fetching market data:', error);
    }
  };

  // Fetch portfolio data
  const fetchPortfolioData = async () => {
    try {
      const response = await fetch(`/api/portfolio?userId=${user.id}`);
      const result = await response.json();
      
      if (result.success) {
        setPortfolio(result.data);
      }
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
    }
  };

  // Handle trade execution
  const handleTrade = async (stockId: string, type: 'BUY' | 'SELL', quantity: number) => {
    try {
      const response = await fetch('/api/trade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          stockId,
          type,
          quantity
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        // Update user balance
        if (result.updatedBalance !== undefined) {
          setUser(prev => ({ ...prev, balance: result.updatedBalance! }));
        }
        
        // Update portfolio
        if (result.portfolio) {
          setPortfolio(result.portfolio);
        }
        
        // Refresh market data and transactions
        await fetchMarketData();
        setRefreshTrigger(prev => prev + 1);
        
        // Show success toast
        showToast({
          type: 'success',
          title: 'Trade Successful!',
          message: result.message,
          duration: 5000
        });
      } else {
        // Show error toast
        showToast({
          type: 'error',
          title: 'Trade Failed',
          message: result.message,
          duration: 5000
        });
      }
    } catch (error) {
      console.error('Error executing trade:', error);
      showToast({
        type: 'error',
        title: 'Trade Error',
        message: 'Trade execution failed. Please try again.',
        duration: 5000
      });
    }
  };

  // Initial data load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchMarketData(),
        fetchPortfolioData()
      ]);
      setLoading(false);
    };

    loadData();
  }, [user.id]);

  // Auto-refresh market data every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchMarketData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading trading platform...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Market Overview */}
          <div className="xl:col-span-2 space-y-6 lg:space-y-8">
            <MarketOverview 
              stocks={stocks} 
              lastUpdate={lastUpdate}
              onRefresh={fetchMarketData}
            />
            
            <TradingPanel 
              stocks={stocks}
              userBalance={user.balance}
              onTrade={handleTrade}
            />
          </div>

          {/* Right Column - Portfolio & Transactions */}
          <div className="space-y-6 lg:space-y-8">
            <PortfolioSummary 
              portfolio={portfolio}
              userBalance={user.balance}
            />
            
            <TransactionHistory 
              userId={user.id}
              key={refreshTrigger}
              onTradeComplete={() => {}}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

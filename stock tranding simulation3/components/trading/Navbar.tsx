import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDarkMode } from '@/contexts/DarkModeContext';

interface MarketIndicator {
  name: string;
  value: number;
  change: number;
  isPositive: boolean;
}

export default function Navbar() {
  const router = useRouter();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [marketIndicators, setMarketIndicators] = useState<MarketIndicator[]>([
    { name: 'S&P 500', value: 4783.45, change: 0.85, isPositive: true },
    { name: 'NASDAQ', value: 14972.76, change: 1.23, isPositive: true },
    { name: 'BTC/USD', value: 67834.21, change: 2.15, isPositive: true },
  ]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketIndicators(prev => 
        prev.map(indicator => ({
          ...indicator,
          value: indicator.value + (Math.random() - 0.5) * indicator.value * 0.001,
          change: indicator.change + (Math.random() - 0.5) * 0.1,
          isPositive: Math.random() > 0.4
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    console.log('Logging out...');
    router.push('/');
  };

  return (
    <div className="glass-card border-b border-gray-200 dark:border-gray-800 px-4 md:px-6 py-4 relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <Link
            href="/trading-dashboard"
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">📈</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">TradingSim</h1>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6">
          <Link
            href="/trading-dashboard"
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors font-medium"
          >
            Dashboard
          </Link>
          <Link
            href="/portfolio"
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors font-medium"
          >
            Portfolio
          </Link>
          <Link
            href="/markets"
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors font-medium"
          >
            Markets
          </Link>
          <Link
            href="/orders"
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors font-medium"
          >
            Orders
          </Link>
        </nav>

        {/* Market Indicators */}
        <div className="hidden xl:flex items-center space-x-6">
          {marketIndicators.map((indicator, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="text-right">
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">{indicator.name}</p>
                <p className="text-xs font-bold text-gray-900 dark:text-white">
                  {indicator.value.toLocaleString('en-US', { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}
                </p>
              </div>
              <div className={`flex items-center space-x-0.5 px-1.5 py-0.5 rounded ${
                indicator.isPositive 
                  ? 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400' 
                  : 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400'
              }`}>
                <span className="text-[10px] font-bold">
                  {indicator.isPositive ? '▲' : '▼'}
                </span>
                <span className="text-[10px] font-bold">
                  {Math.abs(indicator.change).toFixed(2)}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotifications(0)}
              className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <span className="text-lg">🔔</span>
              {notifications > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                  {notifications}
                </span>
              )}
            </button>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
            >
              <span className="text-white font-bold text-sm">JD</span>
            </button>

            {/* User Dropdown */}
            {isUserMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsUserMenuOpen(false)}
                ></div>
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl z-50 overflow-hidden animate-slide-in">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">John Doe</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">john.doe@example.com</p>
                    <div className="mt-2 py-1 px-2 bg-blue-100 dark:bg-blue-500/20 rounded text-[10px] font-bold text-blue-600 dark:text-blue-400 inline-block uppercase tracking-wider">
                      Pro Trader
                    </div>
                  </div>
                  <div className="p-2">
                    <Link
                      href="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <span>👤</span> <span>Profile</span>
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <span>⚙️</span> <span>Settings</span>
                    </Link>
                    <Link
                      href="/help"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <span>❓</span> <span>Help</span>
                    </Link>
                    <div className="h-px bg-gray-200 dark:bg-gray-800 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <span>🚪</span> <span>Logout</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <span className="text-xl">{isMobileMenuOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden" 
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-xl z-50 animate-slide-in p-4">
            <nav className="grid grid-cols-2 gap-2">
              <Link
                href="/trading-dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                <span>📊</span> <span className="font-medium">Dashboard</span>
              </Link>
              <Link
                href="/portfolio"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                <span>💼</span> <span className="font-medium">Portfolio</span>
              </Link>
              <Link
                href="/markets"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                <span>📈</span> <span className="font-medium">Markets</span>
              </Link>
              <Link
                href="/orders"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                <span>📝</span> <span className="font-medium">Orders</span>
              </Link>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}

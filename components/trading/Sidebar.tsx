'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface MenuItem {
  id: string;
  name: string;
  icon: string;
  active?: boolean;
  badge?: number;
}

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems: MenuItem[] = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'portfolio', name: 'Portfolio', icon: '💼', badge: 3 },
    { id: 'trade', name: 'Trade', icon: '📈' },
    { id: 'history', name: 'History', icon: '📜' },
    { id: 'analytics', name: 'Analytics', icon: '📉' },
    { id: 'settings', name: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className={`glass-card h-screen transition-all duration-300 ${
      isCollapsed ? 'w-20' : 'w-64'
    }`}>
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className={`flex items-center space-x-3 transition-opacity duration-300 ${
              isCollapsed ? 'opacity-0' : 'opacity-100'
            }`}>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">📈</span>
              </div>
              <h1 className="text-xl font-bold text-white">TradingSim</h1>
            </div>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveItem(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 group ${
                    activeItem === item.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white glow-blue'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center justify-center w-6 h-6">
                    <span className="text-lg">{item.icon}</span>
                  </div>
                  <div className={`flex-1 text-left transition-opacity duration-300 ${
                    isCollapsed ? 'opacity-0 hidden' : 'opacity-100'
                  }`}>
                    <p className="font-medium">{item.name}</p>
                  </div>
                  {item.badge && !isCollapsed && (
                    <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse-glow">
                      {item.badge}
                    </div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-800">
          <div className={`flex items-center space-x-3 ${
            isCollapsed ? 'justify-center' : ''
          }`}>
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">JD</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse-glow"></div>
            </div>
            <div className={`transition-opacity duration-300 ${
              isCollapsed ? 'opacity-0 hidden' : 'opacity-100'
            }`}>
              <p className="text-sm font-medium text-white">John Doe</p>
              <p className="text-xs text-gray-400">Premium</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

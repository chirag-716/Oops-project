'use client';

import { useState } from 'react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    theme: 'dark',
    language: 'en',
    timezone: 'UTC-5',
    notifications: {
      email: true,
      push: true,
      sms: false,
      priceAlerts: true,
      orderUpdates: true,
      marketNews: false
    },
    trading: {
      defaultOrderType: 'Market',
      confirmOrders: true,
      showAdvancedOptions: false,
      autoRefreshPrices: true,
      refreshInterval: '5s'
    },
    display: {
      showGridLines: true,
      showVolume: true,
      chartType: 'Candlestick',
      colorScheme: 'GreenRed'
    }
  });

  const [activeTab, setActiveTab] = useState('general');

  const handleSettingChange = (category: string, key: string, value: any) => {
    setSettings(prev => {
      if (category === 'theme') {
        return {
          ...prev,
          theme: { ...prev.theme, [key]: value }
        };
      } else if (category === 'notifications') {
        return {
          ...prev,
          notifications: { ...prev.notifications, [key]: value }
        };
      } else if (category === 'trading') {
        return {
          ...prev,
          trading: { ...prev.trading, [key]: value }
        };
      } else if (category === 'display') {
        return {
          ...prev,
          display: { ...prev.display, [key]: value }
        };
      }
      return prev;
    });
  };

  const tabs = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'trading', label: 'Trading', icon: '📈' },
    { id: 'display', label: 'Display', icon: '🎨' },
    { id: 'security', label: 'Security', icon: '🔒' }
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="p-6">
        <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-card p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center space-x-3 ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <div className="glass-card p-6">
              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-white mb-6">General Settings</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Theme
                    </label>
                    <select
                      value={settings.theme}
                      onChange={(e) => handleSettingChange('theme', 'theme', e.target.value)}
                      className="trading-input w-full"
                    >
                      <option value="dark">Dark</option>
                      <option value="light">Light</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Language
                    </label>
                    <select
                      value={settings.language}
                      onChange={(e) => handleSettingChange('theme', 'language', e.target.value)}
                      className="trading-input w-full"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Timezone
                    </label>
                    <select
                      value={settings.timezone}
                      onChange={(e) => handleSettingChange('theme', 'timezone', e.target.value)}
                      className="trading-input w-full"
                    >
                      <option value="UTC-8">Pacific Time (UTC-8)</option>
                      <option value="UTC-5">Eastern Time (UTC-5)</option>
                      <option value="UTC+0">London (UTC+0)</option>
                      <option value="UTC+8">Hong Kong (UTC+8)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Notifications Settings */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-white mb-6">Notification Preferences</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">Email Notifications</p>
                        <p className="text-gray-400 text-sm">Receive notifications via email</p>
                      </div>
                      <button
                        onClick={() => handleSettingChange('notifications', 'email', !settings.notifications.email)}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          settings.notifications.email ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          settings.notifications.email ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">Push Notifications</p>
                        <p className="text-gray-400 text-sm">Receive push notifications</p>
                      </div>
                      <button
                        onClick={() => handleSettingChange('notifications', 'push', !settings.notifications.push)}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          settings.notifications.push ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          settings.notifications.push ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">Price Alerts</p>
                        <p className="text-gray-400 text-sm">Get notified when prices hit your targets</p>
                      </div>
                      <button
                        onClick={() => handleSettingChange('notifications', 'priceAlerts', !settings.notifications.priceAlerts)}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          settings.notifications.priceAlerts ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          settings.notifications.priceAlerts ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">Order Updates</p>
                        <p className="text-gray-400 text-sm">Notifications for order status changes</p>
                      </div>
                      <button
                        onClick={() => handleSettingChange('notifications', 'orderUpdates', !settings.notifications.orderUpdates)}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          settings.notifications.orderUpdates ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          settings.notifications.orderUpdates ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Trading Settings */}
              {activeTab === 'trading' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-white mb-6">Trading Preferences</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Default Order Type
                    </label>
                    <select
                      value={settings.trading.defaultOrderType}
                      onChange={(e) => handleSettingChange('trading', 'defaultOrderType', e.target.value)}
                      className="trading-input w-full"
                    >
                      <option value="Market">Market</option>
                      <option value="Limit">Limit</option>
                      <option value="Stop Loss">Stop Loss</option>
                    </select>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">Confirm Orders</p>
                        <p className="text-gray-400 text-sm">Show confirmation dialog before placing orders</p>
                      </div>
                      <button
                        onClick={() => handleSettingChange('trading', 'confirmOrders', !settings.trading.confirmOrders)}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          settings.trading.confirmOrders ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          settings.trading.confirmOrders ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">Auto-refresh Prices</p>
                        <p className="text-gray-400 text-sm">Automatically update market prices</p>
                      </div>
                      <button
                        onClick={() => handleSettingChange('trading', 'autoRefreshPrices', !settings.trading.autoRefreshPrices)}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          settings.trading.autoRefreshPrices ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          settings.trading.autoRefreshPrices ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Display Settings */}
              {activeTab === 'display' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-white mb-6">Display Preferences</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Chart Type
                    </label>
                    <select
                      value={settings.display.chartType}
                      onChange={(e) => handleSettingChange('display', 'chartType', e.target.value)}
                      className="trading-input w-full"
                    >
                      <option value="Candlestick">Candlestick</option>
                      <option value="Line">Line</option>
                      <option value="Area">Area</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Color Scheme
                    </label>
                    <select
                      value={settings.display.colorScheme}
                      onChange={(e) => handleSettingChange('display', 'colorScheme', e.target.value)}
                      className="trading-input w-full"
                    >
                      <option value="GreenRed">Green/Red</option>
                      <option value="BlueRed">Blue/Red</option>
                      <option value="Gray">Grayscale</option>
                    </select>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">Show Grid Lines</p>
                        <p className="text-gray-400 text-sm">Display grid lines on charts</p>
                      </div>
                      <button
                        onClick={() => handleSettingChange('display', 'showGridLines', !settings.display.showGridLines)}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          settings.display.showGridLines ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          settings.display.showGridLines ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">Show Volume</p>
                        <p className="text-gray-400 text-sm">Display volume bars on charts</p>
                      </div>
                      <button
                        onClick={() => handleSettingChange('display', 'showVolume', !settings.display.showVolume)}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          settings.display.showVolume ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          settings.display.showVolume ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-white mb-6">Security Settings</h2>
                  
                  <div className="space-y-4">
                    <button className="w-full text-left px-4 py-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">Change Password</p>
                        <p className="text-gray-400 text-sm">Update your account password</p>
                      </div>
                      <span className="text-gray-400">→</span>
                    </button>

                    <button className="w-full text-left px-4 py-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">Two-Factor Authentication</p>
                        <p className="text-gray-400 text-sm">Configure 2FA for enhanced security</p>
                      </div>
                      <span className="text-green-400">Enabled</span>
                    </button>

                    <button className="w-full text-left px-4 py-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">API Keys</p>
                        <p className="text-gray-400 text-sm">Manage your API access keys</p>
                      </div>
                      <span className="text-gray-400">→</span>
                    </button>

                    <button className="w-full text-left px-4 py-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">Login History</p>
                        <p className="text-gray-400 text-sm">View recent login activity</p>
                      </div>
                      <span className="text-gray-400">→</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t border-gray-800">
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

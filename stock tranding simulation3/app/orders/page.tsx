'use client';

import { useState, useEffect } from 'react';

interface Order {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  orderType: 'Market' | 'Limit' | 'Stop Loss';
  quantity: number;
  price: number;
  status: 'Pending' | 'Executed' | 'Cancelled';
  createdAt: string;
  executedAt?: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD001',
      symbol: 'AAPL',
      type: 'BUY',
      orderType: 'Market',
      quantity: 50,
      price: 189.84,
      status: 'Executed',
      createdAt: '2024-01-15 09:30:00',
      executedAt: '2024-01-15 09:30:02'
    },
    {
      id: 'ORD002',
      symbol: 'GOOGL',
      type: 'SELL',
      orderType: 'Limit',
      quantity: 20,
      price: 145.00,
      status: 'Pending',
      createdAt: '2024-01-15 10:15:00'
    },
    {
      id: 'ORD003',
      symbol: 'MSFT',
      type: 'BUY',
      orderType: 'Stop Loss',
      quantity: 30,
      price: 365.00,
      status: 'Cancelled',
      createdAt: '2024-01-15 11:20:00'
    },
    {
      id: 'ORD004',
      symbol: 'TSLA',
      type: 'BUY',
      orderType: 'Market',
      quantity: 25,
      price: 234.56,
      status: 'Executed',
      createdAt: '2024-01-15 14:30:00',
      executedAt: '2024-01-15 14:30:01'
    }
  ]);

  const [filter, setFilter] = useState<'All' | 'Pending' | 'Executed' | 'Cancelled'>('All');

  useEffect(() => {
    // Simulate order status updates
    const interval = setInterval(() => {
      setOrders(prev => 
        prev.map(order => {
          if (order.status === 'Pending' && Math.random() > 0.7) {
            return {
              ...order,
              status: Math.random() > 0.2 ? 'Executed' : 'Cancelled',
              executedAt: Math.random() > 0.2 ? new Date().toLocaleString() : undefined
            };
          }
          return order;
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const filteredOrders = filter === 'All' 
    ? orders 
    : orders.filter(order => order.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Executed': return 'text-green-400';
      case 'Pending': return 'text-yellow-400';
      case 'Cancelled': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'Executed': return 'bg-green-500/20 border-green-500/30';
      case 'Pending': return 'bg-yellow-500/20 border-yellow-500/30';
      case 'Cancelled': return 'bg-red-500/20 border-red-500/30';
      default: return 'bg-gray-500/20 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="p-6">
        <h1 className="text-3xl font-bold text-white mb-8">Orders</h1>
        
        {/* Order Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glass-card p-6">
            <h3 className="text-sm text-gray-400 mb-2">Total Orders</h3>
            <p className="text-2xl font-bold text-white">{orders.length}</p>
          </div>
          <div className="glass-card p-6">
            <h3 className="text-sm text-gray-400 mb-2">Pending</h3>
            <p className="text-2xl font-bold text-yellow-400">
              {orders.filter(o => o.status === 'Pending').length}
            </p>
          </div>
          <div className="glass-card p-6">
            <h3 className="text-sm text-gray-400 mb-2">Executed</h3>
            <p className="text-2xl font-bold text-green-400">
              {orders.filter(o => o.status === 'Executed').length}
            </p>
          </div>
          <div className="glass-card p-6">
            <h3 className="text-sm text-gray-400 mb-2">Cancelled</h3>
            <p className="text-2xl font-bold text-red-400">
              {orders.filter(o => o.status === 'Cancelled').length}
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-4 mb-8">
          {(['All', 'Pending', 'Executed', 'Cancelled'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Orders Table */}
        <div className="glass-card">
          <div className="p-6">
            <h2 className="text-xl font-bold text-white mb-6">Order History</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Order ID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Symbol</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Order Type</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Quantity</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Price</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-400">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Created</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Executed</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order, index) => (
                    <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-medium text-white text-sm">{order.id}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-white font-medium">{order.symbol}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-medium ${
                          order.type === 'BUY' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {order.type}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-gray-400">{order.orderType}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-white">{order.quantity}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-white">
                          ${order.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBg(order.status)} ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-gray-400 text-sm">{order.createdAt}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-gray-400 text-sm">
                          {order.executedAt || '--'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredOrders.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-400">No orders found for the selected filter.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

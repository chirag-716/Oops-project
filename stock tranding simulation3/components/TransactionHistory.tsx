'use client';

import { useState, useEffect } from 'react';
import { Transaction, OrderType } from '@/types';

interface TransactionHistoryProps {
  userId: string;
  onTradeComplete: () => void;
}

export function TransactionHistory({ userId, onTradeComplete }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/transactions?userId=${userId}`);
      const result = await response.json();
      
      if (result.success) {
        setTransactions(result.data);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [userId]);

  // Expose refresh method to parent if needed, but don't call it here in useEffect

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const getOrderTypeColor = (type: OrderType) => {
    return type === OrderType.BUY ? 'text-green-600' : 'text-red-600';
  };

  const getOrderTypeIcon = (type: OrderType) => {
    return type === OrderType.BUY ? '📈' : '📉';
  };

  return (
    <div className="trading-card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Transaction History</h2>
        <button
          onClick={fetchTransactions}
          className="trading-button trading-button-secondary text-sm"
        >
          🔄 Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading transactions...</p>
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <p className="text-sm">No transactions yet</p>
          <p className="text-xs mt-2">Start trading to see your transaction history</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="max-h-96 overflow-y-auto">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-3">
                    <div className={`text-lg ${getOrderTypeColor(transaction.type)}`}>
                      {getOrderTypeIcon(transaction.type)}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {transaction.stock?.symbol || 'Unknown'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {transaction.stock?.name || 'Unknown Stock'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-medium ${getOrderTypeColor(transaction.type)}`}>
                      {transaction.type}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(transaction.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Price</p>
                    <p className="font-medium text-gray-900">
                      ${formatPrice(transaction.price)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Quantity</p>
                    <p className="font-medium text-gray-900">
                      {transaction.quantity}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Total</p>
                    <p className={`font-bold ${getOrderTypeColor(transaction.type)}`}>
                      {transaction.type === OrderType.BUY ? '-' : '+'}${formatPrice(transaction.total)}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Transaction ID: {transaction.id}</span>
                    <span>Stock ID: {transaction.stockId}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {transactions.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-center text-sm text-gray-500">
                Showing {transactions.length} recent transactions
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

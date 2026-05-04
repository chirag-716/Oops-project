'use client';

import { useState } from 'react';
import { Stock, OrderType } from '@/types';

interface TradingPanelProps {
  stocks: Stock[];
  userBalance: number;
  onTrade: (stockId: string, type: OrderType, quantity: number) => void;
}

export function TradingPanel({ stocks, userBalance, onTrade }: TradingPanelProps) {
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [orderType, setOrderType] = useState<OrderType>(OrderType.BUY);
  const [quantity, setQuantity] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [successMessage, setSuccessMessage] = useState<string>('');

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const calculateTotal = () => {
    if (!selectedStock) return 0;
    return selectedStock.price * quantity;
  };

  const canAfford = () => {
    if (orderType === OrderType.BUY) {
      return userBalance >= calculateTotal();
    }
    return true; // For sell orders, we'll validate on the backend
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!selectedStock) {
      errors.stock = 'Please select a stock';
    }
    
    if (quantity <= 0) {
      errors.quantity = 'Quantity must be greater than 0';
    }
    
    if (quantity > 1000) {
      errors.quantity = 'Quantity cannot exceed 1000';
    }
    
    if (orderType === OrderType.BUY && !canAfford()) {
      errors.balance = 'Insufficient balance for this order';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage('');
    
    try {
      await onTrade(selectedStock!.id, orderType, quantity);
      
      // Reset form on success
      setQuantity(1);
      setSuccessMessage(`${orderType === OrderType.BUY ? 'Buy' : 'Sell'} order executed successfully!`);
      setFormErrors({});
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Trade error:', error);
      setFormErrors({ general: 'Trade execution failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="trading-card">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Trading Panel</h2>
      
      {/* Success/Error Messages */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 p-4 rounded-md mb-6">
          <div className="flex items-center">
            <span className="text-green-600 mr-2">✓</span>
            <p className="text-green-800">{successMessage}</p>
          </div>
        </div>
      )}
      
      {formErrors.general && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-md mb-6">
          <div className="flex items-center">
            <span className="text-red-600 mr-2">✗</span>
            <p className="text-red-800">{formErrors.general}</p>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Stock Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Stock
          </label>
          <select
            value={selectedStock?.id || ''}
            onChange={(e) => {
              const stock = stocks.find(s => s.id === e.target.value);
              setSelectedStock(stock || null);
              setFormErrors(prev => ({ ...prev, stock: '' }));
            }}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-blue-500 ${
              formErrors.stock ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          >
            <option value="">Choose a stock...</option>
            {stocks.map((stock) => (
              <option key={stock.id} value={stock.id}>
                {stock.symbol} - {stock.name} (${formatPrice(stock.price)})
              </option>
            ))}
          </select>
          {formErrors.stock && (
            <p className="mt-1 text-sm text-red-600">{formErrors.stock}</p>
          )}
        </div>

        {/* Order Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Order Type
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setOrderType(OrderType.BUY)}
              className={`trading-button ${
                orderType === OrderType.BUY
                  ? 'trading-button-success'
                  : 'trading-button-secondary'
              }`}
            >
              📈 BUY
            </button>
            <button
              type="button"
              onClick={() => setOrderType(OrderType.SELL)}
              className={`trading-button ${
                orderType === OrderType.SELL
                  ? 'trading-button-danger'
                  : 'trading-button-secondary'
              }`}
            >
              📉 SELL
            </button>
          </div>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantity
          </label>
          <input
            type="number"
            min="1"
            max="1000"
            value={quantity}
            onChange={(e) => {
              const newQuantity = Math.max(1, parseInt(e.target.value) || 0);
              setQuantity(newQuantity);
              setFormErrors(prev => ({ ...prev, quantity: '' }));
            }}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-blue-500 ${
              formErrors.quantity ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {formErrors.quantity && (
            <p className="mt-1 text-sm text-red-600">{formErrors.quantity}</p>
          )}
        </div>

        {/* Order Summary */}
        {selectedStock && (
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Stock:</span>
                <span className="font-medium">{selectedStock.symbol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Price per share:</span>
                <span className="font-medium">${formatPrice(selectedStock.price)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Quantity:</span>
                <span className="font-medium">{quantity}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="font-medium">Total Cost:</span>
                <span className={`font-bold text-lg ${
                  orderType === OrderType.BUY ? 'text-red-600' : 'text-green-600'
                }`}>
                  ${formatPrice(calculateTotal())}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Balance Warning */}
        {formErrors.balance && (
          <div className="bg-red-50 border border-red-200 p-3 rounded-md">
            <p className="text-sm text-red-800">
              ⚠️ {formErrors.balance}
              {orderType === OrderType.BUY && selectedStock && (
                <> You need ${formatPrice(calculateTotal() - userBalance)} more.</>
              )}
            </p>
          </div>
        )}

        {/* Available Balance */}
        <div className="bg-blue-50 p-3 rounded-md">
          <div className="flex justify-between items-center">
            <span className="text-sm text-blue-800">Available Balance:</span>
            <span className="text-lg font-bold text-blue-600">
              ${formatPrice(userBalance)}
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!selectedStock || isSubmitting || (orderType === OrderType.BUY && !canAfford())}
          className={`w-full trading-button ${
            orderType === OrderType.BUY
              ? 'trading-button-success'
              : 'trading-button-danger'
          } disabled:bg-gray-300 disabled:cursor-not-allowed`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </span>
          ) : (
            `${orderType === OrderType.BUY ? '📈 BUY' : '📉 SELL'} ${selectedStock?.symbol || 'Stock'}`
          )}
        </button>
      </form>
    </div>
  );
}

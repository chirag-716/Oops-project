'use client';

import { useState, useEffect } from 'react';

interface OrderBookEntry {
  price: number;
  quantity: number;
  total: number;
}

export default function TradePanel() {
  const [orderType, setOrderType] = useState<'BUY' | 'SELL'>('BUY');
  const [orderTypeSelect, setOrderTypeSelect] = useState('Market');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(43256.78);
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState('MIS');
  const [validity, setValidity] = useState('DAY');

  const orderTypes = ['Market', 'Limit', 'Stop Loss', 'Stop Limit', 'SL-M', 'Cover Order'];
  const products = ['MIS', 'CNC', 'NRML'];
  const validityOptions = ['DAY', 'IOC', 'MIN'];
  const mockBalance = 45678.90;
  const currentPrice = 43256.78;

  // Mock order book data
  const [buyOrders, setBuyOrders] = useState<OrderBookEntry[]>([]);
  const [sellOrders, setSellOrders] = useState<OrderBookEntry[]>([]);

  useEffect(() => {
    // Generate mock order book
    const generateOrderBook = () => {
      const buy: OrderBookEntry[] = [];
      const sell: OrderBookEntry[] = [];
      
      for (let i = 0; i < 8; i++) {
        const buyPrice = currentPrice - (i + 1) * 10;
        const sellPrice = currentPrice + (i + 1) * 10;
        const buyQty = Math.floor(Math.random() * 100) + 10;
        const sellQty = Math.floor(Math.random() * 100) + 10;
        
        buy.push({
          price: buyPrice,
          quantity: buyQty,
          total: buyPrice * buyQty
        });
        
        sell.push({
          price: sellPrice,
          quantity: sellQty,
          total: sellPrice * sellQty
        });
      }
      
      setBuyOrders(buy.reverse());
      setSellOrders(sell);
    };

    generateOrderBook();
    const interval = setInterval(generateOrderBook, 2000);
    return () => clearInterval(interval);
  }, [currentPrice]);

  // Calculate estimated cost
  useEffect(() => {
    const executionPrice = orderTypeSelect === 'Market' ? currentPrice : price;
    const cost = orderType === 'BUY' ? quantity * executionPrice : quantity * executionPrice * 0.95;
    setEstimatedCost(cost);
  }, [orderType, quantity, price, orderTypeSelect, currentPrice]);

  const handleQuantityChange = (value: string) => {
    const qty = parseInt(value) || 0;
    setQuantity(Math.max(1, qty));
  };

  const handlePriceChange = (value: string) => {
    const prc = parseFloat(value) || 0;
    setPrice(Math.max(0, prc));
  };

  const canAfford = orderType === 'BUY' ? estimatedCost <= mockBalance : true;
  const maxQuantity = orderType === 'BUY' ? Math.floor(mockBalance / (orderTypeSelect === 'Market' ? currentPrice : price)) : 1000;

  const getMarginRequired = () => {
    if (selectedProduct === 'MIS') return estimatedCost * 0.2; // 20% margin
    if (selectedProduct === 'NRML') return estimatedCost * 0.4; // 40% margin
    return estimatedCost; // CNC - full payment
  };

  const marginRequired = getMarginRequired();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">Order Entry</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-glow"></div>
          <span className="text-xs text-green-400">Live</span>
        </div>
      </div>
      
      {/* Buy/Sell Toggle */}
      <div className="flex mb-6 bg-gray-800 rounded-lg p-1">
        <button
          onClick={() => setOrderType('BUY')}
          className={`flex-1 py-3 px-4 rounded-md font-medium transition-all ${
            orderType === 'BUY'
              ? 'bg-green-600 text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          📈 BUY
        </button>
        <button
          onClick={() => setOrderType('SELL')}
          className={`flex-1 py-3 px-4 rounded-md font-medium transition-all ${
            orderType === 'SELL'
              ? 'bg-red-600 text-white shadow-lg'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          📉 SELL
        </button>
      </div>

      {/* Order Book */}
      <div className="mb-6">
        <div className="text-sm font-medium text-gray-400 mb-3">Market Depth</div>
        <div className="bg-gray-900 rounded-lg p-3">
          <div className="space-y-1">
            {/* Sell Orders */}
            {sellOrders.slice(0, 5).map((order, index) => (
              <div key={index} className="flex justify-between text-xs">
                <span className="text-red-400">{order.price.toFixed(2)}</span>
                <span className="text-gray-400">{order.quantity}</span>
                <span className="text-gray-500">{order.total.toLocaleString()}</span>
              </div>
            ))}
            
            {/* Current Price */}
            <div className="flex justify-between text-xs py-1 border-t border-gray-700">
              <span className="text-white font-bold">{currentPrice.toFixed(2)}</span>
              <span className="text-gray-400">--</span>
              <span className="text-gray-500">--</span>
            </div>
            
            {/* Buy Orders */}
            {buyOrders.slice(0, 5).map((order, index) => (
              <div key={index} className="flex justify-between text-xs">
                <span className="text-green-400">{order.price.toFixed(2)}</span>
                <span className="text-gray-400">{order.quantity}</span>
                <span className="text-gray-500">{order.total.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Type */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Order Type
        </label>
        <select
          value={orderTypeSelect}
          onChange={(e) => setOrderTypeSelect(e.target.value)}
          className="trading-input w-full"
        >
          {orderTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* Product Type */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Product
        </label>
        <div className="grid grid-cols-3 gap-2">
          {products.map(product => (
            <button
              key={product}
              onClick={() => setSelectedProduct(product)}
              className={`py-2 px-3 rounded text-xs font-medium transition-all ${
                selectedProduct === product
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {product}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Quantity
        </label>
        <input
          type="number"
          min="1"
          max={maxQuantity}
          value={quantity}
          onChange={(e) => handleQuantityChange(e.target.value)}
          className="trading-input w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Max: {maxQuantity}</span>
          <span>Margin: ${marginRequired.toLocaleString()}</span>
        </div>
      </div>

      {/* Price (for non-market orders) */}
      {orderTypeSelect !== 'Market' && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Price
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => handlePriceChange(e.target.value)}
            className="trading-input w-full"
          />
        </div>
      )}

      {/* Stop Loss */}
      {(orderTypeSelect === 'Stop Loss' || orderTypeSelect === 'Stop Limit' || orderTypeSelect === 'SL-M') && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Stop Loss
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={stopLoss}
            onChange={(e) => setStopLoss(e.target.value)}
            placeholder="Optional"
            className="trading-input w-full"
          />
        </div>
      )}

      {/* Take Profit */}
      {(orderTypeSelect === 'Cover Order' || orderTypeSelect === 'Stop Limit') && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Take Profit
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={takeProfit}
            onChange={(e) => setTakeProfit(e.target.value)}
            placeholder="Optional"
            className="trading-input w-full"
          />
        </div>
      )}

      {/* Validity */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Validity
        </label>
        <select
          value={validity}
          onChange={(e) => setValidity(e.target.value)}
          className="trading-input w-full"
        >
          {validityOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      {/* Order Summary */}
      <div className="mb-6 p-4 bg-gray-800 rounded-lg">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Margin Required</span>
            <span className="text-sm font-bold text-white">
              ${marginRequired.toLocaleString('en-US', { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
              })}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Estimated {orderType === 'BUY' ? 'Cost' : 'Proceeds'}</span>
            <span className={`text-lg font-bold ${
              orderType === 'BUY' ? 'text-white' : 'text-profit'
            }`}>
              ${estimatedCost.toLocaleString('en-US', { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Balance Warning */}
      {!canAfford && orderType === 'BUY' && (
        <div className="mb-6 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
          <p className="text-sm text-red-400">
            ⚠️ Insufficient margin. You need ${(marginRequired - mockBalance).toLocaleString()} more.
          </p>
        </div>
      )}

      {/* Place Order Button */}
      <button
        disabled={!canAfford}
        className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-all ${
          orderType === 'BUY'
            ? canAfford
              ? 'btn-success hover:scale-105'
              : 'bg-gray-700 cursor-not-allowed opacity-50'
            : 'btn-danger hover:scale-105'
        }`}
      >
        {orderType === 'BUY' ? '📈 Place Buy Order' : '📉 Place Sell Order'}
      </button>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-2 mt-4">
        {[1, 5, 10, 25].map(qty => (
          <button
            key={qty}
            onClick={() => setQuantity(qty)}
            className="py-1 px-2 bg-gray-800 text-gray-300 rounded hover:bg-gray-700 transition-colors text-sm"
          >
            {qty}
          </button>
        ))}
      </div>

      {/* Order Info */}
      <div className="mt-4 pt-4 border-t border-gray-800">
        <div className="text-xs text-gray-500 space-y-1">
          <p>• MIS: Intraday orders with 20% margin</p>
          <p>• CNC: Delivery orders with full payment</p>
          <p>• NRML: Normal orders with 40% margin</p>
          <p>• IOC: Immediate or Cancel</p>
          <p>• DAY: Valid till end of day</p>
        </div>
      </div>
    </div>
  );
}

'use client';

export function SkeletonCard() {
  return (
    <div className="trading-card">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-300 rounded mb-4 w-1/3"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          <div className="h-4 bg-gray-300 rounded w-4/6"></div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonMarketOverview() {
  return (
    <div className="trading-card">
      <div className="animate-pulse">
        <div className="flex justify-between items-center mb-6">
          <div className="h-6 bg-gray-300 rounded w-1/4"></div>
          <div className="h-8 bg-gray-300 rounded w-20"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 p-4 rounded-lg">
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-300 rounded w-3/4"></div>
            </div>
          ))}
        </div>
        
        <div className="space-y-2">
          <div className="h-5 bg-gray-300 rounded w-1/3 mb-3"></div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between p-3 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="h-4 bg-gray-300 rounded w-12"></div>
                <div className="h-4 bg-gray-300 rounded w-24"></div>
              </div>
              <div className="flex items-center space-x-8">
                <div className="h-4 bg-gray-300 rounded w-16"></div>
                <div className="h-4 bg-gray-300 rounded w-12"></div>
                <div className="h-4 bg-gray-300 rounded w-10"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SkeletonTradingPanel() {
  return (
    <div className="trading-card">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-300 rounded w-1/3 mb-6"></div>
        
        <div className="space-y-6">
          <div>
            <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
            <div className="h-10 bg-gray-300 rounded"></div>
          </div>
          
          <div>
            <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-10 bg-gray-300 rounded"></div>
              <div className="h-10 bg-gray-300 rounded"></div>
            </div>
          </div>
          
          <div>
            <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
            <div className="h-10 bg-gray-300 rounded"></div>
          </div>
          
          <div className="bg-gray-100 p-4 rounded-md">
            <div className="h-4 bg-gray-300 rounded w-1/3 mb-3"></div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <div className="h-3 bg-gray-300 rounded w-16"></div>
                <div className="h-3 bg-gray-300 rounded w-20"></div>
              </div>
              <div className="flex justify-between">
                <div className="h-3 bg-gray-300 rounded w-20"></div>
                <div className="h-3 bg-gray-300 rounded w-16"></div>
              </div>
            </div>
          </div>
          
          <div className="h-12 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonPortfolioSummary() {
  return (
    <div className="trading-card">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-300 rounded w-1/3 mb-6"></div>
        
        <div className="grid grid-cols-1 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="h-4 bg-blue-300 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-blue-300 rounded w-3/4"></div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
              <div className="h-6 bg-gray-300 rounded w-3/4"></div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
              <div className="h-6 bg-gray-300 rounded w-3/4"></div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <div className="h-5 bg-gray-300 rounded w-1/4 mb-3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between">
                <div className="h-3 bg-gray-300 rounded w-20"></div>
                <div className="h-3 bg-gray-300 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonTransactionHistory() {
  return (
    <div className="trading-card">
      <div className="animate-pulse">
        <div className="flex justify-between items-center mb-6">
          <div className="h-6 bg-gray-300 rounded w-1/3"></div>
          <div className="h-8 bg-gray-300 rounded w-20"></div>
        </div>
        
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-gray-300 rounded"></div>
                  <div>
                    <div className="h-4 bg-gray-300 rounded w-12 mb-1"></div>
                    <div className="h-3 bg-gray-300 rounded w-20"></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-4 bg-gray-300 rounded w-12 mb-1"></div>
                  <div className="h-3 bg-gray-300 rounded w-16"></div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="h-3 bg-gray-300 rounded w-8 mb-1"></div>
                  <div className="h-3 bg-gray-300 rounded w-12"></div>
                </div>
                <div>
                  <div className="h-3 bg-gray-300 rounded w-8 mb-1"></div>
                  <div className="h-3 bg-gray-300 rounded w-8"></div>
                </div>
                <div>
                  <div className="h-3 bg-gray-300 rounded w-8 mb-1"></div>
                  <div className="h-3 bg-gray-300 rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

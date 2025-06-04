import React, { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3, Plus, Eye, ArrowUpRight } from 'lucide-react';

const Investments = () => {
  const [portfolio] = useState({
    totalValue: 8240,
    totalGain: 1520,
    gainPercentage: 18.3,
    dayChange: 45.20,
    dayChangePercentage: 0.55
  });

  const [holdings] = useState([
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      shares: 5,
      currentPrice: 175.43,
      totalValue: 877.15,
      gain: 127.15,
      gainPercentage: 16.9,
      allocation: 10.6
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      shares: 3,
      currentPrice: 338.11,
      totalValue: 1014.33,
      gain: 214.33,
      gainPercentage: 26.8,
      allocation: 12.3
    },
    {
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      shares: 2,
      currentPrice: 138.21,
      totalValue: 276.42,
      gain: -23.58,
      gainPercentage: -7.9,
      allocation: 3.4
    },
    {
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      shares: 4,
      currentPrice: 248.50,
      totalValue: 994.00,
      gain: 194.00,
      gainPercentage: 24.3,
      allocation: 12.1
    }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Investment Portfolio</h1>
            <p className="text-gray-600">Track and manage your investment performance</p>
          </div>
          <div className="flex space-x-3">
            <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <Eye className="mr-2 h-4 w-4" />
              Analyze
            </button>
            <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
              <Plus className="mr-2 h-5 w-5" />
              Invest
            </button>
          </div>
        </div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Portfolio Value</p>
                <p className="text-2xl font-bold text-gray-900">${portfolio.totalValue.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Gain</p>
                <p className="text-2xl font-bold text-green-600">+${portfolio.totalGain.toLocaleString()}</p>
                <p className="text-sm text-green-600 font-medium">+{portfolio.gainPercentage}%</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Change</p>
                <p className={`text-2xl font-bold ${portfolio.dayChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {portfolio.dayChange >= 0 ? '+' : ''}${portfolio.dayChange}
                </p>
                <p className={`text-sm font-medium ${portfolio.dayChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {portfolio.dayChange >= 0 ? '+' : ''}{portfolio.dayChangePercentage}%
                </p>
              </div>
              <div className={`p-3 rounded-xl ${portfolio.dayChange >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                {portfolio.dayChange >= 0 ? (
                  <TrendingUp className="h-6 w-6 text-green-600" />
                ) : (
                  <TrendingDown className="h-6 w-6 text-red-600" />
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Holdings</p>
                <p className="text-2xl font-bold text-gray-900">{holdings.length}</p>
                <p className="text-sm text-gray-500">Stocks</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <PieChart className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Holdings Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Your Holdings</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shares
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gain/Loss
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Allocation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {holdings.map((holding) => (
                  <tr key={holding.symbol} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{holding.symbol}</div>
                        <div className="text-sm text-gray-500">{holding.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {holding.shares}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${holding.currentPrice}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${holding.totalValue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${holding.gain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {holding.gain >= 0 ? '+' : ''}${Math.abs(holding.gain).toFixed(2)}
                      </div>
                      <div className={`text-xs ${holding.gain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {holding.gain >= 0 ? '+' : ''}{holding.gainPercentage}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${holding.allocation * 5}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{holding.allocation}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 transition-colors duration-200">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Investment Education */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">📚 Investment Learning</h2>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center">
              View All
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">Diversification Basics</h3>
              <p className="text-sm text-gray-600 mb-3">Learn how to spread risk across different investments</p>
              <button className="text-blue-600 text-sm font-medium hover:text-blue-700">Read More →</button>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">Dollar-Cost Averaging</h3>
              <p className="text-sm text-gray-600 mb-3">Invest regularly to reduce market timing risk</p>
              <button className="text-blue-600 text-sm font-medium hover:text-blue-700">Read More →</button>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">Risk Management</h3>
              <p className="text-sm text-gray-600 mb-3">Understand and manage investment risks effectively</p>
              <button className="text-blue-600 text-sm font-medium hover:text-blue-700">Read More →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Investments;

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  Target, 
  Calendar,
  BarChart3,
  Wallet,
  CreditCard,
  Building2,
  Users,
  Settings,
  LogOut,
  Plus,
  ArrowRight
} from 'lucide-react';

const ProfessionalDashboard = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const stats = [
    {
      title: 'Total Portfolio',
      value: '$125,430',
      change: '+12.5%',
      changeType: 'positive',
      icon: TrendingUp
    },
    {
      title: 'Monthly Income',
      value: '$8,500',
      change: '+5.2%',
      changeType: 'positive',
      icon: DollarSign
    },
    {
      title: 'Investment Growth',
      value: '$23,450',
      change: '+8.7%',
      changeType: 'positive',
      icon: BarChart3
    },
    {
      title: 'Emergency Fund',
      value: '$15,000',
      change: 'On Track',
      changeType: 'neutral',
      icon: Wallet
    }
  ];

  const quickActions = [
    { title: 'Add Investment', icon: Plus, color: 'bg-blue-500' },
    { title: 'Update Portfolio', icon: PieChart, color: 'bg-green-500' },
    { title: 'Set Goals', icon: Target, color: 'bg-purple-500' },
    { title: 'Schedule Review', icon: Calendar, color: 'bg-orange-500' }
  ];

  const recentTransactions = [
    { type: 'Investment', amount: '+$2,500', description: '401(k) Contribution', date: 'Today' },
    { type: 'Expense', amount: '-$150', description: 'Office Supplies', date: 'Yesterday' },
    { type: 'Income', amount: '+$8,500', description: 'Salary Deposit', date: '2 days ago' },
    { type: 'Investment', amount: '+$1,200', description: 'Stock Purchase', date: '3 days ago' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Professional Dashboard</h1>
                <p className="text-sm text-gray-500">Advanced financial planning for your career</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {userProfile?.firstName} {userProfile?.lastName}
                </p>
                <p className="text-xs text-gray-500">{currentUser?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <p className={`text-sm mt-1 ${
                      stat.changeType === 'positive' ? 'text-green-600' : 
                      stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {stat.change}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <IconComponent className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                {quickActions.map((action, index) => {
                  const IconComponent = action.icon;
                  return (
                    <button
                      key={index}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className={`p-2 rounded-lg ${action.color}`}>
                        <IconComponent className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{action.title}</span>
                      <ArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h2>
              <div className="space-y-4">
                {recentTransactions.map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        transaction.type === 'Income' ? 'bg-green-100' :
                        transaction.type === 'Expense' ? 'bg-red-100' : 'bg-blue-100'
                      }`}>
                        <DollarSign className={`w-4 h-4 ${
                          transaction.type === 'Income' ? 'text-green-600' :
                          transaction.type === 'Expense' ? 'text-red-600' : 'text-blue-600'
                        }`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                        <p className="text-xs text-gray-500">{transaction.date}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-semibold ${
                      transaction.type === 'Income' ? 'text-green-600' :
                      transaction.type === 'Expense' ? 'text-red-600' : 'text-blue-600'
                    }`}>
                      {transaction.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Professional Features */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Career Financial Planning</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">401(k) Optimization</span>
                <span className="text-sm text-blue-600">Review</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Tax Planning</span>
                <span className="text-sm text-green-600">Up to date</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Stock Options</span>
                <span className="text-sm text-purple-600">Manage</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Investment Portfolio</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Stocks</span>
                <span className="text-sm font-medium text-gray-900">45%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Bonds</span>
                <span className="text-sm font-medium text-gray-900">30%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Real Estate</span>
                <span className="text-sm font-medium text-gray-900">25%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalDashboard; 
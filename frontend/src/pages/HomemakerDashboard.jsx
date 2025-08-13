import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Home, 
  DollarSign, 
  PiggyBank, 
  ShoppingCart, 
  Calendar,
  Users,
  Target,
  TrendingUp,
  CreditCard,
  Receipt,
  Settings,
  LogOut,
  Plus,
  ArrowRight,
  Heart
} from 'lucide-react';

const HomemakerDashboard = () => {
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
      title: 'Monthly Budget',
      value: '$3,200',
      change: 'On Track',
      changeType: 'positive',
      icon: DollarSign
    },
    {
      title: 'Family Savings',
      value: '$12,450',
      change: '+8.3%',
      changeType: 'positive',
      icon: PiggyBank
    },
    {
      title: 'Grocery Spending',
      value: '$450',
      change: '-12%',
      changeType: 'positive',
      icon: ShoppingCart
    },
    {
      title: 'Emergency Fund',
      value: '$8,000',
      change: 'Goal Met',
      changeType: 'positive',
      icon: Heart
    }
  ];

  const quickActions = [
    { title: 'Add Expense', icon: Plus, color: 'bg-red-500' },
    { title: 'Set Savings Goal', icon: Target, color: 'bg-green-500' },
    { title: 'Plan Meals', icon: Calendar, color: 'bg-blue-500' },
    { title: 'Family Budget', icon: Users, color: 'bg-purple-500' }
  ];

  const recentExpenses = [
    { category: 'Groceries', amount: '$85.50', description: 'Weekly groceries', date: 'Today' },
    { category: 'Utilities', amount: '$120.00', description: 'Electricity bill', date: 'Yesterday' },
    { category: 'Entertainment', amount: '$45.00', description: 'Family movie night', date: '2 days ago' },
    { category: 'Healthcare', amount: '$65.00', description: 'Pharmacy visit', date: '3 days ago' }
  ];

  const savingsGoals = [
    { name: 'Family Vacation', target: '$5,000', current: '$3,200', progress: 64 },
    { name: 'Emergency Fund', target: '$10,000', current: '$8,000', progress: 80 },
    { name: 'Home Repairs', target: '$2,500', current: '$1,800', progress: 72 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Homemaker Dashboard</h1>
                <p className="text-sm text-gray-500">Family budgeting and household management</p>
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
                  <div className="p-3 bg-green-50 rounded-lg">
                    <IconComponent className="w-6 h-6 text-green-600" />
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

          {/* Recent Expenses */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Expenses</h2>
              <div className="space-y-4">
                {recentExpenses.map((expense, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                        <Receipt className="w-4 h-4 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{expense.description}</p>
                        <p className="text-xs text-gray-500">{expense.date} • {expense.category}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-red-600">
                      -{expense.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Savings Goals */}
        <div className="mt-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Savings Goals</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {savingsGoals.map((goal, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{goal.name}</h3>
                    <span className="text-sm text-gray-500">{goal.progress}%</span>
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>${goal.current}</span>
                      <span>${goal.target}</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Family Budget Categories */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Budget Categories</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Groceries</span>
                <span className="text-sm font-medium text-gray-900">$450 / $500</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '90%' }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Utilities</span>
                <span className="text-sm font-medium text-gray-900">$320 / $350</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '91%' }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Entertainment</span>
                <span className="text-sm font-medium text-gray-900">$120 / $200</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Family Members</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">JD</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">John Doe</span>
                </div>
                <span className="text-sm text-blue-600">Primary</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">JD</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">Jane Doe</span>
                </div>
                <span className="text-sm text-green-600">Spouse</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">KD</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">Kids</span>
                </div>
                <span className="text-sm text-purple-600">Dependents</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomemakerDashboard; 
import React, { useState } from 'react';
import { PieChart, Plus, TrendingDown, TrendingUp, DollarSign, Calendar, AlertCircle } from 'lucide-react';

const Budget = () => {
  const [budget] = useState({
    totalIncome: 2850,
    totalExpenses: 2100,
    remaining: 750,
    categories: [
      {
        name: 'Food & Dining',
        budgeted: 400,
        spent: 380,
        color: 'bg-red-500',
        icon: '🍕'
      },
      {
        name: 'Transportation',
        budgeted: 200,
        spent: 150,
        color: 'bg-blue-500',
        icon: '🚗'
      },
      {
        name: 'Entertainment',
        budgeted: 300,
        spent: 420,
        color: 'bg-purple-500',
        icon: '🎬'
      },
      {
        name: 'Shopping',
        budgeted: 250,
        spent: 180,
        color: 'bg-green-500',
        icon: '🛍️'
      },
      {
        name: 'Education',
        budgeted: 500,
        spent: 450,
        color: 'bg-yellow-500',
        icon: '📚'
      },
      {
        name: 'Health',
        budgeted: 150,
        spent: 120,
        color: 'bg-pink-500',
        icon: '🏥'
      }
    ]
  });

  const getSpendingPercentage = (spent, budgeted) => {
    return (spent / budgeted) * 100;
  };

  const getStatusColor = (spent, budgeted) => {
    const percentage = getSpendingPercentage(spent, budgeted);
    if (percentage > 100) return 'text-red-600';
    if (percentage > 80) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Budget Planner</h1>
            <p className="text-gray-600">Track your spending and stay on budget</p>
          </div>
          <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
            <Plus className="mr-2 h-5 w-5" />
            Add Category
          </button>
        </div>

        {/* Budget Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Income</p>
                <p className="text-2xl font-bold text-gray-900">${budget.totalIncome.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold text-gray-900">${budget.totalExpenses.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-xl">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Remaining</p>
                <p className="text-2xl font-bold text-green-600">${budget.remaining.toLocaleString()}</p>
                <p className="text-sm text-green-600 font-medium">26% of income</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Budget Period</p>
                <p className="text-2xl font-bold text-gray-900">Dec</p>
                <p className="text-sm text-gray-500">2024</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Budget Categories */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Spending by Category</h2>
          <div className="space-y-6">
            {budget.categories.map((category, index) => {
              const percentage = getSpendingPercentage(category.spent, category.budgeted);
              const statusColor = getStatusColor(category.spent, category.budgeted);
              const isOverBudget = category.spent > category.budgeted;

              return (
                <div key={index} className="border border-gray-100 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{category.icon}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-500">
                          ${category.spent} of ${category.budgeted} budgeted
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${statusColor}`}>
                        {percentage.toFixed(1)}%
                      </p>
                      {isOverBudget && (
                        <div className="flex items-center text-red-600 text-sm">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          Over budget
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${
                        isOverBudget ? 'bg-red-500' : category.color
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>

                  {/* Remaining/Over amount */}
                  <div className="mt-2 text-sm">
                    {isOverBudget ? (
                      <span className="text-red-600 font-medium">
                        ${(category.spent - category.budgeted).toFixed(2)} over budget
                      </span>
                    ) : (
                      <span className="text-green-600 font-medium">
                        ${(category.budgeted - category.spent).toFixed(2)} remaining
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Budget Tips */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💡 Budget Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Follow the 50/30/20 Rule</h3>
                  <p className="text-sm text-gray-600">50% needs, 30% wants, 20% savings</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Track Every Expense</h3>
                  <p className="text-sm text-gray-600">Small purchases add up quickly</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Review Monthly</h3>
                  <p className="text-sm text-gray-600">Adjust categories based on spending patterns</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 font-bold text-sm">4</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Emergency Fund First</h3>
                  <p className="text-sm text-gray-600">Build 3-6 months of expenses</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Budget;

import React, { useState } from 'react';
import { Target, Plus, TrendingUp, Calendar, DollarSign, CheckCircle } from 'lucide-react';

const Savings = () => {
  const [goals, setGoals] = useState([
    {
      id: 1,
      title: 'Emergency Fund',
      target: 5000,
      current: 3400,
      deadline: '2024-12-31',
      category: 'Emergency',
      color: 'from-red-500 to-pink-600'
    },
    {
      id: 2,
      title: 'Laptop Upgrade',
      target: 1500,
      current: 950,
      deadline: '2024-08-15',
      category: 'Technology',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      id: 3,
      title: 'Study Abroad Fund',
      target: 10000,
      current: 6800,
      deadline: '2025-06-01',
      category: 'Education',
      color: 'from-emerald-500 to-teal-600'
    }
  ]);

  const totalSaved = goals.reduce((sum, goal) => sum + goal.current, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.target, 0);
  const overallProgress = (totalSaved / totalTarget) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Savings Goals</h1>
            <p className="text-gray-600">Track your progress towards financial milestones</p>
          </div>
          <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
            <Plus className="mr-2 h-5 w-5" />
            New Goal
          </button>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Saved</p>
                <p className="text-3xl font-bold text-gray-900">${totalSaved.toLocaleString()}</p>
                <p className="text-sm text-green-600 font-medium">+8.2% this month</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-xl">
                <DollarSign className="h-8 w-8 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overall Progress</p>
                <p className="text-3xl font-bold text-gray-900">{overallProgress.toFixed(1)}%</p>
                <p className="text-sm text-gray-500">Across all goals</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Goals</p>
                <p className="text-3xl font-bold text-gray-900">{goals.length}</p>
                <p className="text-sm text-gray-500">In progress</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Savings Goals */}
        <div className="space-y-6">
          {goals.map((goal) => {
            const progress = (goal.current / goal.target) * 100;
            const remaining = goal.target - goal.current;
            const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));

            return (
              <div key={goal.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1 mb-4 lg:mb-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{goal.title}</h3>
                      <span className={`
                        inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
                        ${goal.category === 'Emergency' 
                          ? 'bg-red-100 text-red-700' 
                          : goal.category === 'Technology'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-emerald-100 text-emerald-700'
                        }
                      `}>
                        {goal.category}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="h-4 w-4 mr-1" />
                        <span>${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{daysLeft} days left</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>{progress.toFixed(1)}% complete</span>
                        <span>${remaining.toLocaleString()} remaining</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full bg-gradient-to-r ${goal.color} transition-all duration-500`}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200">
                      Edit Goal
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition-all duration-200">
                      Add Money
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Savings Tips */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💡 Savings Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900">Automate Your Savings</h3>
                <p className="text-sm text-gray-600">Set up automatic transfers to reach your goals faster</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900">Track Your Progress</h3>
                <p className="text-sm text-gray-600">Regular monitoring helps you stay motivated</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900">Start Small</h3>
                <p className="text-sm text-gray-600">Even $10 a week adds up to $520 per year</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900">Celebrate Milestones</h3>
                <p className="text-sm text-gray-600">Reward yourself when you reach 25%, 50%, 75% of your goal</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Savings;

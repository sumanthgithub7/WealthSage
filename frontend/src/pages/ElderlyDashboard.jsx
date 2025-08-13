import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  DollarSign, 
  Heart, 
  Shield, 
  Calendar,
  Target,
  TrendingUp,
  CreditCard,
  Receipt,
  Settings,
  LogOut,
  Plus,
  ArrowRight,
  Home,
  Pill,
  BookOpen
} from 'lucide-react';

const ElderlyDashboard = () => {
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
      title: 'Retirement Savings',
      value: '$245,000',
      change: '+3.2%',
      changeType: 'positive',
      icon: DollarSign
    },
    {
      title: 'Monthly Pension',
      value: '$2,800',
      change: 'Stable',
      changeType: 'neutral',
      icon: Shield
    },
    {
      title: 'Healthcare Budget',
      value: '$450',
      change: 'On Track',
      changeType: 'positive',
      icon: Heart
    },
    {
      title: 'Emergency Fund',
      value: '$25,000',
      change: 'Goal Met',
      changeType: 'positive',
      icon: Shield
    }
  ];

  const quickActions = [
    { title: 'Schedule Doctor', icon: Calendar, color: 'bg-blue-500' },
    { title: 'Review Insurance', icon: Shield, color: 'bg-green-500' },
    { title: 'Update Will', icon: BookOpen, color: 'bg-purple-500' },
    { title: 'Family Meeting', icon: Users, color: 'bg-orange-500' }
  ];

  const recentExpenses = [
    { category: 'Healthcare', amount: '$85.00', description: 'Doctor visit', date: 'Today' },
    { category: 'Medication', amount: '$45.50', description: 'Prescription refill', date: 'Yesterday' },
    { category: 'Utilities', amount: '$120.00', description: 'Electricity bill', date: '2 days ago' },
    { category: 'Groceries', amount: '$65.00', description: 'Weekly groceries', date: '3 days ago' }
  ];

  const healthcareSchedule = [
    { appointment: 'Annual Physical', date: 'Dec 15, 2024', doctor: 'Dr. Smith', status: 'Scheduled' },
    { appointment: 'Dental Checkup', date: 'Dec 20, 2024', doctor: 'Dr. Johnson', status: 'Scheduled' },
    { appointment: 'Eye Exam', date: 'Jan 5, 2025', doctor: 'Dr. Williams', status: 'Pending' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Elderly Dashboard</h1>
                <p className="text-sm text-gray-500">Retirement planning and healthcare management</p>
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
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <IconComponent className="w-6 h-6 text-purple-600" />
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
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        expense.category === 'Healthcare' ? 'bg-blue-100' :
                        expense.category === 'Medication' ? 'bg-red-100' : 'bg-gray-100'
                      }`}>
                        {expense.category === 'Healthcare' ? (
                          <Heart className="w-4 h-4 text-blue-600" />
                        ) : expense.category === 'Medication' ? (
                          <Pill className="w-4 h-4 text-red-600" />
                        ) : (
                          <Receipt className="w-4 h-4 text-gray-600" />
                        )}
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

        {/* Healthcare Schedule */}
        <div className="mt-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Healthcare Schedule</h2>
            <div className="space-y-4">
              {healthcareSchedule.map((appointment, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{appointment.appointment}</h3>
                      <p className="text-sm text-gray-500">{appointment.doctor}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{appointment.date}</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      appointment.status === 'Scheduled' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Retirement Planning & Insurance */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Retirement Planning</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">401(k) Balance</span>
                <span className="text-sm text-blue-600">$180,000</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Social Security</span>
                <span className="text-sm text-green-600">$2,800/month</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Required Minimum Distribution</span>
                <span className="text-sm text-purple-600">Due: April 2025</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Insurance Coverage</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Medicare</span>
                <span className="text-sm text-green-600">Active</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Medigap</span>
                <span className="text-sm text-blue-600">Plan G</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Long-term Care</span>
                <span className="text-sm text-purple-600">Covered</span>
              </div>
            </div>
          </div>
        </div>

        {/* Legacy Planning */}
        <div className="mt-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Legacy Planning</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-green-600" />
                  </div>
                  <h3 className="font-medium text-gray-900">Will & Trust</h3>
                </div>
                <p className="text-sm text-gray-600 mb-2">Last updated: 6 months ago</p>
                <button className="text-sm text-blue-600 hover:text-blue-700">Review Documents</button>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="font-medium text-gray-900">Power of Attorney</h3>
                </div>
                <p className="text-sm text-gray-600 mb-2">Designated: John Doe Jr.</p>
                <button className="text-sm text-blue-600 hover:text-blue-700">Update Designation</button>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Heart className="w-4 h-4 text-purple-600" />
                  </div>
                  <h3 className="font-medium text-gray-900">Healthcare Directive</h3>
                </div>
                <p className="text-sm text-gray-600 mb-2">On file with hospital</p>
                <button className="text-sm text-blue-600 hover:text-blue-700">Review Preferences</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElderlyDashboard; 
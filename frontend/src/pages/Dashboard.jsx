import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign,
  Target,
  TrendingUp,
  PieChart,
  Gift,
  ArrowUpRight,
  Plus,
  Eye,
  Calendar,
  Award,
  Sparkles,
  Zap,
  Star,
  BookOpen,
  Users,
  ChevronRight,
  Play
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [incomeData, setIncomeData] = useState({
    totalIncome: 0,
    monthlyIncome: 0,
    incomeTypes: []
  });
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const heroRef = useRef(null);

  // Get user data and update time
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Update time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timeInterval);
  }, []);

  // Optimized data fetching with caching and error handling
  useEffect(() => {
    const fetchIncomeData = async () => {
      try {
        // Check if data is already cached in sessionStorage
        const cachedData = sessionStorage.getItem('dashboardData');
        if (cachedData) {
          const parsed = JSON.parse(cachedData);
          const cacheTime = new Date(parsed.timestamp);
          const now = new Date();
          const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds

          // Use cached data if it's less than 5 minutes old
          if (now - cacheTime < fiveMinutes) {
            setIncomeData(parsed.data);
            setLoading(false);
            return;
          }
        }

        // Fetch only essential data for dashboard (limit to 5 items for speed)
        const response = await fetch('/api/opportunities/Scholarships');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Process the data for dashboard display
        const processedData = {
          totalIncome: 15420, // Mock data - replace with actual calculation
          monthlyIncome: 2850,
          incomeTypes: data.opportunities?.slice(0, 3) || []
        };

        // Cache the data with timestamp
        sessionStorage.setItem('dashboardData', JSON.stringify({
          data: processedData,
          timestamp: new Date().toISOString()
        }));

        setIncomeData(processedData);
      } catch (error) {
        console.error('Error fetching income data:', error);
        // Use fallback data if API fails
        setIncomeData({
          totalIncome: 15420,
          monthlyIncome: 2850,
          incomeTypes: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchIncomeData();
  }, []);

  // Helper functions
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getFirstName = () => {
    return user?.name?.split(' ')[0] || 'Student';
  };

  // Enhanced dashboard cards with creative layouts
  const dashboardCards = [
    {
      id: 'income',
      title: 'Income Sources',
      description: 'Track your earnings and opportunities',
      icon: DollarSign,
      value: `$${incomeData.monthlyIncome.toLocaleString()}`,
      subtext: 'This month',
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'from-emerald-50 to-teal-50',
      route: '/income',
      trend: '+12.5%'
    },
    {
      id: 'savings',
      title: 'Savings Goals',
      description: 'Monitor your progress towards financial goals',
      icon: Target,
      value: '68%',
      subtext: 'Goal completion',
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'from-blue-50 to-indigo-50',
      route: '/savings',
      trend: '+5.2%'
    },
    {
      id: 'investments',
      title: 'Investments',
      description: 'Grow your wealth with smart investments',
      icon: TrendingUp,
      value: '$8,240',
      subtext: 'Portfolio value',
      color: 'from-purple-500 to-violet-600',
      bgColor: 'from-purple-50 to-violet-50',
      route: '/investments',
      trend: '+18.3%'
    },
    {
      id: 'budget',
      title: 'Budget Planner',
      description: 'Plan and track your expenses',
      icon: PieChart,
      value: '$1,850',
      subtext: 'Remaining budget',
      color: 'from-orange-500 to-red-600',
      bgColor: 'from-orange-50 to-red-50',
      route: '/budget',
      trend: '-8.1%'
    },
    {
      id: 'rewards',
      title: 'Rewards & Perks',
      description: 'Earn rewards for achieving your goals',
      icon: Gift,
      value: '1,240',
      subtext: 'Points earned',
      color: 'from-pink-500 to-rose-600',
      bgColor: 'from-pink-50 to-rose-50',
      route: '/rewards',
      trend: '+25.0%'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'income',
      title: 'Scholarship Payment Received',
      amount: '+$1,500',
      date: '2 hours ago',
      icon: Award
    },
    {
      id: 2,
      type: 'savings',
      title: 'Emergency Fund Goal Reached',
      amount: '$5,000',
      date: '1 day ago',
      icon: Target
    },
    {
      id: 3,
      type: 'investment',
      title: 'Portfolio Dividend',
      amount: '+$45.20',
      date: '3 days ago',
      icon: TrendingUp
    }
  ];

  const handleCardClick = (route) => {
    navigate(route);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-xl animate-pulse">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your financial dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/5 to-pink-600/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <main className="relative">
        {/* Hero Section */}
        <section ref={heroRef} className="relative px-4 sm:px-6 lg:px-8 pt-8 pb-12">
          <div className="max-w-7xl mx-auto">
            {/* Dynamic Welcome Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl mb-6 shadow-2xl transform hover:scale-105 transition-all duration-300">
                <Sparkles className="w-10 h-10 text-white animate-pulse" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
                  {getGreeting()}, {getFirstName()}!
                </span>
                <span className="text-4xl ml-2">✨</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Your financial journey continues to grow. Here's what's happening with your money today.
              </p>
              <div className="mt-4 text-sm text-gray-500">
                {currentTime.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>

            {/* Enhanced Quick Stats with Creative Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
              {/* Primary Stat - Income */}
              <div className="lg:col-span-2">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 text-white shadow-2xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <p className="text-emerald-100 text-sm font-medium mb-2">Total Income This Month</p>
                        <p className="text-4xl font-bold">${incomeData.monthlyIncome.toLocaleString()}</p>
                        <p className="text-emerald-200 text-sm mt-2">+12.5% from last month</p>
                      </div>
                      <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                        <DollarSign className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => navigate('/income')}
                        className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition-all duration-200 backdrop-blur-sm"
                      >
                        <span className="text-sm font-medium">View Details</span>
                        <ArrowUpRight className="h-4 w-4" />
                      </button>
                      <div className="text-xs text-emerald-200">
                        {incomeData.incomeTypes.length} active sources
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Secondary Stats */}
              <div className="space-y-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <Target className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">68%</p>
                      <p className="text-sm text-gray-500">Savings Goal</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{ width: '68%' }}></div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Investment Growth</p>
                      <p className="text-2xl font-bold text-green-600">+18.3%</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-xl">
                      <TrendingUp className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Feature Cards Section */}
        <section className="px-4 sm:px-6 lg:px-8 pb-16">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Financial Toolkit</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Everything you need to manage your student finances in one place
              </p>
            </div>

            {/* Creative Card Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Income Sources - Large Featured Card */}
              <div
                onClick={() => navigate('/income')}
                className="lg:row-span-2 bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl p-8 text-white cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-2xl relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-500"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16 group-hover:scale-110 transition-transform duration-500"></div>

                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                      <DollarSign className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-xs bg-green-400/20 text-green-200 px-2 py-1 rounded-full">
                        +12.5% this month
                      </div>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mb-3">Income Sources</h3>
                  <p className="text-blue-100 mb-6 leading-relaxed">
                    Discover scholarships, hackathons, and freelancing opportunities.
                    Your gateway to financial growth.
                  </p>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-200 text-sm">Active Opportunities</span>
                      <span className="font-semibold">{incomeData.incomeTypes.length || 15}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-200 text-sm">This Month</span>
                      <span className="font-semibold">${incomeData.monthlyIncome.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-sm">
                    <span>Explore Opportunities</span>
                    <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                  </div>
                </div>
              </div>

              {/* Other Feature Cards */}
              <div className="space-y-6">
                {/* Budget Planner */}
                <div
                  onClick={() => navigate('/budget')}
                  className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-xl group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <PieChart className="h-6 w-6 text-white" />
                    </div>
                    <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Budget Planner</h3>
                  <p className="text-orange-100 text-sm mb-4">Track expenses and stay on budget</p>
                  <div className="text-2xl font-bold">$1,850</div>
                  <div className="text-orange-200 text-sm">Remaining this month</div>
                </div>

                {/* Investments */}
                <div
                  onClick={() => navigate('/investments')}
                  className="bg-gradient-to-br from-purple-600 to-violet-700 rounded-2xl p-6 text-white cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-xl group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Investments</h3>
                  <p className="text-purple-100 text-sm mb-4">Grow your wealth smartly</p>
                  <div className="text-2xl font-bold">$8,240</div>
                  <div className="text-purple-200 text-sm">+18.3% growth</div>
                </div>
              </div>
            </div>

            {/* Bottom Row Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Savings Goals */}
              <div
                onClick={() => navigate('/savings')}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 cursor-pointer transform hover:scale-105 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Target className="h-6 w-6 text-blue-600" />
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Savings Goals</h3>
                <p className="text-gray-600 text-sm mb-4">Track your progress towards financial milestones</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">68%</div>
                    <div className="text-gray-500 text-sm">Goal completion</div>
                  </div>
                  <div className="w-16 h-16 relative">
                    <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="2"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="2"
                        strokeDasharray="68, 100"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Rewards */}
              <div
                onClick={() => navigate('/rewards')}
                className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-6 text-white cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-xl group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Gift className="h-6 w-6 text-white" />
                  </div>
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
                <h3 className="text-xl font-bold mb-2">Rewards & Perks</h3>
                <p className="text-pink-100 text-sm mb-4">Earn points for achieving your goals</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">1,240</div>
                    <div className="text-pink-200 text-sm">Points earned</div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-300 fill-current" />
                    <Star className="h-4 w-4 text-yellow-300 fill-current" />
                    <Star className="h-4 w-4 text-yellow-300 fill-current" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Activities & Insights */}
        <section className="px-4 sm:px-6 lg:px-8 pb-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Activities */}
              <div className="lg:col-span-2">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Recent Activities</h2>
                    <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center space-x-1">
                      <span>View All</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {recentActivities.map((activity) => {
                      const IconComponent = activity.icon;
                      return (
                        <div key={activity.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl hover:shadow-md transition-all duration-200">
                          <div className="flex items-center space-x-4">
                            <div className="p-3 bg-blue-100 rounded-xl">
                              <IconComponent className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{activity.title}</p>
                              <p className="text-sm text-gray-500">{activity.date}</p>
                            </div>
                          </div>
                          <span className={`
                            font-bold text-lg
                            ${activity.amount.startsWith('+') ? 'text-green-600' : 'text-gray-900'}
                          `}>
                            {activity.amount}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Quick Actions & Tips */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
                  <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full flex items-center space-x-3 p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-all duration-200 backdrop-blur-sm">
                      <Plus className="h-5 w-5" />
                      <span className="text-sm font-medium">Add Income Source</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-all duration-200 backdrop-blur-sm">
                      <Target className="h-5 w-5" />
                      <span className="text-sm font-medium">Set New Goal</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-all duration-200 backdrop-blur-sm">
                      <BookOpen className="h-5 w-5" />
                      <span className="text-sm font-medium">Financial Tips</span>
                    </button>
                  </div>
                </div>

                {/* Financial Tip */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <Zap className="h-4 w-4 text-emerald-600" />
                    </div>
                    <h3 className="font-bold text-emerald-900">Today's Tip</h3>
                  </div>
                  <p className="text-emerald-800 text-sm leading-relaxed">
                    Start investing early! Even $25/month can grow to thousands over time thanks to compound interest.
                    Your future self will thank you.
                  </p>
                </div>

                {/* Community Stats */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                  <div className="flex items-center space-x-2 mb-4">
                    <Users className="h-5 w-5 text-blue-600" />
                    <h3 className="font-bold text-gray-900">Community</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Active Students</span>
                      <span className="font-semibold text-gray-900">12,847</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Earned</span>
                      <span className="font-semibold text-green-600">$2.4M</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Opportunities</span>
                      <span className="font-semibold text-blue-600">1,234</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;

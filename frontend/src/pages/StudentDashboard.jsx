import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  DollarSign, 
  Target, 
  TrendingUp, 
  Award, 
  Bell, 
  Settings,
  BookOpen,
  Zap,
  Star,
  ArrowUpRight,
  Plus,
  ChevronRight,
  Sparkles,
  GraduationCap,
  Users,
  Calendar,
  PieChart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const StudentDashboard = () => {
  const { userProfile, logout } = useAuth();
  const [incomeData, setIncomeData] = useState({
    totalIncome: 0,
    monthlyIncome: 0,
    incomeTypes: []
  });
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });

  // Update time every minute
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timeInterval);
  }, []);

  // Fetch income data
  useEffect(() => {
    const fetchIncomeData = async () => {
      try {
        // Check cache first
        const cachedData = sessionStorage.getItem('studentIncomeData');
        if (cachedData) {
          const parsed = JSON.parse(cachedData);
          if (Date.now() - parsed.timestamp < 300000) { // 5 minutes
            setIncomeData(parsed.data);
            setLoading(false);
            return;
          }
        }

        // Fetch from API
        const response = await fetch('http://localhost:8000/api/opportunities/Scholarships');
        if (response.ok) {
          const data = await response.json();
          const processedData = {
            totalIncome: data.length * 1500, // Mock calculation
            monthlyIncome: data.length * 300,
            incomeTypes: data.slice(0, 5) // Show first 5
          };
          
          setIncomeData(processedData);
          
          // Cache the data
          sessionStorage.setItem('studentIncomeData', JSON.stringify({
            data: processedData,
            timestamp: Date.now()
          }));
        } else {
          // Fallback data
          setIncomeData({
            totalIncome: 7500,
            monthlyIncome: 1200,
            incomeTypes: [
              { title: 'Merit Scholarship', amount: '$2,500', type: 'scholarship' },
              { title: 'Coding Bootcamp', amount: '$1,800', type: 'education' },
              { title: 'Freelance Project', amount: '$950', type: 'freelance' }
            ]
          });
        }
      } catch (error) {
        console.error('Error fetching income data:', error);
        // Fallback data
        setIncomeData({
          totalIncome: 7500,
          monthlyIncome: 1200,
          incomeTypes: [
            { title: 'Merit Scholarship', amount: '$2,500', type: 'scholarship' },
            { title: 'Coding Bootcamp', amount: '$1,800', type: 'education' },
            { title: 'Freelance Project', amount: '$950', type: 'freelance' }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchIncomeData();
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getFirstName = () => {
    return userProfile?.firstName || userProfile?.displayName?.split(' ')[0] || 'Student';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-xl animate-pulse">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                WealthSage
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 rounded-xl hover:bg-gray-50">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 block h-4 w-4 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                  3
                </span>
              </button>
              
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 rounded-xl hover:bg-gray-50">
                <Settings className="h-5 w-5" />
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm font-bold">
                    {getFirstName().charAt(0)}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-900">{getFirstName()}</span>
              </div>
              
              <button
                onClick={logout}
                className="text-red-600 hover:text-red-700 font-medium text-sm transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Hero Section */}
        <section ref={heroRef} className="relative px-4 sm:px-6 lg:px-8 pt-8 pb-12">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl mb-6 shadow-2xl transform hover:scale-105 transition-all duration-300">
                <GraduationCap className="w-10 h-10 text-white animate-pulse" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
                  {getGreeting()}, {getFirstName()}! 
                </span>
                <span className="text-4xl ml-2">🎓</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Your financial journey as a student continues to grow. Here's what's happening with your money today.
              </p>
              <div className="mt-4 text-sm text-gray-500">
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16"
            >
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
                      <button className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition-all duration-200 backdrop-blur-sm">
                        <span className="text-sm font-medium">View Opportunities</span>
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
                      <p className="text-sm font-medium text-gray-600">Reward Points</p>
                      <p className="text-2xl font-bold text-purple-600">1,240</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-xl">
                      <Award className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Main Dashboard Sections */}
        <section className="px-4 sm:px-6 lg:px-8 pb-16">
          <div className="max-w-7xl mx-auto">
            {/* Income Sources Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900">💰 Income Sources</h2>
                <button className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                  <Plus className="h-4 w-4" />
                  <span>Add Source</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {incomeData.incomeTypes.map((source, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 group cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-green-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                        <DollarSign className="h-6 w-6 text-green-600" />
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{source.title}</h3>
                    <p className="text-2xl font-bold text-green-600 mb-2">{source.amount}</p>
                    <p className="text-sm text-gray-500 capitalize">{source.type}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Creative Layout Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              {/* Savings Goal Tracker */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl p-8 text-white relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
                <div className="relative">
                  <div className="flex items-center space-x-3 mb-6">
                    <Target className="h-8 w-8 text-white" />
                    <h3 className="text-2xl font-bold">🎯 Savings Goals</h3>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-blue-100">Emergency Fund</span>
                        <span className="font-bold">$2,400 / $5,000</span>
                      </div>
                      <div className="w-full bg-blue-800/30 rounded-full h-3">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full" style={{ width: '48%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-blue-100">New Laptop</span>
                        <span className="font-bold">$800 / $1,200</span>
                      </div>
                      <div className="w-full bg-blue-800/30 rounded-full h-3">
                        <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full" style={{ width: '67%' }}></div>
                      </div>
                    </div>
                  </div>

                  <button className="mt-6 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition-all duration-200 backdrop-blur-sm">
                    <span className="text-sm font-medium">Set New Goal</span>
                  </button>
                </div>
              </motion.div>

              {/* Smart Budget & Investment */}
              <div className="space-y-6">
                {/* Smart Budget */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <PieChart className="h-6 w-6 text-orange-600" />
                    <h3 className="text-xl font-bold text-gray-900">🧠 Smart Budget</h3>
                  </div>
                  <p className="text-gray-600 mb-4">AI suggests saving 20% more on dining out this month.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">$1,850</span>
                    <span className="text-sm text-green-600 font-medium">↓ $200 saved</span>
                  </div>
                </motion.div>

                {/* Investment Placeholder */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-purple-600 to-violet-700 rounded-2xl p-6 text-white relative overflow-hidden"
                >
                  <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mb-12"></div>
                  <div className="relative">
                    <div className="flex items-center space-x-3 mb-4">
                      <TrendingUp className="h-6 w-6 text-white" />
                      <h3 className="text-xl font-bold">📈 Investments</h3>
                    </div>
                    <p className="text-purple-100 mb-4">Start your investment journey with as little as $25.</p>
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
                      <span className="text-sm font-medium">Coming Soon</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Bottom Section - Quick Actions & Tips */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white"
              >
                <h3 className="text-lg font-bold mb-4">⚡ Quick Actions</h3>
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
              </motion.div>

              {/* Financial Tip */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200"
              >
                <div className="flex items-center space-x-2 mb-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Zap className="h-4 w-4 text-emerald-600" />
                  </div>
                  <h3 className="font-bold text-emerald-900">💡 Today's Tip</h3>
                </div>
                <p className="text-emerald-800 text-sm leading-relaxed">
                  Start investing early! Even $25/month can grow to thousands over time thanks to compound interest.
                  Your future self will thank you.
                </p>
              </motion.div>

              {/* Community Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
              >
                <div className="flex items-center space-x-2 mb-4">
                  <Users className="h-5 w-5 text-blue-600" />
                  <h3 className="font-bold text-gray-900">👥 Community</h3>
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
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default StudentDashboard;

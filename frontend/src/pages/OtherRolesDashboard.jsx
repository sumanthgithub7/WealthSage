import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Bell, 
  Settings, 
  LogOut,
  Construction,
  Clock,
  Star,
  Briefcase,
  Home,
  Users,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const OtherRolesDashboard = () => {
  const { userProfile, logout } = useAuth();

  const getFirstName = () => {
    return userProfile?.firstName || userProfile?.displayName?.split(' ')[0] || 'User';
  };

  const getRoleIcon = () => {
    switch (userProfile?.role) {
      case 'Professional':
        return Briefcase;
      case 'Homemaker':
        return Home;
      case 'Elderly':
        return Users;
      default:
        return GraduationCap;
    }
  };

  const getRoleColor = () => {
    switch (userProfile?.role) {
      case 'Professional':
        return 'from-blue-600 to-indigo-700';
      case 'Homemaker':
        return 'from-green-600 to-emerald-700';
      case 'Elderly':
        return 'from-purple-600 to-violet-700';
      default:
        return 'from-gray-600 to-slate-700';
    }
  };

  const getRoleDescription = () => {
    switch (userProfile?.role) {
      case 'Professional':
        return 'Advanced investment tracking, career-focused financial planning, and professional networking features are coming soon.';
      case 'Homemaker':
        return 'Family budgeting tools, household expense tracking, and savings goal management for your family are in development.';
      case 'Elderly':
        return 'Retirement planning, healthcare budgeting, legacy planning, and senior-focused financial tools are being crafted for you.';
      default:
        return 'Your personalized financial dashboard is being developed with features tailored to your needs.';
    }
  };

  const RoleIcon = getRoleIcon();

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
                <span className="absolute -top-1 -right-1 block h-4 w-4 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center">
                  1
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
                className="flex items-center space-x-2 text-red-600 hover:text-red-700 font-medium text-sm transition-colors duration-200 px-3 py-2 rounded-xl hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
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

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Role Icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={`inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r ${getRoleColor()} rounded-3xl mb-8 shadow-2xl`}
            >
              <RoleIcon className="w-12 h-12 text-white" />
            </motion.div>

            {/* Welcome Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-8"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="text-gray-900">Hello, </span>
                <span className={`bg-gradient-to-r ${getRoleColor()} bg-clip-text text-transparent`}>
                  {getFirstName()}!
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-2">
                Welcome to your {userProfile?.role} dashboard
              </p>
            </motion.div>

            {/* Under Development Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20 mb-8"
            >
              <div className="flex items-center justify-center mb-6">
                <div className="p-4 bg-orange-100 rounded-2xl">
                  <Construction className="h-8 w-8 text-orange-600" />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                🚧 Your Personalized Dashboard is Under Development
              </h2>
              
              <p className="text-gray-600 leading-relaxed mb-6 max-w-2xl mx-auto">
                {getRoleDescription()}
              </p>

              <div className="flex items-center justify-center space-x-2 text-blue-600 mb-6">
                <Clock className="h-5 w-5" />
                <span className="font-medium">Coming Soon</span>
              </div>

              {/* Features Preview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Star className="h-4 w-4 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm">Personalized Features</h3>
                    <p className="text-xs text-gray-600 mt-1">Tailored to your role</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Sparkles className="h-4 w-4 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm">Smart Insights</h3>
                    <p className="text-xs text-gray-600 mt-1">AI-powered recommendations</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-4 border border-purple-200">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Users className="h-4 w-4 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm">Community</h3>
                    <p className="text-xs text-gray-600 mt-1">Connect with peers</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Notification Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white"
            >
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Bell className="h-6 w-6" />
                <h3 className="text-lg font-bold">Stay Updated</h3>
              </div>
              <p className="text-blue-100 mb-4">
                We'll notify you as soon as your personalized dashboard is ready. 
                In the meantime, explore our community features and financial resources.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button className="bg-white/20 hover:bg-white/30 px-6 py-2 rounded-xl font-medium transition-all duration-200 backdrop-blur-sm">
                  Join Community
                </button>
                <button className="bg-white/20 hover:bg-white/30 px-6 py-2 rounded-xl font-medium transition-all duration-200 backdrop-blur-sm">
                  Financial Resources
                </button>
              </div>
            </motion.div>

            {/* Footer Note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="mt-12 text-center"
            >
              <p className="text-gray-500 text-sm">
                Thank you for your patience as we build something amazing for you! 🚀
              </p>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default OtherRolesDashboard;

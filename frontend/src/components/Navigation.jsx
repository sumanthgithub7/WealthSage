import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  DollarSign, 
  PieChart, 
  TrendingUp, 
  Gift, 
  LogOut, 
  Menu, 
  X,
  Bell,
  Settings,
  User,
  Sparkles
} from 'lucide-react';

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState(3);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      current: location.pathname === '/dashboard',
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      name: 'Income',
      href: '/income',
      icon: DollarSign,
      current: location.pathname === '/income',
      gradient: 'from-emerald-500 to-teal-600'
    },
    {
      name: 'Budget',
      href: '/budget',
      icon: PieChart,
      current: location.pathname === '/budget',
      gradient: 'from-orange-500 to-red-600'
    },
    {
      name: 'Investments',
      href: '/investments',
      icon: TrendingUp,
      current: location.pathname === '/investments',
      gradient: 'from-purple-500 to-violet-600'
    },
    {
      name: 'Rewards',
      href: '/rewards',
      icon: Gift,
      current: location.pathname === '/rewards',
      gradient: 'from-pink-500 to-rose-600'
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/auth/login');
  };

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  WealthSage
                </h1>
                <p className="text-xs text-gray-500 -mt-1">Student Finance</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-1">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`
                      group relative flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300
                      ${item.current
                        ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg`
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }
                    `}
                  >
                    <IconComponent className={`
                      mr-2 h-4 w-4 transition-all duration-300
                      ${item.current ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}
                    `} />
                    {item.name}
                    
                    {/* Active indicator */}
                    {item.current && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-sm"></div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right side items */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 rounded-xl hover:bg-gray-50 group">
              <Bell className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 block h-5 w-5 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold flex items-center justify-center shadow-lg animate-pulse">
                  {notifications}
                </span>
              )}
            </button>

            {/* Settings */}
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 rounded-xl hover:bg-gray-50 group">
              <Settings className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
            </button>

            {/* Profile Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-all duration-200 group">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <span className="text-white text-sm font-bold">
                    {getInitials(user?.name)}
                  </span>
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-medium text-gray-900">{user?.name || 'Student'}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </button>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 group"
            >
              <LogOut className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
              <span className="hidden lg:inline">Logout</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-sm">
          <div className="px-4 pt-2 pb-3 space-y-1">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    group flex items-center px-3 py-3 rounded-xl text-base font-medium transition-all duration-200
                    ${item.current
                      ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg`
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                >
                  <IconComponent className={`
                    mr-3 h-5 w-5 transition-colors duration-200
                    ${item.current ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}
                  `} />
                  {item.name}
                </Link>
              );
            })}
            
            {/* Mobile Profile Section */}
            <div className="pt-4 border-t border-gray-100 mt-4">
              <div className="flex items-center px-3 py-2 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold">
                    {getInitials(user?.name)}
                  </span>
                </div>
                <div className="ml-3">
                  <p className="text-base font-medium text-gray-900">{user?.name || 'Student'}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>
              
              <div className="space-y-1">
                <button className="w-full flex items-center px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all duration-200">
                  <User className="mr-3 h-5 w-5" />
                  Profile Settings
                </button>
                
                <button className="w-full flex items-center px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all duration-200">
                  <Bell className="mr-3 h-5 w-5" />
                  Notifications
                  {notifications > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                      {notifications}
                    </span>
                  )}
                </button>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-3 py-2 text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200"
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navigation;

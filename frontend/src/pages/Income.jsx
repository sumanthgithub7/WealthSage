import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Plus, TrendingUp, Calendar, Award, Briefcase, Code } from 'lucide-react';

const Income = () => {
  const [incomeData, setIncomeData] = useState({
    scholarships: [],
    hackathons: [],
    freelancing: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  // Optimized data fetching with caching and lazy loading
  useEffect(() => {
    const fetchIncomeData = async () => {
      try {
        setLoading(true);

        // Check cache first
        const cacheKey = 'incomeData';
        const cachedData = sessionStorage.getItem(cacheKey);
        if (cachedData) {
          const parsed = JSON.parse(cachedData);
          const cacheTime = new Date(parsed.timestamp);
          const now = new Date();
          const tenMinutes = 10 * 60 * 1000; // 10 minutes cache

          if (now - cacheTime < tenMinutes) {
            setIncomeData(parsed.data);
            setLoading(false);
            return;
          }
        }

        // Fetch only the first category initially for faster load
        const scholarshipsRes = await fetch('/api/opportunities/Scholarships');
        if (!scholarshipsRes.ok) {
          throw new Error(`HTTP error! status: ${scholarshipsRes.status}`);
        }
        const scholarships = await scholarshipsRes.json();

        // Set initial data with scholarships
        const initialData = {
          scholarships: scholarships.opportunities || [],
          hackathons: [],
          freelancing: []
        };
        setIncomeData(initialData);
        setLoading(false);

        // Fetch other categories in background
        setTimeout(async () => {
          try {
            const [hackathonsRes, freelancingRes] = await Promise.all([
              fetch('/api/opportunities/Hackathons'),
              fetch('/api/opportunities/Freelancing')
            ]);

            const hackathons = await hackathonsRes.json();
            const freelancing = await freelancingRes.json();

            const fullData = {
              scholarships: scholarships.opportunities || [],
              hackathons: hackathons.opportunities || [],
              freelancing: freelancing.opportunities || []
            };

            setIncomeData(fullData);

            // Cache the complete data
            sessionStorage.setItem(cacheKey, JSON.stringify({
              data: fullData,
              timestamp: new Date().toISOString()
            }));
          } catch (error) {
            console.error('Error fetching additional income data:', error);
          }
        }, 100); // Small delay to prioritize initial render

      } catch (error) {
        console.error('Error fetching income data:', error);
        setIncomeData({
          scholarships: [],
          hackathons: [],
          freelancing: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchIncomeData();
  }, []);

  const tabs = [
    { id: 'all', name: 'All Sources', icon: TrendingUp },
    { id: 'scholarships', name: 'Scholarships', icon: Award },
    { id: 'hackathons', name: 'Hackathons', icon: Code },
    { id: 'freelancing', name: 'Freelancing', icon: Briefcase }
  ];

  const getFilteredData = () => {
    switch (activeTab) {
      case 'scholarships':
        return incomeData.scholarships;
      case 'hackathons':
        return incomeData.hackathons;
      case 'freelancing':
        return incomeData.freelancing;
      default:
        return [
          ...incomeData.scholarships,
          ...incomeData.hackathons,
          ...incomeData.freelancing
        ];
    }
  };

  const getTotalIncome = () => {
    // Mock calculation - replace with actual income calculation
    return {
      total: 15420,
      monthly: 2850,
      growth: 12.5
    };
  };

  const incomeStats = getTotalIncome();
  const filteredData = getFilteredData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Income Sources</h1>
          <p className="text-gray-600">Track and manage your income opportunities</p>
        </div>

        {/* Income Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Income</p>
                <p className="text-3xl font-bold text-gray-900">${incomeStats.total.toLocaleString()}</p>
                <p className="text-sm text-green-600 font-medium">+{incomeStats.growth}% this month</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-xl">
                <TrendingUp className="h-8 w-8 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Income</p>
                <p className="text-3xl font-bold text-gray-900">${incomeStats.monthly.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Current month</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Sources</p>
                <p className="text-3xl font-bold text-gray-900">{filteredData.length}</p>
                <p className="text-sm text-gray-500">Opportunities</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 inline-flex">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                    ${activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Income Sources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredData.map((opportunity, index) => (
            <div
              key={`${opportunity.title}-${index}`}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Category Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className={`
                  inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
                  ${opportunity.type === 'Scholarship' 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : opportunity.type === 'Hackathon'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-blue-100 text-blue-700'
                  }
                `}>
                  {opportunity.type}
                </span>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50">
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                {opportunity.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {opportunity.description}
              </p>

              {/* Metadata */}
              <div className="space-y-2 mb-4">
                {opportunity.deadline && opportunity.deadline !== 'Not specified' && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Deadline: {opportunity.deadline}</span>
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-500">
                  <span>Source: {opportunity.source}</span>
                </div>
              </div>

              {/* Action Button */}
              <a
                href={opportunity.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                <span>Apply Now</span>
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </a>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No income sources found</h3>
            <p className="text-gray-500 mb-6">Start exploring opportunities to boost your income</p>
            <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
              <Plus className="mr-2 h-5 w-5" />
              Explore Opportunities
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Income;

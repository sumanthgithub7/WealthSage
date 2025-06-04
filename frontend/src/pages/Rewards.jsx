import React, { useState } from 'react';
import { Gift, Star, Trophy, Target, Zap, Crown, Award } from 'lucide-react';

const Rewards = () => {
  const [userStats] = useState({
    totalPoints: 1240,
    level: 'Silver',
    nextLevel: 'Gold',
    pointsToNext: 760,
    streak: 15
  });

  const [achievements] = useState([
    {
      id: 1,
      title: 'First Savings Goal',
      description: 'Completed your first savings goal',
      points: 100,
      icon: Target,
      earned: true,
      date: '2024-01-15'
    },
    {
      id: 2,
      title: 'Budget Master',
      description: 'Stayed under budget for 3 months',
      points: 250,
      icon: Trophy,
      earned: true,
      date: '2024-02-20'
    },
    {
      id: 3,
      title: 'Investment Starter',
      description: 'Made your first investment',
      points: 150,
      icon: Star,
      earned: false,
      date: null
    },
    {
      id: 4,
      title: 'Streak Champion',
      description: 'Tracked expenses for 30 days straight',
      points: 200,
      icon: Zap,
      earned: false,
      date: null
    }
  ]);

  const [rewards] = useState([
    {
      id: 1,
      title: 'Premium Features',
      description: 'Unlock advanced analytics and insights',
      cost: 500,
      category: 'Features',
      available: true
    },
    {
      id: 2,
      title: 'Financial Consultation',
      description: '30-minute session with a financial advisor',
      cost: 1000,
      category: 'Services',
      available: true
    },
    {
      id: 3,
      title: 'Investment Course',
      description: 'Complete beginner\'s guide to investing',
      cost: 750,
      category: 'Education',
      available: true
    },
    {
      id: 4,
      title: 'Custom Budget Template',
      description: 'Personalized budget template for your goals',
      cost: 300,
      category: 'Tools',
      available: true
    }
  ]);

  const getLevelProgress = () => {
    const totalForNext = 2000; // Points needed for Gold level
    const current = userStats.totalPoints;
    return (current / totalForNext) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Rewards & Perks</h1>
          <p className="text-gray-600">Earn points and unlock rewards for achieving your financial goals</p>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-medium">Total Points</p>
                <p className="text-3xl font-bold">{userStats.totalPoints.toLocaleString()}</p>
              </div>
              <Crown className="h-8 w-8 text-yellow-100" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current Level</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.level}</p>
                <p className="text-sm text-gray-500">Member</p>
              </div>
              <div className="p-3 bg-silver-100 rounded-xl">
                <Award className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Next Level</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.nextLevel}</p>
                <p className="text-sm text-blue-600 font-medium">{userStats.pointsToNext} points to go</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current Streak</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.streak}</p>
                <p className="text-sm text-green-600 font-medium">Days active</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Level Progress */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Level Progress</h2>
            <span className="text-sm text-gray-500">{getLevelProgress().toFixed(1)}% to {userStats.nextLevel}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all duration-500"
              style={{ width: `${getLevelProgress()}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Earn {userStats.pointsToNext} more points to unlock {userStats.nextLevel} benefits
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Achievements */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Achievements</h2>
            <div className="space-y-4">
              {achievements.map((achievement) => {
                const IconComponent = achievement.icon;
                return (
                  <div
                    key={achievement.id}
                    className={`
                      flex items-center space-x-4 p-4 rounded-xl border transition-all duration-200
                      ${achievement.earned
                        ? 'bg-green-50 border-green-200'
                        : 'bg-gray-50 border-gray-200'
                      }
                    `}
                  >
                    <div className={`
                      p-3 rounded-xl
                      ${achievement.earned
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-400'
                      }
                    `}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${achievement.earned ? 'text-gray-900' : 'text-gray-500'}`}>
                        {achievement.title}
                      </h3>
                      <p className={`text-sm ${achievement.earned ? 'text-gray-600' : 'text-gray-400'}`}>
                        {achievement.description}
                      </p>
                      {achievement.earned && achievement.date && (
                        <p className="text-xs text-green-600 font-medium mt-1">
                          Earned on {new Date(achievement.date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className={`text-right ${achievement.earned ? 'text-green-600' : 'text-gray-400'}`}>
                      <p className="font-bold">+{achievement.points}</p>
                      <p className="text-xs">points</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rewards Store */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Rewards Store</h2>
            <div className="space-y-4">
              {rewards.map((reward) => (
                <div
                  key={reward.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors duration-200"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{reward.title}</h3>
                      <span className={`
                        px-2 py-1 rounded-full text-xs font-medium
                        ${reward.category === 'Features' ? 'bg-blue-100 text-blue-700' :
                          reward.category === 'Services' ? 'bg-purple-100 text-purple-700' :
                          reward.category === 'Education' ? 'bg-green-100 text-green-700' :
                          'bg-yellow-100 text-yellow-700'
                        }
                      `}>
                        {reward.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{reward.description}</p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-bold text-gray-900">{reward.cost} pts</p>
                    <button
                      className={`
                        px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                        ${userStats.totalPoints >= reward.cost
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }
                      `}
                      disabled={userStats.totalPoints < reward.cost}
                    >
                      {userStats.totalPoints >= reward.cost ? 'Redeem' : 'Not enough points'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* How to Earn Points */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🎯 How to Earn Points</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Complete Goals</h3>
              <p className="text-sm text-gray-600">50-200 points</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Daily Check-ins</h3>
              <p className="text-sm text-gray-600">10 points/day</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Trophy className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Achievements</h3>
              <p className="text-sm text-gray-600">100-500 points</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Milestones</h3>
              <p className="text-sm text-gray-600">25-100 points</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rewards;

import React, { useState } from 'react';
import { Plus, TrendingUp, Calendar, Bell, Menu, ArrowLeft, X, ChevronLeft, ChevronRight, Home, MoreVertical } from 'lucide-react';

// Placeholder data
const PLACEHOLDER_HABITS = [
  {
    id: '1',
    name: 'Drink Water',
    description: 'Hydration fuels your mind',
    measurable: true,
    unit: 'glasses',
    target: 8,
    direction: 'at-least',
    todayValue: 5,
    icon: '💧',
    color: '#60A5FA',
    frequency: 'daily',
    daysPerWeek: 7,
    completions: {
      '2024-12-08': 8,
      '2024-12-09': 7,
      '2024-12-10': 5,
      '2024-12-04': 8,
      '2024-12-05': 9,
      '2024-12-06': 8,
      '2024-12-07': 8,
    }
  },
  {
    id: '2',
    name: 'Meditation',
    description: 'Take 10 minutes to breathe and reset',
    measurable: false,
    todayValue: true,
    icon: '🧘',
    color: '#EC4899',
    frequency: 'daily',
    daysPerWeek: 7,
    completions: {
      '2024-12-04': true,
      '2024-12-05': true,
      '2024-12-06': false,
      '2024-12-07': true,
      '2024-12-08': true,
      '2024-12-09': true,
      '2024-12-10': false,
    }
  },
  {
    id: '3',
    name: 'Running',
    description: 'Stay active and healthy',
    measurable: true,
    unit: 'km',
    target: 5,
    direction: 'at-least',
    todayValue: 3,
    icon: '🏃',
    color: '#FBBF24',
    frequency: 'custom',
    daysPerWeek: 4,
    completions: {
      '2024-12-04': 5,
      '2024-12-05': 0,
      '2024-12-06': 5,
      '2024-12-07': 0,
      '2024-12-08': 6,
      '2024-12-09': 0,
      '2024-12-10': 3,
    }
  }
];

// Welcome Screen
const WelcomeScreen = ({ onGetStarted }) => (
  <div className="min-h-screen bg-gradient-to-br from-lime-400 to-lime-500 flex flex-col justify-between p-8">
    <div className="flex-1 flex items-center justify-center">
      <div className="text-white opacity-20 text-9xl font-black transform -rotate-12">
        <div className="mb-4">STEP</div>
        <div className="ml-12">UP</div>
      </div>
    </div>
    
    <div className="space-y-6">
      <div>
        <h1 className="text-5xl font-bold text-gray-900 mb-3">Welcome to StepUp</h1>
        <p className="text-lg text-gray-800 opacity-80">Build better habits — every day</p>
      </div>
      
      <button
        onClick={onGetStarted}
        className="w-full bg-white text-gray-900 py-4 rounded-full font-semibold text-lg flex items-center justify-between px-6 shadow-lg hover:shadow-xl transition-all"
      >
        <div className="w-10 h-10 bg-lime-400 rounded-full flex items-center justify-center">
          <ChevronRight className="w-5 h-5 text-gray-900" />
        </div>
        <span>Get started</span>
        <div className="w-10"></div>
      </button>
    </div>
  </div>
);

// Today Dashboard
const TodayDashboard = ({ habits, onNavigate, onAddHabit }) => {
  const weekDays = ['Wed', 'Thus', 'Fri', 'Sat', 'Sun'];
  const dates = [20, 21, 22, 23, 24];
  const currentDate = 22;
  
  // Format large numbers (e.g., 1000 -> 1k, 1500 -> 1.5k)
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return num.toString();
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <img 
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop" 
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="text-sm text-gray-500">Good morning,</p>
              <p className="font-semibold text-gray-900">Sara Anderson</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-6">
          <ChevronLeft className="w-5 h-5 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">Aug 2025</span>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
        
        <div className="flex justify-between gap-2">
          {weekDays.map((day, idx) => (
            <div
              key={idx}
              className={`flex-1 text-center py-3 rounded-2xl transition-all ${
                dates[idx] === currentDate
                  ? 'bg-lime-400 text-gray-900'
                  : 'bg-gray-50 text-gray-600'
              }`}
            >
              <div className="text-xs mb-1">{day}</div>
              <div className="font-semibold">{dates[idx]}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="px-6 mt-6">
        <div className="bg-lime-400 rounded-3xl p-6 relative overflow-hidden">
          <button className="absolute top-4 right-4 p-1 hover:bg-lime-500 rounded-full transition-colors">
            <X className="w-4 h-4 text-gray-800" />
          </button>
          <p className="text-sm font-semibold text-gray-800 mb-2">Daily motivation</p>
          <p className="text-gray-800 leading-relaxed pr-20">One step today makes you stronger tomorrow</p>
          <div className="absolute bottom-4 right-4 text-white opacity-30 text-7xl font-black transform rotate-12">
            <div className="scale-75">STEP</div>
          </div>
        </div>
      </div>
      
      <div className="px-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Daily habits</h2>
          <button className="text-sm text-gray-600">See more</button>
        </div>
        
        <div className="space-y-4">
          {habits.map(habit => {
            const progress = habit.measurable ? (habit.todayValue / habit.target) * 100 : (habit.todayValue ? 100 : 0);
            
            return (
              <div
                key={habit.id}
                className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow"
                onClick={() => onNavigate('detail', habit.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{habit.name}</h3>
                    <p className="text-sm text-gray-500">{habit.description}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {habit.frequency === 'daily' 
                        ? 'Every day' 
                        : `${habit.daysPerWeek} days a week`}
                    </p>
                  </div>
                  <button className="p-1">
                    <MoreVertical className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <button className="bg-lime-400 text-gray-900 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-lime-500 transition-colors shadow-sm">
                    <Plus className="w-4 h-4" />
                    {habit.measurable ? `Add ${habit.unit.slice(0, -1)}` : 'Mark Done'}
                  </button>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{habit.icon}</span>
                    <div className="relative w-14 h-14">
                      <svg className="w-14 h-14 transform -rotate-90">
                        <circle
                          cx="28"
                          cy="28"
                          r="24"
                          stroke="#F3F4F6"
                          strokeWidth="5"
                          fill="none"
                        />
                        <circle
                          cx="28"
                          cy="28"
                          r="24"
                          stroke={habit.color}
                          strokeWidth="5"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 24}`}
                          strokeDashoffset={`${2 * Math.PI * 24 * (1 - progress / 100)}`}
                          strokeLinecap="round"
                          className="transition-all duration-300"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-xs font-bold text-gray-900">
                          {habit.measurable ? `${formatNumber(habit.todayValue)}/${formatNumber(habit.target)}` : (habit.todayValue ? '✓' : '○')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 pt-2 pb-6 safe-area-bottom">
        <div className="flex items-center justify-around relative">
          <button 
            onClick={() => onNavigate('today')}
            className="flex flex-col items-center gap-1 py-2 text-lime-500"
          >
            <Home className="w-6 h-6" />
            <span className="text-xs font-medium">Home</span>
          </button>
          
          <button
            onClick={onAddHabit}
            className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
          >
            <Plus className="w-7 h-7 text-white" />
          </button>
          
          <button 
            onClick={() => onNavigate('progress')}
            className="flex flex-col items-center gap-1 py-2 text-gray-400"
          >
            <TrendingUp className="w-6 h-6" />
            <span className="text-xs font-medium">Progress</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Progress Screen
const ProgressScreen = ({ habits, onNavigate }) => {
  const [timeRange, setTimeRange] = useState('Month');
  const [selectedHabit, setSelectedHabit] = useState(habits[0]?.id);
  const [currentInsight, setCurrentInsight] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(11); // December
  const [selectedYear, setSelectedYear] = useState(2024);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  
  const timeRanges = ['Month', 'Half-year', 'Year'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const currentHabit = habits.find(h => h.id === selectedHabit);
  
  // Generate insights
  const generateInsights = (habit) => {
    if (!habit) return [{ icon: '👋', message: 'Select a habit to see insights!' }];
    
    const insights = [];
    const completionValues = Object.values(habit.completions || {});
    
    if (habit.measurable) {
      const total = completionValues.reduce((sum, val) => sum + (val || 0), 0);
      const avg = total / (completionValues.length || 1);
      insights.push({
        icon: '📊',
        message: `Averaging ${avg.toFixed(1)} ${habit.unit} per day`
      });
      
      insights.push({
        icon: '🔥',
        message: 'Strong consistency! Keep it up!'
      });
      
      insights.push({
        icon: '📈',
        message: 'Improving trend detected'
      });
    } else {
      const completedDays = completionValues.filter(v => v === true).length;
      const totalDays = completionValues.length || 1;
      const rate = Math.round((completedDays / totalDays) * 100);
      
      insights.push({
        icon: '✅',
        message: `${rate}% completion rate`
      });
      
      insights.push({
        icon: '🎯',
        message: 'Great consistency!'
      });
      
      insights.push({
        icon: '⭐',
        message: 'You are on track!'
      });
    }
    
    return insights;
  };
  
  const insights = generateInsights(currentHabit);
  
  // Calculate weekly data based on time range
  const calculateWeeklyData = () => {
    if (!currentHabit) return [];
    
    const weeklyData = [];
    let startDate, endDate;
    
    // Determine date range based on timeRange
    if (timeRange === 'Month') {
      startDate = new Date(selectedYear, selectedMonth, 1);
      endDate = new Date(selectedYear, selectedMonth + 1, 0);
    } else if (timeRange === 'Half-year') {
      // 6 months back from selected month
      startDate = new Date(selectedYear, selectedMonth - 5, 1);
      endDate = new Date(selectedYear, selectedMonth + 1, 0);
    } else {
      // Year - 12 months back from selected month
      startDate = new Date(selectedYear, selectedMonth - 11, 1);
      endDate = new Date(selectedYear, selectedMonth + 1, 0);
    }
    
    // Calculate weeks in range
    let currentWeekStart = new Date(startDate);
    let weekNum = 1;
    
    while (currentWeekStart <= endDate) {
      const weekEnd = new Date(currentWeekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      // Don't go beyond end date
      const actualWeekEnd = weekEnd > endDate ? endDate : weekEnd;
      
      let weekTotal = 0;
      let weekTarget = 0;
      let daysCompleted = 0;
      let daysCommitted = 0; // For non-measurable activities
      
      // Iterate through days in this week
      let currentDay = new Date(currentWeekStart);
      while (currentDay <= actualWeekEnd) {
        const dateKey = `${currentDay.getFullYear()}-${String(currentDay.getMonth() + 1).padStart(2, '0')}-${String(currentDay.getDate()).padStart(2, '0')}`;
        const value = currentHabit.completions[dateKey];
        
        if (currentHabit.measurable) {
          weekTotal += value || 0;
          weekTarget += currentHabit.target;
        } else {
          // For non-measurable: count days based on frequency commitment
          if (currentHabit.frequency === 'daily' || currentHabit.daysPerWeek === 7) {
            // Every day commitment
            daysCommitted++;
            if (value === true) daysCompleted++;
          } else {
            // Custom frequency - proportional commitment
            // For example, 3 days/week means ~0.43 commitment per day
            const commitmentPerDay = currentHabit.daysPerWeek / 7;
            daysCommitted += commitmentPerDay;
            if (value === true) daysCompleted++;
          }
        }
        
        currentDay.setDate(currentDay.getDate() + 1);
      }
      
      const percentage = currentHabit.measurable 
        ? (weekTarget > 0 ? Math.min(Math.round((weekTotal / weekTarget) * 100), 100) : 0)
        : (daysCommitted > 0 ? Math.min(Math.round((daysCompleted / daysCommitted) * 100), 100) : 0);
      
      weeklyData.push({
        week: `W${weekNum}`,
        achieved: weekTotal,
        target: weekTarget,
        days: daysCompleted,
        targetDays: Math.round(daysCommitted),
        percentage: percentage || 0
      });
      
      currentWeekStart = new Date(actualWeekEnd);
      currentWeekStart.setDate(currentWeekStart.getDate() + 1);
      weekNum++;
    }
    
    return weeklyData;
  };
  
  const weeklyData = calculateWeeklyData();
  
  // Calculate weeks completed and success rate
  const calculateWeeksStats = () => {
    // A week is "completed" only if percentage >= 100%
    const completedWeeks = weeklyData.filter(w => w.percentage >= 100).length;
    const totalWeeks = weeklyData.length;
    const successRate = totalWeeks > 0 ? Math.round((completedWeeks / totalWeeks) * 100) : 0;
    
    return { completedWeeks, totalWeeks, successRate };
  };
  
  const weeksStats = calculateWeeksStats();
  
  // Calculate total for month/period
  const calculateMonthTotal = () => {
    if (!currentHabit) return { totalValue: 0, totalDays: 0, totalSessions: 0 };
    
    let startDate, endDate;
    
    if (timeRange === 'Month') {
      startDate = new Date(selectedYear, selectedMonth, 1);
      endDate = new Date(selectedYear, selectedMonth + 1, 0);
    } else if (timeRange === 'Half-year') {
      startDate = new Date(selectedYear, selectedMonth - 5, 1);
      endDate = new Date(selectedYear, selectedMonth + 1, 0);
    } else {
      startDate = new Date(selectedYear, selectedMonth - 11, 1);
      endDate = new Date(selectedYear, selectedMonth + 1, 0);
    }
    
    let totalValue = 0;
    let totalDays = 0;
    let totalSessions = 0;
    
    let currentDay = new Date(startDate);
    while (currentDay <= endDate) {
      const dateKey = `${currentDay.getFullYear()}-${String(currentDay.getMonth() + 1).padStart(2, '0')}-${String(currentDay.getDate()).padStart(2, '0')}`;
      const value = currentHabit.completions[dateKey];
      
      if (currentHabit.measurable) {
        totalValue += value || 0;
        if (value > 0) totalDays++;
      } else {
        if (value === true) {
          totalSessions++;
          totalDays++;
        }
      }
      
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    return { totalValue, totalDays, totalSessions };
  };
  
  const monthStats = calculateMonthTotal();
  
  const changeMonth = (direction) => {
    let newMonth = selectedMonth + direction;
    let newYear = selectedYear;
    
    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }
    
    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white px-5 pt-8 pb-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900">Progress</h1>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        <div className="flex gap-2 mb-3">
          {timeRanges.map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-lime-400 text-gray-900 shadow-sm'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
        
        <div className="flex items-center justify-between mb-3 bg-gray-50 rounded-xl p-2">
          <button 
            onClick={() => changeMonth(-1)}
            className="p-2 hover:bg-white rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={() => setShowMonthPicker(!showMonthPicker)}
            className="flex items-center gap-2 px-4 py-2 hover:bg-white rounded-lg transition-colors"
          >
            <Calendar className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">
              {monthNames[selectedMonth]} {selectedYear}
            </span>
          </button>
          <button 
            onClick={() => changeMonth(1)}
            className="p-2 hover:bg-white rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        {showMonthPicker && (
          <div className="absolute z-20 bg-white rounded-2xl shadow-lg p-4 mt-2 left-5 right-5">
            <div className="grid grid-cols-3 gap-2">
              {monthNames.map((month, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedMonth(idx);
                    setShowMonthPicker(false);
                  }}
                  className={`py-2 rounded-xl text-sm font-medium transition-colors ${
                    idx === selectedMonth
                      ? 'bg-lime-400 text-gray-900'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {month}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <select
          value={selectedHabit}
          onChange={(e) => setSelectedHabit(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-lime-400 focus:outline-none text-sm text-gray-900 bg-white"
        >
          {habits.map(habit => (
            <option key={habit.id} value={habit.id}>
              {habit.icon} {habit.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="px-5 pt-4 space-y-3">
        <div className="bg-gradient-to-br from-lime-400 to-lime-500 rounded-2xl p-4 shadow-md relative overflow-hidden">
          <div className="flex items-center gap-3 relative z-10">
            <span className="text-3xl">{insights[currentInsight]?.icon}</span>
            <p className="text-sm font-medium text-gray-900 flex-1 leading-relaxed">
              {insights[currentInsight]?.message}
            </p>
          </div>
          
          {insights.length > 1 && (
            <div className="flex gap-1.5 justify-center mt-3">
              {insights.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentInsight(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    currentInsight === idx ? 'w-6 bg-gray-900' : 'w-1.5 bg-gray-700/30'
                  }`}
                />
              ))}
            </div>
          )}
          
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full"></div>
        </div>
        
        <div className="bg-white rounded-2xl p-5 shadow-md">
          <h3 className="text-sm font-medium text-gray-500 mb-3">
            {monthNames[selectedMonth]} {selectedYear} Summary
          </h3>
          
          {currentHabit?.measurable ? (
            <div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-bold text-lime-500">{monthStats.totalValue}</span>
                <span className="text-lg text-gray-500">{currentHabit.unit}</span>
              </div>
              <p className="text-sm text-gray-600">
                Total {currentHabit.unit} • {monthStats.totalDays} active days
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-bold text-lime-500">{monthStats.totalSessions}</span>
                <span className="text-lg text-gray-500">sessions</span>
              </div>
              <p className="text-sm text-gray-600">
                Total sessions completed
              </p>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-4 shadow-md">
            <p className="text-xs text-gray-500 mb-1">Weeks Done</p>
            <p className="text-2xl font-bold text-lime-500">{weeksStats.completedWeeks}</p>
            <p className="text-xs text-gray-400">of {weeksStats.totalWeeks}</p>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mt-2">
              <div 
                className="h-full bg-lime-400 rounded-full"
                style={{ width: `${weeksStats.successRate}%` }}
              />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-4 shadow-md">
            <p className="text-xs text-gray-500 mb-1">Success Rate</p>
            <p className="text-2xl font-bold text-lime-500">{weeksStats.successRate}%</p>
            <p className="text-xs text-gray-400">{weeksStats.completedWeeks} of {weeksStats.totalWeeks} weeks</p>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-4 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Weekly Breakdown</h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {weeklyData.length} weeks
            </span>
          </div>
          
          <div className="relative h-40 mb-4">
            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-400 pr-2">
              <span>100%</span>
              <span>50%</span>
              <span>0%</span>
            </div>
            
            <div className="ml-10 h-full flex items-end justify-between gap-0.5 border-b border-l border-gray-200">
              {weeklyData.map((week, idx) => {
                const height = week.percentage;
                const isAboveTarget = week.percentage >= 100;
                
                return (
                  <div key={idx} className="flex-1 relative h-full flex flex-col justify-end items-center group">
                    <div className="absolute -top-20 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap pointer-events-none">
                      <p className="font-semibold">{week.week}</p>
                      {currentHabit?.measurable ? (
                        <>
                          <p>Achieved: {week.achieved}</p>
                          <p>Target: {week.target}</p>
                        </>
                      ) : (
                        <>
                          <p>Days: {week.days}</p>
                          <p>Target: {week.targetDays}</p>
                        </>
                      )}
                      <p>{week.percentage}%</p>
                    </div>
                    
                    <div 
                      className={`w-full ${weeklyData.length <= 10 ? 'rounded-t-lg' : 'rounded-t'} transition-all ${
                        isAboveTarget ? 'bg-lime-400' : 
                        week.percentage >= 75 ? 'bg-lime-300' :
                        week.percentage >= 50 ? 'bg-yellow-300' :
                        week.percentage >= 25 ? 'bg-orange-300' : 'bg-red-300'
                      }`}
                      style={{ height: `${height}%`, minHeight: '3px' }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
          
          {weeklyData.length <= 10 && (
            <div className="ml-10 flex justify-between text-xs text-gray-500 mt-6">
              {weeklyData.map((week, idx) => (
                <span key={idx} className="flex-1 text-center">{week.week}</span>
              ))}
            </div>
          )}
          
          <div className="flex items-center justify-center gap-3 mt-4 pt-4 border-t border-gray-100 flex-wrap">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-lime-400"></div>
              <span className="text-xs text-gray-600">100%+</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-yellow-300"></div>
              <span className="text-xs text-gray-600">50-74%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-orange-300"></div>
              <span className="text-xs text-gray-600">&lt;50%</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 pt-2 pb-6">
        <div className="flex items-center justify-around relative">
          <button 
            onClick={() => onNavigate('today')}
            className="flex flex-col items-center gap-1 py-2 text-gray-400"
          >
            <Home className="w-6 h-6" />
            <span className="text-xs font-medium">Home</span>
          </button>
          
          <button className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center shadow-lg">
            <Plus className="w-7 h-7 text-white" />
          </button>
          
          <button className="flex flex-col items-center gap-1 py-2 text-lime-500">
            <TrendingUp className="w-6 h-6" />
            <span className="text-xs font-medium">Progress</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Create Habit Screen
const CreateHabitScreen = ({ onBack, onCreate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [measurable, setMeasurable] = useState(false);
  const [unit, setUnit] = useState('minutes');
  const [customUnit, setCustomUnit] = useState('');
  const [target, setTarget] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [daysPerWeek, setDaysPerWeek] = useState('7');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const commonHabits = [
    { name: 'Running', icon: '🏃', measurable: true, unit: 'km', target: '5' },
    { name: 'Swimming', icon: '🏊', measurable: true, unit: 'minutes', target: '30' },
    { name: 'Rowing', icon: '🚣', measurable: true, unit: 'minutes', target: '20' },
    { name: 'Meditation', icon: '🧘', measurable: true, unit: 'minutes', target: '10' },
    { name: 'Reading', icon: '📚', measurable: true, unit: 'pages', target: '20' },
    { name: 'Drink Water', icon: '💧', measurable: true, unit: 'glasses', target: '8' },
  ];
  
  const selectSuggestion = (habit) => {
    setName(habit.name);
    setMeasurable(habit.measurable);
    if (habit.measurable) {
      setUnit(habit.unit);
      setTarget(habit.target);
    }
    setShowSuggestions(false);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white px-6 pt-6 pb-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Create New Habit</h1>
        </div>
      </div>
      
      <div className="px-6 pt-6 space-y-4">
        <div className="bg-white rounded-3xl p-5 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-3">Habit Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setShowSuggestions(e.target.value.length > 0);
            }}
            placeholder="e.g., Morning Meditation"
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-lime-400 focus:outline-none text-gray-900"
          />
          
          {showSuggestions && (
            <div className="mt-3 space-y-2">
              <p className="text-xs font-medium text-gray-500 mb-2">SUGGESTIONS</p>
              <div className="grid grid-cols-2 gap-2">
                {commonHabits
                  .filter(h => h.name.toLowerCase().includes(name.toLowerCase()))
                  .slice(0, 6)
                  .map((habit, idx) => (
                    <button
                      key={idx}
                      onClick={() => selectSuggestion(habit)}
                      className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 hover:bg-lime-50 transition-colors text-left"
                    >
                      <span className="text-xl">{habit.icon}</span>
                      <span className="text-sm font-medium text-gray-700">{habit.name}</span>
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-3xl p-5 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-3">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a motivating description..."
            rows="2"
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-lime-400 focus:outline-none text-gray-900 resize-none"
          />
        </div>
        
        <div className="bg-white rounded-3xl p-5 shadow-sm">
          <label className="flex items-center gap-3 cursor-pointer mb-4">
            <input
              type="checkbox"
              checked={measurable}
              onChange={(e) => setMeasurable(e.target.checked)}
              className="w-5 h-5 text-lime-500 rounded focus:ring-lime-400"
            />
            <div>
              <span className="text-gray-900 font-medium block">Make this measurable</span>
              <span className="text-xs text-gray-500">Track specific values</span>
            </div>
          </label>
          
          {measurable && (
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Unit</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-lime-400 focus:outline-none text-gray-900"
                >
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                  <option value="glasses">Glasses</option>
                  <option value="pages">Pages</option>
                  <option value="km">Kilometers</option>
                  <option value="custom">Custom / Other</option>
                </select>
              </div>
              
              {unit === 'custom' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Custom Unit</label>
                  <input
                    type="text"
                    value={customUnit}
                    onChange={(e) => setCustomUnit(e.target.value)}
                    placeholder="e.g., steps, liters"
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-lime-400 focus:outline-none text-gray-900"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Daily Target</label>
                <input
                  type="number"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="10"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-lime-400 focus:outline-none text-gray-900"
                />
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-3xl p-5 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-3">Frequency</label>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-gray-50">
              <input
                type="radio"
                name="frequency"
                value="daily"
                checked={frequency === 'daily'}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-4 h-4 text-lime-500"
              />
              <span className="text-gray-900 font-medium">Every day</span>
            </label>
            
            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-gray-50">
              <input
                type="radio"
                name="frequency"
                value="custom"
                checked={frequency === 'custom'}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-4 h-4 text-lime-500"
              />
              <span className="text-gray-900 font-medium">Custom days per week</span>
            </label>
            
            {frequency === 'custom' && (
              <div className="ml-10">
                <input
                  type="number"
                  min="1"
                  max="7"
                  value={daysPerWeek}
                  onChange={(e) => setDaysPerWeek(e.target.value)}
                  className="w-20 px-4 py-2 rounded-xl border border-gray-200 focus:border-lime-400 focus:outline-none text-gray-900"
                />
              </div>
            )}
          </div>
        </div>
        
        <button
          onClick={onCreate}
          className="w-full bg-lime-400 text-gray-900 py-4 rounded-full font-semibold text-lg hover:bg-lime-500 transition-colors shadow-sm"
        >
          Create Habit
        </button>
      </div>
    </div>
  );
};

// Habit Detail Screen
const HabitDetailScreen = ({ habit, onBack }) => {
  const year = 2024;
  const month = 11;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  
  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }
  
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white px-6 pt-6 pb-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-gray-900">{habit.name}</h1>
            <p className="text-xs text-gray-500">{habit.description}</p>
            <p className="text-xs text-gray-500 mt-1">
              Target: <span className="text-lime-600 font-medium">{habit.measurable ? `${habit.target} ${habit.unit}` : 'Complete daily'}</span>
            </p>
          </div>
          <span className="text-2xl">{habit.icon}</span>
        </div>
      </div>
      
      <div className="px-6 pt-6 space-y-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today Progress</h3>
          
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="56" stroke="#F3F4F6" strokeWidth="12" fill="none" />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke={habit.color}
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - (habit.measurable ? habit.todayValue / habit.target : habit.todayValue ? 1 : 0))}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold text-gray-900">
                  {habit.measurable ? habit.todayValue : (habit.todayValue ? '✓' : '○')}
                </div>
                {habit.measurable && <div className="text-sm text-gray-500">of {habit.target}</div>}
              </div>
            </div>
          </div>
          
          <button className="w-full bg-lime-400 text-gray-900 py-3 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-lime-500 transition-colors">
            <Plus className="w-5 h-5" />
            {habit.measurable ? `Add ${habit.unit}` : 'Mark Complete'}
          </button>
        </div>
        
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">{monthNames[month]} {year}</h3>
            <div className="flex gap-2">
              <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-2 mb-3">
            {weekDays.map(day => (
              <div key={day} className="text-center text-xs font-medium text-gray-400">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, idx) => {
              if (!day) {
                return <div key={idx} className="aspect-square"></div>;
              }
              
              const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const dayValue = habit.completions[dateKey];
              const isComplete = habit.measurable 
                ? (dayValue !== undefined && dayValue >= habit.target)
                : dayValue === true;
              const isPartial = habit.measurable && dayValue !== undefined && dayValue > 0 && dayValue < habit.target;
              const isToday = day === 10;
              
              return (
                <div
                  key={idx}
                  className={`aspect-square rounded-xl flex items-center justify-center text-sm font-medium transition-all
                    ${isComplete ? 'bg-lime-400 text-gray-900' : ''}
                    ${isPartial ? 'bg-orange-200 text-gray-700' : ''}
                    ${!dayValue && day <= 10 ? 'bg-gray-100 text-gray-400' : ''}
                    ${day > 10 ? 'bg-gray-50 text-gray-300' : ''}
                    ${isToday ? 'ring-2 ring-lime-500 ring-offset-2' : ''}
                  `}
                >
                  {day}
                </div>
              );
            })}
          </div>
          
          <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-lime-400"></div>
              <span className="text-xs text-gray-600">Completed</span>
            </div>
            {habit.measurable && (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-orange-200"></div>
                <span className="text-xs text-gray-600">Partial</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gray-100"></div>
              <span className="text-xs text-gray-600">Missed</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-3xl p-5 shadow-sm text-center">
            <p className="text-3xl font-bold text-lime-500 mb-1">100%</p>
            <p className="text-sm text-gray-600">7-Day Rate</p>
          </div>
          <div className="bg-white rounded-3xl p-5 shadow-sm text-center">
            <p className="text-3xl font-bold" style={{ color: habit.color }}>85%</p>
            <p className="text-sm text-gray-600">30-Day Rate</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button className="flex-1 bg-white text-gray-900 py-3 rounded-full font-medium border border-gray-200 hover:bg-gray-50 transition-colors">
            Edit Habit
          </button>
          <button className="flex-1 bg-white text-red-600 py-3 rounded-full font-medium border border-gray-200 hover:bg-gray-50 transition-colors">
            Archive
          </button>
        </div>
      </div>
    </div>
  );
};

export default function HabitTrackerApp() {
  const [screen, setScreen] = useState('welcome');
  const [selectedHabitId, setSelectedHabitId] = useState(null);
  const [habits, setHabits] = useState([]);
  
  const navigate = (newScreen, habitId = null) => {
    setScreen(newScreen);
    if (habitId) setSelectedHabitId(habitId);
  };
  
  const handleGetStarted = () => {
    setHabits(PLACEHOLDER_HABITS);
    setScreen('today');
  };
  
  const selectedHabit = habits.find(h => h.id === selectedHabitId);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl">
        {screen === 'welcome' && habits.length === 0 && (
          <WelcomeScreen onGetStarted={handleGetStarted} />
        )}
        
        {screen === 'today' && habits.length > 0 && (
          <TodayDashboard 
            habits={habits} 
            onNavigate={navigate}
            onAddHabit={() => navigate('create')}
          />
        )}
        
        {screen === 'progress' && habits.length > 0 && (
          <ProgressScreen habits={habits} onNavigate={navigate} />
        )}
        
        {screen === 'create' && (
          <CreateHabitScreen 
            onBack={() => setScreen('today')}
            onCreate={() => setScreen('today')}
          />
        )}
        
        {screen === 'detail' && selectedHabit && (
          <HabitDetailScreen 
            habit={selectedHabit}
            onBack={() => setScreen('today')}
          />
        )}
      </div>
    </div>
  );
}
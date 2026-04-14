import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Bell, 
  Layers,
  MoreHorizontal,
  Plus,
  Music,
  X,
  CheckCircle2,
  ArrowRight,
  CreditCard,
  Loader2,
  DollarSign,
  TrendingUp,
  Tv,
  Gamepad,
  Zap,
  LayoutGrid
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip, YAxis, CartesianGrid } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { useUser } from '../context/UserContext';

// --- Types ---
type TimeRange = '6M' | '1Y' | 'ALL';

interface QuickUser {
  id: string;
  name: string;
  avatar: string;
}

// --- Mock Data (Charts Only) ---
const chartDataSets: Record<TimeRange, { name: string; value: number }[]> = {
  '6M': [],
  '1Y': [],
  'ALL': []
};

const quickUsers: QuickUser[] = [];

// --- Components ---

const CircularProgress: React.FC<{ percentage: number; color: string; size?: number }> = ({ percentage, color, size = 40 }) => {
  const radius = size / 2 - 4;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90 w-full h-full">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          className="text-gray-200 dark:text-white/10"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth="4"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { activeSubscriptions, transactions, subtractFromWallet, activeSubscriptions: subs } = useUser();

  // State
  const [timeRange, setTimeRange] = useState<TimeRange>('6M');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Transfer Modal State
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferUser, setTransferUser] = useState<QuickUser | null>(null);
  const [transferAmount, setTransferAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Derived Calculations
  const monthlySpend = activeSubscriptions.reduce((acc, sub) => acc + sub.price, 0);
  
  const filteredActivities = useMemo(() => {
    return transactions.filter(a => 
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      a.type.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5); // Show last 5
  }, [transactions, searchQuery]);

  // Handlers
  const handleTimeRangeChange = (range: TimeRange) => setTimeRange(range);

  const openTransferModal = (user: QuickUser | null = null) => {
    setTransferUser(user);
    setTransferAmount('');
    setShowTransferModal(true);
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferAmount) return;

    setIsProcessing(true);
    const amountVal = parseFloat(transferAmount);
    const recipient = transferUser?.name || 'User';
    
    const success = await subtractFromWallet(amountVal, `Transfer to ${recipient}`, 'Withdrawal');
    
    setIsProcessing(false);
    setShowTransferModal(false);

    if (success) {
      addToast(`Successfully sent $${transferAmount} to ${recipient}`, 'success');
    } else {
      addToast(`Insufficient funds for transfer`, 'error');
    }
  };

  // Helper to render icons based on text if they are strings
  const renderIcon = (sub: any) => {
    // If it's a known string icon
    if (typeof sub.icon === 'string') {
        return sub.icon;
    }
    // Fallback if JSX/Component didn't persist well in LS, assume generic
    return '★';
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-6 overflow-hidden bg-gray-50 dark:bg-[#0B0A15] transition-colors duration-300 relative" onClick={() => setShowNotifications(false)}>
      
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 shrink-0 gap-4 relative z-20">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Overview
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Track your shared subscriptions in real-time</p>
        </div>
        <div className="flex gap-4 self-end md:self-auto items-center">
          
          {/* Search Toggle */}
          <div className={`transition-all duration-300 overflow-hidden ${showSearch ? 'w-48 md:w-64 opacity-100' : 'w-0 opacity-0'}`}>
            <div className="relative">
               <input 
                 type="text" 
                 placeholder="Search activity..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:border-primary text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30"
                 autoFocus={showSearch}
               />
               <button onClick={() => { setShowSearch(false); setSearchQuery(''); }} className="absolute right-2 top-2 text-gray-400 hover:text-gray-600 dark:hover:text-white">
                 <X className="w-4 h-4" />
               </button>
            </div>
          </div>

          {!showSearch && (
            <button 
              onClick={(e) => { e.stopPropagation(); setShowSearch(true); }}
              className="w-10 h-10 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors shadow-sm dark:shadow-none"
            >
              <Search className="w-5 h-5" />
            </button>
          )}
          
          <div className="relative">
            <button 
              onClick={(e) => { e.stopPropagation(); setShowNotifications(!showNotifications); }}
              className={`w-10 h-10 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 relative transition-colors shadow-sm dark:shadow-none ${showNotifications ? 'bg-gray-100 dark:bg-white/10' : ''}`}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-[#0B0A15]"></span>
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div 
                className="absolute right-0 top-12 w-80 bg-white dark:bg-[#1A1729] rounded-2xl shadow-xl border border-gray-200 dark:border-white/10 p-2 z-50 animate-[fadeIn_0.2s] origin-top-right"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center p-3 pb-2">
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white">Notifications</h3>
                  <button className="text-[10px] text-primary hover:underline">Mark all read</button>
                </div>
                <div className="space-y-1 max-h-64 overflow-y-auto custom-scrollbar">
                  {[
                    { text: 'Netflix payment due in 2 days', time: '1h ago', read: false },
                    { text: 'Sarah accepted your invite', time: '3h ago', read: false },
                    { text: 'New login from Chrome Windows', time: '1d ago', read: true },
                  ].map((notif, idx) => (
                    <div key={idx} className={`p-3 rounded-xl flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors ${!notif.read ? 'bg-blue-50/50 dark:bg-blue-500/5' : ''}`}>
                      <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${!notif.read ? 'bg-primary' : 'bg-gray-300 dark:bg-white/20'}`}></div>
                      <div>
                        <p className={`text-xs ${!notif.read ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-500 dark:text-gray-400'}`}>{notif.text}</p>
                        <p className="text-[10px] text-gray-400 mt-1">{notif.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-2 border-t border-gray-100 dark:border-white/5 mt-1">
                   <button className="w-full py-2 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">View All History</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pr-2 pb-20 no-scrollbar">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 md:gap-8">
          
          {/* Main Column (KPIs + Chart + Tracker) */}
          <div className="xl:col-span-3 space-y-6 md:space-y-8">
            
            {/* KPI Widgets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Widget 1: Monthly Spend */}
              <div className="bg-white dark:bg-[#1A1729] rounded-3xl p-6 border border-gray-200 dark:border-white/5 relative overflow-hidden group hover:border-primary/20 transition-colors shadow-sm dark:shadow-none">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Monthly Spend</p>
                    <h3 className="text-3xl md:text-4xl font-bold mt-2 text-gray-900 dark:text-white">${monthlySpend.toFixed(2)}</h3>
                  </div>
                  <div className="bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 text-xs font-bold px-2 py-1 rounded-lg border border-green-200 dark:border-green-500/20 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> +2.4%
                  </div>
                </div>
                <div className="relative pt-2">
                  <div className="w-full bg-gray-100 dark:bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-primary h-1.5 rounded-full shadow-[0_0_10px_rgba(71,37,244,0.5)]" style={{ width: '65%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">65% of budget utilized</p>
                </div>
              </div>

              {/* Widget 2: Active Subs */}
              <div className="bg-white dark:bg-[#1A1729] rounded-3xl p-6 border border-gray-200 dark:border-white/5 relative overflow-hidden group hover:border-blue-500/20 transition-colors shadow-sm dark:shadow-none cursor-pointer" onClick={() => navigate('/wallet')}>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Active Subs</p>
                    <h3 className="text-3xl md:text-4xl font-bold mt-2 text-gray-900 dark:text-white">{activeSubscriptions.length}</h3>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center border border-blue-100 dark:border-blue-500/20 text-blue-500 dark:text-blue-400">
                    <Layers className="w-5 h-5" />
                  </div>
                </div>

              </div>

              {/* Widget 3: Next Payment */}
              <div className="bg-white dark:bg-[#1A1729] rounded-3xl p-6 border border-gray-200 dark:border-white/5 relative overflow-hidden group hover:border-red-500/20 transition-colors shadow-sm dark:shadow-none sm:col-span-2 xl:col-span-1">
                 {/* Background blur for effect */}
                <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-red-500/5 rounded-full blur-2xl"></div>
                
                {activeSubscriptions.length > 0 ? (() => {
                  const nextSub = [...activeSubscriptions].sort((a, b) => new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime())[0];
                  return (
                    <>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Next Payment</p>
                        </div>
                        <div className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-[10px] font-bold px-2 py-1 rounded border border-red-100 dark:border-red-500/20">
                          {new Date(nextSub.renewalDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{nextSub.name}</h3>
                      
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded ${nextSub.bg || 'bg-gray-100'} flex items-center justify-center p-1 border border-white/10 shrink-0`}>
                          <span className={`${nextSub.color || 'text-gray-900'} font-bold text-xs`}>{renderIcon(nextSub)}</span>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-gray-900 dark:text-white">${nextSub.price.toFixed(2)}</p>
                          <p className="text-xs text-gray-500">via Wallet</p>
                        </div>
                      </div>
                    </>
                  );
                })() : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <p className="text-sm font-medium">No upcoming payments</p>
                  </div>
                )}
              </div>
            </div>

            {/* Spending Trends Chart */}
            <div className="bg-white dark:bg-[#1A1729] rounded-3xl p-6 border border-gray-200 dark:border-white/5 relative overflow-hidden min-h-[300px] flex flex-col shadow-sm dark:shadow-none transition-colors">
              {/* Glow effect */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-primary/5 dark:bg-blue-900/10 blur-[100px] pointer-events-none"></div>
              
              <div className="flex justify-between items-center mb-6 relative z-10">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Spending Trends</h3>
                <div className="flex bg-gray-100 dark:bg-black/40 rounded-lg p-1 border border-gray-200 dark:border-white/5">
                  {(['6M', '1Y', 'ALL'] as TimeRange[]).map((range) => (
                    <button 
                      key={range}
                      onClick={() => handleTimeRangeChange(range)}
                      className={`px-3 py-1 text-xs font-bold rounded transition-all ${
                        timeRange === range 
                          ? 'bg-white dark:bg-primary text-gray-900 dark:text-white shadow-sm' 
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 w-full h-full min-h-[220px] relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartDataSets[timeRange]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4725f4" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#4725f4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(128,128,128,0.15)" />
                    <Tooltip 
                      cursor={{stroke: 'rgba(71, 37, 244, 0.3)', strokeWidth: 1}}
                      contentStyle={{ backgroundColor: '#1A1729', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                      itemStyle={{ color: '#fff' }}
                      labelStyle={{ display: 'none' }}
                      formatter={(value: number) => [`$${value.toFixed(2)}`, 'Spend']}
                    />
                    <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#9ca3af', fontSize: 11 }} 
                        dy={10}
                    />
                    <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#9ca3af', fontSize: 11 }}
                        tickFormatter={(value) => `$${value}`}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#4725f4" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorValue)" 
                      animationDuration={1000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Subscription Tracker */}
            <div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">Subscription Tracker</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                
                {subs.length > 0 ? subs.map(sub => (
                   <div key={sub.id} className={`rounded-3xl p-5 border relative group shadow-sm dark:shadow-none hover:translate-y-[-2px] transition-transform ${sub.bg === 'bg-white' ? 'bg-white border-gray-200' : 'bg-gray-900 dark:bg-[#131313] border-white/5 text-white'}`}>
                      <div className="flex justify-between items-start mb-4">
                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-lg ${sub.bg} border border-white/10 ${sub.color}`}>
                           {renderIcon(sub)}
                         </div>
                         <span className="bg-white/10 text-gray-500 dark:text-white/60 text-[10px] px-2 py-1 rounded border border-white/5">Shared</span>
                      </div>
                      <div className="mb-6">
                         <h4 className={`font-bold ${sub.bg === 'bg-white' ? 'text-gray-900' : 'text-white'}`}>{sub.name}</h4>
                         <p className="text-xs text-gray-400">{sub.plan}</p>
                      </div>
                      <div className="flex items-end justify-between">
                         <div>
                            <p className="text-[10px] text-gray-400 mb-1">Renewal</p>
                            <p className={`text-lg font-bold ${sub.bg === 'bg-white' ? 'text-gray-900' : 'text-white'}`}>
                              {new Date(sub.renewalDate).toLocaleDateString(undefined, {month:'short', day:'numeric'})}
                            </p>
                         </div>
                         <div className={`text-xl font-bold ${sub.bg === 'bg-white' ? 'text-gray-900' : 'text-white'}`}>
                           ${sub.price}
                         </div>
                      </div>
                   </div>
                )) : (
                  <div className="col-span-3 text-center py-10 bg-white dark:bg-white/5 rounded-3xl border border-gray-200 dark:border-white/5 text-gray-400">
                    <p>No active subscriptions.</p>
                    <button onClick={() => navigate('/marketplace')} className="mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold">Browse Marketplace</button>
                  </div>
                )}

              </div>
            </div>

          </div>

          {/* Right Column (Activity & Transfer) */}
          <div className="xl:col-span-1 flex flex-col gap-8 h-full">
             
             {/* Recent Activity */}
             <div className="flex-1">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-lg text-gray-900 dark:text-white">Recent Activity</h3>
                 <MoreHorizontal className="text-gray-400 hover:text-gray-600 dark:hover:text-white w-5 h-5 cursor-pointer transition-colors" />
               </div>

               <div className="space-y-4">
                 {filteredActivities.length > 0 ? (
                    filteredActivities.map((activity) => (
                      <div 
                        key={activity.id} 
                        className="bg-white dark:bg-[#1A1729] p-4 rounded-2xl border border-gray-200 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors relative overflow-hidden shadow-sm dark:shadow-none animate-[fadeIn_0.5s]"
                      >
                        <div className={`absolute top-0 left-0 w-1 h-full ${activity.type === 'Deposit' ? 'bg-green-500' : 'bg-primary'}`}></div>
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-sm font-bold text-gray-900 dark:text-white">{activity.name}</span>
                          <span className="text-[10px] text-gray-500">{activity.date}</span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                           <span className={`text-[10px] px-2 py-0.5 rounded ${activity.type === 'Deposit' ? 'bg-green-500/10 text-green-500' : 'bg-gray-100 dark:bg-white/10 text-gray-500'}`}>
                             {activity.type}
                           </span>
                           <span className={`text-sm font-bold ${activity.amount > 0 ? 'text-green-500' : 'text-gray-900 dark:text-white'}`}>
                             {activity.amount > 0 ? '+' : ''}${Math.abs(activity.amount).toFixed(2)}
                           </span>
                        </div>
                      </div>
                    ))
                 ) : (
                   <div className="text-center py-8 text-gray-400 text-sm">No activity found.</div>
                 )}
               </div>
             </div>

             {/* Quick Transfer */}
             <div className="pt-6 border-t border-gray-200 dark:border-white/5">
                <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500 mb-4">Quick Transfer</h3>
                <div className="flex justify-between items-center">
                   <div 
                      onClick={() => openTransferModal(null)}
                      className="flex flex-col items-center gap-2 cursor-pointer group"
                    >
                      <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-300 dark:border-white/20 flex items-center justify-center text-gray-400 dark:text-white/50 group-hover:border-primary group-hover:text-primary transition-all">
                         <Plus className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] text-gray-500 group-hover:text-primary dark:group-hover:text-white transition-colors">Add</span>
                   </div>
                   
                   {quickUsers.map((u) => (
                      <div 
                        key={u.id} 
                        onClick={() => openTransferModal(u)}
                        className="flex flex-col items-center gap-2 cursor-pointer group"
                      >
                         <div className="w-12 h-12 rounded-full p-0.5 border-2 border-transparent group-hover:border-primary transition-all">
                           <img src={u.avatar || undefined} className="w-full h-full rounded-full object-cover" alt={u.name} />
                         </div>
                         <span className="text-[10px] text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{u.name}</span>
                      </div>
                   ))}
                </div>
             </div>

          </div>
        </div>
      </div>

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isProcessing && setShowTransferModal(false)}></div>
          <div className="relative w-full max-w-sm bg-white dark:bg-[#1A1729] rounded-3xl shadow-2xl animate-[fadeIn_0.3s] border border-gray-200 dark:border-white/10 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 dark:border-white/5 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quick Transfer</h2>
              <button onClick={() => setShowTransferModal(false)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleTransfer} className="p-6">
               <div className="flex flex-col items-center mb-6">
                 <div className="w-16 h-16 rounded-full overflow-hidden mb-3 border-4 border-gray-50 dark:border-white/5">
                   {transferUser ? (
                      <img src={transferUser.avatar || undefined} className="w-full h-full object-cover" alt={transferUser.name} />
                   ) : (
                      <div className="w-full h-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-400">
                        <Plus className="w-8 h-8" />
                      </div>
                   )}
                 </div>
                 <p className="text-sm font-bold text-gray-900 dark:text-white">
                   Sending to <span className="text-primary">{transferUser ? transferUser.name : 'New Recipient'}</span>
                 </p>
                 {!transferUser && <p className="text-xs text-gray-500">You'll need to enter their username</p>}
               </div>

               <div className="space-y-4">
                 {!transferUser && (
                   <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Username</label>
                      <input 
                        required 
                        type="text" 
                        placeholder="@username" 
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-all"
                      />
                   </div>
                 )}

                 <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Amount</label>
                    <div className="relative">
                       <DollarSign className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
                       <input 
                          required
                          type="number" 
                          step="0.01"
                          value={transferAmount}
                          onChange={(e) => setTransferAmount(e.target.value)}
                          placeholder="0.00" 
                          className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl pl-12 pr-4 py-3 text-xl font-bold text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-all"
                       />
                    </div>
                 </div>

                 <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/5">
                    <CreditCard className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                       <p className="text-xs font-bold text-gray-900 dark:text-white">Wallet Balance</p>
                       <p className="text-[10px] text-gray-500">Available: ${activeSubscriptions.length > 0 ? '1,248.50' : '200.00'}</p>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                 </div>

                 <button 
                   type="submit" 
                   disabled={!transferAmount || isProcessing}
                   className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Money'}
                 </button>
               </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
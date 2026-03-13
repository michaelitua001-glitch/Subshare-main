import React, { useState } from 'react';
import { 
  Plus, 
  ArrowUpRight, 
  ShoppingCart, 
  ShieldCheck, 
  Search, 
  Bell, 
  Wallet as WalletIcon, 
  PiggyBank,
  CreditCard,
  X,
  CheckCircle,
  Loader2,
  DollarSign,
  ArrowRight,
  Trash2,
  Wifi,
  ChevronLeft,
  AlertCircle
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useUser } from '../context/UserContext';

// --- Types ---
interface PaymentCard {
  id: string;
  type: 'Visa' | 'Mastercard';
  last4: string;
  expiry: string;
  holder: string;
  color: string; // Gradient class
}

const initialCards: PaymentCard[] = [];

const Wallet: React.FC = () => {
  const { addToast } = useToast();
  const { walletBalance, transactions, addToWallet, subtractFromWallet } = useUser();

  // --- State ---
  const [cards, setCards] = useState<PaymentCard[]>(initialCards);
  
  // UI State
  const [showTransModal, setShowTransModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [modalMode, setModalMode] = useState<'deposit' | 'withdraw'>('deposit');
  const [step, setStep] = useState(1); // 1 = Input, 2 = Confirmation
  const [amount, setAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Add Card Form State
  const [newCard, setNewCard] = useState({ number: '', expiry: '', cvc: '', holder: '' });

  // --- Derived State ---
  const totalEarned = transactions
    .filter(t => t.type === 'Sales' || t.amount > 0 && t.type !== 'Deposit')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalSpent = transactions
    .filter(t => t.amount < 0 && t.type !== 'Withdrawal')
    .reduce((acc, curr) => acc + Math.abs(curr.amount), 0);
  
  const monthlySpendingLimit = 5000;
  const spendingPercentage = Math.min((totalSpent / monthlySpendingLimit) * 100, 100);

  const filteredTransactions = transactions.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fee Calculation
  const withdrawalFeePercent = 0.015; // 1.5%
  const numAmount = parseFloat(amount || '0');
  const feeAmount = modalMode === 'withdraw' ? numAmount * withdrawalFeePercent : 0;
  const netAmount = modalMode === 'withdraw' ? numAmount - feeAmount : numAmount;

  // --- Handlers ---

  const openTransModal = (mode: 'deposit' | 'withdraw') => {
    setModalMode(mode);
    setAmount('');
    setStep(1);
    setShowTransModal(true);
  };

  const handleNextStep = () => {
    if (!amount || isNaN(parseFloat(amount))) return;
    
    // Check balance for withdrawal
    if (modalMode === 'withdraw' && parseFloat(amount) > walletBalance) {
      addToast('Insufficient funds', 'error');
      return;
    }

    if (modalMode === 'withdraw') {
      setStep(2);
    } else {
      // Deposits don't need a confirmation step in this flow, proceed to transact
      handleTransaction();
    }
  };

  const handleTransaction = async () => {
    if (!amount || isNaN(parseFloat(amount))) return;
    setIsProcessing(true);
    
    const val = parseFloat(amount);
    
    if (modalMode === 'deposit') {
      await addToWallet(val, 'Funds Added');
      addToast(`Successfully deposited $${val.toFixed(2)}`, 'success');
    } else {
      // For withdrawals, we deduct the requested amount. The fee is taken from the payout, not the wallet balance.
      // E.g. Withdraw $100. Wallet -100. User receives $98.50.
      const destination = paymentMethod === 'card' 
        ? `Card ending in ${cards[0]?.last4 || 'xxxx'}` 
        : 'PayPal';
      
      const success = await subtractFromWallet(val, `Withdrawal to ${destination}`, 'Withdrawal');
      
      if (success) {
         addToast(`Successfully withdrew $${val.toFixed(2)}`, 'success');
      } else {
         addToast("Insufficient funds!", 'error');
      }
    }
    setIsProcessing(false);
    setShowTransModal(false);
    setAmount('');
    setStep(1);
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
       const card: PaymentCard = {
         id: Date.now().toString(),
         type: 'Visa',
         last4: newCard.number.slice(-4) || '1234',
         expiry: newCard.expiry || '12/25',
         holder: newCard.holder || 'NEW USER',
         color: 'bg-gradient-to-br from-purple-600 to-indigo-800'
       };
       setCards([...cards, card]);
       setNewCard({ number: '', expiry: '', cvc: '', holder: '' });
       setIsProcessing(false);
       setShowCardModal(false);
       addToast('Payment method added successfully', 'success');
    }, 1500);
  };

  const presetAmounts = [10, 25, 50, 100];

  return (
    <div className="h-full flex flex-col p-6 overflow-hidden bg-gray-50 dark:bg-[#0B0A15] transition-colors duration-300 relative" onClick={() => setShowNotifications(false)}>
      {/* Header */}
      <header className="flex justify-between items-center mb-8 shrink-0 relative z-20">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Wallet
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage your funds and transactions</p>
        </div>
        <div className="flex gap-4 items-center">
          
          {/* Search Toggle */}
          <div className={`transition-all duration-300 overflow-hidden ${showSearch ? 'w-48 opacity-100' : 'w-0 opacity-0'}`}>
            <div className="relative">
               <input 
                 type="text" 
                 placeholder="Search transactions..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:border-primary text-gray-900 dark:text-white"
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
              className="w-10 h-10 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors shadow-sm dark:shadow-none"
            >
              <Search className="w-5 h-5" />
            </button>
          )}

          <div className="relative">
            <button 
              onClick={(e) => { e.stopPropagation(); setShowNotifications(!showNotifications); }}
              className={`w-10 h-10 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 relative transition-colors shadow-sm dark:shadow-none ${showNotifications ? 'bg-gray-100 dark:bg-white/10' : ''}`}
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
                    { text: 'Deposit of $200.00 confirmed', time: '2m ago', read: false },
                    { text: 'Netflix subscription renewed', time: '1d ago', read: true },
                    { text: 'Card ending in 4242 exp soon', time: '3d ago', read: true },
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
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pr-2 pb-20 no-scrollbar">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Main Column (Balance, Stats, History) */}
          <div className="xl:col-span-2 space-y-8">
             
             {/* Total Balance Card */}
             <div className="bg-white dark:bg-[#1A1729] rounded-3xl p-8 border border-gray-200 dark:border-white/5 relative overflow-hidden shadow-sm dark:shadow-none transition-colors">
               {/* Background Effects */}
               <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/5 dark:bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
               
               <div className="relative z-10 flex flex-col md:flex-row justify-between items-end md:items-center gap-8">
                 <div>
                   <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">Total Balance</p>
                   <div className="flex items-center gap-4">
                     <span className="text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
                       ${walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                     </span>
                     <span className="bg-green-50 dark:bg-[#1A2C22] text-green-600 dark:text-[#4ADE80] text-sm font-bold px-2 py-1 rounded-lg border border-green-200 dark:border-[#4ADE80]/20 flex items-center gap-1">
                       <ArrowUpRight className="w-3 h-3" /> +12%
                     </span>
                   </div>
                   <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Available for withdrawal or spending</p>
                 </div>
                 
                 <div className="flex gap-4 w-full md:w-auto">
                   <button 
                     onClick={() => openTransModal('deposit')}
                     className="flex-1 md:flex-none px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-black font-bold rounded-xl hover:bg-black dark:hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 shadow-lg dark:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                   >
                     <Plus className="w-5 h-5" /> Add Funds
                   </button>
                   <button 
                     onClick={() => openTransModal('withdraw')}
                     className="flex-1 md:flex-none px-6 py-3 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-900 dark:text-white font-bold rounded-xl border border-gray-200 dark:border-white/10 transition-colors flex items-center justify-center gap-2"
                   >
                     <ArrowUpRight className="w-5 h-5" /> Withdraw
                   </button>
                 </div>
               </div>
             </div>

             {/* Stats Row */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Total Earned */}
                <div className="bg-white dark:bg-[#1A1729] rounded-3xl p-6 border border-gray-200 dark:border-white/5 flex items-center gap-5 relative overflow-hidden group hover:border-green-500/20 transition-colors shadow-sm dark:shadow-none">
                   <div className="w-14 h-14 rounded-full bg-green-50 dark:bg-[#1A2C22] flex items-center justify-center border border-green-200 dark:border-[#4ADE80]/20 shrink-0">
                     <PiggyBank className="text-green-600 dark:text-[#4ADE80] w-6 h-6" />
                   </div>
                   <div>
                     <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Earned</p>
                     <h4 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                        ${totalEarned.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                     </h4>
                     <p className="text-xs text-green-600 dark:text-[#4ADE80] mt-1 font-medium">+8% this month</p>
                   </div>
                </div>

                {/* Total Spent */}
                <div className="bg-white dark:bg-[#1A1729] rounded-3xl p-6 border border-gray-200 dark:border-white/5 flex items-center gap-5 relative overflow-hidden group hover:border-red-500/20 transition-colors shadow-sm dark:shadow-none">
                   <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-[#2C1A1A] flex items-center justify-center border border-red-200 dark:border-[#EF4444]/20 shrink-0">
                     <ShoppingCart className="text-red-500 dark:text-[#EF4444] w-6 h-6" />
                   </div>
                   <div>
                     <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Spent</p>
                     <h4 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                        ${totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                     </h4>
                     <p className="text-xs text-red-500 dark:text-[#EF4444] mt-1 font-medium">-2% vs last month</p>
                   </div>
                </div>
             </div>

             {/* Transaction History */}
             <div className="bg-white dark:bg-[#1A1729] rounded-3xl p-6 border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">Transaction History</h3>
                  <button className="text-xs text-primary hover:text-primary-dark dark:hover:text-white transition-colors">View All</button>
                </div>
                
                <div className="overflow-x-auto">
                   <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="text-gray-400 dark:text-gray-500 text-[10px] uppercase tracking-wider border-b border-gray-100 dark:border-white/5">
                          <th className="py-4 font-medium pl-2">Service</th>
                          <th className="py-4 font-medium">Date</th>
                          <th className="py-4 font-medium">Type</th>
                          <th className="py-4 font-medium text-right">Amount</th>
                          <th className="py-4 font-medium text-right pr-2">Status</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {filteredTransactions.length > 0 ? (
                           filteredTransactions.map((t) => (
                           <tr key={t.id} className="border-b border-gray-100 dark:border-white/5 last:border-0 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                              <td className="py-4 pl-2 flex items-center gap-4">
                                 <div className={`w-10 h-10 rounded-xl ${t.bg} flex items-center justify-center border border-white/10 font-bold text-sm shadow-lg ${t.color}`}>
                                   {t.icon}
                                 </div>
                                 <span className="font-bold text-gray-900 dark:text-white">{t.name}</span>
                              </td>
                              <td className="py-4 text-gray-500 dark:text-gray-400 text-xs">{t.date}</td>
                              <td className="py-4 text-gray-500 dark:text-gray-300 text-xs">{t.type}</td>
                              <td className={`py-4 text-right font-bold ${t.amount > 0 ? 'text-green-600 dark:text-[#4ADE80]' : 'text-gray-900 dark:text-white'}`}>
                                {t.amount > 0 ? '+' : ''}${Math.abs(t.amount).toFixed(2)}
                              </td>
                              <td className="py-4 text-right pr-2">
                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded border ${
                                  t.status === 'Completed' 
                                    ? 'bg-green-100 dark:bg-[#1A2C22] text-green-700 dark:text-[#4ADE80] border-green-200 dark:border-[#4ADE80]/20' 
                                    : 'bg-yellow-100 dark:bg-[#2C241A] text-yellow-700 dark:text-[#FBBF24] border-yellow-200 dark:border-[#FBBF24]/20'
                                }`}>
                                  {t.status}
                                </span>
                              </td>
                           </tr>
                        ))
                        ) : (
                           <tr>
                              <td colSpan={5} className="py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                                 No transactions found.
                              </td>
                           </tr>
                        )}
                      </tbody>
                   </table>
                </div>
             </div>
          </div>

          {/* Right Column: Cards */}
          <div className="flex flex-col gap-8">
            
            {/* My Cards Panel */}
            <div className="bg-white dark:bg-[#1A1729] rounded-3xl p-6 border border-gray-200 dark:border-white/5 h-full shadow-sm dark:shadow-none">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-lg text-gray-900 dark:text-white">My Cards</h3>
                 <button 
                   onClick={() => setShowCardModal(true)}
                   className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/10 transition-colors border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white"
                 >
                   <Plus className="w-4 h-4" />
                 </button>
               </div>
               
               {/* Main Card */}
               {cards.length > 0 ? (
                  <div className={`w-full aspect-[1.586/1] rounded-2xl ${cards[0].color} border border-white/10 p-6 relative overflow-hidden mb-6 group cursor-pointer shadow-xl transition-all hover:scale-[1.02]`}>
                     {/* Noise texture overlay simulated */}
                     <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                     
                     <div className="relative z-10 flex flex-col justify-between h-full">
                       <div className="flex justify-between items-start">
                          <div className="w-12 h-8 bg-[#e0e0e0] rounded flex items-center justify-center overflow-hidden">
                             <div className="w-full h-px bg-black/20 my-1"></div>
                             <div className="w-full h-px bg-black/20 my-1"></div>
                          </div>
                          <Wifi className="text-gray-400 w-6 h-6 rotate-90" />
                       </div>
                       
                       <div className="space-y-1">
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider">Card Number</p>
                          <p className="font-mono text-xl tracking-widest text-white flex gap-4">
                            <span>****</span><span>****</span><span>****</span><span>{cards[0].last4}</span>
                          </p>
                       </div>

                       <div className="flex justify-between items-end">
                          <div>
                             <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Holder</p>
                             <p className="text-sm font-bold text-white uppercase tracking-wide">{cards[0].holder}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Expires</p>
                             <p className="text-sm font-bold text-white">{cards[0].expiry}</p>
                          </div>
                       </div>
                     </div>
                  </div>
               ) : (
                  <div className="w-full aspect-[1.586/1] rounded-2xl bg-gray-100 dark:bg-white/5 border border-dashed border-gray-300 dark:border-white/20 p-6 flex flex-col items-center justify-center mb-6 text-gray-400">
                     <p className="text-sm mb-2">No active cards</p>
                     <button onClick={() => setShowCardModal(true)} className="text-primary text-xs font-bold hover:underline">Add a card</button>
                  </div>
               )}

               {/* Secondary Cards */}
               <div className="space-y-3 mb-8">
                 {cards.slice(1).map((card) => (
                   <div key={card.id} className="bg-gray-50 dark:bg-[#131022] rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-gray-100 dark:hover:bg-black/40 transition-colors border border-gray-200 dark:border-white/5">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-7 bg-white rounded flex items-center justify-center shadow-sm border border-gray-100">
                            {card.type === 'Visa' ? (
                               <div className="flex -space-x-1">
                                  <div className="w-3 h-3 rounded-full bg-blue-500/80"></div>
                               </div>
                            ) : (
                               <div className="flex -space-x-1">
                                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                               </div>
                            )}
                         </div>
                         <div>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">{card.type} ending in {card.last4}</p>
                            <p className="text-xs text-gray-500">Expires {card.expiry}</p>
                         </div>
                      </div>
                      <button className="text-gray-400 hover:text-red-500 transition-colors">
                         <Trash2 className="w-4 h-4" />
                      </button>
                   </div>
                 ))}
               </div>

               {/* Spending Limit */}
               <div>
                  <div className="flex justify-between items-center mb-3 text-xs">
                     <span className="text-gray-500 dark:text-gray-400">Monthly Spending Limit</span>
                     <span className="font-bold text-gray-900 dark:text-white">
                        ${totalSpent.toLocaleString()} / ${monthlySpendingLimit.toLocaleString()}
                     </span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-white/5 rounded-full h-2 overflow-hidden">
                     <div 
                        className={`h-2 rounded-full shadow-[0_0_10px_rgba(71,37,244,0.5)] transition-all duration-500 ${
                           spendingPercentage > 90 ? 'bg-red-500' : 'bg-primary'
                        }`} 
                        style={{ width: `${spendingPercentage}%` }}
                     ></div>
                  </div>
               </div>
            </div>
            
            {/* Secure Payments Widget */}
            <div className="bg-gradient-to-br from-primary to-purple-800 rounded-2xl p-6 border border-white/10 relative overflow-hidden shadow-lg">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
               
               <div className="flex items-start gap-4 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-black/20 flex items-center justify-center shrink-0 border border-white/10">
                    <ShieldCheck className="text-white w-5 h-5" />
                  </div>
                  <div>
                     <h4 className="font-bold text-white mb-1">Secure Payments</h4>
                     <p className="text-xs text-white/70 leading-relaxed">
                       Your transactions are protected with end-to-end encryption. Need help? Contact Support.
                     </p>
                  </div>
               </div>
            </div>

          </div>

        </div>
      </div>

      {/* Transaction Modal (Deposit & Withdraw) */}
      {showTransModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isProcessing && setShowTransModal(false)}></div>
          <div className="relative w-full max-w-md bg-white dark:bg-[#1A1729] rounded-3xl shadow-2xl animate-[fadeIn_0.3s] border border-gray-200 dark:border-white/10 overflow-hidden flex flex-col">
            
            {/* Header */}
            <div className="p-6 border-b border-gray-100 dark:border-white/5 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <WalletIcon className="text-primary w-5 h-5" /> 
                  {modalMode === 'deposit' ? 'Add Funds' : (step === 1 ? 'Withdraw Funds' : 'Confirm Withdrawal')}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {modalMode === 'deposit' ? 'Top up your wallet balance safely' : (step === 1 ? 'Transfer funds to your account' : 'Review details before confirming')}
                </p>
              </div>
              <button 
                onClick={() => setShowTransModal(false)} 
                disabled={isProcessing}
                className="text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              
              {/* Step 1: Input */}
              {step === 1 && (
                <>
                  {/* Presets */}
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">Select Amount</label>
                    <div className="grid grid-cols-4 gap-3">
                      {presetAmounts.map((val) => (
                        <button
                          key={val}
                          onClick={() => setAmount(val.toString())}
                          className={`py-2 rounded-xl text-sm font-bold border transition-all ${
                            amount === val.toString()
                              ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                              : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white hover:border-primary/50'
                          }`}
                        >
                          ${val}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Amount */}
                  <div>
                    <div className="relative">
                      <div className="absolute left-4 top-3.5 text-gray-500 dark:text-gray-400">
                        <DollarSign className="w-5 h-5" />
                      </div>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter custom amount"
                        className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 text-gray-900 dark:text-white font-bold text-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:font-normal"
                      />
                    </div>
                    {modalMode === 'withdraw' && (
                      <p className="text-xs text-gray-500 mt-2 text-right">Available: ${walletBalance.toFixed(2)}</p>
                    )}
                  </div>

                  {/* Payment Methods */}
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">
                      {modalMode === 'deposit' ? 'Payment Method' : 'Withdraw To'}
                    </label>
                    <div className="space-y-3">
                      <div 
                        onClick={() => setPaymentMethod('card')}
                        className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                          paymentMethod === 'card'
                            ? 'bg-primary/5 border-primary dark:bg-primary/10' 
                            : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-700 dark:text-white">
                            <CreditCard className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-gray-900 dark:text-white">Credit Card</p>
                            <p className="text-xs text-gray-500">
                              {cards.length > 0 ? `Visa ending in ${cards[0].last4}` : 'No cards added'}
                            </p>
                          </div>
                        </div>
                        {paymentMethod === 'card' && <CheckCircle className="text-primary w-5 h-5" />}
                      </div>

                      <div 
                        onClick={() => setPaymentMethod('paypal')}
                        className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                          paymentMethod === 'paypal'
                            ? 'bg-primary/5 border-primary dark:bg-primary/10' 
                            : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#003087] flex items-center justify-center text-white font-bold text-xs">
                            Pay
                          </div>
                          <div>
                            <p className="font-bold text-sm text-gray-900 dark:text-white">PayPal</p>
                            <p className="text-xs text-gray-500">elena@example.com</p>
                          </div>
                        </div>
                        {paymentMethod === 'paypal' && <CheckCircle className="text-primary w-5 h-5" />}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Step 2: Confirmation (Withdraw Only) */}
              {step === 2 && (
                <div className="animate-[fadeIn_0.3s]">
                  <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-6 border border-gray-200 dark:border-white/10 mb-6 space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Withdraw Amount</span>
                      <span className="font-bold text-gray-900 dark:text-white">${numAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Service Fee (1.5%)</span>
                      <span className="text-red-500">-${feeAmount.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-white/10 my-2"></div>
                    <div className="flex justify-between items-center text-lg">
                      <span className="font-bold text-gray-900 dark:text-white">Net Receive</span>
                      <span className="font-bold text-primary">${netAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-500/10 rounded-xl border border-blue-100 dark:border-blue-500/20 text-xs text-blue-800 dark:text-blue-200 leading-relaxed">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <p>
                      Funds will be transferred to <b>{paymentMethod === 'card' ? 'Visa ' + (cards[0]?.last4 || 'Card') : 'PayPal'}</b>. 
                      Transfers typically take 1-3 business days to appear on your statement.
                    </p>
                  </div>
                </div>
              )}

            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] flex gap-3">
              {step === 2 && (
                <button 
                  onClick={() => setStep(1)}
                  disabled={isProcessing}
                  className="px-6 py-4 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white font-bold hover:bg-gray-50 dark:hover:bg-white/10 transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              
              <button 
                onClick={step === 1 ? handleNextStep : handleTransaction}
                disabled={!amount || isProcessing || (modalMode === 'withdraw' && parseFloat(amount) > walletBalance)}
                className="flex-1 py-4 rounded-xl bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                  </>
                ) : (
                  <>
                    {modalMode === 'deposit' ? 'Confirm Deposit' : (step === 1 ? 'Review Withdrawal' : 'Confirm Withdrawal')} 
                    {step === 1 && <ArrowRight className="w-5 h-5" />}
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Add Card Modal */}
      {showCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isProcessing && setShowCardModal(false)}></div>
          <div className="relative w-full max-w-md bg-white dark:bg-[#1A1729] rounded-3xl shadow-2xl animate-[fadeIn_0.3s] border border-gray-200 dark:border-white/10 overflow-hidden flex flex-col">
             
             <div className="p-6 border-b border-gray-100 dark:border-white/5 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New Card</h2>
                <button onClick={() => setShowCardModal(false)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white">
                   <X className="w-5 h-5" />
                </button>
             </div>

             <form onSubmit={handleAddCard} className="p-6 space-y-4">
                <div className="space-y-2">
                   <label className="text-xs font-bold text-gray-500 uppercase">Card Holder</label>
                   <input 
                     required
                     type="text" 
                     placeholder="JOHN DOE" 
                     value={newCard.holder}
                     onChange={(e) => setNewCard({...newCard, holder: e.target.value.toUpperCase()})}
                     className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-all"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-gray-500 uppercase">Card Number</label>
                   <input 
                     required
                     type="text" 
                     placeholder="0000 0000 0000 0000" 
                     maxLength={19}
                     value={newCard.number}
                     onChange={(e) => setNewCard({...newCard, number: e.target.value})}
                     className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-all"
                   />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">Expiry</label>
                      <input 
                        required
                        type="text" 
                        placeholder="MM/YY" 
                        maxLength={5}
                        value={newCard.expiry}
                        onChange={(e) => setNewCard({...newCard, expiry: e.target.value})}
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-all"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">CVC</label>
                      <input 
                        required
                        type="text" 
                        placeholder="123" 
                        maxLength={3}
                        value={newCard.cvc}
                        onChange={(e) => setNewCard({...newCard, cvc: e.target.value})}
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-all"
                      />
                   </div>
                </div>

                <div className="pt-4">
                   <button 
                     type="submit" 
                     disabled={isProcessing}
                     className="w-full py-4 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2"
                   >
                     {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Card'}
                   </button>
                </div>
             </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Wallet;
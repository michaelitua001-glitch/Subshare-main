import React, { createContext, useContext, useState, useEffect } from 'react';

// --- Types ---
export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  plan: 'Free' | 'Premium';
}

export interface Transaction {
  id: number;
  name: string;
  date: string;
  type: 'Purchase' | 'Deposit' | 'Sales' | 'Withdrawal';
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
  icon: string; // We will store icon name/type as string for simplicity in context
  color: string;
  bg: string;
}

export interface Subscription {
  id: string;
  name: string;
  plan: string;
  price: number;
  renewalDate: string; // String date
  icon: string;
  color: string;
  bg: string;
}

interface UserContextType {
  user: UserProfile;
  walletBalance: number;
  transactions: Transaction[];
  activeSubscriptions: Subscription[];
  updateProfile: (data: Partial<UserProfile>) => void;
  addToWallet: (amount: number, description: string) => void;
  subtractFromWallet: (amount: number, description: string, category: string) => boolean; // Returns success/fail
  addSubscription: (sub: Subscription) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// Initial Mock Data (used if local storage is empty)
const defaultUser: UserProfile = {
  name: 'Elena R.',
  email: 'elena@example.com',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
  plan: 'Premium'
};

const defaultTransactions: Transaction[] = [
  {id: 1, name: 'Netflix Premium', date: 'Oct 24, 2023', type: 'Purchase', amount: -4.99, status: 'Completed', icon: 'N', color: 'text-red-600', bg: 'bg-black'},
  {id: 2, name: 'Funds Added', date: 'Oct 22, 2023', type: 'Deposit', amount: 200.00, status: 'Completed', icon: 'P', color: 'text-white', bg: 'bg-blue-600'},
];

const defaultSubs: Subscription[] = [
  { id: '1', name: 'Netflix', plan: 'Premium 4K', price: 4.99, renewalDate: '2023-11-24', icon: 'N', color: 'text-red-600', bg: 'bg-black' },
];

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from localStorage or defaults
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('subshare_user');
    return saved ? JSON.parse(saved) : defaultUser;
  });

  const [walletBalance, setWalletBalance] = useState<number>(() => {
    const saved = localStorage.getItem('subshare_balance');
    return saved ? parseFloat(saved) : 1248.50;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('subshare_transactions');
    return saved ? JSON.parse(saved) : defaultTransactions;
  });

  const [activeSubscriptions, setActiveSubscriptions] = useState<Subscription[]>(() => {
    const saved = localStorage.getItem('subshare_subs');
    return saved ? JSON.parse(saved) : defaultSubs;
  });

  // Persistence Effects
  useEffect(() => { localStorage.setItem('subshare_user', JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem('subshare_balance', walletBalance.toString()); }, [walletBalance]);
  useEffect(() => { localStorage.setItem('subshare_transactions', JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem('subshare_subs', JSON.stringify(activeSubscriptions)); }, [activeSubscriptions]);

  // Actions
  const updateProfile = (data: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...data }));
  };

  const addToWallet = (amount: number, description: string) => {
    setWalletBalance(prev => prev + amount);
    const newTrans: Transaction = {
      id: Date.now(),
      name: description,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      type: 'Deposit',
      amount: amount,
      status: 'Completed',
      icon: 'P',
      color: 'text-white',
      bg: 'bg-green-600'
    };
    setTransactions(prev => [newTrans, ...prev]);
  };

  const subtractFromWallet = (amount: number, description: string, category: string): boolean => {
    if (walletBalance < amount) return false;

    setWalletBalance(prev => prev - amount);
    
    // Determine visuals based on category/description
    let icon = 'S';
    let bg = 'bg-gray-800';
    let color = 'text-white';

    if (description.includes('Netflix')) { icon = 'N'; bg = 'bg-black'; color = 'text-red-600'; }
    if (description.includes('Spotify')) { icon = 'S'; bg = 'bg-[#1db954]'; color = 'text-black'; }
    if (description.includes('Adobe')) { icon = 'A'; bg = 'bg-[#ff0000]'; color = 'text-white'; }
    if (category === 'Withdrawal') { icon = 'W'; bg = 'bg-gray-700'; }

    const newTrans: Transaction = {
      id: Date.now(),
      name: description,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      type: category as any,
      amount: -amount,
      status: 'Completed',
      icon,
      color,
      bg
    };
    setTransactions(prev => [newTrans, ...prev]);
    return true;
  };

  const addSubscription = (sub: Subscription) => {
    setActiveSubscriptions(prev => [sub, ...prev]);
  };

  const logout = () => {
    // Optional: Clear storage on logout? Or just navigate away.
    // localStorage.clear(); 
    // For this demo, we'll keeps data but could reset state if needed
  };

  return (
    <UserContext.Provider value={{
      user,
      walletBalance,
      transactions,
      activeSubscriptions,
      updateProfile,
      addToWallet,
      subtractFromWallet,
      addSubscription,
      logout
    }}>
      {children}
    </UserContext.Provider>
  );
};
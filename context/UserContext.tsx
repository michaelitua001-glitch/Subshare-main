import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Session, User } from '@supabase/supabase-js';

// --- Types ---
export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  avatar: string;
  plan: 'Free' | 'Premium';
}

export interface Transaction {
  id: string;
  name: string;
  date: string;
  type: 'Purchase' | 'Deposit' | 'Sales' | 'Withdrawal';
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
  icon: string;
  color: string;
  bg: string;
}

export interface Subscription {
  id: string;
  name: string;
  plan: string;
  price: number;
  renewalDate: string;
  icon: string;
  color: string;
  bg: string;
}

interface UserContextType {
  user: UserProfile;
  supabaseUser: User | null;
  session: Session | null;
  isLoading: boolean;
  walletBalance: number;
  transactions: Transaction[];
  activeSubscriptions: Subscription[];
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  addToWallet: (amount: number, description: string) => Promise<void>;
  subtractFromWallet: (amount: number, description: string, category: string) => Promise<boolean>;
  addSubscription: (sub: Omit<Subscription, 'id'>) => Promise<void>;
  logout: () => Promise<void>;
  mockLogin: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

const defaultUser: UserProfile = {
  name: '',
  email: '',
  avatar: '',
  plan: 'Free'
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [user, setUser] = useState<UserProfile>(defaultUser);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeSubscriptions, setActiveSubscriptions] = useState<Subscription[]>([]);

  const fetchUserData = async (userId: string, authUser?: User) => {
    setIsLoading(true);
    try {
      // Fetch Profile
      let { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single();
      
      // If profile doesn't exist, create it
      if (!profile && authUser) {
        const newProfile = {
          id: userId,
          name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || '',
          email: authUser.email || '',
          avatar: authUser.user_metadata?.avatar_url || '',
          plan: 'Free',
          wallet_balance: 0
        };
        const { data: createdProfile, error } = await supabase.from('profiles').insert(newProfile).select().single();
        if (!error && createdProfile) {
          profile = createdProfile;
        }
      }

      if (profile) {
        setUser({
          id: profile.id,
          name: profile.name || '',
          email: profile.email || '',
          avatar: profile.avatar || '',
          plan: profile.plan || 'Free'
        });
        setWalletBalance(profile.wallet_balance || 0);
      } else if (authUser) {
        // Fallback if insert fails
        setUser({
          id: userId,
          name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || '',
          email: authUser.email || '',
          avatar: authUser.user_metadata?.avatar_url || '',
          plan: 'Free'
        });
      }

      // Fetch Transactions
      const { data: txs } = await supabase.from('transactions').select('*').eq('user_id', userId).order('date', { ascending: false });
      if (txs) {
        setTransactions(txs.map(tx => ({
          id: tx.id,
          name: tx.name,
          date: new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          type: tx.type,
          amount: tx.amount,
          status: tx.status,
          icon: tx.icon,
          color: tx.color,
          bg: tx.bg
        })));
      }

      // Fetch Subscriptions
      const { data: subs } = await supabase.from('subscriptions').select('*').eq('user_id', userId).order('created_at', { ascending: false });
      if (subs) {
        setActiveSubscriptions(subs.map(sub => ({
          id: sub.id,
          name: sub.name,
          plan: sub.plan,
          price: sub.price,
          renewalDate: sub.renewal_date,
          icon: sub.icon,
          color: sub.color,
          bg: sub.bg
        })));
      }
    } catch (error: any) {
      if (error.message?.includes('Failed to fetch') || error.message?.includes('Supabase not configured')) {
        console.warn("Network error fetching user data, using defaults.");
      } else {
        console.error("Error fetching user data:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          const errMsg = typeof error === 'string' ? error : (error.message || JSON.stringify(error));
          if (errMsg.includes('Lock broken') || errMsg.includes('Failed to fetch') || errMsg.includes('Supabase not configured')) {
            console.warn('Ignorable session error:', errMsg);
          } else {
            console.error("Session error:", error);
          }
        }
        
        if (mounted) {
          setSession(session);
          setSupabaseUser(session?.user ?? null);
          if (session?.user) {
            fetchUserData(session.user.id, session.user);
          } else {
            setIsLoading(false);
          }
        }
      } catch (error: any) {
        const errMsg = typeof error === 'string' ? error : (error?.message || JSON.stringify(error));
        if (errMsg.includes('Lock broken') || errMsg.includes('Failed to fetch') || errMsg.includes('Supabase not configured')) {
          console.warn('Ignorable session exception:', errMsg);
        } else {
          console.error("Failed to fetch session:", error);
        }
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setSession(session);
        setSupabaseUser(session?.user ?? null);
        if (session?.user) {
          fetchUserData(session.user.id, session.user);
        } else {
          setUser(defaultUser);
          setWalletBalance(0);
          setTransactions([]);
          setActiveSubscriptions([]);
          setIsLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!supabaseUser) return;
    const { error } = await supabase.from('profiles').update(data).eq('id', supabaseUser.id);
    if (!error) {
      setUser(prev => ({ ...prev, ...data }));
    } else {
      console.error("Error updating profile:", error);
    }
  };

  const addToWallet = async (amount: number, description: string) => {
    if (!supabaseUser) return;
    const newBalance = walletBalance + amount;
    
    // Update balance
    const { error: profileError } = await supabase.from('profiles').update({ wallet_balance: newBalance }).eq('id', supabaseUser.id);
    if (profileError) {
      console.error("Error updating balance:", profileError);
      return;
    }
    
    // Insert transaction
    const { data: tx, error: txError } = await supabase.from('transactions').insert({
      user_id: supabaseUser.id,
      name: description,
      type: 'Deposit',
      amount: amount,
      status: 'Completed',
      icon: 'P',
      color: 'text-white',
      bg: 'bg-green-600'
    }).select().single();

    if (txError) {
      console.error("Error inserting transaction:", txError);
      return;
    }

    if (tx) {
      setWalletBalance(newBalance);
      setTransactions(prev => [{
        id: tx.id,
        name: tx.name,
        date: new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        type: tx.type,
        amount: tx.amount,
        status: tx.status,
        icon: tx.icon,
        color: tx.color,
        bg: tx.bg
      }, ...prev]);
    }
  };

  const subtractFromWallet = async (amount: number, description: string, category: string): Promise<boolean> => {
    if (!supabaseUser || walletBalance < amount) return false;
    
    const newBalance = walletBalance - amount;
    
    let icon = 'S';
    let bg = 'bg-gray-800';
    let color = 'text-white';

    if (description.includes('Netflix')) { icon = 'N'; bg = 'bg-black'; color = 'text-red-600'; }
    if (description.includes('Spotify')) { icon = 'S'; bg = 'bg-[#1db954]'; color = 'text-black'; }
    if (description.includes('Adobe')) { icon = 'A'; bg = 'bg-[#ff0000]'; color = 'text-white'; }
    if (category === 'Withdrawal') { icon = 'W'; bg = 'bg-gray-700'; }

    // Update balance
    const { error: profileError } = await supabase.from('profiles').update({ wallet_balance: newBalance }).eq('id', supabaseUser.id);
    if (profileError) {
      console.error("Error updating balance:", profileError);
      return false;
    }
    
    // Insert transaction
    const { data: tx, error: txError } = await supabase.from('transactions').insert({
      user_id: supabaseUser.id,
      name: description,
      type: category,
      amount: -amount,
      status: 'Completed',
      icon,
      color,
      bg
    }).select().single();

    if (txError) {
      console.error("Error inserting transaction:", txError);
      return false;
    }

    if (tx) {
      setWalletBalance(newBalance);
      setTransactions(prev => [{
        id: tx.id,
        name: tx.name,
        date: new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        type: tx.type,
        amount: tx.amount,
        status: tx.status,
        icon: tx.icon,
        color: tx.color,
        bg: tx.bg
      }, ...prev]);
      return true;
    }
    return false;
  };

  const addSubscription = async (sub: Omit<Subscription, 'id'>) => {
    if (!supabaseUser) return;
    
    const { data: newSub, error } = await supabase.from('subscriptions').insert({
      user_id: supabaseUser.id,
      name: sub.name,
      plan: sub.plan,
      price: sub.price,
      renewal_date: sub.renewalDate,
      icon: sub.icon,
      color: sub.color,
      bg: sub.bg
    }).select().single();

    if (error) {
      console.error("Error adding subscription:", error);
      return;
    }

    if (newSub) {
      setActiveSubscriptions(prev => [{
        id: newSub.id,
        name: newSub.name,
        plan: newSub.plan,
        price: newSub.price,
        renewalDate: newSub.renewal_date,
        icon: newSub.icon,
        color: newSub.color,
        bg: newSub.bg
      }, ...prev]);
    }
  };

  const mockLogin = () => {
    const mockUser = { id: 'mock-user-123', email: 'test@example.com' } as User;
    const mockSession = { user: mockUser, access_token: 'mock-token' } as Session;
    setSession(mockSession);
    setSupabaseUser(mockUser);
    setUser({
      id: 'mock-user-123',
      name: 'Test User',
      email: 'test@example.com',
      avatar: 'https://picsum.photos/seed/test/100/100',
      plan: 'Free'
    });
    setWalletBalance(100);
    setTransactions([
      {
        id: '1',
        name: 'Welcome Bonus',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        type: 'Deposit',
        amount: 100,
        status: 'Completed',
        icon: 'P',
        color: 'text-white',
        bg: 'bg-green-600'
      }
    ]);
    setIsLoading(false);
  };

  const logout = async () => {
    if (session?.access_token === 'mock-token') {
      setSession(null);
      setSupabaseUser(null);
      setUser(defaultUser);
      setWalletBalance(0);
      setTransactions([]);
      setActiveSubscriptions([]);
      return;
    }
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <UserContext.Provider value={{
      user,
      supabaseUser,
      session,
      isLoading,
      walletBalance,
      transactions,
      activeSubscriptions,
      updateProfile,
      addToWallet,
      subtractFromWallet,
      addSubscription,
      logout,
      mockLogin
    }}>
      {children}
    </UserContext.Provider>
  );
};
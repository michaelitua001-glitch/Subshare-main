import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useUser } from './UserContext';

export interface Notification {
  id: string;
  text: string;
  time: string;
  read: boolean;
  type: 'message' | 'system' | 'payment' | 'invite';
}

interface NotificationContextType {
  notifications: Notification[];
  unreadMessagesCount: number;
  unreadNotificationsCount: number;
  activeThreadId: string | null;
  setActiveThreadId: (id: string | null) => void;
  markAllAsRead: () => void;
  markAsRead: (id: string) => void;
  addNotification: (notif: Omit<Notification, 'id' | 'time' | 'read'>) => void;
  decrementUnreadMessages: (count: number) => void;
  resetUnreadMessages: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { supabaseUser } = useUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);

  // Initial mock notifications
  useEffect(() => {
    setNotifications([
      { id: '1', text: 'Netflix payment due in 2 days', time: '1h ago', read: false, type: 'payment' },
      { id: '2', text: 'Sarah accepted your invite', time: '3h ago', read: false, type: 'invite' },
      { id: '3', text: 'New login from Chrome Windows', time: '1d ago', read: true, type: 'system' },
    ]);
  }, []);

  // Fetch unread messages count
  useEffect(() => {
    if (!supabaseUser) return;

    const fetchUnreadCount = async () => {
      try {
        // This is a simplified version. In a real app, you'd have a more complex query
        // or a dedicated 'unread_counts' table.
        const { data, error } = await supabase
          .from('chat_threads')
          .select('unread');
        
        if (!error && data) {
          const total = data.reduce((acc, t) => acc + (t.unread || 0), 0);
          setUnreadMessagesCount(total);
        }
      } catch (err) {
        console.error("Error fetching unread count:", err);
      }
    };

    fetchUnreadCount();

    // Subscribe to message changes to update count
    const channel = supabase
      .channel('unread-messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages' },
        (payload) => {
          const newMessage = payload.new;
          if (newMessage.sender_id !== supabaseUser.id && newMessage.thread_id !== activeThreadId) {
            setUnreadMessagesCount(prev => prev + 1);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabaseUser]);

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const addNotification = (notif: Omit<Notification, 'id' | 'time' | 'read'>) => {
    const newNotif: Notification = {
      ...notif,
      id: Date.now().toString(),
      time: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const decrementUnreadMessages = (count: number) => {
    setUnreadMessagesCount(prev => Math.max(0, prev - count));
  };

  const resetUnreadMessages = () => {
    setUnreadMessagesCount(0);
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadMessagesCount,
      unreadNotificationsCount,
      activeThreadId,
      setActiveThreadId,
      markAllAsRead,
      markAsRead,
      addNotification,
      decrementUnreadMessages,
      resetUnreadMessages
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

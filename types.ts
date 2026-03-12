export interface Subscription {
  id: string;
  name: string;
  plan: string;
  price: number;
  originalPrice?: number;
  currency: string;
  renewalDate: string;
  slotsTotal: number;
  slotsUsed: number;
  icon: string; // URL or icon name
  color: string;
  isVerified?: boolean;
  status: 'active' | 'expired' | 'pending';
}

export interface Transaction {
  id: string;
  service: string;
  date: string;
  type: 'Purchase' | 'Deposit' | 'Sales' | 'Withdrawal';
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
  icon: string;
  color: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isMe: boolean;
  type: 'text' | 'image' | 'system';
}

export interface ChatThread {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
}

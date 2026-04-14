import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Edit, 
  MoreVertical, 
  Paperclip, 
  Send, 
  Smile, 
  Phone, 
  Video, 
  ArrowLeft,
  Check,
  CheckCheck,
  Image as ImageIcon
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useUser } from '../context/UserContext';
import { supabase } from '../supabaseClient';

// --- Types ---
interface Message {
  id: string;
  thread_id: string;
  text: string;
  sender_id: string;
  senderName?: string;
  created_at: string;
  type: 'text' | 'image' | 'system';
  status: 'sent' | 'delivered' | 'read';
}

interface Thread {
  id: string;
  name: string;
  last_msg: string;
  updated_at: string;
  unread: number;
  avatar: string;
  avatar_color?: string;
  is_online: boolean;
  type: 'group' | 'direct';
  verified?: boolean;
}

const Chat: React.FC = () => {
  const { addToast } = useToast();
  const { supabaseUser } = useUser();
  
  // UI State
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [msgText, setMsgText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Data State
  const [threads, setThreads] = useState<Thread[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeThreadId]);

  // Fetch Threads
  useEffect(() => {
    const fetchThreads = async () => {
      if (!supabaseUser) return;
      
      try {
        const { data, error } = await supabase
          .from('chat_threads')
          .select('*')
          .order('updated_at', { ascending: false });
          
        if (error) {
          console.error("Error fetching threads:", error);
          // Fallback or handle error
        } else if (data) {
          setThreads(data);
          if (data.length > 0 && !activeThreadId) {
            setActiveThreadId(data[0].id);
          }
        }
      } catch (err: any) {
        const errMsg = typeof err === 'string' ? err : (err?.message || JSON.stringify(err));
        if (errMsg.includes('Failed to fetch') || errMsg.includes('Supabase not configured')) {
          console.warn("Network error fetching threads.");
        } else {
          console.error("Fetch threads failed:", err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchThreads();
  }, [supabaseUser]);

  // Fetch Messages for Active Thread
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeThreadId || !supabaseUser) return;

      try {
        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('thread_id', activeThreadId)
          .order('created_at', { ascending: true });

        if (error) {
          console.error("Error fetching messages:", error);
        } else if (data) {
          setMessages(prev => ({
            ...prev,
            [activeThreadId]: data
          }));
        }
      } catch (err: any) {
        const errMsg = typeof err === 'string' ? err : (err?.message || JSON.stringify(err));
        if (errMsg.includes('Failed to fetch') || errMsg.includes('Supabase not configured')) {
          console.warn("Network error fetching messages.");
        } else {
          console.error("Fetch messages failed:", err);
        }
      }
    };

    fetchMessages();
  }, [activeThreadId, supabaseUser]);

  // Subscribe to Realtime Messages
  useEffect(() => {
    if (!supabaseUser) return;

    const channel = supabase
      .channel('public:chat_messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages' },
        (payload) => {
          const newMessage = payload.new as Message;
          
          // Update messages state
          setMessages(prev => {
            const threadMsgs = prev[newMessage.thread_id] || [];
            // Prevent duplicates if we just sent it
            if (threadMsgs.find(m => m.id === newMessage.id)) return prev;
            
            return {
              ...prev,
              [newMessage.thread_id]: [...threadMsgs, newMessage]
            };
          });

          // Update thread preview
          setThreads(prev => {
            const updatedThreads = prev.map(t => 
              t.id === newMessage.thread_id 
                ? { 
                    ...t, 
                    last_msg: newMessage.sender_id === supabaseUser.id ? 'You: ' + newMessage.text : newMessage.text, 
                    updated_at: newMessage.created_at,
                    unread: newMessage.sender_id !== supabaseUser.id && activeThreadId !== newMessage.thread_id ? t.unread + 1 : t.unread
                  } 
                : t
            );
            // Sort: active thread goes to top
            return updatedThreads.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabaseUser, activeThreadId]);

  // Derived state
  const activeThread = threads.find(t => t.id === activeThreadId);
  const activeMessages = activeThreadId ? messages[activeThreadId] || [] : [];
  
  const filteredThreads = threads.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handlers
  const handleThreadClick = (id: string) => {
    setActiveThreadId(id);
    setMobileView('chat');
    
    // Mark as read locally (ideally update in DB too)
    setThreads(prev => prev.map(t => 
      t.id === id ? { ...t, unread: 0 } : t
    ));

    // Focus input on desktop
    setTimeout(() => {
        if (window.innerWidth >= 768) {
            inputRef.current?.focus();
        }
    }, 100);
  };

  const handleBackToList = () => {
    setMobileView('list');
  };

  const handleSendMessage = async () => {
    if (!msgText.trim() || !activeThreadId || !supabaseUser) return;

    const textToSend = msgText;
    setMsgText(''); // Clear input immediately for better UX

    // Optimistic UI update
    const tempId = Date.now().toString();
    const optimisticMessage: Message = {
      id: tempId,
      thread_id: activeThreadId,
      text: textToSend,
      sender_id: supabaseUser.id,
      created_at: new Date().toISOString(),
      type: 'text',
      status: 'sent'
    };

    setMessages(prev => ({
      ...prev,
      [activeThreadId]: [...(prev[activeThreadId] || []), optimisticMessage]
    }));

    // Insert into Supabase
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        thread_id: activeThreadId,
        sender_id: supabaseUser.id,
        text: textToSend,
        type: 'text',
        status: 'sent'
      })
      .select()
      .single();

    if (error) {
      console.error("Error sending message:", error);
      addToast("Failed to send message", "error");
      // Remove optimistic message on failure
      setMessages(prev => ({
        ...prev,
        [activeThreadId]: prev[activeThreadId].filter(m => m.id !== tempId)
      }));
    } else if (data) {
      // Replace optimistic message with real one from DB
      setMessages(prev => ({
        ...prev,
        [activeThreadId]: prev[activeThreadId].map(m => m.id === tempId ? data : m)
      }));

      // Update thread last_msg in DB
      await supabase
        .from('chat_threads')
        .update({ 
          last_msg: 'You: ' + textToSend,
          updated_at: new Date().toISOString()
        })
        .eq('id', activeThreadId);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFeatureNotReady = () => {
    addToast('This feature is coming soon!', 'info');
  };

  // Format time helper
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-full flex flex-col md:flex-row p-0 md:p-6 gap-6 relative z-10 bg-gray-50 dark:bg-[#0B0A15] transition-colors duration-300">
      
      {/* 
        LEFT SIDEBAR (Thread List) 
        - Hidden on mobile if view is 'chat'
        - Always visible on md+
      */}
      <aside className={`
        w-full md:w-80 lg:w-96 bg-white dark:bg-[#1A1729] dark:md:glass-panel md:rounded-2xl flex flex-col h-full overflow-hidden shrink-0 border-r md:border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none transition-all
        ${mobileView === 'chat' ? 'hidden md:flex' : 'flex'}
      `}>
        {/* Sidebar Header */}
        <div className="p-4 md:p-6 border-b border-gray-100 dark:border-white/5 bg-white dark:bg-[#1A1729] sticky top-0 z-20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Messages</h2>
            <button onClick={handleFeatureNotReady} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
              <Edit className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          <div className="relative group">
             <Search className="absolute left-3 top-2.5 text-gray-400 dark:text-white/40 w-5 h-5" />
             <input 
                type="text" 
                placeholder="Search conversations..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 focus:outline-none focus:border-primary transition-all" 
             />
          </div>
        </div>
        
        {/* Thread List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredThreads.map((thread) => (
             <div 
               key={thread.id} 
               onClick={() => handleThreadClick(thread.id)}
               className={`p-3 rounded-xl cursor-pointer transition-all ${
                 activeThreadId === thread.id 
                   ? 'bg-primary/5 dark:bg-primary/20 border border-primary/20 dark:border-primary/30' 
                   : 'hover:bg-gray-50 dark:hover:bg-white/5 border border-transparent'
               }`}
             >
                <div className="flex items-center gap-3">
                   {/* Avatar */}
                   <div className="relative shrink-0">
                      {thread.avatar && thread.avatar.startsWith('http') ? (
                         <img src={thread.avatar} alt={thread.name} className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-white/10" />
                      ) : (
                         <div className={`w-12 h-12 rounded-full ${thread.avatar_color || 'bg-gray-500'} flex items-center justify-center font-bold text-white text-lg shadow-sm border border-white/10`}>
                            {thread.avatar || thread.name.charAt(0)}
                         </div>
                      )}
                      
                      {thread.is_online && (
                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-[#1A1729] rounded-full"></span>
                      )}
                   </div>

                   {/* Info */}
                   <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                         <h3 className={`font-semibold truncate pr-2 ${thread.unread > 0 ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-200'}`}>
                           {thread.name}
                         </h3>
                         <span className={`text-xs whitespace-nowrap ${thread.unread > 0 ? 'text-primary font-bold' : 'text-gray-400 dark:text-white/40'}`}>
                           {formatTime(thread.updated_at)}
                         </span>
                      </div>
                      <div className="flex justify-between items-center gap-2">
                         <p className={`text-sm truncate ${thread.unread > 0 ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-500 dark:text-white/50'}`}>
                            {thread.last_msg?.startsWith('You:') ? <span className="text-gray-400">You: </span> : ''}
                            {thread.last_msg?.replace('You: ', '') || 'No messages yet'}
                         </p>
                         {thread.unread > 0 && (
                           <span className="min-w-[1.25rem] h-5 flex items-center justify-center bg-primary rounded-full text-[10px] font-bold text-white px-1 shadow-sm shadow-primary/30">
                             {thread.unread}
                           </span>
                         )}
                      </div>
                   </div>
                </div>
             </div>
          ))}

          {!isLoading && filteredThreads.length === 0 && (
            <div className="text-center py-10 text-gray-400">
               <p>No conversations found.</p>
            </div>
          )}
        </div>
      </aside>

      {/* 
        RIGHT MAIN (Chat View) 
        - Hidden on mobile if view is 'list'
        - Always visible on md+
      */}
      <div className={`
        flex-1 bg-white dark:bg-[#1A1729] dark:md:glass-panel md:rounded-2xl flex-col h-full overflow-hidden relative border-l md:border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none transition-all
        ${mobileView === 'list' ? 'hidden md:flex' : 'flex'}
      `}>
        {activeThread ? (
          <>
            {/* Chat Header */}
            <header className="p-3 md:p-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-white/80 dark:bg-[#1A1729]/80 backdrop-blur-md sticky top-0 z-30">
               <div className="flex items-center gap-3">
                  {/* Mobile Back Button */}
                  <button 
                    onClick={handleBackToList}
                    className="md:hidden p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  {/* Header Avatar */}
                  <div className="relative">
                    {activeThread.avatar && activeThread.avatar.startsWith('http') ? (
                       <img src={activeThread.avatar} alt={activeThread.name} className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover" />
                    ) : (
                       <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${activeThread.avatar_color || 'bg-gray-500'} flex items-center justify-center text-white font-bold text-lg`}>
                          {activeThread.avatar || activeThread.name.charAt(0)}
                       </div>
                    )}
                    {activeThread.verified && (
                       <span className="absolute -bottom-1 -right-1 bg-primary text-white text-[9px] px-1.5 py-0.5 rounded-full border-2 border-white dark:border-[#1A1729] font-bold shadow-sm">
                         PRO
                       </span>
                    )}
                  </div>

                  {/* Header Info */}
                  <div>
                     <h1 className="text-base md:text-lg font-bold text-gray-900 dark:text-white leading-tight">
                       {activeThread.name}
                     </h1>
                     <div className="flex items-center gap-1.5">
                        {activeThread.is_online ? (
                          <>
                             <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                             <span className="text-xs text-green-600 dark:text-green-400 font-medium">Online</span>
                          </>
                        ) : (
                          <span className="text-xs text-gray-400">Offline</span>
                        )}
                     </div>
                  </div>
               </div>

               {/* Header Actions */}
               <div className="flex items-center gap-1 md:gap-2 text-gray-400">
                  <button onClick={handleFeatureNotReady} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"><Phone className="w-5 h-5" /></button>
                  <button onClick={handleFeatureNotReady} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"><Video className="w-5 h-5" /></button>
                  <button onClick={handleFeatureNotReady} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"><MoreVertical className="w-5 h-5" /></button>
               </div>
            </header>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-gray-50 dark:bg-black/20">
               {/* Date Separator */}
               <div className="flex justify-center sticky top-0 z-10 opacity-80 pointer-events-none">
                 <span className="text-[10px] md:text-xs bg-gray-200/80 dark:bg-white/10 px-3 py-1 rounded-full text-gray-500 dark:text-white/60 backdrop-blur-sm shadow-sm">
                   Today
                 </span>
               </div>
               
               {activeMessages.length > 0 ? (
                 activeMessages.map((msg) => {
                   const isMe = msg.sender_id === supabaseUser?.id;
                   const isSystem = msg.type === 'system';

                   if (isSystem) {
                     return (
                       <div key={msg.id} className="flex justify-center my-4">
                         <span className="text-xs text-gray-400 bg-gray-100 dark:bg-white/5 px-4 py-1.5 rounded-full text-center max-w-[80%]">
                           {msg.text}
                         </span>
                       </div>
                     );
                   }

                   return (
                     <div key={msg.id} className={`flex items-end gap-2 md:gap-3 max-w-[85%] md:max-w-[70%] group ${isMe ? 'self-end flex-row-reverse ml-auto' : ''}`}>
                        {/* Avatar (only for other) */}
                        {!isMe && (
                           activeThread.avatar && activeThread.avatar.startsWith('http') ? (
                              <img src={activeThread.avatar} className="w-6 h-6 md:w-8 md:h-8 rounded-full object-cover shadow-sm mb-1" alt={msg.senderName || 'User'} />
                           ) : (
                              <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full ${activeThread.avatar_color || 'bg-gray-500'} flex items-center justify-center text-[10px] font-bold text-white shadow-sm mb-1`}>
                                 {activeThread.avatar || activeThread.name.charAt(0)}
                              </div>
                           )
                        )}
                        
                        {/* Message Bubble */}
                        <div className={`
                          relative p-3 md:p-4 rounded-2xl text-sm leading-relaxed shadow-sm
                          ${isMe 
                            ? 'bg-primary text-white rounded-br-none' 
                            : 'bg-white dark:bg-[#252238] border border-gray-100 dark:border-white/5 text-gray-800 dark:text-gray-100 rounded-bl-none'
                          }
                        `}>
                           {/* Sender Name for Groups (if not me) */}
                           {!isMe && activeThread.type === 'group' && msg.senderName && (
                             <p className="text-[10px] font-bold opacity-60 mb-1 text-primary dark:text-primary-300">{msg.senderName}</p>
                           )}

                           {/* Content */}
                           {msg.type === 'image' ? (
                              <div className="flex items-center gap-2 italic opacity-80">
                                <ImageIcon className="w-4 h-4" /> Sent an image
                              </div>
                           ) : (
                              <p className="whitespace-pre-wrap">{msg.text}</p>
                           )}

                           {/* Metadata */}
                           <div className={`text-[10px] mt-1 text-right flex items-center justify-end gap-1 ${isMe ? 'text-white/70' : 'text-gray-400'}`}>
                             {formatTime(msg.created_at)}
                             {isMe && (
                               msg.status === 'read' ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />
                             )}
                           </div>
                        </div>
                     </div>
                   );
                 })
               ) : (
                 <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                       <Send className="w-6 h-6 ml-1" />
                    </div>
                    <p>No messages yet.</p>
                    <p className="text-sm">Say hello!</p>
                 </div>
               )}
               <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 md:p-4 bg-white dark:bg-[#1A1729] border-t border-gray-100 dark:border-white/5 relative z-20">
               <div className="flex items-end gap-2 md:gap-3 max-w-4xl mx-auto">
                  <button onClick={handleFeatureNotReady} className="p-3 text-gray-400 dark:text-white/50 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-white/5 rounded-xl transition-colors shrink-0">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  
                  <div className="flex-1 relative">
                     <textarea 
                        ref={inputRef}
                        value={msgText}
                        onChange={(e) => setMsgText(e.target.value)}
                        onKeyDown={handleKeyPress}
                        className="w-full bg-gray-100 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 pr-10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all resize-none max-h-32 min-h-[46px] custom-scrollbar" 
                        placeholder="Type a message..." 
                        rows={1}
                        style={{ height: 'auto', minHeight: '46px' }} 
                     />
                     <button onClick={handleFeatureNotReady} className="absolute right-3 bottom-3 text-gray-400 dark:text-white/50 hover:text-primary transition-colors">
                        <Smile className="w-5 h-5" />
                     </button>
                  </div>
                  
                  <button 
                    onClick={handleSendMessage}
                    disabled={!msgText.trim()}
                    className="p-3 bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95 group shrink-0"
                  >
                     <Send className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
               </div>
            </div>
          </>
        ) : (
          /* Empty State (Desktop) */
          <div className="hidden md:flex flex-col items-center justify-center h-full text-center p-6 bg-gray-50/50 dark:bg-transparent">
             <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <Send className="w-8 h-8 text-primary" />
             </div>
             <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Select a Conversation</h3>
             <p className="text-gray-500 dark:text-gray-400 max-w-xs">
               Choose a thread from the left sidebar to start chatting with your group or seller.
             </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
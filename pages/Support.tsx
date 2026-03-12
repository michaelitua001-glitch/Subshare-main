import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Infinity as InfinityIcon, ArrowLeft, Mail, MessageSquare, FileText, Send, Loader2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Support: React.FC = () => {
  const navigate = useNavigate();
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const { addToast } = useToast();

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSent(true);
      addToast('Message sent successfully!', 'success');
      setTimeout(() => setSent(false), 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0B0A15] text-white font-display overflow-x-hidden selection:bg-primary selection:text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B0A15]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-purple-400 flex items-center justify-center shadow-lg shadow-primary/20">
              <InfinityIcon className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">SubShare</span>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={() => navigate('/')} className="text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back to Home
             </button>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
           <h1 className="text-4xl md:text-6xl font-bold mb-6">How can we help?</h1>
           <p className="text-gray-400 text-lg max-w-2xl mx-auto">Our dedicated support team is here to assist you with any questions or issues regarding your subscriptions.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
           <div className="bg-[#1A1729] p-8 rounded-3xl border border-white/5 hover:border-primary/30 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                 <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Live Chat</h3>
              <p className="text-gray-400 mb-6 text-sm">Chat with our support team in real-time for immediate assistance.</p>
              <button onClick={() => navigate('/auth')} className="text-primary font-bold text-sm hover:underline">Start Chat</button>
           </div>
           
           <div className="bg-[#1A1729] p-8 rounded-3xl border border-white/5 hover:border-primary/30 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-6 group-hover:scale-110 transition-transform">
                 <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Email Support</h3>
              <p className="text-gray-400 mb-6 text-sm">Send us an email and we'll get back to you within 24 hours.</p>
              <a href="mailto:support@subshare.com" className="text-purple-500 font-bold text-sm hover:underline">support@subshare.com</a>
           </div>

           <div className="bg-[#1A1729] p-8 rounded-3xl border border-white/5 hover:border-primary/30 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
                 <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Documentation</h3>
              <p className="text-gray-400 mb-6 text-sm">Browse our detailed guides and FAQs to find answers quickly.</p>
              <button onClick={() => navigate('/how-it-works')} className="text-blue-500 font-bold text-sm hover:underline">View Guides</button>
           </div>
        </div>

        <div className="max-w-2xl mx-auto bg-[#1A1729] rounded-[2rem] p-8 md:p-12 border border-white/5">
           <h2 className="text-2xl font-bold mb-2">Contact Us</h2>
           <p className="text-gray-400 mb-8 text-sm">Fill out the form below and we will reach out shortly.</p>
           
           <form onSubmit={handleSend} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Name</label>
                    <input required type="text" placeholder="John Doe" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-all" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
                    <input required type="email" placeholder="john@example.com" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-all" />
                 </div>
              </div>
              <div className="space-y-2">
                 <label className="text-xs font-bold text-gray-500 uppercase">Subject</label>
                 <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-all">
                    <option>General Inquiry</option>
                    <option>Billing Issue</option>
                    <option>Report a User</option>
                    <option>Technical Support</option>
                 </select>
              </div>
              <div className="space-y-2">
                 <label className="text-xs font-bold text-gray-500 uppercase">Message</label>
                 <textarea required rows={4} placeholder="How can we help you?" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-all resize-none"></textarea>
              </div>
              <button 
                type="submit" 
                disabled={isSending || sent}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${sent ? 'bg-green-500 text-white' : 'bg-primary hover:bg-primary-dark text-white'}`}
              >
                 {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : sent ? 'Message Sent!' : <>Send Message <Send className="w-4 h-4" /></>}
              </button>
           </form>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 text-sm text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p>© 2023 SubShare Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <button onClick={() => navigate('/privacy')} className="hover:text-white transition-colors">Privacy</button>
            <button onClick={() => navigate('/terms')} className="hover:text-white transition-colors">Terms</button>
            <button onClick={() => navigate('/support')} className="hover:text-white transition-colors">Support</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Support;
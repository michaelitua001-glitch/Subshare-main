import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Infinity as InfinityIcon, 
  Check, 
  X, 
  HelpCircle,
  Menu,
  X as CloseIcon
} from 'lucide-react';

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <div className="min-h-screen bg-[#0B0A15] text-white font-display overflow-x-hidden selection:bg-primary selection:text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B0A15]/80 backdrop-blur-md border-b border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-purple-400 flex items-center justify-center shadow-lg shadow-primary/20">
              <InfinityIcon className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">SubShare</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <button onClick={() => navigate('/public-marketplace')} className="hover:text-white transition-colors">Marketplace</button>
            <button onClick={() => navigate('/how-it-works')} className="hover:text-white transition-colors">How it works</button>
            <button onClick={() => navigate('/pricing')} className={`hover:text-white transition-colors ${location.pathname === '/pricing' ? 'text-white' : ''}`}>Pricing</button>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button onClick={() => navigate('/auth')} className="text-sm font-medium text-white hover:text-primary transition-colors">Log In</button>
            <button onClick={() => navigate('/auth')} className="px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white text-sm font-bold transition-all transform hover:scale-105 active:scale-95">Get Started</button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-4">
             <button onClick={() => navigate('/auth')} className="text-sm font-bold text-white bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition-colors">Log In</button>
             <button onClick={toggleMenu} className="text-gray-300 hover:text-white p-1">
                {mobileMenuOpen ? <CloseIcon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
             </button>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-[#0B0A15] border-b border-white/10 p-6 flex flex-col gap-4 animate-[fadeIn_0.2s] shadow-2xl">
             <button onClick={() => navigate('/public-marketplace')} className="text-left text-lg font-medium text-gray-300 hover:text-white py-2 border-b border-white/5">Marketplace</button>
             <button onClick={() => navigate('/how-it-works')} className="text-left text-lg font-medium text-gray-300 hover:text-white py-2 border-b border-white/5">How it works</button>
             <button onClick={() => navigate('/pricing')} className="text-left text-lg font-medium text-white py-2 border-b border-white/5">Pricing</button>
             <div className="pt-2">
               <button 
                 onClick={() => navigate('/auth')} 
                 className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-center shadow-lg shadow-primary/20 transition-all active:scale-95"
               >
                 Get Started
               </button>
             </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <div className="pt-40 pb-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Transparent Pricing</h1>
        <p className="text-gray-400 max-w-xl mx-auto text-lg mb-16">No hidden fees. Choose the plan that works for your sharing habits.</p>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Free Tier */}
          <div className="bg-[#1A1729] rounded-3xl p-8 border border-white/5 hover:border-white/10 transition-all text-left relative">
             <div className="mb-6">
               <h3 className="text-xl font-bold mb-2">Basic Member</h3>
               <p className="text-gray-400 text-sm">Perfect for casual sharers.</p>
             </div>
             
             <div className="flex items-baseline gap-1 mb-8">
               <span className="text-4xl font-bold">$0</span>
               <span className="text-gray-500">/ month</span>
             </div>

             <div className="space-y-4 mb-8">
               <div className="flex items-center gap-3">
                 <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0"><Check className="w-3 h-3 text-white" /></div>
                 <span className="text-gray-300">Join unlimited groups</span>
               </div>
               <div className="flex items-center gap-3">
                 <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0"><Check className="w-3 h-3 text-white" /></div>
                 <span className="text-gray-300">Secure escrow payments</span>
               </div>
               <div className="flex items-center gap-3">
                 <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0"><Check className="w-3 h-3 text-white" /></div>
                 <span className="text-gray-300">5% Service Fee on transactions</span>
               </div>
               <div className="flex items-center gap-3">
                 <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center shrink-0"><X className="w-3 h-3 text-gray-500" /></div>
                 <span className="text-gray-500">No priority support</span>
               </div>
             </div>

             <button onClick={() => navigate('/auth')} className="w-full py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-bold transition-all">
               Get Started Free
             </button>
          </div>

          {/* Pro Tier */}
          <div className="bg-[#1A1729] rounded-3xl p-8 border border-primary/30 relative text-left overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-500"></div>
             <div className="absolute top-0 right-0 px-4 py-1 bg-primary text-white text-xs font-bold rounded-bl-xl">MOST POPULAR</div>
             
             <div className="mb-6">
               <h3 className="text-xl font-bold mb-2 text-white">SubShare Pro</h3>
               <p className="text-gray-400 text-sm">For power users and active sellers.</p>
             </div>
             
             <div className="flex items-baseline gap-1 mb-8">
               <span className="text-4xl font-bold text-white">$2.99</span>
               <span className="text-gray-500">/ month</span>
             </div>

             <div className="space-y-4 mb-8">
               <div className="flex items-center gap-3">
                 <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0"><Check className="w-3 h-3 text-white" /></div>
                 <span className="text-white">Everything in Basic</span>
               </div>
               <div className="flex items-center gap-3">
                 <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0"><Check className="w-3 h-3 text-white" /></div>
                 <span className="text-white font-bold text-primary-300">0% Service Fees</span>
               </div>
               <div className="flex items-center gap-3">
                 <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0"><Check className="w-3 h-3 text-white" /></div>
                 <span className="text-white">Priority 24/7 Support</span>
               </div>
               <div className="flex items-center gap-3">
                 <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0"><Check className="w-3 h-3 text-white" /></div>
                 <span className="text-white">Verified Seller Badge</span>
               </div>
             </div>

             <button onClick={() => navigate('/auth')} className="w-full py-4 rounded-xl bg-primary hover:bg-primary-dark font-bold shadow-lg shadow-primary/20 transition-all">
               Start 7-Day Free Trial
             </button>
          </div>

        </div>
      </div>

      {/* FAQ */}
      <div className="py-20 px-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-10 text-center">Frequently Asked Questions</h2>
        <div className="space-y-6">
           <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
              <h4 className="font-bold flex items-center gap-2 mb-2"><HelpCircle className="w-4 h-4 text-primary" /> When do I get paid?</h4>
              <p className="text-gray-400 text-sm">Funds are released instantly to your wallet as soon as the buyer confirms access. You can withdraw your earnings to your bank account immediately.</p>
           </div>
           <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
              <h4 className="font-bold flex items-center gap-2 mb-2"><HelpCircle className="w-4 h-4 text-primary" /> Is it legal to share?</h4>
              <p className="text-gray-400 text-sm">We only support services that explicitly allow family or multi-household sharing in their terms of service.</p>
           </div>
           <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
              <h4 className="font-bold flex items-center gap-2 mb-2"><HelpCircle className="w-4 h-4 text-primary" /> What if a password stops working?</h4>
              <p className="text-gray-400 text-sm">Buyers can report issues instantly. We pause payouts to the seller until the issue is resolved or refund the buyer.</p>
           </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 text-sm text-gray-500 bg-[#0B0A15]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <p>© 2023 SubShare Inc. All rights reserved.</p>
          <div className="flex gap-6 justify-center">
            <button onClick={() => navigate('/privacy')} className="hover:text-white transition-colors">Privacy</button>
            <button onClick={() => navigate('/terms')} className="hover:text-white transition-colors">Terms</button>
            <button onClick={() => navigate('/support')} className="hover:text-white transition-colors">Support</button>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Pricing;
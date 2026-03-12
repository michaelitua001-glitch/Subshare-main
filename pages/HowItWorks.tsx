import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Infinity as InfinityIcon, 
  Search, 
  CreditCard, 
  Key, 
  ShieldCheck, 
  Users, 
  DollarSign, 
  Play,
  Menu,
  X
} from 'lucide-react';

const HowItWorks: React.FC = () => {
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
            <button onClick={() => navigate('/how-it-works')} className={`hover:text-white transition-colors ${location.pathname === '/how-it-works' ? 'text-white' : ''}`}>How it works</button>
            <button onClick={() => navigate('/pricing')} className="hover:text-white transition-colors">Pricing</button>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button onClick={() => navigate('/auth')} className="text-sm font-medium text-white hover:text-primary transition-colors">Log In</button>
            <button onClick={() => navigate('/auth')} className="px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white text-sm font-bold transition-all transform hover:scale-105 active:scale-95">Get Started</button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-4">
             <button onClick={() => navigate('/auth')} className="text-sm font-bold text-white bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition-colors">Log In</button>
             <button onClick={toggleMenu} className="text-gray-300 hover:text-white p-1">
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
             </button>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-[#0B0A15] border-b border-white/10 p-6 flex flex-col gap-4 animate-[fadeIn_0.2s] shadow-2xl">
             <button onClick={() => navigate('/public-marketplace')} className="text-left text-lg font-medium text-gray-300 hover:text-white py-2 border-b border-white/5">Marketplace</button>
             <button onClick={() => navigate('/how-it-works')} className="text-left text-lg font-medium text-white py-2 border-b border-white/5">How it works</button>
             <button onClick={() => navigate('/pricing')} className="text-left text-lg font-medium text-gray-300 hover:text-white py-2 border-b border-white/5">Pricing</button>
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
      <div className="pt-40 pb-20 px-6 text-center relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 relative z-10">Simple, Secure, Shared.</h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg relative z-10 mb-16">We handle the coordination, payments, and security so you can focus on enjoying your favorite content for less.</p>

        {/* Video Section */}
        <div className="relative z-10 max-w-5xl mx-auto mb-10">
           <div className="aspect-video bg-[#1A1729] rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl relative group cursor-pointer">
              <img 
                 src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80" 
                 alt="Team working" 
                 className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0A15] via-transparent to-transparent opacity-60"></div>
              
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center pl-1 shadow-[0_0_30px_rgba(71,37,244,0.5)]">
                       <Play className="w-8 h-8 fill-current" />
                    </div>
                 </div>
              </div>

              <div className="absolute bottom-8 left-8 text-left">
                 <span className="px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold mb-2 inline-block">
                    Watch Demo
                 </span>
                 <h3 className="text-2xl font-bold text-white">See how SubShare works</h3>
              </div>
           </div>
           
           {/* Decorative elements behind video */}
           <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl -z-10"></div>
           <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl -z-10"></div>
        </div>
      </div>

      {/* For Buyers */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="bg-[#1A1729] rounded-[2.5rem] p-8 md:p-16 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[80px]"></div>
          
          <h2 className="text-3xl font-bold mb-12 flex items-center gap-3">
             <span className="bg-blue-500/20 text-blue-400 px-4 py-1 rounded-full text-sm">For Buyers</span>
             How to Join a Group
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4 relative">
               <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4">
                 <Search className="w-8 h-8" />
               </div>
               <h3 className="text-xl font-bold">1. Find a Deal</h3>
               <p className="text-gray-400 leading-relaxed">Browse the marketplace for the service you want. Filter by price, duration, and seller rating.</p>
               {/* Connector Line */}
               <div className="hidden md:block absolute top-8 left-20 w-full h-[2px] bg-gradient-to-r from-blue-500/20 to-transparent -z-10 transform translate-x-4"></div>
            </div>

            <div className="space-y-4 relative">
               <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-4">
                 <CreditCard className="w-8 h-8" />
               </div>
               <h3 className="text-xl font-bold">2. Secure Payment</h3>
               <p className="text-gray-400 leading-relaxed">Pay securely via the platform. We hold your funds in escrow until you confirm the subscription works.</p>
               {/* Connector Line */}
               <div className="hidden md:block absolute top-8 left-20 w-full h-[2px] bg-gradient-to-r from-purple-500/20 to-transparent -z-10 transform translate-x-4"></div>
            </div>

            <div className="space-y-4">
               <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 mb-4">
                 <Key className="w-8 h-8" />
               </div>
               <h3 className="text-xl font-bold">3. Instant Access</h3>
               <p className="text-gray-400 leading-relaxed">Get credentials instantly or an invite link to your private email. Enjoy your premium access!</p>
            </div>
          </div>
        </div>
      </section>

      {/* For Sellers */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="bg-[#1A1729] rounded-[2.5rem] p-8 md:p-16 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[80px]"></div>
          
          <h2 className="text-3xl font-bold mb-12 flex items-center gap-3">
             <span className="bg-primary/20 text-primary px-4 py-1 rounded-full text-sm">For Sellers</span>
             How to Share & Earn
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
               <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                 <Users className="w-8 h-8" />
               </div>
               <h3 className="text-xl font-bold">1. List Empty Slots</h3>
               <p className="text-gray-400 leading-relaxed">Create a listing for your family plan. Specify how many slots you have and the price per slot.</p>
            </div>

            <div className="space-y-4">
               <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-4">
                 <ShieldCheck className="w-8 h-8" />
               </div>
               <h3 className="text-xl font-bold">2. We Verify</h3>
               <p className="text-gray-400 leading-relaxed">Our system checks your subscription status to ensure trust for buyers. Verified badges get 3x more sales.</p>
            </div>

            <div className="space-y-4">
               <div className="w-16 h-16 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-500 mb-4">
                 <DollarSign className="w-8 h-8" />
               </div>
               <h3 className="text-xl font-bold">3. Get Paid</h3>
               <p className="text-gray-400 leading-relaxed">Receive instant payouts to your wallet the moment a buyer joins. Withdraw your earnings to your bank account anytime, 24/7.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 text-center">
         <h2 className="text-3xl font-bold mb-8">Ready to start saving?</h2>
         <button onClick={() => navigate('/auth')} className="px-8 py-4 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-lg shadow-[0_0_30px_rgba(71,37,244,0.4)] transition-all">
            Join SubShare Now
         </button>
      </section>

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

export default HowItWorks;
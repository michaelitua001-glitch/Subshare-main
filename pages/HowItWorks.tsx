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
  X,
  CheckCircle2,
  Music
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

        {/* Visual Steps Section */}
        <div className="relative z-10 max-w-6xl mx-auto mb-20 text-left">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            <div className="order-2 lg:order-1">
              <h3 className="text-3xl font-bold mb-4">1. Browse the Marketplace</h3>
              <p className="text-gray-400 text-lg mb-6">Explore hundreds of shared subscriptions across various categories like Video, Music, Gaming, and Productivity. Find the perfect plan that fits your needs and budget.</p>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> Verified listings only</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> Transparent pricing</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> Instant availability</li>
              </ul>
            </div>
            <div className="order-1 lg:order-2 relative">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
              <div className="relative bg-[#1A1729] border border-white/10 rounded-2xl p-6 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                {/* Mock Marketplace UI */}
                <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                  <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg">
                    <Search className="w-4 h-4 text-gray-400" />
                    <div className="h-4 w-32 bg-white/10 rounded"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 w-20 bg-primary/20 rounded-full"></div>
                    <div className="h-8 w-20 bg-white/5 rounded-full"></div>
                  </div>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg">
                          <Play className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="h-5 w-32 bg-white/20 rounded mb-2"></div>
                          <div className="h-3 w-20 bg-white/10 rounded"></div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-primary font-bold text-lg">$3.99<span className="text-xs text-gray-500 font-normal">/mo</span></div>
                        <div className="text-xs text-green-400 mt-1 font-medium">2 slots left</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full"></div>
              <div className="relative bg-[#1A1729] border border-white/10 rounded-2xl p-8 shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                {/* Mock Checkout UI */}
                <div className="text-center mb-8">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-2xl mb-4 flex items-center justify-center shadow-lg shadow-green-500/20">
                    <Music className="w-10 h-10 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-1">Spotify Premium</h4>
                  <p className="text-gray-400 text-sm">Family Plan Share</p>
                </div>
                <div className="bg-[#0B0A15] rounded-xl p-6 mb-6 border border-white/5">
                  <div className="flex justify-between mb-3 text-sm">
                    <span className="text-gray-400">Monthly Price</span>
                    <span className="text-white font-bold">$2.50</span>
                  </div>
                  <div className="flex justify-between mb-6 text-sm">
                    <span className="text-gray-400">Platform Fee</span>
                    <span className="text-white font-bold">$0.50</span>
                  </div>
                  <div className="flex justify-between pt-4 border-t border-white/10">
                    <span className="text-gray-300 font-medium">Total</span>
                    <span className="text-primary font-bold text-xl">$3.00<span className="text-sm text-gray-500 font-normal">/mo</span></span>
                  </div>
                </div>
                <div className="w-full py-3.5 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                  <CreditCard className="w-5 h-5" /> Pay Securely
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-4">2. Secure Payment & SubShare Wallet</h3>
              <p className="text-gray-400 text-lg mb-6">Pay securely using your SubShare Wallet. Funds are held in our secure escrow system and are only released to the group owner once you confirm the service is working perfectly.</p>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-purple-500" /> Buyer protection via Escrow</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-purple-500" /> One-click Wallet top-ups</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-purple-500" /> No hidden transaction fees</li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <h3 className="text-3xl font-bold mb-4">3. Instant Access & Dashboard</h3>
              <p className="text-gray-400 text-lg mb-6">Get your credentials instantly or receive an invite link directly to your email. Manage all your shared subscriptions from one centralized, easy-to-use dashboard.</p>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-green-500" /> Auto-renewals management</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-green-500" /> Direct chat with sellers</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-green-500" /> Real-time notifications</li>
              </ul>
            </div>
            <div className="order-1 lg:order-2 relative">
              <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full"></div>
              <div className="relative bg-[#1A1729] border border-white/10 rounded-2xl p-6 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                {/* Mock Dashboard UI */}
                <div className="flex gap-4 mb-6">
                  <div className="flex-1 bg-white/5 rounded-xl p-5 border border-white/5">
                    <div className="text-gray-400 text-xs mb-2">Active Subs</div>
                    <div className="text-3xl font-bold text-white">4</div>
                  </div>
                  <div className="flex-1 bg-white/5 rounded-xl p-5 border border-white/5">
                    <div className="text-gray-400 text-xs mb-2">Wallet Balance</div>
                    <div className="text-3xl font-bold text-green-400">$248.50</div>
                  </div>
                </div>
                <div className="bg-[#0B0A15] rounded-xl p-5 border border-white/5">
                  <div className="flex items-center justify-between mb-5">
                    <h5 className="font-medium text-white">Your Credentials</h5>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 bg-white/5 rounded-lg flex items-center justify-between border border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center text-red-500">
                          <Play className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium text-white">Netflix Premium</span>
                      </div>
                      <div className="px-3 py-1.5 bg-primary/20 text-primary rounded-lg text-xs font-bold">View Details</div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg flex items-center justify-between border border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center text-green-500">
                          <Music className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium text-white">Spotify Family</span>
                      </div>
                      <div className="px-3 py-1.5 bg-primary/20 text-primary rounded-lg text-xs font-bold">View Details</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
               <h3 className="text-xl font-bold">3. Get Paid Instantly</h3>
               <p className="text-gray-400 leading-relaxed">Earnings are credited to your SubShare Wallet the moment a buyer joins. Withdraw your funds 24/7 or use them to join other subscription groups.</p>
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
          <p>© 2024 SubShare Inc. All rights reserved.</p>
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
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  Play, 
  ArrowRight, 
  Search, 
  Plus, 
  ShieldCheck, 
  Zap,
  Music,
  Tv,
  CreditCard,
  Infinity as InfinityIcon,
  Gamepad,
  Menu,
  X
} from 'lucide-react';

const Landing: React.FC = () => {
  const navigate = useNavigate();
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
            <button onClick={() => navigate('/pricing')} className="hover:text-white transition-colors">Pricing</button>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => navigate('/auth')}
              className="text-sm font-medium text-white hover:text-primary transition-colors"
            >
              Log In
            </button>
            <button 
              onClick={() => navigate('/auth')}
              className="px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white text-sm font-bold shadow-[0_0_20px_rgba(71,37,244,0.4)] transition-all transform hover:scale-105 active:scale-95"
            >
              Get Started
            </button>
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
             <button onClick={() => navigate('/how-it-works')} className="text-left text-lg font-medium text-gray-300 hover:text-white py-2 border-b border-white/5">How it works</button>
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

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 relative z-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-green-400 mx-auto lg:mx-0">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              New: Spotify Duo Splitting Available
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight">
              Maximize Your <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-500">Subscriptions.</span>
            </h1>
            
            <p className="text-base sm:text-lg text-gray-400 max-w-lg leading-relaxed mx-auto lg:mx-0">
              Stop overpaying for unused digital services. Track, share, and split costs on the world's first premium subscription marketplace. Save up to 80% monthly.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button 
                onClick={() => navigate('/auth')}
                className="px-8 py-4 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-lg shadow-[0_0_30px_rgba(71,37,244,0.5)] transition-all transform hover:-translate-y-1 active:scale-95"
              >
                Start Saving
              </button>
              <button 
                onClick={() => navigate('/how-it-works')}
                className="px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-lg backdrop-blur-sm transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Play className="w-5 h-5 fill-current" /> See How It Works
              </button>
            </div>

            <div className="pt-8 flex flex-col items-center lg:items-start">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Trusted by 10,000+ users saving on</p>
              <div className="flex gap-4 flex-wrap justify-center lg:justify-start">
                {[
                  { name: 'Netflix', icon: Tv }, 
                  { name: 'Spotify', icon: Music }, 
                  { name: 'Adobe', icon: Zap }, 
                  { name: 'Prime', icon: CreditCard }
                ].map((brand, i) => (
                  <div key={i} className="px-4 py-2 rounded-lg bg-white/5 border border-white/5 flex items-center gap-2 text-gray-400 hover:bg-white/10 hover:text-white transition-colors cursor-default">
                    <brand.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{brand.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Content: Dashboard Preview */}
          <div className="relative z-10 lg:ml-auto w-full max-w-md mx-auto">
            {/* Abstract Card Decorations */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-[2rem] opacity-30 blur-lg"></div>
            
            <div className="relative bg-[#131022] border border-white/10 rounded-[1.5rem] p-6 shadow-2xl overflow-hidden">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="font-bold text-lg text-white">My Dashboard</h3>
                  <p className="text-xs text-gray-400">Total Savings: $42.50/mo</p>
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-white/10 bg-primary/20 flex items-center justify-center text-primary font-bold">
                  JD
                </div>
              </div>

              <div className="space-y-4 mb-6">
                {/* Item 1 */}
                <div className="bg-[#1A1729] rounded-xl p-4 flex items-center justify-between border border-white/5 hover:border-white/10 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-black flex items-center justify-center text-red-600 font-bold text-xl shadow-lg border border-white/5">N</div>
                    <div>
                      <p className="font-bold text-white text-sm">Netflix Premium</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        <p className="text-[10px] text-gray-400">Active • Shared with 3</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white">$4.99</p>
                    <p className="text-[10px] text-gray-500 line-through">$19.99</p>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="bg-[#1A1729] rounded-xl p-4 flex items-center justify-between border border-white/5 hover:border-white/10 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-black flex items-center justify-center text-green-500 font-bold text-xl shadow-lg border border-white/5">S</div>
                    <div>
                      <p className="font-bold text-white text-sm">Spotify Family</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        <p className="text-[10px] text-gray-400">Active • Shared with 5</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white">$2.99</p>
                    <p className="text-[10px] text-gray-500 line-through">$15.99</p>
                  </div>
                </div>

                {/* Item 3 */}
                <div className="bg-gradient-to-r from-[#1A1729] to-[#25213b] rounded-xl p-4 flex items-center justify-between border border-white/10 relative overflow-hidden hover:border-white/20 transition-colors cursor-pointer">
                  <div className="absolute top-0 right-0 px-2 py-0.5 bg-primary/20 text-primary text-[9px] font-bold rounded-bl-lg">Just Saved</div>
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-lg bg-blue-900/50 flex items-center justify-center text-blue-400 font-bold shadow-lg border border-white/5">
                      <Gamepad className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">PS Plus Deluxe</p>
                      <p className="text-xs text-gray-400 mt-0.5">Expires in 2 days</p>
                    </div>
                  </div>
                  <div className="text-right relative z-10">
                    <p className="font-bold text-white">$5.99</p>
                  </div>
                </div>
              </div>

              {/* Toast Notification Mock */}
              <div className="absolute bottom-6 left-6 right-6 bg-[#25213b]/90 backdrop-blur-md p-3 rounded-lg border border-green-500/20 shadow-xl flex items-center gap-3 animate-[bounce_3s_infinite]">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Total Savings</p>
                  <p className="text-[10px] text-gray-300"><span className="text-white font-bold">$15.00 this month</span> vs retail</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1 */}
          <div className="group relative rounded-3xl bg-[#131022] border border-white/5 p-8 md:p-12 overflow-hidden hover:border-primary/30 transition-all duration-500 shadow-lg hover:shadow-primary/5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] group-hover:bg-blue-600/20 transition-all"></div>
            
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center mb-6 text-blue-500">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Browse the Marketplace</h3>
              <p className="text-gray-400 mb-8 max-w-sm leading-relaxed">
                Find available slots in verified premium groups. Join instantly and start enjoying premium services for a fraction of the cost. Save up to 80% on 50+ services.
              </p>
              
              <button onClick={() => navigate('/public-marketplace')} className="text-blue-500 font-bold flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                Explore Deals <ArrowRight className="w-4 h-4" />
              </button>

              <div className="mt-10 flex gap-3 flex-wrap">
                 {['Netflix', 'HBO Max', 'Masterclass'].map((tag, i) => (
                   <span key={i} className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] text-gray-400 flex items-center gap-1.5">
                     <span className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-red-500' : i === 1 ? 'bg-blue-500' : 'bg-purple-500'}`}></span>
                     {tag}
                   </span>
                 ))}
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group relative rounded-3xl bg-[#131022] border border-white/5 p-8 md:p-12 overflow-hidden hover:border-purple-500/30 transition-all duration-500 shadow-lg hover:shadow-purple-500/5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px] group-hover:bg-purple-600/20 transition-all"></div>
            
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-purple-600/20 flex items-center justify-center mb-6 text-purple-500">
                <Plus className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Share & Earn</h3>
              <p className="text-gray-400 mb-8 max-w-sm leading-relaxed">
                Have empty slots in your family plan? List them securely on our platform. We handle the payments and member management so you get paid automatically every month.
              </p>
              
              <button onClick={() => navigate('/auth')} className="text-purple-500 font-bold flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                List Subscription <ArrowRight className="w-4 h-4" />
              </button>


            </div>
          </div>

        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white/[0.02] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="p-6 border-b md:border-b-0 md:border-r border-white/5 last:border-0">
               <h4 className="text-4xl md:text-5xl font-bold text-white mb-2">50k+</h4>
               <p className="text-sm font-bold tracking-widest text-gray-500 uppercase">Active Members</p>
            </div>
            <div className="p-6 border-b md:border-b-0 md:border-r border-white/5 last:border-0">
               <h4 className="text-4xl md:text-5xl font-bold text-white mb-2">$2M+</h4>
               <p className="text-sm font-bold tracking-widest text-gray-500 uppercase">User Savings</p>
            </div>
            <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
               <div className="text-center md:text-left">
                  <h4 className="text-4xl md:text-5xl font-bold text-white mb-2">4.9/5</h4>
                  <p className="text-sm font-bold tracking-widest text-gray-500 uppercase">Trust Score</p>
               </div>
               <button onClick={() => navigate('/public-marketplace')} className="px-6 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-semibold border border-white/10 transition-colors active:scale-95">
                 View Statistics
               </button>
            </div>
          </div>
        </div>
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

export default Landing;
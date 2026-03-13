import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Infinity as InfinityIcon, 
  Search, 
  Tv, 
  Music, 
  Gamepad, 
  PenTool, 
  Zap,
  Lock,
  ArrowRight,
  Menu,
  X
} from 'lucide-react';

const PublicMarketplace: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const categories = [
    { icon: Tv, label: 'Video' },
    { icon: Music, label: 'Music' },
    { icon: Gamepad, label: 'Gaming' },
    { icon: PenTool, label: 'Design' },
    { icon: Zap, label: 'Productivity' },
  ];

  const listings: { name: string; price: number; icon: any; color: string; bg: string }[] = [];

  const filteredListings = listings.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <button onClick={() => navigate('/public-marketplace')} className={`hover:text-white transition-colors ${location.pathname === '/public-marketplace' ? 'text-white' : ''}`}>Marketplace</button>
            <button onClick={() => navigate('/how-it-works')} className="hover:text-white transition-colors">How it works</button>
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
             <button onClick={() => navigate('/public-marketplace')} className="text-left text-lg font-medium text-white py-2 border-b border-white/5">Marketplace</button>
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

      {/* Hero */}
      <div className="pt-32 pb-12 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Browse Available Subscriptions</h1>
        <p className="text-gray-400 max-w-2xl mx-auto mb-10">Join thousands of verified groups and save up to 80% on your monthly digital expenses.</p>
        
        {/* Search */}
        <div className="max-w-xl mx-auto relative mb-12">
          <Search className="absolute left-4 top-3.5 text-gray-500 w-5 h-5" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for Netflix, Spotify, Adobe..." 
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-all"
          />
        </div>

        {/* Categories */}
        <div className="flex justify-center gap-4 flex-wrap mb-16">
          {categories.map((cat, i) => (
            <button key={i} className="px-6 py-3 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all flex items-center gap-2 text-sm font-medium">
              <cat.icon className="w-4 h-4" /> {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.length > 0 ? (
            filteredListings.map((item, i) => (
              <div key={i} className="group bg-[#1A1729] rounded-3xl p-6 border border-white/5 hover:border-primary/50 transition-all relative overflow-hidden">
                 {/* Lock Overlay */}
                 <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                    <Lock className="w-8 h-8 text-white mb-2" />
                    <p className="text-sm font-bold mb-4">Sign in to view details</p>
                    <button onClick={() => navigate('/auth')} className="px-6 py-2 bg-primary rounded-xl font-bold text-sm hover:scale-105 transition-transform">
                      View Listing
                    </button>
                 </div>

                 <div className="flex justify-between items-start mb-6">
                    <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center text-xl font-bold ${item.color} shadow-lg`}>
                      {item.icon}
                    </div>
                    <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-bold border border-green-500/20">
                      Verified
                    </div>
                 </div>
                 
                 <h3 className="text-xl font-bold mb-1">{item.name}</h3>
                 <p className="text-gray-400 text-sm mb-6">Family Plan • 4K UHD</p>

                 <div className="flex items-end justify-between border-t border-white/5 pt-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Price per slot</p>
                      <p className="text-2xl font-bold">${item.price}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-1">Slots</p>
                      <div className="flex -space-x-2 justify-end">
                        <div className="w-6 h-6 rounded-full bg-gray-700 border border-[#1A1729]"></div>
                        <div className="w-6 h-6 rounded-full bg-gray-600 border border-[#1A1729]"></div>
                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[8px] border border-[#1A1729]">+2</div>
                      </div>
                    </div>
                 </div>
              </div>
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-20">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
                    <Search className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">No results found</h3>
                <p className="text-gray-400">Try searching for something else, like "Netflix" or "Music"</p>
                <button onClick={() => setSearchQuery('')} className="mt-6 text-primary hover:text-white transition-colors font-medium">Clear Search</button>
            </div>
          )}
        </div>

        <div className="mt-16 text-center">
           <button onClick={() => navigate('/auth')} className="inline-flex items-center gap-2 text-primary font-bold hover:text-white transition-colors">
             View all 1,240+ listings <ArrowRight className="w-4 h-4" />
           </button>
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

export default PublicMarketplace;
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Tv, 
  Music, 
  Gamepad, 
  PenTool, 
  Zap, 
  GraduationCap, 
  CheckCircle2, 
  ToggleLeft,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Globe,
  Bell,
  Plus,
  X,
  CreditCard,
  Loader2,
  Heart,
  Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

// --- Types ---
interface Listing {
  id: string;
  name: string;
  plan: string;
  price: number;
  cycle: string;
  slots: string;
  billing: string;
  icon: any;
  color: string;
  bg: string;
  verified: boolean;
  full: boolean;
  watched: boolean;
  category: string;
  renewable: boolean;
  timestamp: number;
}

// --- Icons & Helpers ---
const categories = [
  { icon: Tv, label: 'Video' },
  { icon: Music, label: 'Music' },
  { icon: Gamepad, label: 'Gaming' },
  { icon: PenTool, label: 'Design' },
  { icon: Zap, label: 'Productivity' },
  { icon: GraduationCap, label: 'Education' },
];

function PlayIcon() {
  return (
    <div className="relative w-full h-full bg-white flex items-center justify-center rounded-lg">
      <div className="w-8 h-5 bg-[#FF0000] rounded-lg flex items-center justify-center">
        <div className="w-0 h-0 border-t-[3px] border-t-transparent border-l-[6px] border-l-white border-b-[3px] border-b-transparent ml-0.5"></div>
      </div>
    </div>
  );
}

function LayoutGridIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"></rect>
      <rect x="14" y="3" width="7" height="7"></rect>
      <rect x="14" y="14" width="7" height="7"></rect>
      <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
  );
}

// --- Initial Data ---
const initialListings: Listing[] = [];

const Marketplace: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  // --- State ---
  const [listings, setListings] = useState<Listing[]>(initialListings);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState(20);
  const [sortBy, setSortBy] = useState('Recommended');
  
  // Toggles
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [renewableOnly, setRenewableOnly] = useState(false);
  const [watchlistOnly, setWatchlistOnly] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modals & UI
  const [showSellModal, setShowSellModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // New Listing Form
  const [newListing, setNewListing] = useState({
    service: 'Netflix',
    price: '',
    slots: '1',
    plan: ''
  });

  // --- Derived State (Filtering & Sorting) ---
  const filteredListings = useMemo(() => {
    let result = [...listings];

    // 1. Filter by Category
    if (selectedCategory !== 'All') {
      result = result.filter(item => item.category === selectedCategory);
    }

    // 2. Filter by Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.name.toLowerCase().includes(q) || 
        item.plan.toLowerCase().includes(q)
      );
    }

    // 3. Filter by Price Range
    result = result.filter(item => item.price <= priceRange);

    // 4. Filter by Toggles
    if (verifiedOnly) result = result.filter(item => item.verified);
    if (renewableOnly) result = result.filter(item => item.renewable);
    if (watchlistOnly) result = result.filter(item => item.watched);

    // 5. Sorting
    if (sortBy === 'Price: Low to High') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'Recently Added') {
      result.sort((a, b) => b.timestamp - a.timestamp);
    }
    // 'Recommended' leaves it as is (or could be custom logic)

    return result;
  }, [listings, selectedCategory, searchQuery, priceRange, sortBy, verifiedOnly, renewableOnly, watchlistOnly]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredListings.length / itemsPerPage);
  const paginatedListings = filteredListings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, priceRange, sortBy, verifiedOnly, renewableOnly, watchlistOnly]);

  // --- Handlers ---
  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    setTimeout(() => {
      // Pick icon/color logic
      let icon: any = newListing.service[0];
      let bg = 'bg-gray-900';
      let color = 'text-white';
      let category = 'Video';

      if (newListing.service === 'Netflix') { icon = 'N'; bg='bg-black'; color='text-red-600'; category = 'Video'; }
      if (newListing.service === 'Spotify') { icon = <Music className="w-6 h-6" />; bg='bg-[#1db954]'; color='text-black'; category = 'Music'; }
      if (newListing.service === 'Disney+') { icon = 'D+'; bg='bg-[#0063e5]'; color='text-white'; category = 'Video'; }
      
      const item: Listing = {
        id: Math.random().toString(36).substr(2, 9),
        name: newListing.service + ' Premium',
        plan: newListing.plan || 'Family Plan',
        price: parseFloat(newListing.price),
        cycle: '/mo',
        slots: `${newListing.slots} slots left`,
        billing: 'Monthly',
        icon: icon,
        color: color,
        bg: bg,
        verified: true,
        full: false,
        watched: false,
        category: category,
        renewable: true,
        timestamp: Date.now()
      };

      setListings([item, ...listings]);
      setIsProcessing(false);
      setShowSellModal(false);
      setNewListing({ service: 'Netflix', price: '', slots: '1', plan: '' });
      addToast('Listing created successfully!', 'success');
      
      // Auto-switch to All so user sees their listing if they were filtered
      if (selectedCategory !== 'All' && selectedCategory !== category) {
          setSelectedCategory('All');
      }
      setSearchQuery('');
    }, 1500);
  };

  const toggleWatchlist = (id: string) => {
    const item = listings.find(i => i.id === id);
    if (item) {
        if (!item.watched) {
            addToast('Added to watchlist', 'success');
        } else {
            addToast('Removed from watchlist', 'info');
        }
    }
    setListings(prev => prev.map(item => 
      item.id === id ? { ...item, watched: !item.watched } : item
    ));
  };

  const handleResetFilters = () => {
    setSortBy('Recommended');
    setVerifiedOnly(false);
    setRenewableOnly(false);
    setWatchlistOnly(false);
    setPriceRange(20);
    setSearchQuery('');
    setSelectedCategory('All');
    setCurrentPage(1);
    addToast('Filters reset', 'info');
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-6 overflow-hidden bg-gray-50 dark:bg-[#0B0A15] transition-colors duration-300 relative">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 shrink-0 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Marketplace
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Discover and join premium shared subscriptions</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative flex-1 md:w-64 lg:w-80">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#1A1729] border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-sm dark:shadow-none"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button 
             onClick={() => setShowSellModal(true)}
             className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-bold shadow-[0_0_20px_rgba(71,37,244,0.4)] transition-all flex items-center gap-2 whitespace-nowrap"
          >
             <Plus className="w-4 h-4" /> Sell
          </button>
          
          <button className="w-10 h-10 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 relative transition-colors shrink-0 shadow-sm dark:shadow-none">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-[#0B0A15]"></span>
          </button>

          {/* Mobile Filter Toggle */}
          <button 
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="lg:hidden w-10 h-10 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto pr-2 pb-20 no-scrollbar">
        {/* Categories */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-6 no-scrollbar">
          <button 
            onClick={() => setSelectedCategory('All')}
            className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'All' 
                ? 'bg-primary text-white shadow-[0_0_15px_rgba(71,37,244,0.3)]' 
                : 'bg-white dark:bg-[#1A1729] border border-gray-200 dark:border-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat, idx) => (
            <button 
              key={idx} 
              onClick={() => setSelectedCategory(cat.label)}
              className={`px-6 py-2.5 rounded-full border flex items-center gap-2 text-sm font-medium whitespace-nowrap transition-all shadow-sm dark:shadow-none ${
                selectedCategory === cat.label
                  ? 'bg-primary border-primary text-white shadow-[0_0_15px_rgba(71,37,244,0.3)]'
                  : 'bg-white dark:bg-[#1A1729] border-gray-200 dark:border-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <cat.icon className="w-4 h-4" /> {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Filters */}
          <div className={`lg:col-span-1 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
             <div className="bg-white dark:bg-[#1A1729] rounded-2xl p-6 border border-gray-200 dark:border-white/5 sticky top-0 shadow-sm dark:shadow-none animate-[fadeIn_0.3s]">
               <div className="flex items-center justify-between mb-6">
                 <h3 className="font-bold text-lg text-gray-900 dark:text-white">Filters</h3>
                 <button onClick={handleResetFilters} className="text-xs text-primary hover:text-primary-dark dark:hover:text-white transition-colors">Reset</button>
               </div>
               
               <div className="space-y-8">
                 {/* Sort By */}
                 <div>
                   <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 block">Sort By</label>
                   <div className="space-y-3">
                     {[
                       { label: 'Recommended' },
                       { label: 'Price: Low to High' },
                       { label: 'Recently Added' }
                     ].map((opt, i) => (
                       <label key={i} className="flex items-center gap-3 cursor-pointer group">
                         <div 
                           onClick={() => setSortBy(opt.label)}
                           className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${sortBy === opt.label ? 'border-primary' : 'border-gray-300 dark:border-gray-600 group-hover:border-gray-400'}`}
                         >
                           {sortBy === opt.label && <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>}
                         </div>
                         <span className={`text-sm ${sortBy === opt.label ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'} transition-colors`}>{opt.label}</span>
                       </label>
                     ))}
                   </div>
                 </div>
                 
                 {/* Options */}
                 <div>
                   <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 block">Options</label>
                   <div className="space-y-3">
                     <label className="flex items-center gap-3 cursor-pointer group" onClick={(e) => { e.preventDefault(); setVerifiedOnly(!verifiedOnly); }}>
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${verifiedOnly ? 'bg-primary border-primary' : 'border-gray-300 dark:border-gray-600 group-hover:border-gray-400'}`}>
                           {verifiedOnly && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Verified Sellers Only</span>
                     </label>

                     <label className="flex items-center gap-3 cursor-pointer group" onClick={(e) => { e.preventDefault(); setRenewableOnly(!renewableOnly); }}>
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${renewableOnly ? 'bg-primary border-primary' : 'border-gray-300 dark:border-gray-600 group-hover:border-gray-400'}`}>
                           {renewableOnly && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Renewable Only</span>
                     </label>
                     
                     {/* Watchlist Toggle */}
                     <label className="flex items-center gap-3 cursor-pointer group" onClick={(e) => { e.preventDefault(); setWatchlistOnly(!watchlistOnly); }}>
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${watchlistOnly ? 'bg-primary border-primary' : 'border-gray-300 dark:border-gray-600 group-hover:border-gray-400'}`}>
                           {watchlistOnly && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <div className="flex items-center gap-2">
                          <Heart className={`w-3.5 h-3.5 ${watchlistOnly ? 'text-primary' : 'text-gray-500 dark:text-gray-400'} group-hover:text-primary transition-colors`} />
                          <span className={`text-sm ${watchlistOnly ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-500 dark:text-gray-400'} group-hover:text-gray-900 dark:group-hover:text-white transition-colors`}>My Watchlist</span>
                        </div>
                     </label>
                   </div>
                 </div>

                 {/* Price Range */}
                 <div>
                   <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 block">Price Range</label>
                   <div className="flex items-center gap-3 mb-3">
                      <div className="bg-gray-50 dark:bg-[#0B0A15] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-center w-full text-gray-500 dark:text-gray-400">$1</div>
                      <span className="text-gray-400 dark:text-gray-600">-</span>
                      <div className="bg-gray-50 dark:bg-[#0B0A15] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-center w-full text-gray-900 dark:text-white">${priceRange}</div>
                   </div>
                   <input 
                      type="range" 
                      min="1" 
                      max="50" 
                      value={priceRange}
                      onChange={(e) => setPriceRange(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary" 
                   />
                 </div>
               </div>
             </div>
          </div>

          {/* Grid */}
          <div className="lg:col-span-3">
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedListings.length > 0 ? (
                  paginatedListings.map((item) => (
                    <div key={item.id} className="bg-white dark:bg-[#1A1729] rounded-2xl p-5 border border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10 hover:translate-y-[-2px] transition-all duration-300 group cursor-pointer relative overflow-hidden shadow-sm dark:shadow-none animate-[fadeIn_0.5s]">
                      {/* Watchlist Button */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWatchlist(item.id);
                        }}
                        className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 hover:bg-red-50 dark:hover:bg-red-500/20 border border-gray-200 dark:border-white/10 flex items-center justify-center transition-all active:scale-95 group/heart"
                      >
                         <Heart className={`w-4 h-4 transition-colors ${item.watched ? 'fill-red-500 text-red-500' : 'text-gray-400 dark:text-gray-400 group-hover/heart:text-red-500'}`} />
                      </button>

                      {/* Verified Badge */}
                      {item.verified && (
                         <div className="absolute top-4 right-14 bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 text-[10px] font-bold px-2 py-1 rounded border border-green-200 dark:border-green-500/20 flex items-center gap-1 backdrop-blur-sm z-10">
                           <ShieldCheck className="w-3 h-3" /> Verified
                         </div>
                      )}

                      <div className="flex items-start gap-4 mb-6">
                        <div className={`w-14 h-14 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0 border border-white/5 shadow-lg`}>
                          {typeof item.icon === 'string' ? (
                            <span className={`${item.color} font-extrabold tracking-tighter text-lg`}>{item.icon}</span>
                          ) : (
                             <div className={item.color}>{item.icon}</div>
                          )}
                        </div>
                        <div className="pt-1 pr-12">
                          <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight">{item.name}</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.plan}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                         <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-300">
                               <ToggleLeft className={`w-5 h-5 ${item.full ? 'text-gray-400 dark:text-gray-600' : 'text-gray-400'}`} /> 
                               <span>{item.slots}</span>
                            </div>
                            <span className={item.billing === 'Annual Plan' || item.billing === 'Annual' ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'}>{item.billing}</span>
                         </div>

                         <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                            <div className="flex items-baseline gap-1">
                               <span className="text-2xl font-bold text-gray-900 dark:text-white">${item.price.toFixed(2)}</span>
                               <span className="text-xs text-gray-500">{item.cycle}</span>
                            </div>
                            <button 
                              disabled={item.full}
                              onClick={() => navigate(`/product/${item.id}`)}
                              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                                item.full 
                                  ? 'bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                                  : 'bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-900 dark:text-white border border-gray-200 dark:border-white/5'
                              }`}
                            >
                              {item.full ? 'Full' : 'Join'}
                            </button>
                         </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-1 md:col-span-2 xl:col-span-3 flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-gray-200 dark:border-white/5 rounded-3xl">
                     <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                        <Heart className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                     </div>
                     <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No listings found</h3>
                     <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs mx-auto">
                        {watchlistOnly
                          ? "You haven't added any listings to your watchlist yet." 
                          : "Try adjusting your filters or search for something else."}
                     </p>
                     <button 
                        onClick={handleResetFilters}
                        className="mt-6 px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-bold transition-colors"
                     >
                        Clear Filters
                     </button>
                  </div>
                )}
             </div>

             {/* Pagination */}
             {totalPages > 1 && (
               <div className="mt-12 flex justify-center items-center gap-3">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="w-10 h-10 rounded-lg bg-white dark:bg-[#1A1729] border border-gray-200 dark:border-white/5 flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors shadow-sm dark:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button 
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
                        currentPage === page
                          ? 'bg-primary text-white shadow-lg shadow-primary/20'
                          : 'bg-white dark:bg-[#1A1729] border border-gray-200 dark:border-white/5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 rounded-lg bg-white dark:bg-[#1A1729] border border-gray-200 dark:border-white/5 flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors shadow-sm dark:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     <ChevronRight className="w-5 h-5" />
                  </button>
               </div>
             )}
          </div>
        </div>
      </div>

      {/* Sell Modal */}
      {showSellModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isProcessing && setShowSellModal(false)}></div>
          <div className="relative w-full max-w-md bg-white dark:bg-[#1A1729] rounded-3xl shadow-2xl animate-[fadeIn_0.3s] border border-gray-200 dark:border-white/10 flex flex-col max-h-[90vh]">
            
            <div className="p-6 border-b border-gray-100 dark:border-white/5 flex justify-between items-center shrink-0">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">List Subscription</h2>
              <button onClick={() => setShowSellModal(false)} disabled={isProcessing} className="text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateListing} className="flex-1 overflow-y-auto p-6 space-y-5">
               <div className="space-y-2">
                 <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Service</label>
                 <select 
                   value={newListing.service}
                   onChange={(e) => setNewListing({...newListing, service: e.target.value})}
                   className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
                 >
                   <option>Netflix</option>
                   <option>Spotify</option>
                   <option>YouTube Premium</option>
                   <option>Disney+</option>
                   <option>Hulu</option>
                 </select>
               </div>

               <div className="space-y-2">
                 <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Plan Name</label>
                 <input 
                   type="text"
                   value={newListing.plan}
                   onChange={(e) => setNewListing({...newListing, plan: e.target.value})}
                   placeholder="e.g. Family Plan 4K"
                   required
                   className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                 />
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price / Mo</label>
                   <div className="relative">
                     <span className="absolute left-4 top-3 text-gray-400">$</span>
                     <input 
                       type="number"
                       step="0.01"
                       value={newListing.price}
                       onChange={(e) => setNewListing({...newListing, price: e.target.value})}
                       placeholder="4.99"
                       required
                       className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl pl-8 pr-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                     />
                   </div>
                 </div>

                 <div className="space-y-2">
                   <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Available Slots</label>
                   <input 
                       type="number"
                       min="1"
                       max="10"
                       value={newListing.slots}
                       onChange={(e) => setNewListing({...newListing, slots: e.target.value})}
                       className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                   />
                 </div>
               </div>

               <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-500/20 flex gap-3 items-start">
                  <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                    You'll receive payments directly to your wallet once a buyer joins. We charge a 5% service fee on successful transactions.
                  </p>
               </div>
            </form>

            <div className="p-6 border-t border-gray-100 dark:border-white/5 shrink-0 bg-gray-50/50 dark:bg-white/[0.02]">
               <button 
                  onClick={handleCreateListing}
                  disabled={isProcessing || !newListing.price || !newListing.plan}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Listing'}
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
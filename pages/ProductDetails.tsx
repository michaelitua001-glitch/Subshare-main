import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Monitor, 
  Lock, 
  Zap, 
  Star, 
  ArrowRight, 
  ChevronRight,
  CreditCard,
  X,
  CheckCircle,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useUser } from '../context/UserContext';
import { supabase } from '../supabaseClient';

const ProductDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { walletBalance, subtractFromWallet, addSubscription } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) {
          console.error("Error fetching product:", error);
          addToast("Failed to load product details", "error");
        } else if (data) {
          setProduct(data);
        }
      } catch (err: any) {
        const errMsg = typeof err === 'string' ? err : (err?.message || JSON.stringify(err));
        if (errMsg.includes('Failed to fetch') || errMsg.includes('Supabase not configured')) {
          console.warn("Network error fetching product details.");
        } else {
          console.error("Fetch failed:", err);
          addToast("Failed to load product details", "error");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, addToast]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-[#0B0A15]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-gray-50 dark:bg-[#0B0A15]">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Product Not Found</h2>
        <button onClick={() => navigate('/marketplace')} className="text-primary hover:underline">Return to Marketplace</button>
      </div>
    );
  }

  const productPrice = product.price || 0;
  const serviceFee = 0.50;
  const totalPrice = productPrice + serviceFee;

  const handlePurchase = async () => {
    // 1. Check Balance
    if (walletBalance < totalPrice) {
      addToast('Insufficient wallet balance. Please top up.', 'error');
      return;
    }

    setIsProcessing(true);

    // 2. Process Transaction
    const success = await subtractFromWallet(totalPrice, `${product.name} Purchase`, 'Purchase');
    
    if (success) {
      // 3. Add to Subscriptions
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      await addSubscription({
        name: product.name,
        plan: product.plan || 'Standard',
        price: productPrice,
        renewalDate: nextMonth.toISOString(),
        icon: product.icon || product.name.charAt(0),
        color: product.color || 'text-primary',
        bg: product.bg || 'bg-gray-100'
      });

      setShowModal(false);
      setShowSuccess(true);
      addToast('Subscription purchased successfully!', 'success');
    } else {
       addToast('Transaction failed.', 'error');
    }
    setIsProcessing(false);
  };

  if (showSuccess) {
    return (
      <div className="h-full flex items-center justify-center p-4 relative overflow-hidden bg-gray-50 dark:bg-[#0B0A15]">
         <div className="absolute inset-0 bg-primary/5 z-0"></div>
         <div className="bg-white dark:bg-[#1A1729] dark:md:glass-panel border border-gray-200 dark:border-white/10 rounded-2xl p-8 md:p-12 text-center max-w-lg w-full relative z-10 animate-[fadeIn_0.5s] shadow-xl dark:shadow-none">
            <div className="mb-8 relative inline-flex items-center justify-center">
              <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full animate-pulse"></div>
              <div className="w-24 h-24 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center relative z-10">
                <CheckCircle className="text-primary w-12 h-12" />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Success!</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8">Your subscription is active.</p>
            
            <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-6 mb-8 text-left">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200 dark:border-white/10">
                <div className="flex items-center gap-3">
                   <div className={`w-10 h-10 rounded-lg ${product.bg || 'bg-gray-100'} flex items-center justify-center ${product.color || 'text-gray-900'} font-bold text-sm`}>
                     {product.icon || product.name.charAt(0)}
                   </div>
                   <div>
                     <p className="text-gray-900 dark:text-white font-bold">{product.name}</p>
                     <p className="text-xs text-gray-500 dark:text-gray-400">{product.plan || 'Standard'}</p>
                   </div>
                </div>
                <span className="text-xl font-bold text-primary">${productPrice}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                 <div>
                   <p className="text-gray-500 text-xs">Seller</p>
                   <p className="text-gray-900 dark:text-gray-200">{product.seller_name || 'Anonymous'}</p>
                 </div>
                 <div className="text-right">
                   <p className="text-gray-500 text-xs">Date</p>
                   <p className="text-gray-900 dark:text-gray-200">{new Date().toLocaleDateString()}</p>
                 </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <button onClick={() => navigate('/chat')} className="w-full py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">
                Get Credentials
              </button>
              <button onClick={() => navigate('/dashboard')} className="w-full py-3 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-900 dark:text-white font-semibold transition-all">
                Go to Dashboard
              </button>
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 md:p-8 bg-gray-50 dark:bg-[#0B0A15] transition-colors duration-300">
      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto mb-6 flex items-center gap-2 text-sm text-gray-400 dark:text-slate-400">
        <span className="cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors" onClick={() => navigate('/marketplace')}>Marketplace</span>
        <ChevronRight className="w-3 h-3" />
        <span className="cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors">{product.category || 'Category'}</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-900 dark:text-white">{product.name}</span>
      </div>

      <div className="bg-white dark:bg-[#1A1729] dark:glass-panel max-w-5xl mx-auto rounded-2xl p-6 md:p-10 relative overflow-hidden border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none transition-colors">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left: Visuals */}
          <div className="lg:col-span-5 space-y-6">
            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-black relative group shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
              <div className={`w-full h-full flex items-center justify-center ${product.bg || 'bg-black'}`}>
                <span className={`${product.color || 'text-white'} font-extrabold text-9xl tracking-tighter`}>{product.icon || product.name.charAt(0)}</span>
              </div>
              <div className="absolute top-4 left-4 z-20 bg-green-500/20 backdrop-blur-md border border-green-500/30 text-green-400 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3" /> VERIFIED
              </div>
              <div className="absolute bottom-4 left-4 z-20">
                <h3 className="text-white text-2xl font-bold">{product.name}</h3>
                <div className="flex items-center gap-1 mt-1 text-yellow-400">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-slate-300 text-sm ml-1">(4.9)</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl p-4 flex items-center justify-between">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                   {product.seller_name ? product.seller_name.substring(0, 2).toUpperCase() : 'AN'}
                 </div>
                 <div>
                   <p className="text-xs text-gray-500 dark:text-slate-400">Sold by</p>
                   <p className="font-bold text-gray-900 dark:text-white text-sm">{product.seller_name || 'Anonymous'}</p>
                 </div>
               </div>
               <div className="text-right">
                 <p className="text-xs text-gray-500 dark:text-slate-400">Sales</p>
                 <p className="font-bold text-gray-900 dark:text-white text-sm">1.4k+</p>
               </div>
            </div>
          </div>

          {/* Right: Info */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 gap-4">
              <div>
                 <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">{product.plan || 'Standard Plan'}</h1>
                 <p className="text-gray-500 dark:text-slate-400 font-medium">Monthly Subscription • Auto-renewal available</p>
              </div>
              <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded-lg border border-primary/20 dark:border-primary/30 self-start">
                 <div className="font-bold text-primary">4K</div>
              </div>
            </div>

            <div className="h-px w-full bg-gray-200 dark:bg-white/10 my-6"></div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                {icon: Monitor, title: 'Multi-Device', sub: 'TV, Phone, Laptop'},
                {icon: Lock, title: 'Private Profile', sub: 'Your own PIN code'},
                {icon: Zap, title: 'Instant Access', sub: 'Credentials in 30s'},
                {icon: ShieldCheck, title: 'Warranty', sub: '30-day guarantee'}
              ].map((f, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                   <div className="p-2 bg-gray-200 dark:bg-slate-800 rounded-lg text-primary">
                     <f.icon className="w-5 h-5" />
                   </div>
                   <div>
                     <h4 className="text-gray-900 dark:text-white font-semibold text-sm">{f.title}</h4>
                     <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">{f.sub}</p>
                   </div>
                </div>
              ))}
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 flex items-center justify-between mb-8">
               <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500">
                 <Zap className="w-4 h-4 fill-current animate-pulse" />
                 <span className="text-sm font-bold">High Demand</span>
               </div>
               <span className="text-sm text-gray-600 dark:text-slate-300">Only <span className="text-gray-900 dark:text-white font-bold">1 slot</span> left</span>
            </div>

            <div className="mt-auto pt-6 border-t border-gray-200 dark:border-white/5">
               <div className="flex items-end justify-between mb-6">
                 <div>
                   <p className="text-gray-500 dark:text-slate-400 text-sm mb-1">Total Price</p>
                   <div className="flex items-baseline gap-2">
                     <span className="text-4xl font-extrabold text-gray-900 dark:text-white">${productPrice}</span>
                     <span className="text-gray-500 dark:text-slate-500 font-medium">/ month</span>
                   </div>
                 </div>
                 <div className="text-right">
                   <p className="text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-1">Save 75%</p>
                   <p className="text-gray-400 dark:text-slate-500 text-xs line-through">${(productPrice * 4).toFixed(2)}</p>
                 </div>
               </div>

               <button 
                  onClick={() => setShowModal(true)}
                  className="w-full bg-primary hover:bg-primary-dark text-white py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center gap-2 group transition-all shadow-lg shadow-primary/30"
                >
                  Buy Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isProcessing && setShowModal(false)}></div>
          <div className="relative w-full max-w-md bg-white dark:bg-[#1A1729] dark:glass-panel rounded-2xl shadow-2xl animate-[fadeIn_0.3s] border border-gray-200 dark:border-white/10">
             <div className="p-6 border-b border-gray-200 dark:border-white/10 flex justify-between items-center">
               <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                 <ShieldCheck className="text-primary w-6 h-6" /> Secure Checkout
               </h2>
               <button onClick={() => !isProcessing && setShowModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                 <X className="w-5 h-5" />
               </button>
             </div>
             
             <div className="p-6 space-y-6">
               <div className="bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 p-4 rounded-xl flex gap-3">
                 <AlertTriangle className="text-yellow-600 dark:text-yellow-500 w-5 h-5 shrink-0" />
                 <p className="text-xs text-yellow-700 dark:text-yellow-100/80 leading-relaxed">
                    Verify details before proceeding. Funds are held in escrow until you confirm the subscription works.
                 </p>
               </div>

               <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-5 border border-gray-200 dark:border-white/5 space-y-3">
                 <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                   <span>Subtotal</span>
                   <span>${productPrice}</span>
                 </div>
                 <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                    <span>Service Fee</span>
                    <span>${serviceFee.toFixed(2)}</span>
                 </div>
                 <div className="border-t border-gray-200 dark:border-white/10 my-2"></div>
                 <div className="flex justify-between text-gray-900 dark:text-white font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">${totalPrice.toFixed(2)}</span>
                 </div>
               </div>
               
               <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Payment Method</span>
                  <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <CreditCard className="w-4 h-4" />
                    <span>Wallet Balance (${walletBalance.toFixed(2)})</span>
                  </div>
               </div>

               <button 
                 onClick={handlePurchase}
                 disabled={isProcessing}
                 className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_15px_rgba(71,37,244,0.4)] flex items-center justify-center gap-2 disabled:opacity-50"
               >
                 {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Purchase'}
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
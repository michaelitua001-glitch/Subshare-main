import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Infinity as InfinityIcon, Mail, Lock, User, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useToast } from '../context/ToastContext';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        addToast('Successfully logged in!', 'success');
        navigate('/dashboard');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            }
          }
        });
        if (error) throw error;
        addToast('Registration successful! Please check your email to verify your account.', 'success');
        if (!error) {
          setIsLogin(true);
        }
      }
    } catch (error: any) {
      addToast(error.message || 'An error occurred during authentication.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0A15] flex items-center justify-center p-4 transition-colors duration-300 relative">
      
      {/* Back Button */}
      <button 
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 md:top-8 md:left-8 z-10 flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors font-bold text-sm"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="bg-white dark:bg-[#1A1729] dark:border dark:border-white/5 w-full max-w-4xl h-full md:h-[600px] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-0">
        
        {/* Left Side - Visual */}
        <div className="w-full md:w-1/2 bg-primary relative p-8 md:p-12 flex flex-col justify-between overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-primary to-purple-800"></div>
           <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2"></div>
           <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-black/20 rounded-full blur-[60px] translate-x-1/3 translate-y-1/3"></div>
           
           <div className="relative z-10 pt-8 md:pt-0">
             <div className="flex items-center gap-2 mb-8">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/20">
                   <InfinityIcon className="text-white w-6 h-6" />
                </div>
                <span className="text-white font-bold text-xl tracking-tight">SubShare</span>
             </div>
             
             <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
               {isLogin ? "Welcome Back to Savings." : "Join the Sharing Economy."}
             </h2>
             <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-xs">
               {isLogin 
                 ? "Log in to track your shared subscriptions, manage payments, and discover new deals."
                 : "Create an account to start selling your unused slots or buying premium access for less."
               }
             </p>
           </div>

           <div className="relative z-10 mt-8 md:mt-0">
             <div className="flex gap-2 mb-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-2 h-2 rounded-full bg-white/30 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>
                ))}
             </div>
             <p className="text-white/50 text-xs">Trusted by 10,000+ users worldwide</p>
           </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white dark:bg-[#1A1729]">
           <div className="max-w-xs mx-auto w-full">
             <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
               {isLogin ? "Log In" : "Create Account"}
             </h3>
             <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
               {isLogin ? "Enter your details to access your account" : "Enter your details to get started"}
             </p>

             <form onSubmit={handleSubmit} className="space-y-4">
               {!isLogin && (
                 <div className="space-y-1.5">
                   <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Full Name</label>
                   <div className="relative">
                     <User className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
                     <input 
                       type="text" 
                       required 
                       value={name}
                       onChange={(e) => setName(e.target.value)}
                       placeholder="Elena R." 
                       className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:font-normal"
                     />
                   </div>
                 </div>
               )}

               <div className="space-y-1.5">
                 <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email Address</label>
                 <div className="relative">
                   <Mail className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
                   <input 
                     type="email" 
                     required 
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     placeholder="name@example.com" 
                     className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:font-normal"
                   />
                 </div>
               </div>

               <div className="space-y-1.5">
                 <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Password</label>
                    {isLogin && <a href="#" className="text-xs text-primary hover:text-primary-dark font-semibold">Forgot?</a>}
                 </div>
                 <div className="relative">
                   <Lock className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
                   <input 
                     type="password" 
                     required 
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     placeholder="••••••••" 
                     className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:font-normal"
                   />
                 </div>
               </div>

               <button 
                 type="submit" 
                 disabled={loading}
                 className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 mt-4"
               >
                 {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                   <>
                     {isLogin ? "Sign In" : "Create Account"} <ArrowRight className="w-5 h-5" />
                   </>
                 )}
               </button>
             </form>

             <div className="mt-8 text-center">
               <p className="text-sm text-gray-500 dark:text-gray-400">
                 {isLogin ? "Don't have an account?" : "Already have an account?"} {" "}
                 <button 
                   onClick={() => setIsLogin(!isLogin)}
                   className="text-primary font-bold hover:underline"
                 >
                   {isLogin ? "Sign Up" : "Log In"}
                 </button>
               </p>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
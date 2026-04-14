import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Infinity as InfinityIcon, Mail, Lock, User, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useToast } from '../context/ToastContext';
import { useUser } from '../context/UserContext';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { mockLogin } = useUser();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleGoogleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          skipBrowserRedirect: true,
        }
      });
      
      if (error) throw error;
      
      if (data?.url) {
        const authWindow = window.open(
          data.url,
          'oauth_popup',
          'width=500,height=600'
        );
        if (!authWindow) {
          addToast('Please allow popups to sign in with Google.', 'error');
        }
      }
    } catch (error: any) {
      const errMsg = typeof error === 'string' ? error : (error?.message || JSON.stringify(error));
      if (errMsg.includes('Supabase not configured')) {
        mockLogin();
        addToast('Supabase connection failed. Using mock login for demonstration.', 'success');
        navigate('/dashboard');
      } else {
        addToast(error.message || 'An error occurred during Google authentication.', 'error');
      }
    }
  };

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
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            }
          }
        });
        if (error) throw error;
        
        if (data?.session) {
          addToast('Registration successful! Welcome to SubShare.', 'success');
          navigate('/dashboard');
        } else {
          addToast('Registration successful! Please check your email to verify your account.', 'success');
          setIsLogin(true);
        }
      }
    } catch (error: any) {
      const errMsg = typeof error === 'string' ? error : (error?.message || JSON.stringify(error));
      if (errMsg.includes('Supabase not configured')) {
        mockLogin();
        addToast('Supabase connection failed. Using mock login for demonstration.', 'success');
        navigate('/dashboard');
      } else {
        addToast(error.message || 'An error occurred during authentication.', 'error');
      }
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

             <div className="relative my-6">
               <div className="absolute inset-0 flex items-center">
                 <div className="w-full border-t border-gray-200 dark:border-white/10"></div>
               </div>
               <div className="relative flex justify-center text-sm">
                 <span className="px-2 bg-white dark:bg-[#1A1729] text-gray-500">Or continue with</span>
               </div>
             </div>

             <button
               type="button"
               onClick={handleGoogleLogin}
               className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-bold py-3.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-3"
             >
               <svg className="w-5 h-5" viewBox="0 0 24 24">
                 <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                 <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                 <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                 <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
               </svg>
               Google
             </button>

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
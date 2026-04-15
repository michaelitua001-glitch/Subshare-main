import React, { useState } from 'react';
import { HashRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Menu, Infinity as InfinityIcon, Loader2 } from 'lucide-react';
import { ToastProvider } from './context/ToastContext';
import { UserProvider, useUser } from './context/UserContext';
import { NotificationProvider } from './context/NotificationContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import ProductDetails from './pages/ProductDetails';
import Wallet from './pages/Wallet';
import Chat from './pages/Chat';
import Settings from './pages/Settings';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import AuthCallback from './pages/AuthCallback';
import PublicMarketplace from './pages/PublicMarketplace';
import HowItWorks from './pages/HowItWorks';
import Pricing from './pages/Pricing';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Support from './pages/Support';
import Onboarding from './pages/Onboarding';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, isLoading, supabaseUser } = useUser();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-[#131022]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  // Check onboarding status
  const userId = supabaseUser ? supabaseUser.id : 'mock';
  const hasCompletedOnboarding = localStorage.getItem(`onboarding_completed_${userId}`) === 'true';

  if (!hasCompletedOnboarding && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  if (hasCompletedOnboarding && location.pathname === '/onboarding') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Hide sidebar on Public pages
  const isPublicPage = [
    '/', 
    '/auth', 
    '/auth/callback',
    '/public-marketplace', 
    '/how-it-works', 
    '/pricing',
    '/privacy',
    '/terms',
    '/support',
    '/onboarding'
  ].includes(location.pathname);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-[#131022] text-gray-900 dark:text-white relative font-display selection:bg-primary selection:text-white transition-colors duration-300">
      {/* Abstract Background Blobs - Global (Hidden on Public pages to respect their own design) */}
      {!isPublicPage && (
        <div className="dark:block hidden">
          <div className="blob w-[500px] h-[500px] bg-primary top-[-100px] left-[-100px]"></div>
          <div className="blob w-[600px] h-[600px] bg-purple-600 bottom-[-150px] right-[-100px]"></div>
          <div className="blob w-[300px] h-[300px] bg-blue-600 top-[40%] left-[30%] opacity-20"></div>
        </div>
      )}

      {/* Sidebar - Hidden on public pages */}
      {!isPublicPage && (
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <main className={`flex-1 ${isPublicPage ? 'overflow-auto' : 'overflow-hidden flex flex-col'} relative z-10`}>
        {/* Mobile Header */}
        {!isPublicPage && (
          <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-[#1A1729] border-b border-gray-200 dark:border-white/5 shrink-0 transition-colors">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-purple-400 flex items-center justify-center shadow-lg shadow-primary/20">
                <InfinityIcon className="text-white w-4 h-4" />
              </div>
              <span className="font-bold text-lg">SubShare</span>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        )}
        
        <div className={`flex-1 overflow-hidden ${!isPublicPage ? 'relative' : ''}`}>
           {children}
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <ToastProvider>
        <UserProvider>
          <NotificationProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/public-marketplace" element={<PublicMarketplace />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/support" element={<Support />} />
                
                {/* Protected Routes */}
                <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
                <Route path="/product/:id" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
                <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
                <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              </Routes>
            </Layout>
          </NotificationProvider>
        </UserProvider>
      </ToastProvider>
    </HashRouter>
  );
};

export default App;
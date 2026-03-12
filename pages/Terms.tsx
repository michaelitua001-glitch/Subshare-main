import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Infinity as InfinityIcon, ArrowLeft } from 'lucide-react';

const Terms: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0B0A15] text-white font-display overflow-x-hidden selection:bg-primary selection:text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B0A15]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-purple-400 flex items-center justify-center shadow-lg shadow-primary/20">
              <InfinityIcon className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">SubShare</span>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={() => navigate('/')} className="text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back to Home
             </button>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Terms of Service</h1>
        <p className="text-gray-400 mb-12 text-lg">Last updated: October 24, 2023</p>

        <div className="space-y-12 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p>By accessing or using SubShare, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
            <p>SubShare provides a marketplace platform for users to share costs of digital subscriptions. We act as an intermediary to facilitate payments and group management but are not a party to any agreement between users.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. User Responsibilities</h2>
            <p className="mb-4">You are responsible for:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-400">
              <li>Ensuring your sharing activities comply with the Terms of Service of the respective subscription providers.</li>
              <li>Maintaining the confidentiality of your account credentials.</li>
              <li>Providing accurate and up-to-date information.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Payments and Fees</h2>
            <p>Buyers pay the listed price plus any applicable service fees. Sellers receive the listed price minus our platform fee. All payments are held in escrow until the subscription period begins or access is confirmed.</p>
          </section>

           <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Termination</h2>
            <p>We reserve the right to terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
          </section>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 text-sm text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p>© 2023 SubShare Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <button onClick={() => navigate('/privacy')} className="hover:text-white transition-colors">Privacy</button>
            <button onClick={() => navigate('/terms')} className="hover:text-white transition-colors">Terms</button>
            <button onClick={() => navigate('/support')} className="hover:text-white transition-colors">Support</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Terms;
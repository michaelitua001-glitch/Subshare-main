import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Infinity as InfinityIcon, ArrowLeft } from 'lucide-react';

const Privacy: React.FC = () => {
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
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-gray-400 mb-12 text-lg">Last updated: October 24, 2023</p>

        <div className="space-y-12 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
            <p className="mb-4">We collect information you provide directly to us, such as when you create an account, update your profile, list a subscription, or communicate with us. This may include:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-400">
              <li>Contact information (name, email address)</li>
              <li>Payment information (processed securely by our payment providers)</li>
              <li>Profile information (username, profile picture)</li>
              <li>Communications you send to us or other users via the platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
            <p className="mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-400">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Facilitate communication between buyers and sellers</li>
              <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Sharing of Information</h2>
            <p>We do not share your personal information with third parties except as described in this policy. We may share information with vendors, consultants, and other service providers who need access to such information to carry out work on our behalf.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Data Security</h2>
            <p>We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.</p>
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

export default Privacy;
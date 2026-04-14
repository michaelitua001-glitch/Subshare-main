import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Camera, ArrowRight, CheckCircle2, Sparkles, Share2, Download } from 'lucide-react';

const Onboarding: React.FC = () => {
  const { user, updateProfile, supabaseUser } = useUser();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [name, setName] = useState(user.name || '');
  const [avatar, setAvatar] = useState(user.avatar || '');
  const [primaryGoal, setPrimaryGoal] = useState<'share' | 'subscribe' | null>(null);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      completeOnboarding();
    }
  };

  const completeOnboarding = async () => {
    // Save profile updates
    if (name !== user.name || avatar !== user.avatar) {
      await updateProfile({ name, avatar });
    }
    
    // Mark onboarding as complete in localStorage
    if (supabaseUser) {
      localStorage.setItem(`onboarding_completed_${supabaseUser.id}`, 'true');
    } else {
      localStorage.setItem(`onboarding_completed_mock`, 'true');
    }
    
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#131022] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px]" />

      <div className="w-full max-w-xl bg-white dark:bg-[#1A1729] rounded-3xl shadow-2xl overflow-hidden relative z-10 border border-gray-200 dark:border-white/5">
        {/* Progress Bar */}
        <div className="h-2 bg-gray-100 dark:bg-gray-800 w-full">
          <div 
            className="h-full bg-gradient-to-r from-primary to-purple-500 transition-all duration-500 ease-out"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <div className="p-8 md:p-12">
          {step === 1 && (
            <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <Sparkles className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome to SubShare!</h1>
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                The smartest way to share subscription costs and manage your digital life. Let's get your account set up in just a few steps.
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Set up your profile</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Personalize how others see you on SubShare.</p>
              </div>

              <div className="flex flex-col items-center gap-4 mb-8">
                <div className="relative group cursor-pointer">
                  <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden border-4 border-white dark:border-[#1A1729] shadow-lg">
                    {avatar ? (
                      <img src={avatar || undefined} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Camera className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
                <button 
                  onClick={() => setAvatar(`https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`)}
                  className="text-sm text-primary hover:text-primary/80 font-medium"
                >
                  Generate Random Avatar
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Display Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                    placeholder="Enter your name"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">What's your main goal?</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2">We'll tailor your experience based on what you want to do.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setPrimaryGoal('share')}
                  className={`p-6 rounded-2xl border-2 text-left transition-all ${
                    primaryGoal === 'share' 
                      ? 'border-primary bg-primary/5 dark:bg-primary/10' 
                      : 'border-gray-200 dark:border-white/5 hover:border-primary/50 bg-white dark:bg-black/20'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                    primaryGoal === 'share' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                  }`}>
                    <Share2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Share & Earn</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">I have subscriptions and want to sell empty slots to others.</p>
                </button>

                <button
                  onClick={() => setPrimaryGoal('subscribe')}
                  className={`p-6 rounded-2xl border-2 text-left transition-all ${
                    primaryGoal === 'subscribe' 
                      ? 'border-purple-500 bg-purple-500/5 dark:bg-purple-500/10' 
                      : 'border-gray-200 dark:border-white/5 hover:border-purple-500/50 bg-white dark:bg-black/20'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                    primaryGoal === 'subscribe' ? 'bg-purple-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                  }`}>
                    <Download className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Save Money</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">I want to join existing subscriptions for a fraction of the cost.</p>
                </button>
              </div>
            </div>
          )}

          <div className="mt-10 flex items-center justify-between">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
              >
                Back
              </button>
            ) : (
              <div></div>
            )}
            
            <button
              onClick={handleNext}
              disabled={step === 2 && !name.trim()}
              className="px-8 py-3 bg-gradient-to-r from-primary to-purple-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {step === 3 ? (
                <>
                  Get Started <CheckCircle2 className="w-5 h-5" />
                </>
              ) : (
                <>
                  Continue <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;

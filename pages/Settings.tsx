import React, { useState, useEffect, useRef } from 'react';
import { User, Bell, Shield, Moon, Sun, Camera, Mail, Check, Loader2, Lock, X, Eye, EyeOff } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useUser } from '../context/UserContext';

const Settings: React.FC = () => {
  const { addToast } = useToast();
  const { user, updateProfile } = useUser();
  
  // --- State ---
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Profile Form State
  const [formProfile, setFormProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    avatar: ''
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Notifications State
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    pushNotifs: true,
    marketing: false
  });

  // Password Modal State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false); // Toggle visibility
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // --- Effects ---
  useEffect(() => {
    // Sync theme state with DOM
    if (document.documentElement.classList.contains('dark')) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }, []);

  // Sync form with context user data on load
  useEffect(() => {
     if (user) {
         const [first, ...rest] = user.name.split(' ');
         setFormProfile({
             firstName: first || '',
             lastName: rest.join(' ') || '',
             email: user.email,
             avatar: user.avatar
         });
     }
  }, [user]);

  // --- Handlers ---

  const toggleTheme = (newTheme: 'dark' | 'light') => {
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormProfile({ ...formProfile, [e.target.name]: e.target.value });
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a fake local URL for preview
      const imageUrl = URL.createObjectURL(file);
      setFormProfile(prev => ({ ...prev, avatar: imageUrl }));
      addToast('Profile picture selected', 'info');
    }
  };

  const handleNotifToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    if (!formProfile.firstName || !formProfile.lastName || !formProfile.email) {
      addToast('Please fill in all required fields', 'error');
      return;
    }
    
    setIsSaving(true);
    setTimeout(() => {
      // Update Context
      updateProfile({
          name: `${formProfile.firstName} ${formProfile.lastName}`,
          email: formProfile.email,
          avatar: formProfile.avatar
      });

      setIsSaving(false);
      setSaveSuccess(true);
      addToast('Settings saved successfully!', 'success');
      setTimeout(() => setSaveSuccess(false), 2000);
    }, 1000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordForm.current || !passwordForm.new || !passwordForm.confirm) {
        addToast('Please fill in all password fields', 'error');
        return;
    }

    if (passwordForm.new !== passwordForm.confirm) {
      addToast('New passwords do not match', 'error');
      return;
    }

    if (passwordForm.new.length < 8) {
      addToast('New password must be at least 8 characters', 'error');
      return;
    }

    setIsChangingPassword(true);
    setTimeout(() => {
      setIsChangingPassword(false);
      setShowPasswordModal(false);
      setPasswordForm({ current: '', new: '', confirm: '' });
      addToast('Password changed successfully', 'success');
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-6 overflow-hidden bg-gray-50 dark:bg-[#0B0A15] text-gray-900 dark:text-white transition-colors duration-300">
      <header className="mb-6 shrink-0">
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-sm text-gray-500 dark:text-white/50 mt-1">Manage your preferences</p>
      </header>

      <div className="flex-1 overflow-y-auto pb-20 no-scrollbar">
        <div className="max-w-4xl mx-auto space-y-8">
           
           {/* Appearance / Theme */}
           <div className="bg-white dark:bg-[#1A1729] border border-gray-200 dark:border-white/5 rounded-2xl p-6 md:p-8 shadow-sm dark:shadow-none animate-[fadeIn_0.3s]">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                 <Sun className="text-primary w-5 h-5" /> Appearance
              </h3>
              <div className="flex gap-4">
                <button 
                  onClick={() => toggleTheme('light')}
                  className={`flex-1 p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${theme === 'light' ? 'border-primary bg-primary/5 text-primary shadow-[0_0_15px_rgba(71,37,244,0.15)]' : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'}`}
                >
                  <Sun className="w-6 h-6" />
                  <span className="font-medium text-sm">Light Mode</span>
                </button>
                <button 
                  onClick={() => toggleTheme('dark')}
                  className={`flex-1 p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${theme === 'dark' ? 'border-primary bg-primary/5 text-primary shadow-[0_0_15px_rgba(71,37,244,0.15)]' : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'}`}
                >
                  <Moon className="w-6 h-6" />
                  <span className="font-medium text-sm">Dark Mode</span>
                </button>
              </div>
           </div>

           {/* Profile */}
           <div className="bg-white dark:bg-[#1A1729] border border-gray-200 dark:border-white/5 rounded-2xl p-6 md:p-8 shadow-sm dark:shadow-none animate-[fadeIn_0.4s]">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                 <User className="text-primary w-5 h-5" /> Profile Settings
              </h3>
              <div className="flex flex-col md:flex-row gap-8 items-start">
                 <div className="flex flex-col items-center gap-4 shrink-0 mx-auto md:mx-0">
                    <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                       <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 dark:border-white/5 relative">
                          <img src={formProfile.avatar || undefined} alt="Profile" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                             <Camera className="text-white w-8 h-8" />
                          </div>
                       </div>
                       <input 
                         type="file" 
                         ref={fileInputRef} 
                         onChange={handleFileChange} 
                         className="hidden" 
                         accept="image/*"
                       />
                    </div>
                    <p className="text-xs text-gray-500">Click to change</p>
                 </div>

                 <div className="flex-1 w-full space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                       <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-500 dark:text-white/70">First Name</label>
                          <input 
                            type="text" 
                            name="firstName"
                            value={formProfile.firstName}
                            onChange={handleProfileChange}
                            className="w-full rounded-xl px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 placeholder-gray-400 dark:placeholder-white/30 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all text-gray-900 dark:text-white" 
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-500 dark:text-white/70">Last Name</label>
                          <input 
                            type="text" 
                            name="lastName"
                            value={formProfile.lastName}
                            onChange={handleProfileChange}
                            className="w-full rounded-xl px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 placeholder-gray-400 dark:placeholder-white/30 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all text-gray-900 dark:text-white" 
                          />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-medium text-gray-500 dark:text-white/70">Email</label>
                       <div className="relative">
                          <Mail className="absolute left-4 top-3.5 text-gray-400 dark:text-white/40 w-5 h-5" />
                          <input 
                            type="email" 
                            name="email"
                            value={formProfile.email}
                            onChange={handleProfileChange}
                            className="w-full rounded-xl pl-11 pr-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 placeholder-gray-400 dark:placeholder-white/30 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all text-gray-900 dark:text-white" 
                          />
                       </div>
                    </div>
                    <div className="pt-2 flex justify-end">
                       <button 
                         onClick={handleSave}
                         disabled={isSaving}
                         className={`px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-primary/20 transition-all flex items-center gap-2 ${
                           saveSuccess 
                             ? 'bg-green-500 text-white' 
                             : 'bg-primary hover:bg-primary-dark text-white active:scale-95'
                         }`}
                       >
                         {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                         {saveSuccess && <Check className="w-4 h-4" />}
                         {isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Changes'}
                       </button>
                    </div>
                 </div>
              </div>
           </div>

           {/* Notifications */}
           <div className="bg-white dark:bg-[#1A1729] border border-gray-200 dark:border-white/5 rounded-2xl p-6 md:p-8 shadow-sm dark:shadow-none animate-[fadeIn_0.5s]">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                 <Bell className="text-primary w-5 h-5" /> Notifications
              </h3>
              <div className="space-y-6">
                 {[
                   { label: 'Email Alerts', key: 'emailAlerts' },
                   { label: 'Push Notifications', key: 'pushNotifs' },
                   { label: 'Marketing Emails', key: 'marketing' }
                 ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                       <span className="font-medium text-gray-900 dark:text-white">{item.label}</span>
                       <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={notifications[item.key as keyof typeof notifications]}
                            onChange={() => handleNotifToggle(item.key as keyof typeof notifications)}
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-gray-200 dark:bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                       </label>
                    </div>
                 ))}
              </div>
           </div>

           {/* Security */}
           <div className="bg-white dark:bg-[#1A1729] border border-gray-200 dark:border-white/5 rounded-2xl p-6 md:p-8 shadow-sm dark:shadow-none animate-[fadeIn_0.6s]">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                 <Shield className="text-primary w-5 h-5" /> Security
              </h3>
              <button 
                onClick={() => setShowPasswordModal(true)}
                className="w-full bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 px-4 py-3 rounded-xl font-medium transition-all text-left flex justify-between items-center text-gray-900 dark:text-white"
              >
                 <span>Change Password</span>
                 <span className="text-xs text-gray-500 dark:text-white/50">Last changed 3 months ago</span>
              </button>
           </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isChangingPassword && setShowPasswordModal(false)}></div>
          <div className="relative w-full max-w-md bg-white dark:bg-[#1A1729] rounded-3xl shadow-2xl animate-[fadeIn_0.3s] border border-gray-200 dark:border-white/10 overflow-hidden flex flex-col">
            
            <div className="p-6 border-b border-gray-100 dark:border-white/5 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Lock className="text-primary w-5 h-5" /> Change Password
              </h2>
              <button 
                onClick={() => setShowPasswordModal(false)} 
                disabled={isChangingPassword}
                className="text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="p-6 space-y-4">
               <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Current Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"}
                      value={passwordForm.current}
                      onChange={(e) => setPasswordForm({...passwordForm, current: e.target.value})}
                      className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-all"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">New Password</label>
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={passwordForm.new}
                    onChange={(e) => setPasswordForm({...passwordForm, new: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-all"
                  />
               </div>

               <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Confirm New Password</label>
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={passwordForm.confirm}
                    onChange={(e) => setPasswordForm({...passwordForm, confirm: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-all"
                  />
               </div>

               <button 
                 type="submit" 
                 disabled={isChangingPassword}
                 className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 {isChangingPassword ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Update Password'}
               </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Settings;
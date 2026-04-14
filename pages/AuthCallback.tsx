import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase handles the token parsing automatically in the background
    // We just need to close the popup or redirect
    const timer = setTimeout(() => {
      if (window.opener) {
        window.close();
      } else {
        navigate('/dashboard');
      }
    }, 1000); // Give Supabase a second to process the session

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0A15] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1A1729] p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Authenticating...</h2>
        <p className="text-gray-500 dark:text-gray-400">
          Please wait while we complete your sign in. This window should close automatically.
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;

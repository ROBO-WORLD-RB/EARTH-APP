import React from 'react';
import { signInWithGoogle } from '../services/authService';
import EarthIcon from './icons/EarthIcon';
import GoogleIcon from './icons/GoogleIcon';

interface AuthPageProps {
  onAuthSuccess?: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      onAuthSuccess?.();
    } catch (error) {
      console.error('Authentication failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
        <div className="text-center">
          <div className="flex justify-center">
            <EarthIcon className="w-20 h-20" />
          </div>
          <h1 className="mt-4 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
            EARTH
          </h1>
          <h2 className="mt-1 text-xl font-semibold text-gray-700 dark:text-gray-300">
            AI Brain Studio
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Sign in to customize your AI brain and start chatting
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            <GoogleIcon className="w-5 h-5" />
            <span>Sign in with Google</span>
          </button>
          
          <div className="text-center mt-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase'; // Update path as needed

const Topbar = () => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsLoggingOut(true);

      // Supabase signout
      await supabase.auth.signOut({ scope: 'global' });

      // Clear any local storage items
      localStorage.removeItem('supabase.auth.token');

      // Clear cookies
      document.cookie.split(";").forEach((cookie) => {
        document.cookie = cookie
          .replace(/^ +/, "")
          .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
      });

      // Redirect to login or home
      router.push('/');
    } catch (error) {
      console.error('Error during sign out:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 text-white bg-[#2B2623] shadow-md">
      <div
        className="font-medium text-lg cursor-pointer"
        onClick={() => router.push('/')}
      >
        A Perfect Blend of Tea & Coffee
      </div>
      <div className="flex items-center space-x-4">
        <button
          type="button"
          onClick={handleSignOut}
          disabled={isLoggingOut}
          className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-200 disabled:opacity-70"
        >
          {isLoggingOut ? 'Logging Out...' : 'Log Out'}
        </button>
      </div>
    </div>
  );
};

export default Topbar;

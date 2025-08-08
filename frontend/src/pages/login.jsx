// src/pages/Login.jsx
import React, { useState } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { app } from '../firebase'; // Import your Firebase config

export default function Login() {
  const [error, setError] = useState(false);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const email = result.user.email;
      
      if (!email.endsWith('@yourcollege.edu')) {  // change to your domain
        setError(true);
        auth.signOut();
      } else {
        setError(false);
        // Redirect to dashboard or home
        window.location.href = '/dashboard';
      }
    } catch (err) {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">CampusCrate Login</h1>
        <p className="text-gray-600 mb-6">Please sign in using your college email</p>

        {error && (
          <p className="text-red-500 mb-4">Login failed. Please try again.</p>
        )}

        <button
          onClick={handleLogin}
          className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google Icon"
            className="w-5 h-5"
          />
          <span>Sign in with Google</span>
        </button>
      </div>
    </div>
  );
}

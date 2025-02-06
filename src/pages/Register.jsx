import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import { useTheme } from '../contexts/ThemeContext';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const { register, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData.email, formData.password, { username: formData.username });
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to create an account');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to sign in with Google');
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} py-6 flex flex-col justify-center sm:py-12`}>
      <div className="max-w-md mx-auto">
        <form onSubmit={handleSubmit} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md rounded px-8 pt-6 pb-8 mb-4`}>
          <h2 className={`text-2xl mb-6 text-center font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Register</h2>
          {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
          
          <div className="mb-4">
            <label className={`block ${darkMode ? 'text-gray-300' : 'text-gray-700'} text-sm font-bold mb-2`}>Username</label>
            <input
              type="text"
              className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-700'
              }`}
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
          </div>

          <div className="mb-4">
            <label className={`block ${darkMode ? 'text-gray-300' : 'text-gray-700'} text-sm font-bold mb-2`}>Email</label>
            <input
              type="email"
              className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-700'
              }`}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="mb-4">
            <label className={`block ${darkMode ? 'text-gray-300' : 'text-gray-700'} text-sm font-bold mb-2`}>Password</label>
            <input
              type="password"
              className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-700'
              }`}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Register
          </button>

          <div className={`mt-4 text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>or</div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className={`mt-4 w-full flex items-center justify-center font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' 
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <FcGoogle className="mr-2 text-xl" /> Sign in with Google
          </button>
        </form>
      </div>
    </div>
  );
}
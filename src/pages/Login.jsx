import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";
import { Loader2, Mail, Lock } from "lucide-react";
import { useTheme } from '../contexts/ThemeContext';
import { Link } from "react-router-dom";

// Import your logo - adjust the path based on your project structure
import Logo from '../assets/Meal Master App New Logo.svg';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { darkMode } = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (loading) return;
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        setError("User not found. Please sign up.");
      } else if (error.code === "auth/wrong-password") {
        setError("Incorrect password. Try again.");
      } else if (error.code === "auth/invalid-email") {
        setError("Invalid email format.");
      } else {
        setError("Failed to log in. Please try again.");
      }
      setLoading(false);
    }
  };

  return (
    <div className={`flex items-center justify-center min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className={`max-w-md w-full ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-8`}>
        <div className="flex flex-col items-center mb-8">
          <img 
            src={Logo} 
            alt="Meal Master Logo" 
            className="w-32 h-32 mb-4 animate-fade-in"
          />
          <h2 className={`text-3xl font-bold text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Welcome Back
          </h2>
          <p className={`mt-2 text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Sign in to continue to Meal Master
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-100 text-red-500 rounded-md text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className={`flex items-center border-2 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500 transition-all ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300'}`}>
            <Mail className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mr-3`} size={20} />
            <input
              type="email"
              id="email"
              placeholder="Email"
              className={`w-full outline-none ${darkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-white text-gray-900 placeholder-gray-500'}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className={`flex items-center border-2 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500 transition-all ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300'}`}>
            <Lock className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mr-3`} size={20} />
            <input
              type="password"
              id="password"
              placeholder="Password"
              className={`w-full outline-none ${darkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-white text-gray-900 placeholder-gray-500'}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className={`w-full flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg
              focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50
              transform transition-all duration-300 hover:scale-[1.02]
              disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100
              ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                <span>Logging in...</span>
              </>
            ) : (
              "Sign In"
            )}
          </button>

          <div className="flex justify-center mt-4">
          <p className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-blue-500 hover:text-blue-600 font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

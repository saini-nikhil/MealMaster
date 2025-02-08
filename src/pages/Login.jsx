import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";
import { Loader2, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useTheme } from '../contexts/ThemeContext';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
        setError("Account not found. Would you like to register?");
        setTimeout(() => {
          navigate("/register", { state: { email } });
        }, 3000);
      } else if (error.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else if (error.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError("Login failed. Please try again later.");
      }
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`flex items-center justify-center min-h-screen ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className={`max-w-md w-full mx-4 ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      } rounded-xl shadow-lg p-8 transition-all duration-300`}>
        <h2 className={`text-3xl font-bold mb-6 text-center ${
          darkMode ? 'text-white' : 'text-gray-800'
        }`}>
          Welcome Back
        </h2>
        
        {error && (
          <div className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${
            darkMode 
              ? 'bg-red-900/50 text-red-200 border border-red-800' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className={`relative group`}>
            <div className={`flex items-center border-2 rounded-lg px-3 py-2 ${
              darkMode 
                ? 'border-gray-600 bg-gray-700 focus-within:border-blue-400' 
                : 'border-gray-200 focus-within:border-blue-500'
            } transition-colors duration-300`}>
              <Mail className={`${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              } mr-2`} size={20} />
              <input
                type="email"
                id="email"
                placeholder="Email address"
                className={`w-full outline-none ${
                  darkMode 
                    ? 'bg-gray-700 text-white placeholder-gray-400' 
                    : 'bg-white text-gray-900 placeholder-gray-500'
                }`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className={`relative group`}>
            <div className={`flex items-center border-2 rounded-lg px-3 py-2 ${
              darkMode 
                ? 'border-gray-600 bg-gray-700 focus-within:border-blue-400' 
                : 'border-gray-200 focus-within:border-blue-500'
            } transition-colors duration-300`}>
              <Lock className={`${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              } mr-2`} size={20} />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Password"
                className={`w-full outline-none ${
                  darkMode 
                    ? 'bg-gray-700 text-white placeholder-gray-400' 
                    : 'bg-white text-gray-900 placeholder-gray-500'
                }`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className={`ml-2 focus:outline-none ${
                  darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <button
              type="submit"
              className={`w-full flex items-center justify-center ${
                loading 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
              } text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>

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
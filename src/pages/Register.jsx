import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import { Mail, Lock, User, Check, AlertCircle, Loader2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

// Import your logo - adjust the path based on your project structure
import Logo from '../assets/Meal Master App New Logo.svg';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validations, setValidations] = useState({
    username: { isValid: false, message: '' },
    email: { isValid: false, message: '' },
    password: { isValid: false, message: '' },
  });
  const { register, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const validateField = (name, value) => {
    switch (name) {
      case 'username':
        return {
          isValid: value.length >= 3,
          message: value.length < 3 ? 'Username must be at least 3 characters' : ''
        };
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return {
          isValid: emailRegex.test(value),
          message: !emailRegex.test(value) ? 'Please enter a valid email address' : ''
        };
      case 'password':
        const hasMinLength = value.length >= 8;
        const hasNumber = /\d/.test(value);
        const hasSpecialChar = /[!@#$%^&*]/.test(value);
        return {
          isValid: hasMinLength && hasNumber && hasSpecialChar,
          message: !hasMinLength ? 'Password must be at least 8 characters' :
                  !hasNumber ? 'Password must contain at least one number' :
                  !hasSpecialChar ? 'Password must contain at least one special character' : ''
        };
      default:
        return { isValid: false, message: '' };
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setValidations(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    
    // Validate all fields
    const allValidations = {
      username: validateField('username', formData.username),
      email: validateField('email', formData.email),
      password: validateField('password', formData.password)
    };
    setValidations(allValidations);

    // Check if all fields are valid
    if (!Object.values(allValidations).every(v => v.isValid)) {
      return;
    }

    setLoading(true);
    try {
      await register(formData.email, formData.password, { username: formData.username });
      navigate('/dashboard');
    } catch (error) {
      setError(error.message || 'Failed to create an account');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex items-center justify-center min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className={`max-w-md w-full ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-8 m-4 transform transition-all duration-500 hover:shadow-xl`}>
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-32 h-32 mb-4">
            <img 
              src={Logo} 
              alt="Meal Master Logo" 
              className="w-full h-full animate-fade-in object-contain"
            />
            <div className="absolute inset-0 bg-blue-500 filter blur-xl opacity-20 animate-pulse rounded-full"></div>
          </div>
          <h2 className={`text-3xl font-bold text-center bg-gradient-to-r ${darkMode ? 'from-blue-400 to-purple-400' : 'from-blue-600 to-purple-600'} bg-clip-text text-transparent`}>
            Create Account
          </h2>
          <p className={`mt-2 text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Join Meal Master today and start your culinary journey
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-md animate-shake">
            <div className="flex items-center">
              <AlertCircle className="mr-2" size={20} />
              <p>{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username Input */}
          <div className="space-y-2">
            <div className={`flex items-center border-2 rounded-lg px-4 py-3 transition-all ${validations.username.isValid ? 'border-green-500' : formData.username && !validations.username.isValid ? 'border-red-500' : 'border-gray-300 focus-within:border-blue-500'} ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
              <User className={`mr-3 ${validations.username.isValid ? 'text-green-500' : formData.username && !validations.username.isValid ? 'text-red-500' : darkMode ? 'text-gray-400' : 'text-gray-500'}`} size={20} />
              <input
                type="text"
                name="username"
                placeholder="Username"
                className={`w-full outline-none ${darkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-white text-gray-900 placeholder-gray-500'}`}
                value={formData.username}
                onChange={handleChange}
                required
                disabled={loading}
              />
              {formData.username && (validations.username.isValid ? <Check className="text-green-500 ml-2" size={20} /> : <AlertCircle className="text-red-500 ml-2" size={20} />)}
            </div>
            {formData.username && validations.username.message && (
              <p className="text-red-500 text-sm ml-1">{validations.username.message}</p>
            )}
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <div className={`flex items-center border-2 rounded-lg px-4 py-3 transition-all ${validations.email.isValid ? 'border-green-500' : formData.email && !validations.email.isValid ? 'border-red-500' : 'border-gray-300 focus-within:border-blue-500'} ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
              <Mail className={`mr-3 ${validations.email.isValid ? 'text-green-500' : formData.email && !validations.email.isValid ? 'text-red-500' : darkMode ? 'text-gray-400' : 'text-gray-500'}`} size={20} />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className={`w-full outline-none ${darkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-white text-gray-900 placeholder-gray-500'}`}
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
              {formData.email && (validations.email.isValid ? <Check className="text-green-500 ml-2" size={20} /> : <AlertCircle className="text-red-500 ml-2" size={20} />)}
            </div>
            {formData.email && validations.email.message && (
              <p className="text-red-500 text-sm ml-1">{validations.email.message}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <div className={`flex items-center border-2 rounded-lg px-4 py-3 transition-all ${validations.password.isValid ? 'border-green-500' : formData.password && !validations.password.isValid ? 'border-red-500' : 'border-gray-300 focus-within:border-blue-500'} ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
              <Lock className={`mr-3 ${validations.password.isValid ? 'text-green-500' : formData.password && !validations.password.isValid ? 'text-red-500' : darkMode ? 'text-gray-400' : 'text-gray-500'}`} size={20} />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className={`w-full outline-none ${darkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-white text-gray-900 placeholder-gray-500'}`}
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
              />
              {formData.password && (validations.password.isValid ? <Check className="text-green-500 ml-2" size={20} /> : <AlertCircle className="text-red-500 ml-2" size={20} />)}
            </div>
            {formData.password && validations.password.message && (
              <p className="text-red-500 text-sm ml-1">{validations.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            className={`w-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            disabled={loading || !Object.values(validations).every(v => v.isValid)}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                Creating Account...
              </>
            ) : 'Create Account'}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className={`w-full border-t ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={`px-2 ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>
                or continue with
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className={`w-full flex items-center justify-center py-3 px-4 rounded-lg font-medium transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-opacity-50 ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50'}`}
          >
            <FcGoogle className="mr-2 text-xl" />
            Sign up with Google
          </button>

          <div className="text-center mt-6">
            <button 
              type="button"
              className={`text-sm ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'} transition-colors duration-200 hover:underline`}
              onClick={() => navigate("/login")}
            >
              Already have an account? Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

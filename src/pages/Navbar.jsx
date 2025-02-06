import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const menuVariants = {
    open: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
    closed: { opacity: 0, y: -20 },
  };

  const itemVariants = {
    open: { opacity: 1, y: 0 },
    closed: { opacity: 0, y: -20 },
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo with Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            <Link to="/">
              <img 
                src='https://raw.githubusercontent.com/saini-nikhil/MealMaster/refs/heads/main/src/assets/Meal%20Master%20App%20New%20Logo.svg' 
                alt='MealMaster Logo' 
                className='h-12 hover:scale-105 transition-transform duration-300'
              />
            </Link>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                <motion.div
                  initial="closed"
                  animate="open"
                  variants={menuVariants}
                  className="flex items-center space-x-8"
                >
                  <motion.div variants={itemVariants}>
                    <Link 
                      to="/meal-planner" 
                      className="relative text-gray-600 hover:text-blue-500 transition-colors duration-300
                        before:content-[''] before:absolute before:-bottom-1 before:left-0 before:w-0 before:h-0.5 
                        before:bg-blue-500 before:transition-all before:duration-300 hover:before:w-full"
                    >
                      Meal Planner
                    </Link>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <Link 
                      to="/NutritionTracker" 
                      className="relative text-gray-600 hover:text-blue-500 transition-colors duration-300
                        before:content-[''] before:absolute before:-bottom-1 before:left-0 before:w-0 before:h-0.5 
                        before:bg-blue-500 before:transition-all before:duration-300 hover:before:w-full"
                    >
                      Nutrition Tracker
                    </Link>
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <Link 
                      to="/recipes" 
                      className="relative text-gray-600 hover:text-blue-500 transition-colors duration-300
                        before:content-[''] before:absolute before:-bottom-1 before:left-0 before:w-0 before:h-0.5 
                        before:bg-blue-500 before:transition-all before:duration-300 hover:before:w-full"
                    >
                      Recipes
                    </Link>
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <Link 
                      to="/profile" 
                      className="relative text-gray-600 hover:text-blue-500 transition-colors duration-300
                        before:content-[''] before:absolute before:-bottom-1 before:left-0 before:w-0 before:h-0.5 
                        before:bg-blue-500 before:transition-all before:duration-300 hover:before:w-full"
                    >
                      Profile
                    </Link>
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <button
                      onClick={handleLogout}
                      className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 
                        text-white font-semibold py-2 px-6 rounded-full shadow-lg hover:shadow-xl
                        transition-all duration-300 transform hover:scale-105"
                    >
                      Logout
                    </button>
                  </motion.div>
                </motion.div>
              </>
            ) : (
              <div className="flex items-center space-x-6">
                <Link 
                  to="/login" 
                  className="relative text-gray-600 hover:text-blue-500 transition-colors duration-300
                    before:content-[''] before:absolute before:-bottom-1 before:left-0 before:w-0 before:h-0.5 
                    before:bg-blue-500 before:transition-all before:duration-300 hover:before:w-full"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 
                    text-white font-semibold py-2 px-6 rounded-full shadow-lg hover:shadow-xl
                    transition-all duration-300 transform hover:scale-105"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-blue-500 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg py-4"
          >
            <div className="px-4 pt-2 pb-3 space-y-4">
              {user ? (
                <>
                  <Link 
                    to="/meal-planner" 
                    className="block px-4 py-2 text-gray-600 hover:bg-blue-50 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Meal Planner
                  </Link>
                  <Link 
                    to="/recipes" 
                    className="block px-4 py-2 text-gray-600 hover:bg-blue-50 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Recipes
                  </Link>
                  <Link 
                    to="/profile" 
                    className="block px-4 py-2 text-gray-600 hover:bg-blue-50 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="block px-4 py-2 text-gray-600 hover:bg-blue-50 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="block px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}

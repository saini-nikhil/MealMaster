import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { Menu, X, Sun, Moon, MessageSquare } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { darkMode, setDarkMode } = useTheme();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const menuVariants = {
    open: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
    closed: { opacity: 0, y: -20 },
  };

  const itemVariants = {
    open: { opacity: 1, y: 0 },
    closed: { opacity: 0, y: -20 },
  };

  const hoverEffect = { scale: 1.1, transition: { duration: 0.3 } };

  const bgClasses = darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800';

  return (
    <nav className={`shadow-lg sticky top-0 z-50 transition-colors duration-300 ${bgClasses}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <Link to="/">
          <img 
            src='https://raw.githubusercontent.com/saini-nikhil/MealMaster/refs/heads/main/src/assets/Meal%20Master%20App%20New%20Logo.svg' 
            alt='MealMaster Logo' 
            className='h-12 hover:scale-105 transition-transform duration-300'
          />
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <motion.div initial="closed" animate="open" variants={menuVariants} className="flex items-center space-x-8">
            {user ? (
              <>
                <motion.div variants={itemVariants} whileHover={hoverEffect}>
                  <Link to="/meal-planner" className="relative hover:text-blue-500 transition-colors duration-300">
                    Meal Planner
                  </Link>
                </motion.div>
                <motion.div variants={itemVariants} whileHover={hoverEffect}>
                  <Link to="/NutritionTracker" className="relative hover:text-blue-500 transition-colors duration-300">
                    Nutrition Tracker
                  </Link>
                </motion.div>
                <motion.div variants={itemVariants} whileHover={hoverEffect}>
                  <Link to="/recipes" className="relative hover:text-blue-500 transition-colors duration-300">
                    Recipes
                  </Link>
                </motion.div>
                <motion.div variants={itemVariants} whileHover={hoverEffect}>
                  <Link to="/community" className="relative hover:text-blue-500 transition-colors duration-300">
                    Community
                  </Link>
                </motion.div>
                <motion.div variants={itemVariants} whileHover={hoverEffect}>
                  <Link to="/profile" className="relative hover:text-blue-500 transition-colors duration-300">
                    Profile
                  </Link>
                </motion.div>
                <motion.div variants={itemVariants} whileHover={hoverEffect}>
                  <button
                    onClick={handleLogout}
                    className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold py-2 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Logout
                  </button>
                </motion.div>
              </>
            ) : (
              <div className="flex items-center space-x-6">
                <motion.div whileHover={hoverEffect}>
                  <Link to="/login" className="relative hover:text-blue-500 transition-colors duration-300">
                    Login
                  </Link>
                </motion.div>
                <motion.div whileHover={hoverEffect}>
                  <Link to="/register" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-2 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    Get Started
                  </Link>
                </motion.div>
              </div>
            )}
          </motion.div>
          <div className="flex items-center space-x-4">
            <motion.div variants={itemVariants}>
              <Link
                to="/ChatInterface"
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
              >
                <MessageSquare className="w-6 h-6 text-blue-500" />
              </Link>
            </motion.div>
            <motion.div variants={itemVariants}>
              <motion.button
                onClick={toggleDarkMode}
                className="p-2 rounded-full transition-colors duration-300 transform hover:scale-110 shadow-md"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                {darkMode ? <Sun className="w-6 h-6 text-yellow-400" /> : <Moon className="w-6 h-6 text-gray-800" />}
              </motion.button>
            </motion.div>
          </div>
        </div>

        <div className="md:hidden flex items-center space-x-2">
          <Link
            to="/ChatInterface"
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
          >
            <MessageSquare className="w-6 h-6 text-blue-500" />
          </Link>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-600 hover:text-blue-500 transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <motion.button
            onClick={toggleDarkMode}
            className="p-2 rounded-full shadow-md"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            {darkMode ? <Sun className="w-6 h-6 text-yellow-400" /> : <Moon className="w-6 h-6 text-gray-800" />}
          </motion.button>
        </div>
      </div>

      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg py-4 z-40"
        >
          <div className="px-4 pt-2 pb-3 space-y-4">
            {user ? (
              <>
                <Link to="/meal-planner" className="block px-4 py-2 text-gray-600 hover:bg-blue-50 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
                  Meal Planner
                </Link>
                <Link to="/NutritionTracker" className="block px-4 py-2 text-gray-600 hover:bg-blue-50 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
                Nutrition Tracker
                </Link>
                <Link to="/recipes" className="block px-4 py-2 text-gray-600 hover:bg-blue-50 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
                  Recipes
                </Link>
                <Link to="/community" className="block px-4 py-2 text-gray-600 hover:bg-blue-50 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
                 Community
                </Link>
                <Link to="/profile" className="block px-4 py-2 text-gray-600 hover:bg-blue-50 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
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
                <Link to="/login" className="block px-4 py-2 text-gray-600 hover:bg-blue-50 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="block px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
}
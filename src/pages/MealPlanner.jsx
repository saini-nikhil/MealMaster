import React, { useState, useEffect } from 'react';
import { Calendar, Plus, X, Tag, ShoppingCart, Trash2 } from 'lucide-react';
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../Auth/firebase';
import { useAuth } from '../Auth/AuthContext';
import { useTheme } from '../contexts/ThemeContext';  // Import the useTheme hook
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';  // Add this line

const categories = ['all', 'vegetarian', 'vegan', 'non-vegetarian', 'gluten-free'];

const MealPlanner = () => {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [favRecipes, setFavRecipes] = useState([]);
  const [mealPlans, setMealPlans] = useState([]);
  const [isAddingMeal, setIsAddingMeal] = useState(false);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedMealType, setSelectedMealType] = useState('breakfast');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [currentWeekStart, setCurrentWeekStart] = useState(getWeekStart());
  const [draggedRecipe, setDraggedRecipe] = useState(null);
  const [dropTarget, setDropTarget] = useState({ day: null, mealType: null });
  const [hoveredRecipe, setHoveredRecipe] = useState(null);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const mealTypes = ['breakfast', 'lunch', 'dinner'];

  useEffect(() => {
    if (user) {
      const recipesQuery = query(
        collection(db, 'userRecipes'),
        where('userId', '==', user.uid)
      );

      const unsubscribeRecipes = onSnapshot(recipesQuery, (snapshot) => {
        const recipes = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setFavRecipes(recipes);
      });

      const mealPlansQuery = query(
        collection(db, 'mealPlans'),
        where('userId', '==', user.uid)
      );

      const unsubscribeMealPlans = onSnapshot(mealPlansQuery, (snapshot) => {
        const plans = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMealPlans(plans);
      });

      return () => {
        unsubscribeRecipes();
        unsubscribeMealPlans();
      };
    }
  }, [user]);

  function getWeekStart() {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    return new Date(now.setDate(diff));
  }

  const getCategoryColor = (category) => {
    const colors = {
      'vegetarian': 'bg-green-600',
      'vegan': 'bg-emerald-600',
      'non-vegetarian': 'bg-red-600',
      'gluten-free': 'bg-purple-600'
    };
    return colors[category] || 'bg-blue-600';
  };

  const handleDragStart = (recipe) => {
    setDraggedRecipe(recipe);
  };

  const handleDragOver = (e, day, mealType) => {
    e.preventDefault();
    setDropTarget({ day, mealType });
  };

  const handleDrop = async (e, day, mealType) => {
    e.preventDefault();
    if (draggedRecipe) {
      const newMealPlan = {
        userId: user.uid,
        day,
        mealType,
        recipe: draggedRecipe,
        createdAt: new Date()
      };
      await addDoc(collection(db, 'mealPlans'), newMealPlan);
      setDraggedRecipe(null);
      setDropTarget({ day: null, mealType: null });
    }
  };

  const addMealPlan = async () => {
    if (!selectedDay || !selectedRecipe) return;

    const newMealPlan = {
      userId: user.uid,
      day: selectedDay,
      mealType: selectedMealType,
      recipe: selectedRecipe,
      createdAt: new Date()
    };

    await addDoc(collection(db, 'mealPlans'), newMealPlan);
    setIsAddingMeal(false);
    setSelectedDay('');
    setSelectedRecipe(null);
  };

  const deleteMealPlan = async (planId) => {
    await deleteDoc(doc(db, 'mealPlans', planId));
  };

  const getFilteredRecipes = () => {
    return favRecipes.filter(recipe => 
      selectedCategory === 'all' || recipe.category.toLowerCase() === selectedCategory
    );
  };

  const getMealsForDay = (day, mealType) => {
    return mealPlans.filter(plan => 
      plan.day === day && plan.mealType === mealType
    );
  };

  const handleGenerateGroceryList = (recipe) => {
    navigate('/grocerylist', { state: { recipe: recipe.name } });
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + (direction * 7));
    setCurrentWeekStart(newDate);
  };

  const renderFavoriteRecipes = () => (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Tag className="w-5 h-5" />
        Favorite Recipes
      </h2>
      <div className="flex flex-wrap gap-3">
        {favRecipes.map((recipe) => (
          <motion.div
            key={recipe.id}
            className="relative"
            onMouseEnter={() => setHoveredRecipe(recipe.id)}
            onMouseLeave={() => setHoveredRecipe(null)}
          >
            <motion.div
              draggable
              onDragStart={() => handleDragStart(recipe)}
              className={`${getCategoryColor(recipe.category)} text-white px-4 py-2 rounded-lg cursor-move 
                flex items-center gap-2 relative`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <span>{recipe.name}</span>
            </motion.div>
            
            {/* Grocery List Button - Shows on Hover */}
            <AnimatePresence>
              {hoveredRecipe === recipe.id && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute -bottom-8 left-0 right-0 bg-green-500 text-white px-2 py-1 rounded-md 
                    text-sm flex items-center justify-center gap-1 hover:bg-green-600 transition-colors shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGenerateGroceryList(recipe);
                  }}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Generate List
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
    <div className={`max-w-7xl mx-auto p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Calendar className="w-8 h-8" />
          Meal Planner
        </h1>
        <button
          onClick={() => setIsAddingMeal(true)}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Meal
        </button>
      </div>

      {/* Weekly Calendar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-8">
        {days.map((day) => (
          <motion.div
            key={day}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`${darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg p-4`}
          >
            <h3 className="font-bold text-center mb-2">{day}</h3>
            {mealTypes.map((mealType) => (
              <div 
                key={mealType}
                className={`mb-2 p-2 rounded-lg transition-colors
                  ${dropTarget.day === day && dropTarget.mealType === mealType 
                    ? 'bg-blue-100 dark:bg-blue-900' 
                    : ''}`}
                onDragOver={(e) => handleDragOver(e, day, mealType)}
                onDrop={(e) => handleDrop(e, day, mealType)}
              >
                <h4 className="text-sm font-semibold capitalize mb-1">{mealType}</h4>
                {mealPlans
                  .filter(meal => meal.day === day && meal.mealType === mealType)
                  .map((meal) => (
                    <motion.div
                      key={meal.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={`${getCategoryColor(meal.recipe.category)} text-white p-2 rounded-md mb-1 
                        text-sm flex justify-between items-center`}
                    >
                      <span>{meal.recipe.name}</span>
                      <button
                        onClick={() => deleteMealPlan(meal.id)}
                        className="text-white hover:text-red-200 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
              </div>
            ))}
          </motion.div>
        ))}
      </div>

      {/* Add Meal Modal */}
      {isAddingMeal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 max-w-2xl w-full mx-4`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Add New Meal</h2>
              <button
                onClick={() => setIsAddingMeal(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block mb-2">Day</label>
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                  className={`w-full p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
                >
                  <option value="">Select Day</option>
                  {days.map((day) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2">Meal Type</label>
                <select
                  value={selectedMealType}
                  onChange={(e) => setSelectedMealType(e.target.value)}
                  className={`w-full p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
                >
                  {mealTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block mb-2">Category Filter</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`w-full p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="max-h-64 overflow-y-auto mb-6">
              <h3 className="font-semibold mb-2">Select Recipe</h3>
              <div className="grid grid-cols-1 gap-2">
                {getFilteredRecipes().map((recipe) => (
                  <button
                    key={recipe.id}
                    onClick={() => setSelectedRecipe(recipe)}
                    className={`p-3 rounded-lg text-left transition-colors ${selectedRecipe?.id === recipe.id
                      ? getCategoryColor(recipe.category) + ' text-white'
                      : darkMode
                        ? 'bg-gray-700 hover:bg-gray-600'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="font-medium">{recipe.name}</div>
                    <div className="text-sm opacity-75">{recipe.category}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsAddingMeal(false)}
                className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} hover:opacity-80 transition-opacity`}
              >
                Cancel
              </button>
              <button
                onClick={addMealPlan}
                disabled={!selectedDay || !selectedRecipe}
                className={`px-4 py-2 rounded-lg ${!selectedDay || !selectedRecipe ? 'bg-gray-400' : 'bg-blue-600'} 
                text-white hover:bg-blue-700 transition-colors`}
              >
                Add Meal
              </button>
            </div>
          </div>
        </div>
      )}

      {renderFavoriteRecipes()}
    </div>
    </div>
  );
};

export default MealPlanner;

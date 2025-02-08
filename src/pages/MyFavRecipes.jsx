import React, { useState, useEffect } from "react";
import { db } from "../Auth/firebase";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { useAuth } from "../Auth/AuthContext";
import { useTheme } from '../contexts/ThemeContext';
import { toast } from 'react-hot-toast';
import { Search, Timer, CalendarRange, ChevronDown, ChevronUp } from "lucide-react";
// import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function FavRecipes() {
  const { user } = useAuth();
  const [favRecipes, setFavRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [dietFilter, setDietFilter] = useState("all");
  const [mealFilter, setMealFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRecipe, setExpandedRecipe] = useState(null);
  const recipesPerPage = 12;

  const [selectedDays, setSelectedDays] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  
  const [mealType, setMealType] = useState("breakfast");
  const [timerState, setTimerState] = useState({
    recipeId: null,
    timerMinutes: 0,
    timeLeft: null,
  });

  const alarmSound = new Audio("/alarm.mp3");
  const { darkMode } = useTheme();

  useEffect(() => {
    if (user) {
      fetchFavoriteRecipes();
    }
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [search, dietFilter, mealFilter, favRecipes]);

  const fetchFavoriteRecipes = async () => {
    setLoading(true);
    setHasError(false);

    try {
      const favRef = query(
        collection(db, "userRecipes"),
        where("userId", "==", user.uid)
      );
      const querySnapshot = await getDocs(favRef);
      const favoriteRecipes = [];
      querySnapshot.forEach((docSnap) => {
        favoriteRecipes.push({ id: docSnap.id, ...docSnap.data() });
      });

      setFavRecipes(favoriteRecipes);
      setCurrentPage(1);
    } catch (error) {
      setHasError(true);
      console.error("Error fetching favorite recipes:", error);
    } finally {
      setLoading(false);
    }
  };


  

  const applyFilters = () => {
    let recipes = favRecipes;

    if (search) {
      recipes = recipes.filter((recipe) =>
        recipe.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (dietFilter !== "all") {
      recipes = recipes.filter(
        (recipe) => recipe.category.toLowerCase() === dietFilter
      );
    }

    if (mealFilter !== "all") {
      recipes = recipes.filter(
        (recipe) => recipe.meal_type.toLowerCase() === mealFilter
      );
    }

    setFilteredRecipes(recipes);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);
  const startIndex = (currentPage - 1) * recipesPerPage;
  const currentRecipes = filteredRecipes.slice(startIndex, startIndex + recipesPerPage);

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const openMealPlanModal = (recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const handleDaySelection = (day) => {
    setSelectedDays((prevDays) => {
      if (prevDays.includes(day)) {
        return prevDays.filter((d) => d !== day);
      } else {
        return [...prevDays, day];
      }
    });
  };

  const saveMealPlan = async () => {
    if (!selectedRecipe || selectedDays.length === 0) return;
  
    try {
      const mealPlanRef = collection(db, "mealPlans");
      
      // Create a meal plan for each selected day
      const promises = selectedDays.map(day => 
        addDoc(mealPlanRef, {
          userId: user.uid,
          recipe: {
            id: selectedRecipe.id,
            name: selectedRecipe.name,
            category: selectedRecipe.category,
            instructions: selectedRecipe.instructions,
            calories: selectedRecipe.calories,
            meal_type: selectedRecipe.meal_type
          },
          day,
          mealType,
          createdAt: new Date()
        })
      );
  
      await Promise.all(promises);
  
      setIsModalOpen(false);
      setSelectedRecipe(null);
      setSelectedDays([]);
      toast.success('Meal plan added successfully!');
    } catch (error) {
      console.error("Error saving meal plan:", error);
      toast.error('Failed to add meal plan');
    }
  };

  const startTimer = (recipeId) => {
    setTimerState({
      recipeId,
      timeLeft: timerState.timerMinutes * 60,
    });
  };

  useEffect(() => {
    if (timerState.timeLeft === null || timerState.timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimerState((prevState) => ({
        ...prevState,
        timeLeft: prevState.timeLeft - 1,
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, [timerState.timeLeft]);

  useEffect(() => {
    if (timerState.timeLeft === 0) {
      alarmSound.play();
      alert(`Time's up for ${timerState.recipeId}`);
      setTimerState({ ...timerState, timeLeft: null });
    }
  }, [timerState.timeLeft]);

  const handleSetTimer = (recipeId, timerMinutes) => {
    setTimerState({
      recipeId,
      timerMinutes,
      timeLeft: timerMinutes * 60,
    });
  };
  
  const toggleIngredients = (recipeId) => {
    setExpandedRecipe(expandedRecipe === recipeId ? null : recipeId);
  };
  

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="text-center text-red-500 font-bold">
        Error fetching favorite recipes. Please try again later.
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Card Container */}
        <div className={`mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-lg overflow-hidden`}>
          <div className={`p-4 ${darkMode ? 'text-white' : 'bg-gray-200'}`}>
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Favorite Recipes
            </h1>
          </div>
  
          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              <div className="relative sm:col-span-2 lg:col-span-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search recipes..."
                  className={`w-full pl-12 pr-4 py-3.5 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm`}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
  
              {/* Diet Filter Dropdown */}
              <select
                className={`w-full py-3.5 px-4 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-colors shadow-sm`}
                value={dietFilter}
                onChange={(e) => setDietFilter(e.target.value)}
              >
                <option value="all">All Diets</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="non-vegetarian">Non-Veg</option>
                <option value="gluten-free">Gluten-Free</option>
              </select>
  
              {/* Meal Filter Dropdown */}
              <select
                className={`w-full py-3.5 px-4 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-colors shadow-sm`}
                value={mealFilter}
                onChange={(e) => setMealFilter(e.target.value)}
              >
                <option value="all">All Meals</option>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
              </select>
            </div>
          </div>
        </div>
  
        {/* Loading, Error or Recipe List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : hasError ? (
          <div className={`text-center py-12 ${darkMode ? 'bg-red-900 text-red-300' : 'bg-red-50 text-red-500'} rounded-lg`}>
            <p className="text-lg font-medium">Error fetching recipes</p>
            <p className="text-sm mt-2">Please try again later</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className={`rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
              >
                <div className="p-6">
                  <h3 className={`text-xl font-bold leading-tight mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {recipe.name}
                  </h3>
                  <p className={`mb-4 line-clamp-3 leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {recipe.instructions}
                  </p>
  
                  <div className="space-y-3">
                    <button
                      onClick={() => toggleIngredients(recipe.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg ${
                        darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
                      } transition-colors`}
                    >
                      <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Ingredients
                      </span>
                      {expandedRecipe === recipe.id ? (
                        <ChevronUp size={20} className="text-gray-400" />
                      ) : (
                        <ChevronDown size={20} className="text-gray-400" />
                      )}
                    </button>
  
                    {expandedRecipe === recipe.id && (
                      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <ul className="list-disc list-inside space-y-2">
                          {Array.isArray(recipe.ingredients) ? (
                            recipe.ingredients.map((ingredient, index) => (
                              <li key={index} className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                {ingredient.trim()}
                              </li>
                            ))
                          ) : (
                            <li className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              {recipe.ingredients}
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
  
                    {/* Calories and Meal Type */}
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>Calories:</span>
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{recipe.calories}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>Meal Type:</span>
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600 capitalize'}>{recipe.meal_type}</span>
                    </div>
                    <div className="pt-2">
                      <span className={`inline-block text-sm font-medium ${darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'} rounded-full px-4 py-1.5`}>
                        {recipe.category}
                      </span>
                    </div>
  
                    {/* Timer and Meal Plan buttons */}
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => handleSetTimer(recipe.id, 10)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
                      >
                        <Timer size={18} />
                        <span>Set Timer</span>
                      </button>
                      <button
                        onClick={() => openMealPlanModal(recipe)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-sm"
                      >
                        <CalendarRange size={18} />
                        <span>Add to Meal Plan</span>
                      </button>
                    </div>
  
                    {/* Timer state */}
                    {timerState.recipeId === recipe.id && (
                      <div className="mt-4 space-y-3">
                        <input
                          type="number"
                          className={`w-full p-3 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}
                          placeholder="Enter minutes"
                          value={timerState.timerMinutes}
                          onChange={(e) => setTimerState({
                            ...timerState,
                            timerMinutes: e.target.value,
                          })}
                        />
                        {timerState.timeLeft !== null && (
                          <div className="text-lg font-bold text-center p-2 bg-red-500 text-white rounded-lg">
                            {Math.floor(timerState.timeLeft / 60)}:
                            {(timerState.timeLeft % 60).toString().padStart(2, "0")}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
  
        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-6 py-2.5 rounded-lg transition-colors font-medium ${
              currentPage === 1
                ? 'bg-gray-300 cursor-not-allowed'
                : darkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
            }`}
          >
            Previous
          </button>
          <span className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-6 py-2.5 rounded-lg transition-colors font-medium ${
              currentPage === totalPages
                ? 'bg-gray-300 cursor-not-allowed'
                : darkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
            }`}
          >
            Next
          </button>
        </div>
  
        {/* Meal Plan Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
            <div className={`p-6 rounded-lg w-96 transform transition-all duration-300 ease-in-out ${isModalOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'} ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
              <h2 className="text-2xl font-bold mb-4">Select Days for Meal Plan</h2>
              <div className="grid grid-cols-2 gap-4">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                  <button
                    key={day}
                    onClick={() => handleDaySelection(day)}
                    className={`w-full py-2 text-lg rounded-lg transform transition-all duration-200 hover:scale-105 ${
                      selectedDays.includes(day)
                        ? "bg-blue-500 text-white shadow-lg"
                        : darkMode
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
              <div className="mt-4">
                <select
                  className={`p-2 border rounded w-full transition-colors duration-200 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                      : 'bg-gray-50 border-gray-300 focus:border-blue-500'
                  }`}
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value)}
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                </select>
              </div>
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded transform transition-all duration-200 hover:scale-105 hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={saveMealPlan}
                  className="bg-green-500 text-white px-4 py-2 rounded transform transition-all duration-200 hover:scale-105 hover:bg-green-600"
                >
                  Save Meal Plan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
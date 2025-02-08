import React, { useState, useEffect } from "react";
import { db } from "../Auth/firebase";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { useAuth } from "../Auth/AuthContext";
import { useTheme } from '../contexts/ThemeContext';
import { toast } from 'react-hot-toast';

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
  const recipesPerPage = 10;

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
    <div className={`max-w-6xl mx-auto p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
      <div className="mb-8 flex flex-col md:flex-row md:justify-between gap-4">
        <input
          type="text"
          placeholder="Search recipes..."
          className={`w-full md:w-1/3 p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className={`p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}
          value={dietFilter}
          onChange={(e) => setDietFilter(e.target.value)}
        >
          <option value="all">All Diets</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="vegan">Vegan</option>
          <option value="non-vegetarian">Non-Veg</option>
          <option value="gluten-free">Gluten-Free</option>
        </select>
        <select
          className={`p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}
          value={mealFilter}
          onChange={(e) => setMealFilter(e.target.value)}
        >
          <option value="all">All Meals</option>
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
        </select>
      </div>

      {filteredRecipes.length === 0 ? (
        <div className={`text-center text-xl font-bold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          No recipes found. Try a different filter or search term.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentRecipes.map((recipe) => (
              <div key={recipe.id} className={`rounded-lg shadow-md overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="p-4">
                  <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{recipe.name}</h3>
                  <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{recipe.instructions}</p>
                  <div className="mb-4">
                    <span className="font-semibold">Calories:</span> {recipe.calories}
                  </div>
                  <div className="mb-4">
                    <span className="font-semibold">Meal Type:</span> {recipe.meal_type}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-2 py-1 rounded text-sm ${darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'}`}>
                      {recipe.category}
                    </span>
                  </div>

                  {timerState.recipeId === recipe.id ? (
                    <div className="mt-4">
                      <input
                        type="number"
                        className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}
                        placeholder="Enter minutes"
                        value={timerState.timerMinutes}
                        onChange={(e) =>
                          setTimerState({
                            ...timerState,
                            timerMinutes: e.target.value,
                          })
                        }
                      />
                      <div className="mt-2">
                        <button
                          onClick={() => startTimer(recipe.id)}
                          className="bg-green-500 text-white px-4 py-2 rounded"
                        >
                          Start Timer
                        </button>
                      </div>
                      {timerState.timeLeft !== null && (
                        <div className="text-lg font-bold text-red-500 mt-2">
                          Time Left: {Math.floor(timerState.timeLeft / 60)}:
                          {(timerState.timeLeft % 60).toString().padStart(2, "0")}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="mt-4 flex items-center gap-4">
                      <button
                        onClick={() => handleSetTimer(recipe.id, 10)}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                      >
                        Set Timer
                      </button>
                      <button
                        onClick={() => openMealPlanModal(recipe)}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                      >
                        Add to Meal Plan
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg mx-2 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-500 text-white'}`}
        >
          Prev
        </button>
        <span className={`text-lg ${darkMode ? 'text-white' : 'text-black'}`}>{currentPage} / {totalPages}</span>
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-lg mx-2 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-500 text-white'}`}
        >
          Next
        </button>
      </div>
      {isModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
    <div className={`p-6 rounded-lg w-96 transform transition-all duration-300 ease-in-out ${
      isModalOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
    } ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
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
  );
}
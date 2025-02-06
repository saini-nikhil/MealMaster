import React, { useState, useEffect } from "react";
import { db } from "../Auth/firebase";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { useAuth } from "../Auth/AuthContext";


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

  // Timer state for each recipe
  const [timerState, setTimerState] = useState({
    recipeId: null,
    timerMinutes: 0,
    timeLeft: null,
  });

  // Load audio for the timer end
  const alarmSound = new Audio("/alarm.mp3");

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

  // Handle pagination
  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);
  const startIndex = (currentPage - 1) * recipesPerPage;
  const currentRecipes = filteredRecipes.slice(startIndex, startIndex + recipesPerPage);

  const goToPage = (page) => {
    setCurrentPage(page);
  };


  // Open Modal to select days for meal plan
  const openMealPlanModal = (recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  // Handle day selection for meal plan
  const handleDaySelection = (day) => {
    setSelectedDays((prevDays) => {
      if (prevDays.includes(day)) {
        return prevDays.filter((d) => d !== day);
      } else {
        return [...prevDays, day];
      }
    });
  };

  // Save meal plan to the database
  const saveMealPlan = async () => {
    if (!selectedRecipe || selectedDays.length === 0) return;

    try {
      const mealPlanRef = collection(db, "mealPlans");
      await addDoc(mealPlanRef, {
        userId: user.uid,
        recipe: selectedRecipe,  // Save all recipe data
        days: selectedDays,
        createdAt: new Date(),
      });

      // Close the modal and reset selections
      setIsModalOpen(false);
      setSelectedRecipe(null);
      setSelectedDays([]);
    } catch (error) {
      console.error("Error saving meal plan:", error);
    }
  };
  // Start Timer for a specific recipe
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
      alarmSound.play(); // Play sound when timer ends
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
    return <div className="text-center text-lg font-bold">Loading...</div>;
  }

  if (hasError) {
    return (
      <div className="text-center text-red-500 font-bold">
        Error fetching favorite recipes. Please try again later.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Filter Section */}
      <div className="mb-8 flex flex-col md:flex-row md:justify-between gap-4">
        <input
          type="text"
          placeholder="Search recipes..."
          className="w-full md:w-1/3 p-2 border rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="p-2 border rounded"
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
          className="p-2 border rounded"
          value={mealFilter}
          onChange={(e) => setMealFilter(e.target.value)}
        >
          <option value="all">All Meals</option>
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
        </select>
      </div>

      {/* Recipe List */}
      {filteredRecipes.length === 0 ? (
        <div className="text-center text-xl font-bold text-gray-600">
          No recipes found. Try a different filter or search term.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentRecipes.map((recipe) => (
              <div key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2">{recipe.name}</h3>
                  <p className="text-gray-600 mb-4">{recipe.instructions}</p>
                  <div className="mb-4">
                    <span className="font-semibold">Calories:</span> {recipe.calories}
                  </div>
                  <div className="mb-4">
                    <span className="font-semibold">Meal Type:</span> {recipe.meal_type}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                      {recipe.category}
                    </span>
                  </div>

                  {/* Timer in Recipe Card */}
                  {timerState.recipeId === recipe.id ? (
                    <div className="mt-4">
                      <input
                        type="number"
                        className="w-full p-2 border rounded"
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
                    <div className="mt-4">
                      <button
                        onClick={() => handleSetTimer(recipe.id, 10)} // Default to 10 minutes
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                      >
                        Set Timer
                      </button>
                      <button
                onClick={() => openMealPlanModal(recipe)}
                className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
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
      {/* pagination  */}

      <div className="flex justify-center mt-6">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg mx-2"
        >
          Prev
        </button>
        <span className="text-lg">{currentPage} / {totalPages}</span>
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg mx-2"
        >
          Next
        </button>
      </div>

      {/* Modal for Selecting Days */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Select Days for Meal Plan</h2>
            <div className="grid grid-cols-2 gap-4">
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                <button
                  key={day}
                  onClick={() => handleDaySelection(day)}
                  className={`w-full py-2 text-lg rounded-lg ${
                    selectedDays.includes(day)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={saveMealPlan}
                className="bg-green-500 text-white px-4 py-2 rounded"
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

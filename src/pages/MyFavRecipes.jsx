import React, { useState, useEffect } from "react";
import { db } from "../Auth/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
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

  const [showTimerModal, setShowTimerModal] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);

  // Load audio for the timer end
  const alarmSound = new Audio("/alarm.mp3"); // Ensure alarm.mp3 is in the public folder

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

  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = filteredRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe);
  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);

  const startTimer = () => {
    setTimeLeft(timerMinutes * 60);
    setShowTimerModal(false);
  };

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    if (timeLeft === 0) {
      alarmSound.play(); // Play sound when timer ends
      alert("Baking time is over!");
    }
  }, [timeLeft]);

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
        <button onClick={() => setShowTimerModal(true)} className="bg-blue-500 text-white px-4 py-2 rounded">
          Set Timer
        </button>
      </div>

      {showTimerModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-bold">Set Baking Timer</h2>
            <input
              type="number"
              className="w-full p-2 border rounded mt-2"
              placeholder="Enter minutes"
              value={timerMinutes}
              onChange={(e) => setTimerMinutes(e.target.value)}
            />
            <button onClick={startTimer} className="bg-green-500 text-white px-4 py-2 rounded mt-2">
              Start
            </button>
          </div>
        </div>
      )}

      {timeLeft !== null && (
        <div className="text-center text-lg font-bold text-red-500">
          Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
        </div>
      )}

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
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

import React, { useState, useEffect } from "react";
import axios from "axios";
import { db } from "../Auth/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useAuth } from "../Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { Heart, PlusCircle, Search, BookmarkIcon } from "lucide-react";
import { useTheme } from '../contexts/ThemeContext';

export default function Recipes() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [dietFilter, setDietFilter] = useState("all");
  const [mealFilter, setMealFilter] = useState("all");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newRecipe, setNewRecipe] = useState({
    name: "",
    ingredients: "",
    category: "",
    meal_type: "",
    calories: "",
    instructions: "",
  });
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [recipesPerPage] = useState(12);
  const [favRecipes, setFavRecipes] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const { darkMode } = useTheme();

  useEffect(() => {
    fetchRecipes();
    fetchFavoriteRecipes();
  }, [dietFilter, mealFilter, currentPage, search, user]);

  const fetchRecipes = async () => {
    setLoading(true);
    setHasError(false);
    try {
      const response = await axios.get(
        "https://meelmasterauth-default-rtdb.firebaseio.com/recipes.json"
      );
      if (response.data) {
        const fetchedRecipes = Object.keys(response.data).map((key) => ({
          id: key,
          ...response.data[key],
        }));

        let filteredRecipes = fetchedRecipes;
        if (dietFilter !== "all") {
          filteredRecipes = filteredRecipes.filter(
            (recipe) => recipe.category.toLowerCase() === dietFilter
          );
        }
        if (mealFilter !== "all") {
          filteredRecipes = filteredRecipes.filter(
            (recipe) => recipe.meal_type.toLowerCase() === mealFilter
          );
        }
        if (search) {
          filteredRecipes = filteredRecipes.filter((recipe) =>
            recipe.name.toLowerCase().includes(search.toLowerCase())
          );
        }

        const indexOfLastRecipe = currentPage * recipesPerPage;
        const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
        const currentRecipes = filteredRecipes.slice(
          indexOfFirstRecipe,
          indexOfLastRecipe
        );

        setRecipes(currentRecipes);

        const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);
        setTotalPages(totalPages);
      }
    } catch (error) {
      setHasError(true);
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavoriteRecipes = async () => {
    if (!user) return;
    const favRef = query(
      collection(db, "userRecipes"),
      where("userId", "==", user.uid)
    );

    try {
      const querySnapshot = await getDocs(favRef);
      const favoriteRecipes = [];
      querySnapshot.forEach((docSnap) => {
        favoriteRecipes.push({ 
          firestoreId: docSnap.id,  // Store the Firestore document ID
          ...docSnap.data() 
        });
      });
      setFavRecipes(favoriteRecipes);
    } catch (error) {
      console.error("Error fetching favorite recipes:", error);
    }
  };

  const handleToggleFavorites = async (recipe) => {
    if (!user) {
      alert("Please login to save favorites");
      return;
    }

    try {
      const isFavorited = favRecipes.some((fav) => fav.id === recipe.id);

      if (isFavorited) {
        // Find the Firestore document ID for this recipe
        const favoriteDoc = favRecipes.find((fav) => fav.id === recipe.id);
        if (favoriteDoc) {
          const favDoc = doc(db, "userRecipes", favoriteDoc.firestoreId);
          await deleteDoc(favDoc);
          setFavRecipes(favRecipes.filter((fav) => fav.id !== recipe.id));
        }
      } else {
        const docRef = await addDoc(collection(db, "userRecipes"), {
          userId: user.uid,
          ...recipe,
        });
        setFavRecipes([...favRecipes, { firestoreId: docRef.id, ...recipe }]);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      alert("Error updating favorites. Please try again.");
    }
  };

  const handleAddRecipe = async () => {
    if (
      !newRecipe.name ||
      !newRecipe.ingredients ||
      !newRecipe.category ||
      !newRecipe.meal_type ||
      !newRecipe.calories ||
      !newRecipe.instructions
    ) {
      alert("Please fill out all fields.");
      return;
    }
    await addRecipe(newRecipe);
    setIsPopupOpen(false);
    setNewRecipe({
      name: "",
      ingredients: "",
      category: "",
      meal_type: "",
      calories: "",
      instructions: "",
    });
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const navigate = useNavigate();

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`rounded-xl shadow-md p-6 mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
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

            <div className="w-full">
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
            </div>

            <div className="w-full">
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

            <div className="flex gap-4 sm:justify-end">
              <button
                onClick={() => setIsPopupOpen(true)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all duration-200 shadow-lg"
              >
                <PlusCircle size={20} />
                <span className="sm:hidden lg:inline font-medium">Add Recipe</span>
              </button>
            </div>
            <button
              onClick={() => navigate("/FavRecipes")}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-white border-2 border-blue-500 text-blue-500 px-6 py-3 rounded-lg hover:bg-blue-50 transition-all duration-200 shadow-md"
            >
              <BookmarkIcon size={20} />
              <span className="sm:hidden lg:inline font-medium">Favorites</span>
            </button>
          </div>
        </div>

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
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                className={`rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className={`text-xl font-bold leading-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>{recipe.name}</h3>
                    <button
                      onClick={() => handleToggleFavorites(recipe)}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors group"
                      aria-label={favRecipes.some((fav) => fav.id === recipe.id) ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Heart
                        size={24}
                        className={`transition-colors ${favRecipes.some((fav) => fav.id === recipe.id) ? "text-red-500 fill-red-500" : "text-gray-400 group-hover:text-red-500"}`}
                      />
                    </button>
                  </div>
                  <p className={`mb-4 line-clamp-3 leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{recipe.instructions}</p>
                  <div className="space-y-3">
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-8">
          <div className="flex gap-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors font-medium"
            >
              Previous
            </button>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors font-medium"
            >
              Next
            </button>
          </div>
        </div>

        {isPopupOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className={`rounded-xl shadow-lg w-full max-w-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">Add New Recipe</h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Recipe Name"
                    className={`w-full p-3 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    value={newRecipe.name}
                    onChange={(e) => setNewRecipe({ ...newRecipe, name: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Ingredients (comma separated)"
                    className={`w-full p-3 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    value={newRecipe.ingredients}
                    onChange={(e) => setNewRecipe({ ...newRecipe, ingredients: e.target.value.split(",") })}
                  />
                  <select
                    className={`w-full p-3 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    value={newRecipe.category}
                    onChange={(e) => setNewRecipe({ ...newRecipe, category: e.target.value })}
                  >
                    <option value="">Select Diet Type</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="Non-Vegetarian">Non-Veg</option>
                    <option value="gluten-free">Gluten-Free</option>
                  </select>
                  <select
                    className={`w-full p-3 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    value={newRecipe.meal_type}
                    onChange={(e) => setNewRecipe({ ...newRecipe, meal_type: e.target.value })}
                  >
                    <option value="">Select Meal Type</option>
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Calories"
                    className={`w-full p-3 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    value={newRecipe.calories}
                    onChange={(e) => setNewRecipe({ ...newRecipe, calories: e.target.value })}
                  />
                  <textarea
                    placeholder="Instructions"
                    className={`w-full p-3 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]`}
                    value={newRecipe.instructions}
                    onChange={(e) => setNewRecipe({ ...newRecipe, instructions: e.target.value })}
                  />
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      onClick={() => setIsPopupOpen(false)}
                      className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddRecipe}
                      className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                    >
                      Add Recipe
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
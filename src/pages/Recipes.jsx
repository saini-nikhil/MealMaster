import React, { useState, useEffect } from "react";
import axios from "axios";
import { db } from "../Auth/firebase";
import { collection, addDoc, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import { useAuth } from "../Auth/AuthContext";
import { useNavigate } from "react-router-dom";

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
  const [recipesPerPage] = useState(10);
  const [favRecipes, setFavRecipes] = useState([]); // State for favorite recipes


  useEffect(() => {
    fetchRecipes();
    fetchFavoriteRecipes(); // Fetch favorite recipes on component load
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
    if (!user) return; // No need to fetch if user is not logged in
    const favRef = query(
      collection(db, "userRecipes"),
      where("userId", "==", user.uid)
    );

    try {
      const querySnapshot = await getDocs(favRef);
      const favoriteRecipes = [];
      querySnapshot.forEach((docSnap) => {
        favoriteRecipes.push({ id: docSnap.id, ...docSnap.data() });
      });
      setFavRecipes(favoriteRecipes);
    } catch (error) {
      console.error("Error fetching favorite recipes:", error);
    }
  };

  const handleToggleFavorites = async (recipe) => {
    const isFavorited = favRecipes.some((fav) => fav.id === recipe.id);

    if (isFavorited) {
      // Remove from favorites
      const favDoc = doc(db, "userRecipes", recipe.id);
      await deleteDoc(favDoc);
      setFavRecipes(favRecipes.filter((fav) => fav.id !== recipe.id));
    } else {
      // Add to favorites
      await addDoc(collection(db, "userRecipes"), {
        userId: user.uid,
        ...recipe,
      });
      setFavRecipes([...favRecipes, { id: recipe.id, ...recipe }]);
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

  // Pagination Handlers
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const [totalPages, setTotalPages] = useState(1); // State for total pages

  const naviagte = useNavigate()
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

        <button
          onClick={() => naviagte("/FavRecipes")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Fav Recipes
        </button>
        <button
          onClick={() => setIsPopupOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Recipes
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : hasError ? (
        <div>Error fetching recipes. Please try again later.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">{recipe.name}</h3>
                <p className="text-gray-600 mb-4">{recipe.instructions}</p>
                <div className="mb-4">
                  <span className="font-semibold">Calories:</span>{" "}
                  {recipe.calories}
                </div>
                <div className="mb-4">
                  <span className="font-semibold">Meal Type:</span>{" "}
                  {recipe.meal_type}
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                    {recipe.category}
                  </span>
                </div>
                <button
                  onClick={() => handleToggleFavorites(recipe)}
                  className={`mt-4 px-4 py-2 rounded ${
                    favRecipes.some((fav) => fav.id === recipe.id)
                      ? "bg-red-500"
                      : "bg-blue-500"
                  } text-white hover:bg-blue-600`}
                >
                  {favRecipes.some((fav) => fav.id === recipe.id)
                    ? "Remove from Fav"
                    : "Add to Fav"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md mr-2"
        >
          Previous
        </button>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
        >
          Next
        </button>
      </div>

      {isPopupOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Add New Recipe</h2>
            <input
              type="text"
              placeholder="Recipe Name"
              className="w-full p-2 border rounded mb-2"
              value={newRecipe.name}
              onChange={(e) =>
                setNewRecipe({ ...newRecipe, name: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Ingredients (comma separated)"
              className="w-full p-2 border rounded mb-2"
              value={newRecipe.ingredients}
              onChange={(e) =>
                setNewRecipe({
                  ...newRecipe,
                  ingredients: e.target.value.split(","),
                })
              }
            />
            <select
              className="w-full p-2 border rounded mb-2"
              value={newRecipe.category}
              onChange={(e) =>
                setNewRecipe({ ...newRecipe, category: e.target.value })
              }
            >
              <option value="">Select Diet Type</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="Non-Vegetarian">Non-Veg</option>
              <option value="gluten-free">Gluten-Free</option>
            </select>
            <select
              className="w-full p-2 border rounded mb-2"
              value={newRecipe.meal_type}
              onChange={(e) =>
                setNewRecipe({ ...newRecipe, meal_type: e.target.value })
              }
            >
              <option value="">Select Meal Type</option>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
            </select>
            <input
              type="number"
              placeholder="Calories"
              className="w-full p-2 border rounded mb-2"
              value={newRecipe.calories}
              onChange={(e) =>
                setNewRecipe({ ...newRecipe, calories: e.target.value })
              }
            />
            <textarea
              placeholder="Instructions"
              className="w-full p-2 border rounded mb-2"
              value={newRecipe.instructions}
              onChange={(e) =>
                setNewRecipe({ ...newRecipe, instructions: e.target.value })
              }
            />
            <button
              onClick={handleAddRecipe}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { db } from "../Auth/firebase";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { useAuth } from "../Auth/AuthContext";

const MealPlanner = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const [userRecipes, setUserRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [mealType, setMealType] = useState(null);
  const [day, setDay] = useState(null);
  const [recipeName, setRecipeName] = useState('');
  const [recipeCategory, setRecipeCategory] = useState('');

  // Initialize meal plan state
  const [mealPlan, setMealPlan] = useState({
    Monday: { breakfast: null, lunch: null, dinner: null },
    Tuesday: { breakfast: null, lunch: null, dinner: null },
    Wednesday: { breakfast: null, lunch: null, dinner: null },
    Thursday: { breakfast: null, lunch: null, dinner: null },
    Friday: { breakfast: null, lunch: null, dinner: null },
    Saturday: { breakfast: null, lunch: null, dinner: null },
    Sunday: { breakfast: null, lunch: null, dinner: null },
  });

  // Fetch recipes when component mounts
  useEffect(() => {
    if (user) {
      fetchRecipes();
      fetchMealPlan();
    }
  }, [user]);

  // Fetch recipes from Firebase
  const fetchRecipes = async () => {
    try {
      const recipesRef = query(
        collection(db, "userRecipes"),
        where("userId", "==", user.uid)
      );
      const querySnapshot = await getDocs(recipesRef);
      const recipesData = [];
      querySnapshot.forEach((doc) => {
        recipesData.push({ id: doc.id, ...doc.data() });
      });
      setRecipes(recipesData);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch existing meal plan
  const fetchMealPlan = async () => {
    try {
      const mealPlanRef = query(
        collection(db, "mealPlans"),
        where("userId", "==", user.uid)
      );
      const querySnapshot = await getDocs(mealPlanRef);
      const currentMealPlan = { ...mealPlan };
      
      querySnapshot.forEach((doc) => {
        const planData = doc.data();
        const { recipe, days, mealType } = planData;
        days.forEach(day => {
          currentMealPlan[day][mealType.toLowerCase()] = recipe;
        });
      });
      
      setMealPlan(currentMealPlan);
    } catch (error) {
      console.error("Error fetching meal plan:", error);
    }
  };

  // Handle drag start
  const handleDragStart = (recipe) => {
    setSelectedRecipe(recipe);
  };

  // Handle drag over
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Handle drop
  const handleDrop = async (e, dropDay, dropMealType) => {
    e.preventDefault();
    if (selectedRecipe) {
      // Update local state
      setMealPlan(prevPlan => ({
        ...prevPlan,
        [dropDay]: {
          ...prevPlan[dropDay],
          [dropMealType]: selectedRecipe
        }
      }));

      // Save to Firebase
      try {
        await addDoc(collection(db, "mealPlans"), {
          userId: user.uid,
          recipe: selectedRecipe,
          days: [dropDay],
          mealType: dropMealType,
          createdAt: new Date()
        });
      } catch (error) {
        console.error("Error saving meal plan:", error);
      }

      setSelectedRecipe(null);
    }
  };

  // Add new recipe
  const handleAddRecipe = async (e) => {
    e.preventDefault();
    if (!recipeName || !recipeCategory) return;

    const newRecipe = {
      id: Date.now(),
      name: recipeName,
      category: recipeCategory,
      userId: user.uid
    };

    try {
      // Save to Firebase
      const docRef = await addDoc(collection(db, "userRecipes"), newRecipe);
      newRecipe.id = docRef.id;
      
      // Update local state
      setRecipes(prev => [...prev, newRecipe]);
      setRecipeName('');
      setRecipeCategory('');
    } catch (error) {
      console.error("Error adding recipe:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Weekly Meal Planner</h1>

      {/* Add Recipe Form */}
      <div className="mb-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Add New Recipe</h2>
        <form onSubmit={handleAddRecipe} className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Recipe Name"
            value={recipeName}
            onChange={(e) => setRecipeName(e.target.value)}
            className="flex-1 border rounded p-2"
            required
          />
          <input
            type="text"
            placeholder="Category"
            value={recipeCategory}
            onChange={(e) => setRecipeCategory(e.target.value)}
            className="flex-1 border rounded p-2"
            required
          />
          <button 
            type="submit" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded transition-colors"
          >
            Add Recipe
          </button>
        </form>
      </div>

      {/* Recipe List */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Recipes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              draggable
              onDragStart={() => handleDragStart(recipe)}
              className="bg-white rounded-lg shadow-md p-4 cursor-move hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold mb-2">{recipe.name}</h3>
              <span className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded">
                {recipe.category}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Meal Plan Calendar */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {Object.entries(mealPlan).map(([dayOfWeek, meals]) => (
          <div key={dayOfWeek} className="border rounded-lg p-4 bg-white shadow-sm">
            <h3 className="font-bold text-lg mb-4 text-center">{dayOfWeek}</h3>
            {Object.entries(meals).map(([meal, recipe]) => (
              <div
                key={meal}
                className="border rounded p-3 mb-3 min-h-[80px] transition-colors hover:bg-gray-50"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, dayOfWeek, meal)}
              >
                <div className="text-sm font-medium text-gray-500 mb-1 capitalize">
                  {meal}
                </div>
                {recipe ? (
                  <div>
                    <div className="font-medium">{recipe.name}</div>
                    <div className="text-sm text-gray-500">
                      {recipe.category}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-400 italic">
                    Drag a recipe here
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealPlanner;
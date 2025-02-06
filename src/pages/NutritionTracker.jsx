import React, { useState, useEffect } from "react";
import { useAuth } from "../Auth/AuthContext";
import { db } from "../Auth/firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { PlusCircle, Trash2, Search } from "lucide-react";

export default function NutritionTracker() {
  const { user } = useAuth();
  const [loggedMeals, setLoggedMeals] = useState([]);
  const [newMeal, setNewMeal] = useState({
    name: "",
    calories: "",
    carbs: "",
    protein: "",
    fat: "",
  });
  const [search, setSearch] = useState("");
  const [totalCalories, setTotalCalories] = useState(0);
  const [totalCarbs, setTotalCarbs] = useState(0);
  const [totalProtein, setTotalProtein] = useState(0);
  const [totalFat, setTotalFat] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (user) {
      fetchLoggedMeals();
    }
  }, [user]);

  const fetchLoggedMeals = async () => {
    if (!user) return;
    setLoading(true);
    setHasError(false);
    try {
      const mealRef = collection(db, "nutritionTracker");
      const querySnapshot = await getDocs(mealRef);
      const meals = [];
      querySnapshot.forEach((docSnap) => {
        meals.push({ id: docSnap.id, ...docSnap.data() });
      });

      // Filter meals based on search
      let filteredMeals = meals;
      if (search) {
        filteredMeals = meals.filter((meal) =>
          meal.name.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Update logged meals
      setLoggedMeals(filteredMeals);

      // Update nutritional summary
      let calories = 0;
      let carbs = 0;
      let protein = 0;
      let fat = 0;
      filteredMeals.forEach((meal) => {
        calories += parseFloat(meal.calories);
        carbs += parseFloat(meal.carbs);
        protein += parseFloat(meal.protein);
        fat += parseFloat(meal.fat);
      });

      setTotalCalories(calories);
      setTotalCarbs(carbs);
      setTotalProtein(protein);
      setTotalFat(fat);
    } catch (error) {
      setHasError(true);
      console.error("Error fetching logged meals:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMeal = async () => {
    if (
      !newMeal.name ||
      !newMeal.calories ||
      !newMeal.carbs ||
      !newMeal.protein ||
      !newMeal.fat
    ) {
      alert("Please fill out all fields.");
      return;
    }

    await addMeal(newMeal);
    setNewMeal({
      name: "",
      calories: "",
      carbs: "",
      protein: "",
      fat: "",
    });
  };

  const addMeal = async (meal) => {
    const mealRef = collection(db, "nutritionTracker");
    try {
      await addDoc(mealRef, {
        userId: user.uid,
        ...meal,
      });
      fetchLoggedMeals(); // Refresh meal list after adding a new one
    } catch (error) {
      console.error("Error adding meal:", error);
    }
  };

  const handleDeleteMeal = async (mealId) => {
    try {
      const mealDoc = doc(db, "nutritionTracker", mealId);
      await deleteDoc(mealDoc);
      fetchLoggedMeals(); // Refresh meal list after deletion
    } catch (error) {
      console.error("Error deleting meal:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Nutrition Tracker Form */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Log Your Meals</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Meal Name"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={newMeal.name}
              onChange={(e) =>
                setNewMeal({ ...newMeal, name: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Calories"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={newMeal.calories}
              onChange={(e) =>
                setNewMeal({ ...newMeal, calories: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Carbs (g)"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={newMeal.carbs}
              onChange={(e) =>
                setNewMeal({ ...newMeal, carbs: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Protein (g)"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={newMeal.protein}
              onChange={(e) =>
                setNewMeal({ ...newMeal, protein: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Fat (g)"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={newMeal.fat}
              onChange={(e) =>
                setNewMeal({ ...newMeal, fat: e.target.value })
              }
            />
            <button
              onClick={handleAddMeal}
              className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <PlusCircle size={20} /> Add Meal
            </button>
          </div>
        </div>

        {/* Loading and Error States */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : hasError ? (
          <div className="text-center text-red-500 py-12 bg-red-50 rounded-lg">
            <p className="text-lg font-medium">Error fetching meals</p>
            <p className="text-sm mt-2">Please try again later</p>
          </div>
        ) : (
          <>
            {/* Meals List */}
            <div className="space-y-6">
              {loggedMeals.map((meal) => (
                <div
                  key={meal.id}
                  className="bg-white rounded-xl shadow-md p-6 flex justify-between items-center"
                >
                  <div>
                    <h3 className="text-xl font-bold">{meal.name}</h3>
                    <p className="text-sm text-gray-600">{meal.calories} Calories</p>
                  </div>
                  <div>
                    <button
                      onClick={() => handleDeleteMeal(meal.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Nutritional Summary */}
            <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-bold">Daily Nutritional Summary</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Calories</p>
                  <p className="text-lg font-bold">{totalCalories} kcal</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Carbs</p>
                  <p className="text-lg font-bold">{totalCarbs} g</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Protein</p>
                  <p className="text-lg font-bold">{totalProtein} g</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Fat</p>
                  <p className="text-lg font-bold">{totalFat} g</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

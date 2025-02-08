import React, { useState, useEffect } from "react";
import { useAuth } from "../Auth/AuthContext";
import { db } from "../Auth/firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where
} from "firebase/firestore";
import { PlusCircle, Trash2 } from "lucide-react";
import { useTheme } from '../contexts/ThemeContext';
import axios from 'axios';
import { LineChart, Line, AreaChart, Area, RadialBarChart , RadialBar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
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
  const [generating, setGenerating] = useState(false);
  const { darkMode } = useTheme();

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

      // Create a query to fetch only meals for the logged-in user
      const q = query(mealRef, where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const meals = [];
      querySnapshot.forEach((docSnap) => {
        meals.push({ id: docSnap.id, ...docSnap.data() });
      });

      let filteredMeals = meals;
      if (search) {
        filteredMeals = meals.filter((meal) =>
          meal.name.toLowerCase().includes(search.toLowerCase())
        );
      }

      setLoggedMeals(filteredMeals);

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
        userId: user.uid,  // Store the user ID along with the meal data
        ...meal,
      });
      fetchLoggedMeals();
    } catch (error) {
      console.error("Error adding meal:", error);
    }
  };

  const handleDeleteMeal = async (mealId) => {
    try {
      const mealDoc = doc(db, "nutritionTracker", mealId);
      await deleteDoc(mealDoc);
      fetchLoggedMeals();
    } catch (error) {
      console.error("Error deleting meal:", error);
    }
  };

  // Fetch nutrition info from API
  const fetchNutritionInfo = async (foodInput) => {
    setGenerating(true);
    try {
      const apiKey = "1+Z7o7eAPhjxxYwGH8i3rg==yEKe8xemDLbuiwFn"; // **REPLACE WITH YOUR ACTUAL API KEY**
      const apiUrl = `https://api.calorieninjas.com/v1/nutrition?query=${foodInput}`;

      const response = await axios.get(apiUrl, {
        headers: {
          "X-Api-Key": apiKey,
        },
      });

      if (response.data.items && response.data.items.length > 0) {
        const foodData = response.data.items[0];
        setNewMeal({
          ...newMeal,
          name: foodInput,
          calories: foodData.calories,
          carbs: foodData.carbohydrates_total_g,
          protein: foodData.protein_g,
          fat: foodData.fat_total_g,
        });
      } else {
        alert("No nutrition information found for that food.");
      }
    } catch (err) {
      console.error("Error fetching nutrition data:", err);
      alert("Error fetching data. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const prepareChartData = () => {
    return loggedMeals.map(meal => ({
      name: meal.name,
      calories: parseFloat(meal.calories),
      protein: parseFloat(meal.protein),
      carbs: parseFloat(meal.carbs),
      fat: parseFloat(meal.fat)
    }));
  };

  const prepareMacroData = () => {
    return [
      {
        name: 'Protein',
        value: totalProtein,
        fill: '#0088FE'
      },
      {
        name: 'Carbs',
        value: totalCarbs,
        fill: '#00C49F'
      },
      {
        name: 'Fat',
        value: totalFat,
        fill: '#FFBB28'
      }
    ];
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`rounded-xl shadow-md p-6 mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className="text-2xl font-bold mb-6">Log Your Meals</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Meal Name"
              className={`w-full p-3 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} rounded-lg focus:ring-2 focus:ring-blue-500`}
              value={newMeal.name}
              onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
            />
            <button
              onClick={() => fetchNutritionInfo(newMeal.name)}
              className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
              disabled={generating}
            >
              {generating ? "Fetching..." : "Get Nutrition Info"}
            </button>
            <input
              type="number"
              placeholder="Calories"
              className={`w-full p-3 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} rounded-lg focus:ring-2 focus:ring-blue-500`}
              value={newMeal.calories}
              onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })}
            />
            <input
              type="number"
              placeholder="Carbs (g)"
              className={`w-full p-3 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} rounded-lg focus:ring-2 focus:ring-blue-500`}
              value={newMeal.carbs}
              onChange={(e) => setNewMeal({ ...newMeal, carbs: e.target.value })}
            />
            <input
              type="number"
              placeholder="Protein (g)"
              className={`w-full p-3 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} rounded-lg focus:ring-2 focus:ring-blue-500`}
              value={newMeal.protein}
              onChange={(e) => setNewMeal({ ...newMeal, protein: e.target.value })}
            />
            <input
              type="number"
              placeholder="Fat (g)"
              className={`w-full p-3 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} rounded-lg focus:ring-2 focus:ring-blue-500`}
              value={newMeal.fat}
              onChange={(e) => setNewMeal({ ...newMeal, fat: e.target.value })}
            />
            <button
              onClick={handleAddMeal}
              className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <PlusCircle size={20} /> Add Meal
            </button>
          </div>
        </div>

        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : hasError ? (
          <div className={`text-center py-12 ${darkMode ? 'bg-red-900 text-red-300' : 'bg-red-50 text-red-500'} rounded-lg`}>
            <p className="text-lg font-medium">Error fetching meals</p>
            <p className="text-sm mt-2">Please try again later</p>
          </div>
        ) : (
          <>
            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Calorie Trend Chart */}
              <div className={`rounded-xl shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h3 className="text-xl font-bold mb-4">Calorie Intake Trend</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={prepareChartData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                      <XAxis dataKey="name" stroke={darkMode ? '#9CA3AF' : '#4B5563'} />
                      <YAxis stroke={darkMode ? '#9CA3AF' : '#4B5563'} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                          border: 'none',
                          borderRadius: '8px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="calories" stroke="#3B82F6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Macronutrient Distribution Chart */}
              <div className={`rounded-xl shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h3 className="text-xl font-bold mb-4">Macronutrient Distribution</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart 
                      innerRadius="30%" 
                      outerRadius="100%" 
                      data={prepareMacroData()} 
                      startAngle={180} 
                      endAngle={0}
                    >
                      <RadialBar
                        minAngle={15}
                        background
                        clockWise={true}
                        dataKey="value"
                        cornerRadius={10}
                      />
                      <Legend 
                        iconSize={10}
                        layout="vertical"
                        verticalAlign="middle"
                        align="right"
                      />
                      <Tooltip />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Nutrient Breakdown Area Chart */}
              <div className={`rounded-xl shadow-md p-6 lg:col-span-2 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h3 className="text-xl font-bold mb-4">Nutrient Breakdown</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={prepareChartData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                      <XAxis dataKey="name" stroke={darkMode ? '#9CA3AF' : '#4B5563'} />
                      <YAxis stroke={darkMode ? '#9CA3AF' : '#4B5563'} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                          border: 'none',
                          borderRadius: '8px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Legend />
                      <Area type="monotone" dataKey="protein" stackId="1" stroke="#0088FE" fill="#0088FE" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="carbs" stackId="1" stroke="#00C49F" fill="#00C49F" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="fat" stackId="1" stroke="#FFBB28" fill="#FFBB28" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

           


            <div className={`mt-8 rounded-xl shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className="text-xl font-bold">Daily Nutritional Summary</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                <div className="text-center">
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Calories</p>
                  <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-black'}`}>{totalCalories} kcal</p>
                </div>
                <div className="text-center">
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Carbs</p>
                  <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-black'}`}>{totalCarbs} g</p>
                </div>
                <div className="text-center">
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Protein</p>
                  <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-black'}`}>{totalProtein} g</p>
                </div>
                <div className="text-center">
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Fat</p>
                  <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-black'}`}>{totalFat} g</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

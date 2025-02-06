import React, { useState, useEffect } from 'react';
import { useAuth } from '../Auth/AuthContext';
import { Link } from 'react-router-dom';
import { Menu, Search, Bell, User, Calendar, BookOpen, Flame,  BarChart2, Heart, ChevronRight, Star, ArrowRight } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { db } from "../Auth/firebase";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('all');
  const { user } = useAuth();
  const [dailyNutrition, setDailyNutrition] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state


  useEffect(() => {
    const fetchDailyNutrition = async () => {
      if (!user) return;

      setLoading(true);
      setError(null); // Clear any previous errors

      try {
        const mealRef = collection(db, "nutritionTracker");
        const q = query(mealRef, where("userId", "==", user.uid)); // Query for the user's meals

        const querySnapshot = await getDocs(q);
        let calories = 0;
        let protein = 0;
        let carbs = 0;
        let fat = 0;

        querySnapshot.forEach((doc) => {
          const mealData = doc.data();
          calories += parseFloat(mealData.calories || 0); // Handle potential missing data
          protein += parseFloat(mealData.protein || 0);
          carbs += parseFloat(mealData.carbs || 0);
          fat += parseFloat(mealData.fat || 0);
        });

        setDailyNutrition({ calories, protein, carbs, fat });
      } catch (err) {
        console.error("Error fetching nutrition data:", err);
        setError("Error fetching nutrition data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDailyNutrition();
  }, [user]);


  const nutritionChartData = {
    labels: ['Calories', 'Protein', 'Carbs', 'Fat'],
    datasets: [
      {
        label: 'Daily Intake',
        data: [dailyNutrition.calories, dailyNutrition.protein, dailyNutrition.carbs, dailyNutrition.fat],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const nutritionChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' ,
      },
      title: {
        display: true,
        text: 'Daily Nutrition Breakdown',
      },
    },
  };
  const motivationalQuotes = [ // New: Motivational quotes
    "The only bad workout is the one that didn't happen.",
    "Strive for progress, not perfection.",
    "Every accomplishment starts with the decision to try.",
    "Believe you can and you're halfway there.",
  ];

  const [currentQuote, setCurrentQuote] = useState(motivationalQuotes[0]);

  useEffect(() => {
    // Set a random quote every few seconds (e.g., 5 seconds)
    const quoteInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
      setCurrentQuote(motivationalQuotes[randomIndex]);
    }, 5000); // 5000 milliseconds = 5 seconds

    return () => clearInterval(quoteInterval); // Clear interval on component unmount
  }, []);
  return (
    <div className="max-w-6xl mx-auto p-4 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h1 className="text-3xl font-bold mb-4">Welcome, {user?.username || "User"}!</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6"> {/* Keep the 3-column grid */}

        {/* Navigation Links (col-span-1 each on medium screens and above) */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow md:col-span-1">
          <Link to="/meal-planner">
            <Calendar className="w-12 h-12 mb-2 text-blue-500" />
            <h2 className="text-xl font-bold mb-2">Meal Planner</h2>
            <p className="text-gray-600 text-center">Plan your weekly meals</p>
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow md:col-span-1">
          <Link to="/recipes">
            <BookOpen className="w-12 h-12 mb-2 text-green-500" />
            <h2 className="text-xl font-bold mb-2">Recipe Database</h2>
            <p className="text-gray-600 text-center">Browse and search recipes</p>
          </Link>
        </div>

        {/* Nutrition Tracking Section (Takes full width) */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow md:col-span-3"> {/* col-span-3 */}
          <h2 className="text-xl font-bold mb-4">Nutrition Tracking</h2>
          {loading ? (
            <div className="text-center">Loading nutrition data...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <div>
              <div className="mb-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* ... (nutrition value display - same as before) */}
                </div>
              </div>
              <div className="mt-4">
                <Bar options={nutritionChartOptions} data={nutritionChartData} />
              </div>
            </div>
          )}
        </div>
        </div>
<br />
        {/* Motivational Quote Section (col-span-1) */}
        <div className="bg-gradient-to-r from-indigo-500/50 via-purple-500/50 to-pink-500/50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow relative overflow-hidden md:col-span-1"> {/* Added col-span */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <h2 className="text-xl font-bold mb-4 text-white relative z-10">Motivation</h2>
          <p className="text-2xl italic text-white relative z-10 animate-pulse">"{currentQuote}"</p>
          <Flame className="w-16 h-16 text-yellow-300 absolute bottom-4 right-4 opacity-70 animate-bounce" />
        </div>


      {/* End of grid */}
    </div>
  );
}
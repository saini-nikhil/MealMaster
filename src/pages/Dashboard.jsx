import React, { useState, useEffect } from 'react';
import { useAuth } from '../Auth/AuthContext';
import { Link } from 'react-router-dom';
import { Calendar, BookOpen, Flame } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { db } from "../Auth/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useTheme } from '../contexts/ThemeContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const { user } = useAuth();
  const [dailyNutrition, setDailyNutrition] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const motivationalQuotes = [
    "The only bad workout is the one that didn't happen.",
    "Strive for progress, not perfection.",
    "Every accomplishment starts with the decision to try.",
    "Believe you can and you're halfway there.",
  ];
  const [currentQuote, setCurrentQuote] = useState(motivationalQuotes[0]);
  const { darkMode } = useTheme();

  useEffect(() => {
    const fetchDailyNutrition = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const mealRef = collection(db, "nutritionTracker");
        const q = query(mealRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        let calories = 0;
        let protein = 0;
        let carbs = 0;
        let fat = 0;
        querySnapshot.forEach((doc) => {
          const mealData = doc.data();
          calories += parseFloat(mealData.calories || 0);
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

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
      setCurrentQuote(motivationalQuotes[randomIndex]);
    }, 5000);
    return () => clearInterval(quoteInterval);
  }, []);

  const nutritionChartData = {
    labels: ['Calories', 'Protein', 'Carbs', 'Fat'],
    datasets: [
      {
        label: 'Daily Intake',
        data: [dailyNutrition.calories, dailyNutrition.protein, dailyNutrition.carbs, dailyNutrition.fat],
        backgroundColor: darkMode
          ? ['rgba(255, 99, 132, 0.7)', 'rgba(54, 162, 235, 0.7)', 'rgba(255, 206, 86, 0.7)', 'rgba(75, 192, 192, 0.7)']
          : ['rgba(255, 99, 132, 0.5)', 'rgba(54, 162, 235, 0.5)', 'rgba(255, 206, 86, 0.5)', 'rgba(75, 192, 192, 0.5)'],
        borderColor: darkMode
          ? ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)']
          : ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const nutritionChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: darkMode ? '#f5f5f5' : '#333',
        },
      },
      title: {
        display: true,
        text: 'Daily Nutrition Breakdown',
        color: darkMode ? '#f5f5f5' : '#333',
      },
    },
    scales: {
      x: {
        ticks: {
          color: darkMode ? '#f5f5f5' : '#333',
        },
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
      y: {
        ticks: {
          color: darkMode ? '#f5f5f5' : '#333',
        },
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  return (
    <div className={`p-4 min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <h1 className="text-3xl font-bold mb-4">Welcome, {user?.username || "User"}!</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow ${darkMode ? 'bg-gray-800' : 'bg-white'} md:col-span-1`}>
          <Link to="/meal-planner">
            <Calendar className="w-12 h-12 mb-2 text-blue-500" />
            <h2 className="text-xl font-bold mb-2">Meal Planner</h2>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Plan your weekly meals</p>
          </Link>
        </div>
        <div className={`p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow ${darkMode ? 'bg-gray-800' : 'bg-white'} md:col-span-1`}>
          <Link to="/recipes">
            <BookOpen className="w-12 h-12 mb-2 text-green-500" />
            <h2 className="text-xl font-bold mb-2">Recipe Database</h2>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Browse and search recipes</p>
          </Link>
        </div>
        <div className={`p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow ${darkMode ? 'bg-gray-800' : 'bg-white'} md:col-span-3`}>
          <h2 className="text-xl font-bold mb-4">Nutrition Tracking</h2>
          {loading ? (
            <div className="text-center">Loading nutrition data...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <div>
              <div className="mb-4">
                <div className="grid grid-cols-2 gap-4"></div>
              </div>
              <div className="mt-4">
                <Bar options={nutritionChartOptions} data={nutritionChartData} />
              </div>
            </div>
          )}
        </div>
      </div>
      <br />
      <div className="bg-gradient-to-r from-indigo-500/50 via-purple-500/50 to-pink-500/50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow relative overflow-hidden md:col-span-1">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        <h2 className="text-xl font-bold mb-4 text-white relative z-10">Motivation</h2>
        <p className="text-2xl italic text-white relative z-10 animate-pulse">"{currentQuote}"</p>
        <Flame className="w-16 h-16 text-yellow-300 absolute bottom-4 right-4 opacity-70 animate-bounce" />
      </div>
    </div>
  );
}
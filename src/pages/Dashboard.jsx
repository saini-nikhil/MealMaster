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

  // Sample recipe data (replace with your actual data fetching)
  const popularRecipes = [
    { id: 1, name: 'Quinoa Buddha Bowl', category: 'lunch', rating: 4.8, calories: 450, protein: 20, carbs: 60, fat: 15, time: '25 min' },
    { id: 2, name: 'Berry Smoothie Bowl', category: 'breakfast', rating: 4.9, calories: 320, protein: 10, carbs: 50, fat: 5, time: '10 min' },
    { id: 3, name: 'Grilled Salmon Salad', category: 'dinner', rating: 4.7, calories: 520, protein: 40, carbs: 20, fat: 30, time: '30 min' }
  ];

  // Sample nutrition logging (replace with your actual data fetching/logging)
  useEffect(() => {
    // In a real app, you'd fetch the user's logged food data for the current day.
    // For this example, we'll simulate logging some of the popular recipes.

    const todayMeals = [popularRecipes[0], popularRecipes[2]]; // Logged meals for today
    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fat = 0;

    todayMeals.forEach(meal => {
      calories += meal.calories;
      protein += meal.protein;
      carbs += meal.carbs;
      fat += meal.fat;
    });

    setDailyNutrition({ calories, protein, carbs, fat });
  }, []); // Empty dependency array ensures this runs only once on mount (for the initial day's data)


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
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Welcome, {user?.username || "User"}!</h1> {/* Handle potential null user */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/meal-planner" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-center justify-center"> {/* Center content */}
            <Calendar className="w-12 h-12 mb-2 text-blue-500" /> {/* Add icon */}
            <h2 className="text-xl font-bold mb-2">Meal Planner</h2>
            <p className="text-gray-600 text-center">Plan your weekly meals</p> {/* Center text */}
          </Link>

          <Link to="/recipes" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-center justify-center"> {/* Center content */}
            <BookOpen className="w-12 h-12 mb-2 text-green-500" /> {/* Add icon */}
            <h2 className="text-xl font-bold mb-2">Recipe Database</h2>
            <p className="text-gray-600 text-center">Browse and search recipes</p> {/* Center text */}
          </Link>

        {/* Nutrition Tracking Section */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-bold mb-4">Nutrition Tracking</h2>
          <div className="mb-4">
            <p>Calories: {dailyNutrition.calories}</p>
            <p>Protein: {dailyNutrition.protein}g</p>
            <p>Carbs: {dailyNutrition.carbs}g</p>
            <p>Fat: {dailyNutrition.fat}g</p>
          </div>
          <Bar options={nutritionChartOptions} data={nutritionChartData} />
        </div>

        {/* Motivational Quote Section */}
        
      </div>
     
      <div className="bg-gradient-to-r from-indigo-500/50 via-purple-500/50 to-pink-500/50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow relative overflow-hidden"> {/* Gradient background */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div> {/* Subtle overlay for texture */}
        <h2 className="text-xl font-bold mb-4 text-white relative z-10">Motivation</h2> {/* White text, bring to front */}
        <p className="text-2xl italic text-white relative z-10 animate-pulse">"{currentQuote}"</p> {/* Larger text, white, pulse animation */}
        <Flame className="w-16 h-16 text-yellow-300 absolute bottom-4 right-4 opacity-70 animate-bounce" /> {/* Flame icon, positioned, animated */}
      </div>
    </div>
  );
}
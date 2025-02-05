import React from 'react';
import { useAuth } from '../Auth/AuthContext';
import { Link } from 'react-router-dom';
import { Menu, Search, Bell, User, Calendar, BookOpen, BarChart2, Heart, ChevronRight, Star, ArrowRight } from 'lucide-react';
import { useState } from 'react';



export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('all');

  const { user } = useAuth();
  const popularRecipes = [
    { id: 1, name: 'Quinoa Buddha Bowl', category: 'lunch', rating: 4.8, calories: 450, time: '25 min' },
    { id: 2, name: 'Berry Smoothie Bowl', category: 'breakfast', rating: 4.9, calories: 320, time: '10 min' },
    { id: 3, name: 'Grilled Salmon Salad', category: 'dinner', rating: 4.7, calories: 520, time: '30 min' }
  ];


  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Welcome, {user.username}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/meal-planner">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-bold mb-2">Meal Planner</h2>
            <p className="text-gray-600">Plan your weekly meals</p>
          </div>
        </Link>
        <Link to="/recipes">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-bold mb-2">Recipe Database</h2>
            <p className="text-gray-600">Browse and search recipes</p>
          </div>
        </Link>
      </div>

      


    </div>
  );
}


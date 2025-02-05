import React from 'react';
import { useAuth } from '../Auth/AuthContext';
import { Link } from 'react-router-dom';


export default function Dashboard() {
  const { user } = useAuth();

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
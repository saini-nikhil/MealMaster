import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Auth/AuthContext';
import Navbar from './pages/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import MealPlanner from './pages/MealPlanner';
import Recipes from './pages/Recipes';
import ProtectedRoute from './pages/ProtectedRoute';
import NutritionTracker from './pages/NutritionTracker';
import Homepage from './pages/Homepage';
import FavRecipes from './pages/MyFavRecipes';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navbar/>
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Homepage />} />

              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/meal-planner" element={
                <ProtectedRoute>
                  <MealPlanner />
                </ProtectedRoute>
              } />
              <Route path="/recipes" element={
                <ProtectedRoute>
                  <Recipes />
                </ProtectedRoute>
              } />
              <Route path="/NutritionTracker" element={
                <ProtectedRoute>
                  <NutritionTracker />
                </ProtectedRoute>
              } />
              <Route path="/FavRecipes" element={
                <ProtectedRoute>
                  <FavRecipes />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

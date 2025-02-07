import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Auth/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './pages/Navbar';
import Footer from './pages/Footer';
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
import Community from './pages/Community';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Navbar />
          <div >
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Homepage />} />
              <Route path="/community" element={<Community />} />

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
          <Footer />
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
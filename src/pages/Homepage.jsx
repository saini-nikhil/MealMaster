// import React from "react";
// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import { ShoppingCart, AlarmClock, Utensils, Dumbbell, Users, BrainCircuit } from "lucide-react";

// export default function Homepage() {
//   return (
//     <div className="bg-gray-100 min-h-screen">
//       {/* Hero Section */}
//       <section className="relative text-center py-20 bg-gradient-to-r from-green-400 to-blue-500 text-white">
//         <motion.h1
//           className="text-4xl md:text-5xl font-bold mt-4"
//           initial={{ opacity: 0, x: -50 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 1 }}
//         >
//           Smart Meal Planning, Simplified
//         </motion.h1>
//         <motion.p
//           className="text-lg md:text-xl mt-3"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 1.2 }}
//         >
//           Plan your meals, track nutrition, and simplify your grocery shopping.
//         </motion.p>
//         <Link to="/login">
//           <motion.button
//             className="mt-6 px-6 py-3 bg-white text-green-600 font-bold rounded-lg shadow-lg hover:bg-gray-100 transition"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             Get Started
//           </motion.button>
//         </Link>
//       </section>

//       {/* Features Section */}
//       <section className="max-w-6xl mx-auto py-16 px-6 grid md:grid-cols-3 gap-8">
//         {features.map((feature, index) => (
//           <motion.div
//             key={index}
//             className="bg-white p-6 rounded-xl shadow-lg text-center"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, delay: index * 0.2 }}
//           >
//             <feature.icon className="w-12 h-12 mx-auto text-green-500 mb-4" />
//             <h2 className="text-xl font-bold mb-2">{feature.title}</h2>
//             <p className="text-gray-600">{feature.description}</p>
//           </motion.div>
//         ))}
//       </section>
//     </div>
//   );
// }

// // Features List
// const features = [
//   {
//     title: "Meal Plan Creation",
//     description: "Drag & drop meals into a weekly planner and save favorites.",
//     icon: Utensils,
//   },
//   {
//     title: "Grocery List Generator",
//     description: "Auto-generate shopping lists based on your meal plan.",
//     icon: ShoppingCart,
//   },
//   {
//     title: "Meal Prep Reminders",
//     description: "Get alerts when it's time to cook or marinate ingredients.",
//     icon: AlarmClock,
//   },
//   {
//     title: "Calorie & Macro Goals",
//     description: "Track your daily intake with real-time progress updates.",
//     icon: Dumbbell,
//   },
//   {
//     title: "AI-Based Meal Suggestions",
//     description: "Smart meal recommendations based on your preferences.",
//     icon: BrainCircuit,
//   },
//   {
//     title: "Community Recipes",
//     description: "Share and discover new meals from the MealMaster community.",
//     icon: Users,
//   },
// ];


import React, { useState } from 'react';
import { Menu, Search, Bell, User, Calendar, BookOpen, BarChart2, Heart, ChevronRight, Star, ArrowRight } from 'lucide-react';

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('all');

  const popularRecipes = [
    { id: 1, name: 'Quinoa Buddha Bowl', category: 'lunch', rating: 4.8, calories: 450, time: '25 min' },
    { id: 2, name: 'Berry Smoothie Bowl', category: 'breakfast', rating: 4.9, calories: 320, time: '10 min' },
    { id: 3, name: 'Grilled Salmon Salad', category: 'dinner', rating: 4.7, calories: 520, time: '30 min' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-green-600">MealMaster</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="flex items-center text-gray-700 hover:text-green-600 transition-colors">
                <Calendar className="w-5 h-5 mr-1" />
                Meal Plans
              </a>
              <a href="#" className="flex items-center text-gray-700 hover:text-green-600 transition-colors">
                <BookOpen className="w-5 h-5 mr-1" />
                Recipes
              </a>
              <a href="#" className="flex items-center text-gray-700 hover:text-green-600 transition-colors">
                <BarChart2 className="w-5 h-5 mr-1" />
                Nutrition
              </a>
              <a href="#" className="flex items-center text-gray-700 hover:text-green-600 transition-colors">
                <Heart className="w-5 h-5 mr-1" />
                Favorites
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search recipes..." 
                  className="w-48 pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
              <button className="p-2 text-gray-600 hover:text-green-600 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-green-600 transition-colors">
                <User className="w-5 h-5" />
              </button>
              <button className="md:hidden p-2 text-gray-600">
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-500 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6">
                Eat Healthy,
                <br />
                Live Better
              </h1>
              <p className="text-xl mb-8 text-green-50">
                Transform your eating habits with personalized meal plans, nutrition tracking, 
                and thousands of healthy recipes at your fingertips.
              </p>
              <div className="space-x-4">
                <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-medium hover:bg-green-50 transition-colors">
                  Start Free Trial
                </button>
                <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-green-600 transition-colors">
                  Watch Demo
                </button>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 mt-12">
                <div>
                  <div className="text-3xl font-bold">1000+</div>
                  <div className="text-green-50">Healthy Recipes</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">50k+</div>
                  <div className="text-green-50">Active Users</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">4.9</div>
                  <div className="text-green-50">User Rating</div>
                </div>
              </div>
            </div>
            
            {/* Hero Image */}
            <div className="relative">
              <img 
                src="/api/placeholder/600/400" 
                alt="Healthy meal preparation" 
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-6 h-6 text-green-600" />
                  <div>
                    <div className="font-medium">Meal Plan Ready!</div>
                    <div className="text-sm text-gray-600">Your weekly plan is set</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get started with MealMaster in three simple steps and transform your eating habits
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <User className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">1. Create Profile</h3>
            <p className="text-gray-600 mb-4">Tell us about your dietary preferences, goals, and restrictions</p>
            <a href="#" className="text-green-600 font-medium flex items-center hover:text-green-700">
              Learn More <ChevronRight className="w-4 h-4 ml-1" />
            </a>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">2. Get Your Plan</h3>
            <p className="text-gray-600 mb-4">Receive personalized meal plans based on your unique profile</p>
            <a href="#" className="text-green-600 font-medium flex items-center hover:text-green-700">
              Learn More <ChevronRight className="w-4 h-4 ml-1" />
            </a>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <BarChart2 className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">3. Track Progress</h3>
            <p className="text-gray-600 mb-4">Monitor your nutrition and adjust your plan as needed</p>
            <a href="#" className="text-green-600 font-medium flex items-center hover:text-green-700">
              Learn More <ChevronRight className="w-4 h-4 ml-1" />
            </a>
          </div>
        </div>
      </div>

      {/* Popular Recipes Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Popular Recipes</h2>
            <div className="flex space-x-4">
              <button 
                className={`px-4 py-2 rounded-lg ${activeTab === 'all' ? 'bg-green-600 text-white' : 'text-gray-600 hover:text-green-600'}`}
                onClick={() => setActiveTab('all')}
              >
                All
              </button>
              <button 
                className={`px-4 py-2 rounded-lg ${activeTab === 'breakfast' ? 'bg-green-600 text-white' : 'text-gray-600 hover:text-green-600'}`}
                onClick={() => setActiveTab('breakfast')}
              >
                Breakfast
              </button>
              <button 
                className={`px-4 py-2 rounded-lg ${activeTab === 'lunch' ? 'bg-green-600 text-white' : 'text-gray-600 hover:text-green-600'}`}
                onClick={() => setActiveTab('lunch')}
              >
                Lunch
              </button>
              <button 
                className={`px-4 py-2 rounded-lg ${activeTab === 'dinner' ? 'bg-green-600 text-white' : 'text-gray-600 hover:text-green-600'}`}
                onClick={() => setActiveTab('dinner')}
              >
                Dinner
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {popularRecipes.map(recipe => (
              <div key={recipe.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <img 
                  src={`/api/placeholder/400/250`}
                  alt={recipe.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{recipe.name}</h3>
                      <span className="inline-block bg-green-100 text-green-600 text-sm px-3 py-1 rounded-full">
                        {recipe.category}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="ml-1 text-gray-600">{recipe.rating}</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-gray-600 mb-4">
                    <span>{recipe.calories} cal</span>
                    <span>{recipe.time}</span>
                  </div>
                  <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
                    View Recipe <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-green-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Health Journey?</h2>
          <p className="text-xl text-green-50 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have transformed their eating habits with MealMaster
          </p>
          <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-medium hover:bg-green-50 transition-colors">
            Get Started Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
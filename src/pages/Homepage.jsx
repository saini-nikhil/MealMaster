import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, AlarmClock, Utensils, Dumbbell, Users, BrainCircuit } from "lucide-react";

export default function Homepage() {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <section className="relative text-center py-20 bg-gradient-to-r from-green-400 to-blue-500 text-white">
        <motion.h1
          className="text-4xl md:text-5xl font-bold mt-4"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          Smart Meal Planning, Simplified
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl mt-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        >
          Plan your meals, track nutrition, and simplify your grocery shopping.
        </motion.p>
        <Link to="/login">
          <motion.button
            className="mt-6 px-6 py-3 bg-white text-green-600 font-bold rounded-lg shadow-lg hover:bg-gray-100 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started
          </motion.button>
        </Link>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto py-16 px-6 grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="bg-white p-6 rounded-xl shadow-lg text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
          >
            <feature.icon className="w-12 h-12 mx-auto text-green-500 mb-4" />
            <h2 className="text-xl font-bold mb-2">{feature.title}</h2>
            <p className="text-gray-600">{feature.description}</p>
          </motion.div>
        ))}
      </section>
    </div>
  );
}

// Features List
const features = [
  {
    title: "Meal Plan Creation",
    description: "Drag & drop meals into a weekly planner and save favorites.",
    icon: Utensils,
  },
  {
    title: "Grocery List Generator",
    description: "Auto-generate shopping lists based on your meal plan.",
    icon: ShoppingCart,
  },
  {
    title: "Meal Prep Reminders",
    description: "Get alerts when it's time to cook or marinate ingredients.",
    icon: AlarmClock,
  },
  {
    title: "Calorie & Macro Goals",
    description: "Track your daily intake with real-time progress updates.",
    icon: Dumbbell,
  },
  {
    title: "AI-Based Meal Suggestions",
    description: "Smart meal recommendations based on your preferences.",
    icon: BrainCircuit,
  },
  {
    title: "Community Recipes",
    description: "Share and discover new meals from the MealMaster community.",
    icon: Users,
  },
];

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { BrainCircuit, Dumbbell, Users, CheckCircle, Quote } from "lucide-react";
import { useAuth } from "../Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTheme } from '../contexts/ThemeContext';

const heroImageUrl = "https://raw.githubusercontent.com/saini-nikhil/MealMaster/main/src/assets/Meal%20Master%20Hero%20Image.svg";

const featureImages = {
  aiMeal: "https://raw.githubusercontent.com/saini-nikhil/MealMaster/main/src/assets/Meal%20Master%20AI%20Meal.svg",
  calorie: "https://raw.githubusercontent.com/saini-nikhil/MealMaster/refs/heads/main/src/assets/Meal%20Master%20Calories.svg",
  community: "https://raw.githubusercontent.com/saini-nikhil/MealMaster/main/src/assets/Meal%20Master%20Community%20Recipes.svg",
  groceryList: "https://raw.githubusercontent.com/saini-nikhil/MealMaster/main/src/assets/Meal%20Master%20Grocery%20List.svg",
  prepReminder: "https://raw.githubusercontent.com/saini-nikhil/MealMaster/main/src/assets/Meal%20Master%20Prep%20Reminder.svg",
  nutritionalAnalysis: "https://raw.githubusercontent.com/saini-nikhil/MealMaster/refs/heads/main/src/assets/Meal%20Master%20Calories.svg"
};

const reviews = [
  { name: "John Doe", text: '"MealMaster changed my life!"', img: "https://randomuser.me/api/portraits/men/45.jpg" },
  { name: "Jane Smith", text: '"AI meal planning saves me so much time!"', img: "https://randomuser.me/api/portraits/women/65.jpg" },
  { name: "Chris Johnson", text: '"The calorie tracking is super useful!"', img: "https://randomuser.me/api/portraits/men/32.jpg" },
  { name: "Emily Davis", text: '"I love the community recipes!"', img: "https://randomuser.me/api/portraits/women/50.jpg" },
  { name: "Michael Brown", text: '"The grocery list generator is a game changer!"', img: "https://randomuser.me/api/portraits/men/30.jpg" }
];

const featuresData = [
  {
    title: "Meal Plan Creation",
    description: "Easily create weekly meal plans tailored to your dietary preferences.",
    img: featureImages.aiMeal,
    icon: <Dumbbell />,
    bullets: [
      "Select recipes from our extensive database.",
      "Input your own recipes for personalized planning.",
      "Drag and drop meals into a calendar view for convenience.",
    ],
  },
  {
    title: "Nutritional Tracking",
    description: "Keep track of your daily nutrition effortlessly.",
    img: featureImages.nutritionalAnalysis,
    icon: <BrainCircuit />,
    bullets: [
      "Log meals manually or search our recipe database.",
      "Get insights into your macro and micronutrient intake.",
      "Monitor your progress towards nutritional goals.",
    ],
    alwaysBlack: true,
  },
  {
    title: "Grocery List Generator",
    description: "Automatically generate a grocery list based on your meal plan.",
    img: featureImages.groceryList,
    icon: <Users />,
    bullets: [
      "Save time by organizing shopping lists by category.",
      "Check off items as you shop for a seamless experience.",
      "Adjust quantities based on your needs.",
    ],
  },
  {
    title: "Meal Prep Reminders",
    description: "Stay organized with reminders for meal prep times.",
    img: featureImages.prepReminder,
    icon: <Users />,
    bullets: [
      "Set reminders for specific meals or prep times.",
      "Adjust reminders based on your schedule.",
      "Never forget a meal prep again!",
    ],
    alwaysBlack: true,
  },
];

export default function Homepage() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  useEffect(() => {
    if (!isLoading && user) {
      navigate("/dashboard");
    }
  }, [user, navigate, isLoading]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} min-h-screen mx-0`}>

      <section className="relative flex flex-col-reverse md:flex-row items-center justify-between px-6 py-20">
        <motion.div
          className="md:w-1/2 text-center md:text-left"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className={`text-4xl md:text-5xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Ready to Simplify Your Mealtime with AI?
          </h1>
          <p className={`mt-4 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Join Meal Master to revolutionize your cooking experience with AI-powered meal planning.
          </p>
          <motion.button
            className="mt-6 px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = "/login"}
          >
            Get Started
          </motion.button>
        </motion.div>

        <motion.div
          className="md:w-1/2 flex justify-center"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <img
            src={heroImageUrl}
            alt="Meal Master Hero"
            className="w-full md:w-4/5"
          />
        </motion.div>
      </section>

      {featuresData.map((feature, index) => (
        <section
          key={index}
          className={`relative flex flex-col md:flex-row items-center justify-between px-6 py-8 ${
            index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
          } ${darkMode ? (index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900') : ''}`}
        >
          <motion.div
            className={`md:w-1/2 flex justify-center mb-4 md:mb-0 ${index % 2 !== 0 ? 'order-first md:order-last' : ''}`}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <img
              src={feature.img}
              alt={feature.title}
              className="w-full h-auto max-w-xs md:max-w-md"
            />
          </motion.div>

          <motion.div
            className="md:w-1/2 text-center md:text-left"
            initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <h2 className={`text-3xl font-bold ${feature.alwaysBlack ? 'text-gray-900' : darkMode ? 'text-white' : 'text-gray-900'} flex items-center`}>
              {feature.icon}
              <span className="ml-2">{feature.title}</span>
            </h2>
            <p className={`mt-4 text-lg ${feature.alwaysBlack ? 'text-gray-700' : darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {feature.description}
            </p>
            {feature.bullets && (
              <ul className="mt-2 list-none">
                {feature.bullets.map((bullet, bulletIndex) => (
                  <li
                    key={bulletIndex}
                    className={`flex items-center ${feature.alwaysBlack ? 'text-gray-600' : darkMode ? 'text-gray-400' : 'text-gray-600'}`}
                  >
                    <CheckCircle className="text-green-600 mr-2" />
                    {bullet}
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        </section>
      ))}

      <section className="max-w-6xl mx-auto py-16 px-6">
        <h2 className={`text-3xl font-bold text-center ${darkMode ? 'text-white' : 'text-gray-900'} mb-8`}>What Our Users Say</h2>
        <div className="grid md:grid-cols-3 gap-8 mt-8">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              className={`p-6 text-center rounded-lg shadow-lg ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
              } transition transform hover:-translate-y-1`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <img
                src={review.img}
                alt={review.name}
                className="w-16 h-16 rounded-full mx-auto mb-4 border border-gray-200 shadow-md"
              />
              <Quote className="text-gray-400 mb-2" />
              <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{review.name}</h3>
              <p className={`mt-2 italic ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{review.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className={`${darkMode ? 'bg-gray-800' : 'bg-green-100'} py-16`}>
        <div className="max-w-xl mx-auto text-center">
          <h2 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Experience the Benefits of MealMaster</h2>
          <p className={`mt-4 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            MealMaster not only simplifies meal planning but also enhances your overall cooking experience:
          </p>
          <ul className="mt-6 list-none mx-auto max-w-md">
            <li className="flex items-center justify-start mb-2">
              <CheckCircle className="text-green-600 mr-2" />
              Save time with effortless meal planning.
            </li>
            <li className="flex items-center justify-start mb-2">
              <CheckCircle className="text-green-600 mr-2" />
              Enjoy personalized meal suggestions.
            </li>
            <li className="flex items-center justify-start mb-2">
              <CheckCircle className="text-green-600 mr-2" />
              Track your nutritional intake easily.
            </li>
            <li className="flex items-center justify-start mb-2">
              <CheckCircle className="text-green-600 mr-2" />
              Connect with a vibrant community of food lovers.
            </li>
          </ul>
          <motion.button
            className="mt-8 px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = "/login"}
          >
            Join Us Now!
          </motion.button>
        </div>
      </section>
    </div>
  );
}
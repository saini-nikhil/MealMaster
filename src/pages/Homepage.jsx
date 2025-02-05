import React from "react";
import { motion } from "framer-motion";
import { BrainCircuit, Dumbbell, Users, CheckCircle, Quote } from "lucide-react"; // Importing icons

//Hero image URL (from your GitHub)
const heroImageUrl = "https://raw.githubusercontent.com/saini-nikhil/MealMaster/main/src/assets/Meal%20Master%20Hero%20Image.svg";

// Feature images
const featureImages = {
  aiMeal: "https://raw.githubusercontent.com/saini-nikhil/MealMaster/main/src/assets/Meal%20Master%20AI%20Meal.svg",
  calorie: "https://raw.githubusercontent.com/saini-nikhil/MealMaster/main/src/assets/Meal%20Master%20Calories.svg",
  community: "https://raw.githubusercontent.com/saini-nikhil/MealMaster/main/src/assets/Meal%20Master%20Community%20Recipes.svg",
  groceryList: "https://raw.githubusercontent.com/saini-nikhil/MealMaster/main/src/assets/Meal%20Master%20Grocery%20List.svg",
  prepReminder: "https://raw.githubusercontent.com/saini-nikhil/MealMaster/main/src/assets/Meal%20Master%20Prep%20Reminder.svg",
  nutritionalAnalysis: "https://raw.githubusercontent.com/saini-nikhil/MealMaster/refs/heads/main/src/assets/Meal%20Master%20Calories.svg"
};


const reviews = [
  { name: "John Doe", text: "“MealMaster changed my life!”", img: "https://randomuser.me/api/portraits/men/45.jpg" },
  { name: "Jane Smith", text: "“AI meal planning saves me so much time!”", img: "https://randomuser.me/api/portraits/women/65.jpg" },
  { name: "Chris Johnson", text: "“The calorie tracking is super useful!”", img: "https://randomuser.me/api/portraits/men/32.jpg" },
  { name: "Emily Davis", text: "“I love the community recipes!”", img: "https://randomuser.me/api/portraits/women/50.jpg" },
  { name: "Michael Brown", text: "“The grocery list generator is a game changer!”", img: "https://randomuser.me/api/portraits/men/30.jpg" }
];

export default function Homepage() {
  return (
    <div className="bg-white min-h-screen mx-0"> {/* Ensuring white background */}
      
      {/* HERO SECTION */}
      <section className="relative flex flex-col-reverse md:flex-row items-center justify-between px-6 py-20">
        <motion.div
          className="md:w-1/2 text-center md:text-left"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Ready to Simplify Your Mealtime with AI?
          </h1>
          <p className="mt-4 text-lg text-gray-700">
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

      {/* ADDITIONAL FEATURES SECTION */}
      {featuresData.map((feature, index) => (
        <section key={index} className={`relative flex ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} items-center justify-between px-6 py-8`}>
          
          <motion.div
            className="md:w-1/2 flex justify-center"
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <img
              src={feature.img}
              alt={feature.title}
              className="w-full md:w-4/5"
            />
          </motion.div>

          <motion.div
            className="md:w-1/2 text-center md:text-left"
            initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 flex items-center">
              {feature.icon} {/* Render icon */}
              <span className="ml-2">{feature.title}</span>
            </h2>
            <p className="mt-4 text-lg text-gray-700">{feature.description}</p>
            {feature.bullets && (
              <ul className="mt-2 list-disc list-inside text-gray-600">
                {feature.bullets.map((bullet, bulletIndex) => (
                  <li key={bulletIndex} className="flex items-center">
                    <CheckCircle className="text-green-600 mr-2" /> {/* Check icon */}
                    {bullet}
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        </section>
      ))}

      {/* USER REVIEWS */}
      <section className="max-w-6xl mx-auto py-16 px-6">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">What Our Users Say</h2>
        <div className="grid md:grid-cols-3 gap-8 mt-8">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              className="p-6 text-center rounded-lg shadow-lg bg-gray-50 hover:bg-gray-100 transition transform hover:-translate-y-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <img src={review.img} alt={review.name} className="w-16 h-16 rounded-full mx-auto mb-4 border border-gray-200 shadow-md" />
              <Quote className="text-gray-400 mb-2" /> {/* Quote icon */}
              <h3 className="font-bold text-gray-900">{review.name}</h3>
              <p className="text-gray-600 mt-2 italic">{review.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/*OVERALL BENEFITS SECTION */}
      <section className="bg-green-100 py-16">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900">Experience the Benefits of MealMaster</h2>
          <p className="mt-4 text-lg text-gray-700">
            MealMaster not only simplifies meal planning but also enhances your overall cooking experience:
          </p>
          <ul className="mt-6 list-disc list-inside text-left mx-auto max-w-md">
            <li>✔️ Save time with effortless meal planning.</li>
            <li>✔️ Enjoy personalized meal suggestions.</li>
            <li>✔️ Track your nutritional intake easily.</li>
            <li>✔️ Connect with a vibrant community of food lovers.</li>
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

// Features Data
const featuresData = [
  {
    title: "Meal Plan Creation",
    description:
      "Easily create weekly meal plans tailored to your dietary preferences.",
    img: featureImages.groceryList,
    icon: <Dumbbell />, // Unique icon for this feature
    bullets: [
      "Select recipes from our extensive database.",
      "Input your own recipes for personalized planning.",
      "Drag and drop meals into a calendar view for convenience."
    ]
  },
  {
    title: "Nutritional Tracking",
    description:
      "Keep track of your daily nutrition effortlessly.",
    img: featureImages.nutritionalAnalysis,
    icon: <BrainCircuit />, // Unique icon for this feature
    bullets: [
      "Log meals manually or search our recipe database.",
      "Get insights into your macro and micronutrient intake.",
      "Monitor your progress towards nutritional goals."
    ]
  },
  {
    title: "Grocery List Generator",
    description:
      "Automatically generate a grocery list based on your meal plan.",
    img: featureImages.groceryList,
    icon: <Users />, // Unique icon for this feature
    bullets: [
      "Save time by organizing shopping lists by category.",
      "Check off items as you shop for a seamless experience.",
      "Adjust quantities based on your needs."
    ]
  },
  {
    title: "Meal Prep Reminders",
    description:
      "Stay organized with reminders for meal prep times.",
    img: featureImages.prepReminder,
    icon: <Users />, // Unique icon for this feature
    bullets: [
      "Set reminders for specific meals or prep times.",
      "Adjust reminders based on your schedule.",
      "Never forget a meal prep again!"
    ]
  },
];
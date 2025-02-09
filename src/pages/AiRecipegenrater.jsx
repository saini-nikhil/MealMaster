import React, { useState } from 'react';
import { MessageCircle, ShoppingCart, ChevronRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key } from '../AiKey/Key';
import { useTheme } from '../contexts/ThemeContext';

const AiRecipegenrater = () => {
  const [message, setMessage] = useState('');
  const [groceryItems, setGroceryItems] = useState([]);
  const [recipe, setRecipe] = useState('');  // New state to store the recipe
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTag, setSelectedTag] = useState('all');
  const [error, setError] = useState(null);
  const { darkMode } = useTheme();

  const API_KEY = Key

  const recipeTags = [
    { id: 'all', label: 'All Recipes', icon: '🍳' },
    { id: 'vegetarian', label: 'Vegetarian', icon: '🥬' },
    { id: 'vegan', label: 'Vegan', icon: '🌱' },
    { id: 'non-veg', label: 'Non-Vegetarian', icon: '🍗' },
    { id: 'gluten-free', label: 'Gluten Free', icon: '🌾' },
    { id: 'dairy-free', label: 'Dairy Free', icon: '🥛🚫' },
    { id: 'keto', label: 'Keto', icon: '🥓' },
    { id: 'mediterranean', label: 'Mediterranean', icon: '🌊' },
    { id: 'paleo', label: 'Paleo', icon: '🍖' },
    { id: 'low-carb', label: 'Low Carb', icon: '🚫🍞' },
    { id: 'quick-meals', label: 'Quick Meals', icon: '⏱' },
    { id: 'soup', label: 'Soup', icon: '🥣' }
  ];

  const callGeminiAI = async (inputMessage) => {
    setIsLoading(true);
    setError(null);
  
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': API_KEY,
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Generate a recipe and grocery list for the following meal plan: ${inputMessage}. 
                       Provide the recipe and the grocery list in the following format:
                       {
                         "recipe": "recipe_instructions_here",
                         "groceryItems": [
                           {
                             "id": "unique_id",
                             "name": "item_name",
                             "category": "item_category",
                             "quantity": "amount_needed",
                             "icon": "emoji_icon"
                           }
                         ]
                       }`
              }]
            }]
          })
        }
      );
  
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
  
      const data = await response.json();
  
      try {
        // Extract the response text and clean up any markdown syntax
        let textResponse = data.candidates[0].content.parts[0].text;
  
        // Remove any backticks (`) or markdown block syntax (e.g., ` ```json `)
        textResponse = textResponse.replace(/```json|```/g, '').trim();
  
        // Now try parsing the cleaned response
        const parsedResponse = JSON.parse(textResponse);
        
        // If successful, set the recipe and grocery items
        setRecipe(parsedResponse.recipe);  // Set the recipe instructions
        setGroceryItems(parsedResponse.groceryItems);  // Set the grocery list items
      } catch (parseError) {
        console.error('Error parsing Gemini response:', parseError);
        setGroceryItems([]);
        setError("Failed to parse response from the API.");
      }
    } catch (error) {
      console.error('Error fetching from Gemini API:', error);
      setGroceryItems([]);
      setError("Sorry, something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim()) {
      await callGeminiAI(message);
    }
  };

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
    <div className={`max-w-4xl mx-auto p-6 space-y-8 ${
      darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'
    }`}>
      {/* Recipe Tags */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {recipeTags.map((tag) => (
          <motion.button
            key={tag.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedTag(tag.id)}
            className={`px-4 py-2 rounded-full flex items-center gap-2 ${
              selectedTag === tag.id
                ? 'bg-blue-500 text-white'
                : darkMode 
                  ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                  : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <span>{tag.icon}</span>
            <span>{tag.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Chat Interface */}
      <div className={`rounded-lg shadow-lg p-6 ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          <MessageCircle className="w-6 h-6" />
          Recipe Assistant
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your recipe or meal plan..."
              className={`w-full p-4 pr-12 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </form>

        {/* Error Message */}
        {error && <p className="text-red-500 mt-4">{error}</p>}

        {/* Recipe Instructions */}
        {recipe && (
          <div className="mt-8">
            <h3 className={`text-xl font-semibold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Recipe Instructions
            </h3>
            <p className={
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }>{recipe}</p>
          </div>
        )}

        {/* Grocery List */}
        <div className="mt-8">
          <h3 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            <ShoppingCart className="w-5 h-5" />
            Your Grocery List
          </h3>

          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : (
            <AnimatePresence>
              <div className="space-y-3">
                {groceryItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`p-4 rounded-lg flex items-center justify-between ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <h4 className={`font-medium ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>{item.name}</h4>
                        <p className={
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }>{item.category}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      darkMode 
                        ? 'bg-blue-900/50 text-blue-200' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {item.quantity}
                    </span>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default AiRecipegenrater;

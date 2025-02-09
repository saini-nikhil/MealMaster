import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, ShoppingCart, ChevronRight, Loader2, Download, Printer, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import html2pdf from 'html2pdf.js';

const GroceryList = () => {
  const [message, setMessage] = useState('');
  const [groceryItems, setGroceryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTag, setSelectedTag] = useState('all');
  const [showRecipes, setShowRecipes] = useState(false);
  const [error, setError] = useState(null);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const groceryListRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.recipe) {
      setMessage(location.state.recipe);
      callGeminiAI(location.state.recipe);
    }
  }, [location.state]);

  const API_KEY = "AIzaSyDtt9iTVZyMWurYKixqAO4CdfzGNFF3N2g"; 

  const recipeTags = [
    { id: 'vegetarian', label: 'Vegetarian', icon: '🥬', recipes: ['Spinach and Ricotta Lasagna', 'Mushroom Risotto', 'Eggplant Parmesan', 'Vegetable Curry', 'Black Bean Burgers'] },
    { id: 'vegan', label: 'Vegan', icon: '🌱', recipes: ['Chickpea Curry', 'Vegan Mac and Cheese', 'Lentil Shepherd\'s Pie', 'Buddha Bowl', 'Cauliflower Wings'] },
    { id: 'non-veg', label: 'Non-Vegetarian', icon: '🍗', recipes: ['Butter Chicken', 'Grilled Salmon', 'BBQ Ribs', 'Roast Chicken', 'Beef Steak'] },
    { id: 'gluten-free', label: 'Gluten Free', icon: '🌾', recipes: ['Quinoa Bowl', 'Zucchini Noodles with Meatballs', 'Rice Paper Rolls', 'Grilled Chicken and Sweet Potato', 'Gluten-Free Pancakes'] },
    { id: 'dairy-free', label: 'Dairy Free', icon: '🥛🚫', recipes: ['Coconut Curry', 'Dairy-Free Smoothie Bowl', 'Grilled Fish Tacos', 'Teriyaki Chicken', 'Tomato Basil Pasta'] },
    { id: 'keto', label: 'Keto', icon: '🥓', recipes: ['Keto Bacon and Eggs', 'Cauliflower Rice Bowl', 'Keto Pizza', 'Butter Chicken (Keto)', 'Zucchini Lasagna'] },
    { id: 'mediterranean', label: 'Mediterranean', icon: '🌊', recipes: ['Greek Salad', 'Grilled Souvlaki', 'Mediterranean Fish', 'Tabbouleh', 'Hummus Platter'] },
    { id: 'paleo', label: 'Paleo', icon: '🍖', recipes: ['Caveman Chicken', 'Sweet Potato Hash', 'Paleo Meatballs', 'Grilled Salmon with Avocado', 'Paleo Breakfast Bowl'] },
    { id: 'low-carb', label: 'Low Carb', icon: '🚫🍞', recipes: ['Cauliflower Mac and Cheese', 'Turkey Lettuce Wraps', 'Low-Carb Chicken Parmesan', 'Egg and Bacon Cups', 'Zucchini Boats'] },
    { id: 'quick-meals', label: 'Quick Meals', icon: '⏱', recipes: ['15-min Stir Fry', 'Quick Quesadillas', 'Instant Pot Soup', '5-Minute Sandwich', 'Microwave Mug Cake'] },
    { id: 'soup', label: 'Soup', icon: '🥣', recipes: ['Tomato Basil Soup', 'Chicken Noodle Soup', 'Butternut Squash Soup', 'Minestrone', 'French Onion Soup'] }
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
                text: `Generate a grocery list for the following recipe or meal plan: ${inputMessage}. 
                       Return the response in JSON format with the following structure:
                       {
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
        // Get the response text from the API
        let textResponse = data.candidates[0].content.parts[0].text;
  
        // Clean up the response by removing backticks or markdown-like syntax
        textResponse = textResponse.replace(/```json|```/g, ''); // Remove markdown syntax like ` ```json `
  
        // Now try parsing the cleaned response
        const parsedResponse = JSON.parse(textResponse);
        setGroceryItems(parsedResponse.groceryItems);
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

  const handleDownloadPDF = async () => {
    const element = groceryListRef.current;
    const opt = {
      margin: 1,
      filename: 'grocery-list.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    try {
      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError('Failed to generate PDF. Please try again.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleTagClick = (tagId) => {
    setSelectedTag(tagId);
    setShowRecipes(true);
  };

  const handleRecipeClick = async (recipe) => {
    setMessage(recipe);
    setShowRecipes(false);
    await callGeminiAI(recipe);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex gap-4 overflow-x-auto pb-4">
        {recipeTags.map((tag) => (
          <motion.button
            key={tag.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleTagClick(tag.id)}
            className={`px-4 py-2 rounded-full flex items-center gap-2 ${
              selectedTag === tag.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <span>{tag.icon}</span>
            <span>{tag.label}</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {showRecipes && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-lg shadow-lg p-6 relative"
          >
            <button
              onClick={() => setShowRecipes(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-semibold mb-4">
              {recipeTags.find(tag => tag.id === selectedTag)?.label} Recipes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recipeTags
                .find(tag => tag.id === selectedTag)
                ?.recipes.map((recipe, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleRecipeClick(recipe)}
                    className="p-4 bg-gray-50 rounded-lg text-left hover:bg-gray-100 transition-colors"
                  >
                    {recipe}
                  </motion.button>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
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
              className="w-full p-4 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </form>

        {isLoading && (
          <div className="flex justify-center mt-4">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          </div>
        )}

        {error && <p className="text-red-500 mt-4">{error}</p>}

        <div className="mt-8" ref={groceryListRef} id="groceryListRef">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Your Grocery List
            </h3>

            {groceryItems.length > 0 && (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors"
                  onClick={() => setShowExportOptions(!showExportOptions)}
                >
                  <Download className="w-4 h-4" />
                  Export List
                </motion.button>

                <AnimatePresence>
                  {showExportOptions && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg overflow-hidden z-10"
                    >
                      <motion.button
                        whileHover={{ backgroundColor: 'rgb(243, 244, 246)' }}
                        className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100 transition-colors"
                        onClick={handleDownloadPDF}
                        style={{ backgroundColor: 'white' }}
                      >
                        <Download className="w-4 h-4" />
                        Download PDF
                      </motion.button>
                      <motion.button
                        whileHover={{ backgroundColor: 'rgb(243, 244, 246)' }}
                        className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100 transition-colors"
                        onClick={handlePrint}
                        style={{ backgroundColor: 'white' }}
                      >
                        <Printer className="w-4 h-4" />
                        Print List
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <style>{`
  @media print {
    body * {
      visibility: hidden;
    }
    #groceryListRef, #groceryListRef * {
      visibility: visible;
      background-color: rgb(255, 255, 255) !important;
      color: rgb(0, 0, 0) !important;
    }
    #groceryListRef {
      position: absolute;
      left: 0;
      top: 0;
    }
  }
`}</style>
          </div>
          <div className="mt-4 space-y-2">
            {groceryItems.map((item) => (
              <div key={item.id} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <span>{item.icon}</span>
                <span className="font-medium">{item.name}</span>
                <span className="text-gray-500">- {item.quantity}</span>
                <span className="ml-auto text-sm text-gray-400">{item.category}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroceryList;

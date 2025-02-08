import React, { useState, useEffect } from 'react';
import { ShoppingCart, Check, Plus, Trash2, X } from 'lucide-react';
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../Auth/firebase';
import { useAuth } from '../Auth/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const GroceryList = ({ mealPlans, onClose }) => {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [groceryItems, setGroceryItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [customItems, setCustomItems] = useState([]);

  useEffect(() => {
    if (user) {
      // Fetch existing custom items
      const customItemsQuery = query(
        collection(db, 'groceryItems'),
        where('userId', '==', user.uid)
      );

      const unsubscribe = onSnapshot(customItemsQuery, (snapshot) => {
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCustomItems(items);
      });

      return () => unsubscribe();
    }
  }, [user]);

  useEffect(() => {
    // Generate grocery list from meal plans
    const ingredients = mealPlans.reduce((acc, meal) => {
      if (meal.recipe && meal.recipe.ingredients) {
        meal.recipe.ingredients.forEach(ingredient => {
          const existingItem = acc.find(item => item.name === ingredient.name);
          if (existingItem) {
            existingItem.quantity += ingredient.quantity;
          } else {
            acc.push({ ...ingredient, checked: false });
          }
        });
      }
      return acc;
    }, []);

    setGroceryItems(ingredients);
  }, [mealPlans]);

  const toggleItemCheck = async (index) => {
    const newItems = [...groceryItems];
    newItems[index].checked = !newItems[index].checked;
    setGroceryItems(newItems);
  };

  const addCustomItem = async () => {
    if (!newItem.trim()) return;

    const item = {
      userId: user.uid,
      name: newItem.trim(),
      checked: false,
      custom: true,
      createdAt: new Date()
    };

    await addDoc(collection(db, 'groceryItems'), item);
    setNewItem('');
  };

  const deleteCustomItem = async (itemId) => {
    await deleteDoc(doc(db, 'groceryItems', itemId));
  };

  const toggleCustomItemCheck = async (itemId) => {
    const itemRef = doc(db, 'groceryItems', itemId);
    const item = customItems.find(item => item.id === itemId);
    await updateDoc(itemRef, { checked: !item.checked });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <ShoppingCart className="w-6 h-6" />
            Grocery List
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Add custom item */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Add custom item"
            className={`flex-1 p-2 rounded-lg ${
              darkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}
            onKeyPress={(e) => e.key === 'Enter' && addCustomItem()}
          />
          <button
            onClick={addCustomItem}
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Grocery list */}
        <div className="space-y-4">
          {/* Recipe ingredients */}
          <div className="space-y-2">
            <h3 className="font-semibold">From Meal Plan</h3>
            {groceryItems.map((item, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 p-2 rounded-lg ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}
              >
                <button
                  onClick={() => toggleItemCheck(index)}
                  className={`p-1 rounded ${
                    item.checked ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <Check className={`w-4 h-4 ${item.checked ? 'text-white' : 'text-transparent'}`} />
                </button>
                <span className={item.checked ? 'line-through opacity-50' : ''}>
                  {item.quantity} {item.unit} {item.name}
                </span>
              </div>
            ))}
          </div>

          {/* Custom items */}
          <div className="space-y-2">
            <h3 className="font-semibold">Custom Items</h3>
            {customItems.map((item) => (
              <div
                key={item.id}
                className={`flex items-center justify-between gap-2 p-2 rounded-lg ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleCustomItemCheck(item.id)}
                    className={`p-1 rounded ${
                      item.checked ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <Check className={`w-4 h-4 ${item.checked ? 'text-white' : 'text-transparent'}`} />
                  </button>
                  <span className={item.checked ? 'line-through opacity-50' : ''}>
                    {item.name}
                  </span>
                </div>
                <button
                  onClick={() => deleteCustomItem(item.id)}
                  className="text-red-500 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroceryList;
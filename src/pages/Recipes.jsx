import React, { useState, useEffect } from 'react';
import { db } from '../Auth/firebase';

import { collection, query, getDocs, addDoc, where } from 'firebase/firestore';
import { useAuth } from '../Auth/AuthContext';


export default function Recipes() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchRecipes();
  }, [filter]);

  const fetchRecipes = async () => {
    let q = collection(db, 'recipes');
    if (filter !== 'all') {
      q = query(q, where('dietaryTags', 'array-contains', filter));
    }
    const snapshot = await getDocs(q);
    setRecipes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const addRecipe = async (recipe) => {
    await addDoc(collection(db, 'userRecipes'), {
      userId: user.uid,
      ...recipe
    });
  };

  const filteredRecipes = recipes.filter(recipe => 
    recipe.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search recipes..."
          className="w-full p-2 border rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select 
          className="mt-4 p-2 border rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="vegan">Vegan</option>
          <option value="gluten-free">Gluten-free</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map(recipe => (
          <div key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4">
              <h3 className="text-xl font-bold mb-2">{recipe.name}</h3>
              <p className="text-gray-600 mb-4">{recipe.description}</p>
              <div className="mb-4">
                <span className="font-semibold">Calories:</span> {recipe.calories}
              </div>
              <div className="flex flex-wrap gap-2">
                {recipe.dietaryTags.map(tag => (
                  <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    {tag}
                  </span>
                ))}
              </div>
              <button
                onClick={() => addRecipe(recipe)}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add to My Recipes
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

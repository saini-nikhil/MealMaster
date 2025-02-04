import React, { useState, useEffect } from 'react';
import { useAuth } from '../Auth/AuthContext';
import { db } from '../Auth/firebase';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';

export default function MealPlanner() {
  const { user } = useAuth();
  const [meals, setMeals] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    fetchMeals();
  }, [user.uid]);

  const fetchMeals = async () => {
    const q = query(
      collection(db, 'meals'),
      where('userId', '==', user.uid)
    );
    const snapshot = await getDocs(q);
    setMeals(snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })));
  };

  const addMeal = async (recipe) => {
    await addDoc(collection(db, 'meals'), {
      userId: user.uid,
      recipeId: recipe.id,
      date: selectedDate,
      recipe: recipe
    });
    fetchMeals();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Meal Planner</h1>
      <div className="grid grid-cols-7 gap-4">
        {/* Calendar implementation */}
        {meals.map(meal => (
          <div key={meal.id} className="bg-white p-4 rounded shadow">
            <h3 className="font-bold">{meal.recipe.name}</h3>
            <p className="text-sm text-gray-600">{meal.recipe.calories} calories</p>
          </div>
        ))}
      </div>
    </div>
  );
}

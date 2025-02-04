import React, { useState, useEffect } from 'react';
import { useAuth } from '../Auth/AuthContext';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../Auth/firebase';


export default function NutritionTracker() {
  const { user } = useAuth();
  const [meals, setMeals] = useState([]);
  const [dailyTotal, setDailyTotal] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  });

  useEffect(() => {
    fetchTodaysMeals();
  }, []);

  const fetchTodaysMeals = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const q = query(
      collection(db, 'meals'),
      where('userId', '==', user.uid),
      where('date', '>=', today)
    );
    
    const snapshot = await getDocs(q);
    const todaysMeals = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    setMeals(todaysMeals);
    calculateDailyTotals(todaysMeals);
  };

  const calculateDailyTotals = (meals) => {
    const totals = meals.reduce((acc, meal) => ({
      calories: acc.calories + (meal.nutrition?.calories || 0),
      protein: acc.protein + (meal.nutrition?.protein || 0),
      carbs: acc.carbs + (meal.nutrition?.carbs || 0),
      fat: acc.fat + (meal.nutrition?.fat || 0)
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
    
    setDailyTotal(totals);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Today's Nutrition</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded">
          <div className="text-sm text-gray-600">Calories</div>
          <div className="text-2xl font-bold">{dailyTotal.calories}</div>
        </div>
        <div className="bg-green-50 p-4 rounded">
          <div className="text-sm text-gray-600">Protein</div>
          <div className="text-2xl font-bold">{dailyTotal.protein}g</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded">
          <div className="text-sm text-gray-600">Carbs</div>
          <div className="text-2xl font-bold">{dailyTotal.carbs}g</div>
        </div>
        <div className="bg-red-50 p-4 rounded">
          <div className="text-sm text-gray-600">Fat</div>
          <div className="text-2xl font-bold">{dailyTotal.fat}g</div>
        </div>
      </div>

      <div className="space-y-4">
        {meals.map(meal => (
          <div key={meal.id} className="border-b pb-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{meal.recipe.name}</h3>
                <div className="text-sm text-gray-600">
                  {meal.nutrition?.calories} calories
                </div>
              </div>
              <div className="text-sm">
                <div>P: {meal.nutrition?.protein}g</div>
                <div>C: {meal.nutrition?.carbs}g</div>
                <div>F: {meal.nutrition?.fat}g</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
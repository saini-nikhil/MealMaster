// // src/components/GroceryList.jsx 
// import React, { useState, useEffect } from 'react';
// import { db } from '../firebase';
// import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
// import { useAuth } from '../contexts/AuthContext';

// export default function GroceryList() {
//   const { user } = useAuth();
//   const [groceryItems, setGroceryItems] = useState([]);
//   const [weeklyMeals, setWeeklyMeals] = useState([]);

//   useEffect(() => {
//     fetchWeeklyMeals();
//   }, [user.uid]);

//   const fetchWeeklyMeals = async () => {
//     const startOfWeek = new Date();
//     startOfWeek.setHours(0, 0, 0, 0);
//     startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

//     const endOfWeek = new Date(startOfWeek);
//     endOfWeek.setDate(endOfWeek.getDate() + 6);

//     const mealsQuery = query(
//       collection(db, 'meals'),
//       where('userId', '==', user.uid),
//       where('date', '>=', startOfWeek),
//       where('date', '<=', endOfWeek)
//     );

//     const snapshot = await getDocs(mealsQuery);
//     const meals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//     setWeeklyMeals(meals);
//     generateGroceryList(meals);
//   };

//   const generateGroceryList = (meals) => {
//     const ingredients = meals.reduce((acc, meal) => {
//       meal.recipe.ingredients.forEach(ingredient => {
//         const existingItem = acc.find(item => item.name === ingredient.name);
//         if (existingItem) {
//           existingItem.quantity += ingredient.quantity;
//         } else {
//           acc.push({ ...ingredient, checked: false });
//         }
//       });
//       return acc;
//     }, []);
//     setGroceryItems(ingredients);
//   };

//   const toggleItem = async (index) => {
//     const updatedItems = [...groceryItems];
//     updatedItems[index].checked = !updatedItems[index].checked;
//     setGroceryItems(updatedItems);
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-4">
//       <h2 className="text-2xl font-bold mb-4">Weekly Grocery List</h2>
//       <div className="bg-white shadow rounded-lg p-6">
//         {groceryItems.map((item, index) => (
//           <div key={index} className="flex items-center py-2 border-b">
//             <input
//               type="checkbox"
//               checked={item.checked}
//               onChange={() => toggleItem(index)}
//               className="h-4 w-4 text-blue-600"
//             />
//             <span className={`ml-3 ${item.checked ? 'line-through text-gray-400' : ''}`}>
//               {item.quantity} {item.unit} {item.name}
//             </span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// // src/components/MealReminders.jsx
// import React, { useState } from 'react';
// import { addDoc, collection } from 'firebase/firestore';

// export default function MealReminders() {
//   const { user } = useAuth();
//   const [reminders, setReminders] = useState([]);

//   const addReminder = async (mealId, time) => {
//     const reminder = {
//       userId: user.uid,
//       mealId,
//       time,
//       status: 'pending'
//     };

//     await addDoc(collection(db, 'reminders'), reminder);
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-4">
//       <h2 className="text-2xl font-bold mb-4">Meal Reminders</h2>
//       <div className="space-y-4">
//         {weeklyMeals.map(meal => (
//           <div key={meal.id} className="bg-white shadow rounded-lg p-4">
//             <h3 className="font-semibold">{meal.recipe.name}</h3>
//             <input
//               type="datetime-local"
//               className="mt-2 p-2 border rounded"
//               onChange={(e) => addReminder(meal.id, e.target.value)}
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// // src/components/MacroTracker.jsx
// export default function MacroTracker() {
//   const { user } = useAuth();
//   const [macros, setMacros] = useState({
//     current: { calories: 0, protein: 0, carbs: 0, fat: 0 },
//     goals: { calories: 2000, protein: 150, carbs: 200, fat: 65 }
//   });

//   const calculateProgress = (current, goal) => {
//     return Math.min((current / goal) * 100, 100);
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-4">
//       <h2 className="text-2xl font-bold mb-4">Macro Tracking</h2>
//       <div className="space-y-6">
//         {Object.entries(macros.current).map(([macro, value]) => (
//           <div key={macro} className="bg-white shadow rounded-lg p-4">
//             <div className="flex justify-between mb-2">
//               <span className="capitalize">{macro}</span>
//               <span>{value}/{macros.goals[macro]}{macro === 'calories' ? 'kcal' : 'g'}</span>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-2.5">
//               <div
//                 className="bg-blue-600 h-2.5 rounded-full"
//                 style={{ width: `${calculateProgress(value, macros.goals[macro])}%` }}
//               ></div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
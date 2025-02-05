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
// src/components/MealPlanCreator.jsx
// import React, { useState, useEffect } from 'react';
// import { DndProvider } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { useDrag, useDrop } from 'react-dnd';
// import { collection, query, where, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
// import { useAuth } from '../Auth/AuthContext';
// import { db } from '../Auth/firebase';

// // Draggable Recipe Card Component
// const RecipeCard = ({ recipe, onSave }) => {
//   const [{ isDragging }, drag] = useDrag(() => ({
//     type: 'recipe',
//     item: { recipe },
//     collect: (monitor) => ({
//       isDragging: monitor.isDragging(),
//     }),
//   }));

//   return (
//     <div
//       ref={drag}
//       className={`p-4 bg-white rounded-lg shadow ${isDragging ? 'opacity-50' : ''}`}
//     >
//       <h3 className="font-semibold">{recipe.name}</h3>
//       <p className="text-sm text-gray-600">{recipe.calories} calories</p>
//       <button
//         onClick={() => onSave(recipe)}
//         className="mt-2 text-sm text-blue-600 hover:text-blue-800"
//       >
//         Add to Favorites
//       </button>
//     </div>
//   );
// };

// // Calendar Day Cell Component
// const DayCell = ({ date, meal, onDrop }) => {
//   const [{ isOver }, drop] = useDrop(() => ({
//     accept: 'recipe',
//     drop: (item) => onDrop(date, item.recipe),
//     collect: (monitor) => ({
//       isOver: monitor.isOver(),
//     }),
//   }));

//   return (
//     <div
//       ref={drop}
//       className={`p-4 border rounded-lg min-h-[150px] ${
//         isOver ? 'bg-blue-50' : 'bg-white'
//       }`}
//     >
//       <div className="font-semibold mb-2">
//         {date.toLocaleDateString('en-US', { weekday: 'short' })}
//       </div>
//       {meal && (
//         <div className="p-2 bg-gray-50 rounded">
//           <p className="font-medium">{meal.name}</p>
//           <p className="text-sm text-gray-600">{meal.calories} calories</p>
//         </div>
//       )}
//     </div>
//   );
// };

// // Main MealPlanCreator Component
// export default function MealPlanCreator() {
//   const { user } = useAuth();
//   const [recipes, setRecipes] = useState([]);
//   const [favoriteRecipes, setFavoriteRecipes] = useState([]);
//   const [mealPlan, setMealPlan] = useState({});
//   const [weekStart, setWeekStart] = useState(getStartOfWeek());

//   function getStartOfWeek(date = new Date()) {
//     const start = new Date(date);
//     start.setDate(start.getDate() - start.getDay());
//     start.setHours(0, 0, 0, 0);
//     return start;
//   }

//   useEffect(() => {
//     fetchRecipes();
//     fetchFavorites();
//     fetchMealPlan();
//   }, [user.uid, weekStart]);

//   const fetchRecipes = async () => {
//     const recipesRef = collection(db, 'recipes');
//     const snapshot = await getDocs(recipesRef);
//     setRecipes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//   };

//   const fetchFavorites = async () => {
//     const favoritesQuery = query(
//       collection(db, 'favoriteRecipes'),
//       where('userId', '==', user.uid)
//     );
//     const snapshot = await getDocs(favoritesQuery);
//     setFavoriteRecipes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//   };

//   const fetchMealPlan = async () => {
//     const planQuery = query(
//       collection(db, 'mealPlans'),
//       where('userId', '==', user.uid),
//       where('weekStart', '==', weekStart)
//     );
//     const snapshot = await getDocs(planQuery);
//     if (!snapshot.empty) {
//       setMealPlan(snapshot.docs[0].data().meals);
//     }
//   };

//   const saveFavoriteRecipe = async (recipe) => {
//     await addDoc(collection(db, 'favoriteRecipes'), {
//       userId: user.uid,
//       ...recipe,
//       savedAt: new Date()
//     });
//     fetchFavorites();
//   };

//   const handleDrop = async (date, recipe) => {
//     const dateStr = date.toISOString().split('T')[0];
//     const updatedMealPlan = { ...mealPlan, [dateStr]: recipe };
//     setMealPlan(updatedMealPlan);

//     const planQuery = query(
//       collection(db, 'mealPlans'),
//       where('userId', '==', user.uid),
//       where('weekStart', '==', weekStart)
//     );
//     const snapshot = await getDocs(planQuery);

//     if (snapshot.empty) {
//       await addDoc(collection(db, 'mealPlans'), {
//         userId: user.uid,
//         weekStart,
//         meals: updatedMealPlan
//       });
//     } else {
//       await updateDoc(doc(db, 'mealPlans', snapshot.docs[0].id), {
//         meals: updatedMealPlan
//       });
//     }
//   };

//   const getWeekDates = () => {
//     const dates = [];
//     for (let i = 0; i < 7; i++) {
//       const date = new Date(weekStart);
//       date.setDate(date.getDate() + i);
//       dates.push(date);
//     }
//     return dates;
//   };

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="max-w-6xl mx-auto p-4">
//         <div className="flex justify-between mb-6">
//           <h2 className="text-2xl font-bold">Meal Plan Creator</h2>
//           <div className="space-x-4">
//             <button
//               onClick={() => setWeekStart(getStartOfWeek(new Date(weekStart.getTime() - 7 * 24 * 60 * 60 * 1000)))}
//               className="px-4 py-2 bg-gray-100 rounded"
//             >
//               Previous Week
//             </button>
//             <button
//               onClick={() => setWeekStart(getStartOfWeek(new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000)))}
//               className="px-4 py-2 bg-gray-100 rounded"
//             >
//               Next Week
//             </button>
//           </div>
//         </div>

//         <div className="grid grid-cols-7 gap-4 mb-8">
//           {getWeekDates().map(date => (
//             <DayCell
//               key={date.toISOString()}
//               date={date}
//               meal={mealPlan[date.toISOString().split('T')[0]]}
//               onDrop={handleDrop}
//             />
//           ))}
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           <div>
//             <h3 className="text-xl font-semibold mb-4">Available Recipes</h3>
//             <div className="space-y-4">
//               {recipes.map(recipe => (
//                 <RecipeCard
//                   key={recipe.id}
//                   recipe={recipe}
//                   onSave={saveFavoriteRecipe}
//                 />
//               ))}
//             </div>
//           </div>

//           <div>
//             <h3 className="text-xl font-semibold mb-4">Favorite Recipes</h3>
//             <div className="space-y-4">
//               {favoriteRecipes.map(recipe => (
//                 <RecipeCard
//                   key={recipe.id}
//                   recipe={recipe}
//                   onSave={saveFavoriteRecipe}
//                 />
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </DndProvider>
//   );
// }
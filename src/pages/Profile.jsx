import React, { useState } from 'react';
import { useAuth } from '../Auth/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../Auth/firebase';
import { useTheme } from '../contexts/ThemeContext';

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    dietaryPreferences: user.dietaryPreferences || [],
    fitnessGoals: user.fitnessGoals || '',
    dailyCalorieTarget: user.dailyCalorieTarget || '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const { darkMode } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, 'users', user.uid), profile);
      setMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      setMessage('Failed to update profile');
    }
  };

  return (
    <div className={`max-w-lg mx-auto mt-10 p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} shadow-lg rounded-xl`}>
      <h1 className={`text-3xl font-bold mb-6 text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>Profile Settings</h1>
      {message && <div className={`mb-4 p-3 rounded ${darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'} text-center`}>{message}</div>}
      {!isEditing ? (
        <div className="space-y-4">
          <div>
            <span className="font-semibold">Dietary Preferences:</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {profile.dietaryPreferences.map((pref) => (
                <span key={pref} className={`px-3 py-1 rounded-md text-sm ${darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'}`}>
                  {pref}
                </span>
              ))}
            </div>
          </div>
          <div>
            <span className="font-semibold">Fitness Goals:</span>
            <p className={`mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{profile.fitnessGoals}</p>
          </div>
          <div>
            <span className="font-semibold">Daily Calorie Target:</span>
            <p className={`mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{profile.dailyCalorieTarget} calories</p>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="w-full mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block ${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium mb-1`}>Dietary Preferences</label>
            <select
              multiple
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-700'}`}
              value={profile.dietaryPreferences}
              onChange={(e) => setProfile({
                ...profile,
                dietaryPreferences: Array.from(e.target.selectedOptions, option => option.value),
              })}
            >
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="gluten-free">Gluten-free</option>
              <option value="Non-Veg">Non-Veg</option>
            </select>
          </div>
          <div>
            <label className={`block ${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium mb-1`}>Fitness Goals</label>
            <select
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-700'}`}
              value={profile.fitnessGoals}
              onChange={(e) => setProfile({ ...profile, fitnessGoals: e.target.value })}
            >
              <option value="weight-loss">Weight Loss</option>
              <option value="muscle-gain">Muscle Gain</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
          <div>
            <label className={`block ${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium mb-1`}>Daily Calorie Target</label>
            <input
              type="number"
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-700'}`}
              value={profile.dailyCalorieTarget}
              onChange={(e) => setProfile({ ...profile, dailyCalorieTarget: e.target.value })}
            />
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="w-full bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

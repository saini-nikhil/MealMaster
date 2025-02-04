import React, { useState } from 'react';
import { useAuth } from '../Auth/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../Auth/firebase';


export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    dietaryPreferences: user.dietaryPreferences || [],
    allergies: user.allergies || [],
    fitnessGoals: user.fitnessGoals || '',
    dailyCalorieTarget: user.dailyCalorieTarget || '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');

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
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>
      {message && (
        <div className="mb-4 p-4 rounded bg-green-100 text-green-700">
          {message}
        </div>
      )}
      <div className="bg-white shadow rounded-lg p-6">
        {!isEditing ? (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Current Settings</h2>
              <div className="space-y-4">
                <div>
                  <span className="font-medium">Dietary Preferences:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {profile.dietaryPreferences.map(pref => (
                      <span key={pref} className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {pref}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="font-medium">Fitness Goals:</span>
                  <p className="mt-1">{profile.fitnessGoals}</p>
                </div>
                <div>
                  <span className="font-medium">Daily Calorie Target:</span>
                  <p className="mt-1">{profile.dailyCalorieTarget} calories</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Edit Profile
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Dietary Preferences
              </label>
              <select
                multiple
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                value={profile.dietaryPreferences}
                onChange={(e) => setProfile({
                  ...profile,
                  dietaryPreferences: Array.from(e.target.selectedOptions, option => option.value)
                })}
              >
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="gluten-free">Gluten-free</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fitness Goals
              </label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                value={profile.fitnessGoals}
                onChange={(e) => setProfile({...profile, fitnessGoals: e.target.value})}
              >
                <option value="weight-loss">Weight Loss</option>
                <option value="muscle-gain">Muscle Gain</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Daily Calorie Target
              </label>
              <input
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                value={profile.dailyCalorieTarget}
                onChange={(e) => setProfile({...profile, dailyCalorieTarget: e.target.value})}
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
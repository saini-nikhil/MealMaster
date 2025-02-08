import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../Auth/firebase';


const ProfileForm = ({ user }) => {
  const [profile, setProfile] = useState({
    dietaryPreferences: user.dietaryPreferences || [],
    allergies: user.allergies || [],
    fitnessGoals: user.fitnessGoals || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateDoc(doc(db, 'users', user.uid), profile);
  };

  return (
    <form onSubmit={handleSubmit}>
      <select
        multiple
        value={profile.dietaryPreferences}
        onChange={(e) => setProfile({
          ...profile,
          dietaryPreferences: Array.from(e.target.selectedOptions, option => option.value)
        })}
      >
        <option value="vegetarian">Vegetarian</option>
        <option value="vegan">Vegan</option>
        <option value="gluten-free">Gluten-free</option>
        <option value="">Non-Veg</option>
      </select>
      {/* Add other form fields */}
      <button type="submit">Save Profile</button>
    </form>
  );
};

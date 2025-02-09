import React, { useState, useEffect } from 'react';
import { useAuth } from '../Auth/AuthContext';
import { db, storage } from '../Auth/firebase';
import { collection, addDoc, getDocs, updateDoc, arrayUnion, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, UserCircle, Send, Camera, Heart, MessageSquare, Bookmark, Clock, Users ,Zap } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function Community() {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [recipes, setRecipes] = useState([]);
  const [newRecipe, setNewRecipe] = useState({
    title: '',
    ingredients: '',
    instructions: '',
    cookingTime: '',
    servings: '',
    description: ''
  });
  const [newImage, setNewImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replies, setReplies] = useState({});
  const [savedRecipes, setSavedRecipes] = useState([]);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const recipeRef = collection(db, 'communityRecipes');
      const querySnapshot = await getDocs(recipeRef);
      const recipesData = [];
      querySnapshot.forEach((docSnap) => {
        recipesData.push({ id: docSnap.id, ...docSnap.data() });
      });
      setRecipes(recipesData.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate()));
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecipe = async () => {
    if (!user || !newRecipe.title.trim()) return;

    let imageUrl = null;
    if (newImage) {
      setLoading(true);
      const imageRef = ref(storage, `recipeImages/${newImage.name}`);
      await uploadBytes(imageRef, newImage);
      imageUrl = await getDownloadURL(imageRef);
    }

    try {
      const recipeRef = collection(db, 'communityRecipes');
      await addDoc(recipeRef, {
        userId: user.uid,
        ...newRecipe,
        author: user.displayName || 'Anonymous',
        image: imageUrl,
        ratings: [],
        comments: [],
        saves: 0,
        createdAt: new Date(),
      });
      setNewRecipe({
        title: '',
        ingredients: '',
        instructions: '',
        cookingTime: '',
        servings: '',
        description: ''
      });
      setNewImage(null);
      setImagePreview(null);
      fetchRecipes();
    } catch (error) {
      console.error('Error adding recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (recipeId) => {
    if (!user || !replies[recipeId]?.trim()) return;

    try {
      const recipeDoc = doc(db, 'communityRecipes', recipeId);
      await updateDoc(recipeDoc, {
        comments: arrayUnion({
          userId: user.uid,
          author: user.displayName || 'Anonymous',
          content: replies[recipeId],
          createdAt: new Date()
        })
      });
      setReplies({ ...replies, [recipeId]: '' });
      setReplyingTo(null);
      fetchRecipes();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleSaveRecipe = async (recipeId) => {
    if (!user) return;

    try {
      const userDoc = doc(db, 'users', user.uid);
      await updateDoc(userDoc, {
        savedRecipes: arrayUnion(recipeId)
      });
      setSavedRecipes([...savedRecipes, recipeId]);
    } catch (error) {
      console.error('Error saving recipe:', error);
    }
  };

   const HeroSection = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`relative overflow-hidden rounded-2xl mb-12 ${darkMode ? 'bg-gray-800' : 'bg-blue-50'}`}
    >
      <motion.div 
        className="absolute -right-10 -top-10 w-64 h-64 bg-blue-500 rounded-full opacity-10"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute -left-10 -bottom-10 w-64 h-64 bg-purple-500 rounded-full opacity-10"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, -90, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      />
      <div className="relative p-8 md:p-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-4"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              Welcome to Our 
              <motion.span 
                className="text-blue-500 block"
                animate={{ color: ['#3B82F6', '#8B5CF6', '#3B82F6'] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                Community Hub
              </motion.span>
            </motion.h1>
            <motion.p 
              className={`text-lg mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Join our vibrant community to share ideas, get inspired, and connect with like-minded people.
            </motion.p>
            <motion.div 
              className="flex space-x-6"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-500" />
                <span className="font-semibold">{recipes.length} Posts</span>
              </div>
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-purple-500" />
                <span className="font-semibold">
                  {recipes.reduce((acc, post) => acc + (post.comments?.length || 0), 0)} Comments
                </span>
              </div>
            </motion.div>
          </div>
          <motion.div 
            className="hidden md:flex justify-end"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              <motion.div 
                className="absolute -top-4 -left-4 w-24 h-24 bg-blue-500 rounded-lg opacity-20"
                animate={{
                  rotate: [0, 180, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div 
                className="absolute -bottom-4 -right-4 w-24 h-24 bg-purple-500 rounded-lg opacity-20"
                animate={{
                  rotate: [0, -180, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              />
              <div className={`relative z-10 p-6 rounded-xl shadow-xl ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                <Zap className="w-12 h-12 text-yellow-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Start Sharing</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Share your thoughts, experiences, and connect with others in our community.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>

  
    <div className={`max-w-5xl mx-auto py-10 px-4 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <HeroSection />
      
      <div className={`mb-8 p-6 shadow-lg rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className="text-2xl font-bold mb-4">Share Your Recipe</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Recipe Title"
            value={newRecipe.title}
            onChange={(e) => setNewRecipe({...newRecipe, title: e.target.value})}
            className={`w-full p-3 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
          />
          <textarea
            placeholder="Recipe Description"
            value={newRecipe.description}
            onChange={(e) => setNewRecipe({...newRecipe, description: e.target.value})}
            className={`w-full h-20 p-3 rounded-lg resize-none ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Cooking Time (e.g., 30 mins)"
              value={newRecipe.cookingTime}
              onChange={(e) => setNewRecipe({...newRecipe, cookingTime: e.target.value})}
              className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
            />
            <input
              type="text"
              placeholder="Servings (e.g., 4 people)"
              value={newRecipe.servings}
              onChange={(e) => setNewRecipe({...newRecipe, servings: e.target.value})}
              className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
            />
          </div>
          <textarea
            placeholder="Ingredients (one per line)"
            value={newRecipe.ingredients}
            onChange={(e) => setNewRecipe({...newRecipe, ingredients: e.target.value})}
            className={`w-full h-32 p-3 rounded-lg resize-none ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
          />
          <textarea
            placeholder="Cooking Instructions (step by step)"
            value={newRecipe.instructions}
            onChange={(e) => setNewRecipe({...newRecipe, instructions: e.target.value})}
            className={`w-full h-48 p-3 rounded-lg resize-none ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
          />
          <div className="flex justify-between items-center">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                setNewImage(file);
                setImagePreview(URL.createObjectURL(file));
              }}
              className="hidden"
              id="recipe-image"
            />

            <div></div>
            {/* <label
              htmlFor="recipe-image"
              className="flex items-center space-x-2 cursor-pointer text-blue-500 hover:text-blue-600"
            >
              <Camera className="w-5 h-5" />
              <span>Add Photo</span>
            </label> */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddRecipe}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Share Recipe
            </motion.button>
          </div>
          {imagePreview && (
            <div className="mt-4">
              <img src={imagePreview} alt="Recipe preview" className="w-full max-h-64 object-cover rounded-lg" />
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <motion.div className="space-y-6">
          {recipes.map((recipe) => (
            <motion.div
              key={recipe.id}
              className={`p-6 rounded-lg shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <UserCircle className="w-8 h-8 text-blue-500" />
                  <div>
                    <h3 className="font-semibold">{recipe.author}</h3>
                    <p className="text-xs text-gray-400">
                      {recipe.createdAt.toDate().toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-gray-400 hover:text-red-500"
                    onClick={() => handleSaveRecipe(recipe.id)}
                  >
                    <Heart className={`w-5 h-5 ${savedRecipes.includes(recipe.id) ? 'text-red-500' : ''}`} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-gray-400 hover:text-blue-500"
                    onClick={() => handleSaveRecipe(recipe.id)}
                  >
                    <Bookmark className={`w-5 h-5 ${savedRecipes.includes(recipe.id) ? 'text-blue-500' : ''}`} />
                  </motion.button>
                </div>
              </div>

              <h2 className="text-2xl font-bold mb-2">{recipe.title}</h2>
              {recipe.image && (
                <img src={recipe.image} alt={recipe.title} className="w-full h-64 object-cover rounded-lg mb-4" />
              )}
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{recipe.cookingTime}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{recipe.servings}</span>
                </div>
              </div>

              <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {recipe.description}
              </p>

              <div className="mb-4">
                <h4 className="font-semibold mb-2">Ingredients:</h4>
                <pre className={`whitespace-pre-line ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {recipe.ingredients}
                </pre>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold mb-2">Instructions:</h4>
                <pre className={`whitespace-pre-line ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {recipe.instructions}
                </pre>
              </div>

              <div className="space-y-4">
                {recipe.comments && recipe.comments.map((comment, index) => (
                  <motion.div 
                    key={index}
                    className="border-t-2 pt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center space-x-2">
                      <UserCircle className="w-6 h-6 text-blue-500" />
                      <span className="font-semibold">{comment.author}</span>
                    </div>
                    <p className="mt-2 text-sm">{comment.content}</p>
                    <p className="text-xs text-gray-400 mt-2">{new Date(comment.createdAt.seconds * 1000).toLocaleString()}</p>
                  </motion.div>
                ))}
              </div>

              {replyingTo === recipe.id ? (
                <div className="mt-4">
                  <textarea
                    placeholder="Add a comment..."
                    value={replies[recipe.id] || ''}
                    onChange={(e) => setReplies({...replies, [recipe.id]: e.target.value})}
                    className={`w-full h-16 p-3 rounded-lg resize-none ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
                  />
                  <button 
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2"
                    onClick={() => handleAddComment(recipe.id)}
                  >
                    Post Comment
                  </button>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-blue-500"
                  onClick={() => setReplyingTo(recipe.id)}
                >
                  Reply
                </motion.button>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
    </div>
  );
}

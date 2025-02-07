import React, { useState, useEffect } from 'react';
import { useAuth } from '../Auth/AuthContext';
import { db, storage } from '../Auth/firebase';
import { collection, addDoc, getDocs, updateDoc, arrayUnion, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, UserCircle, Send, Camera, Loader, Users, Heart, MessageSquare, Zap } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function Community() {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replies, setReplies] = useState({});
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetchPosts();
    if (uploadProgress > 0 && uploadProgress < 100) {
      const timer = setTimeout(() => {
        setUploadProgress(prev => Math.min(prev + 10, 100));
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [uploadProgress]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const postRef = collection(db, 'communityPosts');
      const querySnapshot = await getDocs(postRef);
      const postsData = [];
      querySnapshot.forEach((docSnap) => {
        postsData.push({ id: docSnap.id, ...docSnap.data() });
      });
      setPosts(postsData.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate()));
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPost = async () => {
    if (!user || !newPost.trim()) return;

    let imageUrl = null;
    if (newImage) {
      setLoading(true);
      setUploadProgress(10);
      const imageRef = ref(storage, `communityPosts/${newImage.name}`);
      await uploadBytes(imageRef, newImage);
      imageUrl = await getDownloadURL(imageRef);
      setUploadProgress(100);
    }

    try {
      const postRef = collection(db, 'communityPosts');
      await addDoc(postRef, {
        userId: user.uid,
        content: newPost,
        author: user.displayName || 'Anonymous',
        comments: [],
        image: imageUrl,
        createdAt: new Date(),
      });
      setNewPost('');
      setNewImage(null);
      setImagePreview(null);
      setUploadProgress(0);
      fetchPosts();
    } catch (error) {
      console.error('Error adding post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReplyPost = async (postId) => {
    const comment = replies[postId];
    if (!user || !comment?.trim()) return;

    try {
      const postDoc = doc(db, 'communityPosts', postId);
      await updateDoc(postDoc, {
        comments: arrayUnion({
          userId: user.uid,
          content: comment,
          author: user.displayName || 'Anonymous',
          createdAt: new Date()
        }),
      });

      setReplies({ ...replies, [postId]: '' });
      setReplyingTo(null);
      fetchPosts();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5 MB!');
        return;
      }
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        alert('Only JPG or PNG images are allowed!');
        return;
      }
      setNewImage(file);
      setImagePreview(URL.createObjectURL(file));
      setUploadProgress(5);
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
                <span className="font-semibold">{posts.length} Posts</span>
              </div>
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-purple-500" />
                <span className="font-semibold">
                  {posts.reduce((acc, post) => acc + (post.comments?.length || 0), 0)} Comments
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
    <div className={`max-w-5xl mx-auto py-10 px-4 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <HeroSection />
      
      <div className={`mb-8 p-6 shadow-lg rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="relative">
          <textarea
            className={`w-full h-28 p-3 rounded-lg resize-none focus:ring-2 ${
              darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
            }`}
            placeholder="Share your thoughts..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
          <AnimatePresence>
            {imagePreview && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="mt-2 relative"
              >
                <div className="flex items-center space-x-4">
                  <div className="relative w-24 h-16">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                        <div className="w-16 h-16 relative">
                          <motion.div 
                            className="absolute inset-0 border-4 border-blue-500 rounded-full"
                            style={{
                              borderTopColor: 'transparent',
                              borderRightColor: 'transparent',
                            }}
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear"
                            }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
                            {uploadProgress}%
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  {uploadProgress === 100 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-green-500 flex items-center"
                    >
                      <span className="text-sm">Upload complete!</span>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="absolute top-3 right-3 flex space-x-2">
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="upload" />
            <label htmlFor="upload" className="cursor-pointer">
              <Camera className="w-6 h-6 text-blue-500 cursor-pointer" />
            </label>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleAddPost}
              className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition cursor-pointer"
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>

      {loading && !imagePreview ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {posts.length === 0 ? (
            <p className="text-center text-xl">No posts yet. Be the first to share!</p>
          ) : (
            posts.map((post) => (
              <motion.div
                key={post.id}
                className={`p-6 rounded-lg shadow-xl transform motion-safe:hover:scale-105 transition-all duration-300 ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                }`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center space-x-2">
                    <UserCircle className="w-8 h-8 text-blue-500" />
                    <div>
                      <h3 className="font-semibold">{post.author}</h3>
                      <p className="text-xs text-gray-400">
                        {post.createdAt.toDate().toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <motion.button
                  
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex items-center space-x-1 text-gray-400 hover:text-red-500 transition"
                >
                  <Heart className="w-5 h-5" />
                </motion.button>
              </div>
              {post.image && (
                <motion.img 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  src={post.image} 
                  alt="Post" 
                  className="w-full h-64 object-cover rounded-lg mb-4" 
                />
              )}
              <p className={`mt-2 flex-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {post.content}
              </p>

              {/* Comments Section */}
              <div className="mt-4 space-y-2">
                {post.comments && post.comments.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
                  >
                    <h4 className="font-semibold mb-2">Comments</h4>
                    {post.comments.map((comment, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-2 rounded ${darkMode ? 'bg-gray-600' : 'bg-gray-100'} mb-2`}
                      >
                        <div className="flex items-center space-x-2">
                          <UserCircle className="w-6 h-6 text-blue-500" />
                          <span className="font-medium text-sm">{comment.author}</span>
                          {comment.createdAt && (
                            <span className="text-xs text-gray-400">
                              {comment.createdAt.toDate().toLocaleString()}
                            </span>
                          )}
                        </div>
                        <p className={`ml-8 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {comment.content}
                        </p>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Reply Section */}
              {replyingTo === post.id ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center mt-4"
                >
                  <input
                    type="text"
                    value={replies[post.id] || ''}
                    onChange={(e) => setReplies({ ...replies, [post.id]: e.target.value })}
                    placeholder="Add a comment..."
                    className={`flex-1 p-2 rounded-lg border ${
                      darkMode
                        ? 'bg-gray-700 text-white border-gray-600'
                        : 'bg-gray-100 text-gray-900 border-gray-300'
                    }`}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleReplyPost(post.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg ml-2 hover:bg-blue-600 transition cursor-pointer"
                  >
                    Submit
                  </motion.button>
                </motion.div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setReplyingTo(post.id)}
                  className="flex items-center space-x-1 text-blue-500 mt-4 hover:text-blue-600 transition cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">Reply</span>
                </motion.button>
              )}
            </motion.div>
          ))
        )}
      </motion.div>
    )}
  </div>
);
}
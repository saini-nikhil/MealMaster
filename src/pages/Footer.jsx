import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <span className="text-sm">
          &copy; {new Date().getFullYear()} MealMaster. All rights reserved.
        </span>
        <span className="text-lg flex items-center">
          Made with
          <motion.span
            className="inline-block mx-2"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <Heart className="w-6 h-6 text-red-500 inline-block" />
          </motion.span>
          for Food Lovers
        </span>
      </div>
    </footer>
  );
}
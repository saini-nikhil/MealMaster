import React from 'react';
import { ExternalLink, ChevronRight, Heart, Clock, Trophy, Users } from 'lucide-react';

const Footer = () => {
  const features = [
    { name: 'Meal Planner', path: '/meal-planner' },
    { name: 'Nutrition Tracker', path: '/NutritionTracker' },
    { name: 'Recipes', path: '/recipes' },
    { name: 'Community', path: '/community' }
  ];

  const importantInfo = [
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms & Conditions', path: '/terms' }
  ];

  const quickLinks = [
    { name: 'Weekly Meal Plans', path: '/meal-planner', icon: Clock },
    { name: 'Favorite Recipes', path: '/favrecipes', icon: Trophy },
    { name: 'Community Recipe Stories', path: '/community', icon: Users }
  ];

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white">
      <footer className="bg-white shadow-lg py-12">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid md:grid-cols-3 gap-12 animate-fade-in">
            <div className="w-full">
              <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 mb-6">
                Features
              </h3>
              <ul className="space-y-4">
                {features.map((feature) => (
                  <li key={feature.name} className="group hover:translate-x-2 transition-transform duration-300">
                    <a href={feature.path} className="hover:text-blue-500 transition-colors duration-300 inline-flex items-center">
                      <ChevronRight className="w-4 h-4 mr-2 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {feature.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-full">
              <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-600 mb-6">
                Important Info
              </h3>
              <ul className="space-y-4">
                {importantInfo.map((info) => (
                  <li key={info.name} className="group hover:translate-x-2 transition-transform duration-300">
                    <a href={info.path} className="hover:text-purple-500 transition-colors duration-300 inline-flex items-center">
                      <ExternalLink className="w-4 h-4 mr-2 text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {info.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-full">
              <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-orange-600 mb-6">
                Quick Links
              </h3>
              <ul className="space-y-4">
                {quickLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <li key={link.name} className="group hover:translate-x-2 transition-transform duration-300">
                      <a href={link.path} className="hover:text-pink-500 transition-colors duration-300 inline-flex items-center">
                        <Icon className="w-4 h-4 mr-2 text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {link.name}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
            <div className="mb-2">© {new Date().getFullYear()} MealMaster. All rights reserved.</div>
            <div className="flex items-center justify-center gap-2">
              Made with 
              <Heart className="w-4 h-4 text-red-500 animate-pulse" /> 
              by the MealMaster Team
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
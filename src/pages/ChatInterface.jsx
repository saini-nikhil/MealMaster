import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, User, RefreshCw } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

export default function ChatInterface() {
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Hello! How can I help you with meal planning today?', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { darkMode } = useTheme();
  
  const apiKey = "AIzaSyDtt9iTVZyMWurYKixqAO4CdfzGNFF3N2g"; 
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Add user message
    const userMessage = { role: 'user', content: input.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const context = `Context:
In today's busy lifestyle, maintaining a balanced diet can be challenging. This app helps users plan meals, track their nutrition, and promote healthy eating habits by providing personalized meal plans based on dietary preferences and goals.
Project Goal:
Develop a Meal Planning App that allows users to create meal plans, track their daily intake, and receive nutritional insights to promote healthy eating.`;

      const prompt = `${context}\n\nQuestion: ${userMessage.content}`;

      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        method: "post",
        data: {
          contents: [{ parts: [{ text: prompt }] }],
        },
      });

      const aiResponse = response.data.candidates[0].content.parts[0].text;
      
      const botMessage = {
        role: 'bot',
        content: aiResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Failed to get bot response:', error);
      setMessages(prev => [...prev, {
        role: 'bot',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        error: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const resetConversation = () => {
    setMessages([
      { role: 'bot', content: 'Hello! How can I help you with meal planning today?', timestamp: new Date() }
    ]);
  };

  return (
    <div className={`flex flex-col h-[600px] w-full max-w-2xl mx-auto rounded-xl shadow-lg overflow-hidden ${
      darkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      {/* Chat Header */}
      <div className={`flex items-center p-4 ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      } border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <Bot className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
        <h2 className={`ml-2 font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Meal Planning Assistant
        </h2>
        <button 
          onClick={resetConversation}
          className={`ml-auto p-2 rounded-full hover:bg-opacity-80 transition-colors ${
            darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          }`}
        >
          <RefreshCw className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
        </button>
      </div>

      {/* Chat Messages */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${
        darkMode ? 'bg-gray-800' : 'bg-gray-50'
      }`}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start space-x-2 ${
              message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              message.role === 'user' 
                ? darkMode ? 'bg-blue-500' : 'bg-blue-100'
                : darkMode ? 'bg-gray-700' : 'bg-gray-200'
            }`}>
              {message.role === 'user' ? (
                <User className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-blue-500'}`} />
              ) : (
                <Bot className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
              )}
            </div>

            {/* Message Content */}
            <div className={`max-w-[80%] rounded-lg px-4 py-2 ${
              message.role === 'user'
                ? darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                : message.error
                  ? darkMode ? 'bg-red-900/50 text-red-200' : 'bg-red-50 text-red-800'
                  : darkMode ? 'bg-gray-700 text-gray-200' : 'bg-white text-gray-800'
            }`}>
              <div className="text-sm prose prose-sm dark:prose-invert">
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
              <span className={`text-xs mt-1 block ${
                message.role === 'user'
                  ? 'text-blue-100'
                  : darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {formatTime(message.timestamp)}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className={`p-4 border-t ${
        darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center space-x-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about meal planning..."
            className={`flex-1 p-2 rounded-lg border resize-none ${
              darkMode 
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            rows="3"
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className={`p-2 rounded-lg ${
              isLoading || !input.trim()
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
            } text-white transition-colors`}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
import React, { useState } from 'react';
import { Bell, Search, User, Mic, MicOff } from 'lucide-react';
import voiceInput from '../../voice-input';

export default function TopNav({ role }) {
  let user = null;
  try {
    const item = localStorage.getItem('user_data');
    if (item) user = JSON.parse(item);
  } catch (error) {
    console.error('Failed to parse user_data from LocalStorage:', error);
  }
  
  // Dynamic defaults based on detected role
  const defaultUser = {
    name: role === 'admin' ? 'Admin User' : role === 'teacher' ? 'Teacher User' : 'Student User',
    role: role ? (role.charAt(0).toUpperCase() + role.slice(1)) : 'Student'
  };

  // Use localStorage user if available, otherwise use default
  user = user || defaultUser;

  // If role prop is provided, ensure UI reflects it even if localStorage is stale
  if (role && user.role.toLowerCase() !== role.toLowerCase()) {
    user.role = defaultUser.role;
    user.name = defaultUser.name; // Reset name to default if role mismatch detected
  }

  const [isListening, setIsListening] = useState(false);

  const toggleVoice = () => {
    if (isListening) {
      voiceInput.stop();
      setIsListening(false);
    } else {
      voiceInput.start();
      setIsListening(true);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10">
      
      {/* Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="w-5 h-5 text-gray-400" />
          </span>
          <input 
            type="text" 
            placeholder="Search experiments, students, reports..." 
            className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-4">
        {/* Voice Toggle */}
        <button 
          onClick={toggleVoice}
          className={`relative p-2 rounded-full transition-all ${isListening ? 'bg-primary-vibrant text-white' : 'text-gray-500 hover:text-primary-vibrant hover:bg-gray-100'}`}
          title={isListening ? 'Stop Voice Commands' : 'Start Voice Commands'}
        >
          {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          {isListening && (
            <span className="absolute -top-1 -right-1 block h-3 w-3 rounded-full bg-red-500 border-2 border-white animate-pulse"></span>
          )}
        </button>

        {/* Notifications */}
        <button className="relative text-gray-500 hover:text-primary-vibrant transition-colors">
          <Bell className="w-6 h-6" />
          <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center space-x-3 border-l border-gray-200 pl-6">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-900 leading-none">{user.name}</p>
            <p className="text-xs text-gray-500 mt-1 uppercase">{user.role}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-primary-vibrant/10 flex items-center justify-center text-primary-vibrant">
            <User className="w-6 h-6" />
          </div>
        </div>
      </div>
    </header>
  );
}

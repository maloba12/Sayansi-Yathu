import React from 'react';
import { Megaphone, AlertTriangle, Info } from 'lucide-react';

export default function AnnouncementCard({ announcement, isSelected, onClick }) {
  const getStyle = () => {
    switch(announcement.type) {
      case 'urgent': return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: AlertTriangle };
      case 'admin': return { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', icon: Megaphone };
      default: return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: Info };
    }
  };

  const style = getStyle();
  const Icon = style.icon;

  return (
    <div 
      onClick={onClick}
      className={`relative p-4 rounded-2xl cursor-pointer border-l-4 transition-all duration-200 mb-3
        ${isSelected ? `${style.bg} ${style.border} shadow-sm` : `bg-white border-y border-r border-gray-100 ${style.border} hover:bg-gray-50 hover:shadow-sm`}
      `}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center space-x-2">
          <Icon className={`w-4 h-4 ${style.text}`} />
          <span className={`text-[10px] uppercase font-bold tracking-wider ${style.text}`}>
            {announcement.type} Broadcast
          </span>
        </div>
        <span className="text-[10px] text-gray-400 font-medium">{announcement.date}</span>
      </div>

      <div>
        <h4 className="text-sm font-bold text-gray-800">{announcement.title}</h4>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
          {announcement.preview}
        </p>
      </div>
      
      <div className="mt-3 flex items-center justify-between">
        <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
          From: {announcement.author}
        </span>
      </div>
    </div>
  );
}

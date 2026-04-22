import React from 'react';
import { Star, Mic, Paperclip, Circle } from 'lucide-react';

export default function MessageCard({ message, isSelected, onClick }) {
  const isUnread = !message.read;

  return (
    <div 
      onClick={onClick}
      className={`relative p-4 rounded-2xl cursor-pointer border transition-all duration-200 mb-3
        ${isSelected ? 'bg-primary-vibrant/5 border-primary-vibrant/30 shadow-sm' : 'bg-white border-gray-100 hover:border-gray-300 hover:shadow-sm'}
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          {/* Initials Avatar */}
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
            ${message.senderRole === 'HOD' ? 'bg-purple-100 text-purple-700' : 
              message.senderRole === 'Admin' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'}
          `}>
            {message.senderName.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className={`text-sm ${isUnread ? 'font-bold text-gray-900' : 'font-semibold text-gray-700'}`}>
                {message.senderName}
              </h4>
              <span className={`text-[10px] px-2 py-0.5 rounded-md uppercase tracking-wider font-bold
                ${message.senderRole === 'HOD' ? 'bg-purple-100 text-purple-700' : 
                  message.senderRole === 'Admin' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'}
              `}>
                {message.senderRole}
              </span>
            </div>
            <p className={`text-xs mt-0.5 ${isUnread ? 'font-bold text-gray-800' : 'text-gray-500'}`}>
              {message.subject}
            </p>
          </div>
        </div>
        
        {/* Right side indicators */}
        <div className="flex flex-col items-end space-y-2">
          <span className="text-[10px] text-gray-400 font-medium">{message.time}</span>
          <div className="flex space-x-1 text-gray-400">
            {message.hasVoice && <Mic className="w-3.5 h-3.5" />}
            {message.hasFile && <Paperclip className="w-3.5 h-3.5" />}
            {message.isStarred && <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />}
          </div>
        </div>
      </div>

      <div className="mt-3 pl-[52px]">
        <p className="text-[13px] text-gray-500 line-clamp-2 leading-relaxed">
          {message.preview}
        </p>
        
        {/* Tags */}
        {message.tags && message.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {message.tags.map((tag, idx) => (
              <span key={idx} className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full font-medium border border-gray-200">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {isUnread && (
        <div className="absolute top-1/2 left-2 -translate-y-1/2">
          <Circle className="w-2 h-2 text-primary-vibrant fill-primary-vibrant" />
        </div>
      )}
    </div>
  );
}

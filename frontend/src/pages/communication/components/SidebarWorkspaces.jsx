import React, { useState } from 'react';
import { 
  MessageSquare, 
  Bell, 
  FileBox, 
  AlertCircle, 
  Archive, 
  Trash2, 
  ChevronDown, 
  Send, 
  PenTool 
} from 'lucide-react';

export default function SidebarWorkspaces({ activeWorkspace, setActiveWorkspace, badges }) {
  const [showMore, setShowMore] = useState(false);

  const mainWorkspaces = [
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: badges?.messages || 0 },
    { id: 'announcements', label: 'Announcements', icon: Bell, badge: badges?.announcements || 0 },
    { id: 'reports', label: 'Reports', icon: FileBox, badge: badges?.reports || 0 },
    { id: 'priority', label: 'Priority', icon: AlertCircle, badge: badges?.priority || 0 },
    { id: 'archive', label: 'Archive', icon: Archive, badge: 0 },
    { id: 'trash', label: 'Trash', icon: Trash2, badge: 0 },
  ];

  const moreWorkspaces = [
    { id: 'sent', label: 'Sent', icon: Send, badge: 0 },
    { id: 'drafts', label: 'Drafts', icon: PenTool, badge: badges?.drafts || 0 },
  ];

  const renderItem = (item) => {
    const isActive = activeWorkspace === item.id;
    const Icon = item.icon;
    
    return (
      <button
        key={item.id}
        onClick={() => setActiveWorkspace(item.id)}
        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-200 mb-1 ${
          isActive 
            ? 'bg-primary-vibrant text-white shadow-md' 
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`}
      >
        <div className="flex items-center space-x-3">
          <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
          <span className="font-medium text-sm">{item.label}</span>
        </div>
        {item.badge > 0 && (
          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
            isActive ? 'bg-white text-primary-vibrant' : 'bg-primary-vibrant text-white'
          }`}>
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="w-full h-full flex flex-col bg-white border-r border-gray-200 p-4">
      <div className="mb-6 px-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">Workspaces</h2>
      </div>

      <nav className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {mainWorkspaces.map(renderItem)}

        <div className="mt-4">
          <button 
            onClick={() => setShowMore(!showMore)}
            className="w-full flex items-center justify-between px-4 py-2 text-gray-500 hover:text-gray-800 transition-colors"
          >
            <span className="text-sm font-semibold">More</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showMore ? 'rotate-180' : ''}`} />
          </button>
          
          <div className={`overflow-hidden transition-all duration-300 ${showMore ? 'max-h-40 mt-1' : 'max-h-0'}`}>
            {moreWorkspaces.map(renderItem)}
          </div>
        </div>
      </nav>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import SidebarWorkspaces from './components/SidebarWorkspaces';
import MessageCard from './components/MessageCard';
import AnnouncementCard from './components/AnnouncementCard';
import ReportCard from './components/ReportCard';
import MessageViewer from './components/MessageViewer';
import ReportViewer from './components/ReportViewer';
import ComposeModal from './components/ComposeModal';
import { PenSquare } from 'lucide-react';
import axios from 'axios';

export default function CommunicationHub({ role }) {
  const [activeWorkspace, setActiveWorkspace] = useState('messages');
  const [activeItem, setActiveItem] = useState(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [items, setItems] = useState([]);

  // Mock data tailored for Sayansi Yathu context
  useEffect(() => {
    setActiveItem(null); // Reset viewer when workspace shifts
    
    // In production, we'd fetch from /api/chat based on workspace.
    // For now, load contextual mocks structured around the academic theme.
    if (activeWorkspace === 'messages') {
      setItems([
        {
          id: 1, type: 'message', senderName: 'Mr. Tembo', senderRole: 'Teacher',
          subject: 'Form 3 Physics Engagement',
          preview: 'I noticed students are logging fewer Hookes Law experiments this week. We might need to schedule a review session.',
          fullBody: "Good morning,\n\nI reviewed the recent analytics dashboard and noticed a sharp drop-off in students completing the latest Hooke's Law simulation.\n\nCould we meet to discuss potentially simplifying the threshold requirements or reviewing the concepts in class?\n\nRegards,\nMr. Tembo",
          time: '10:30 AM', read: false, tags: ['Physics', 'Urgent'], isStarred: true, hasFile: true
        },
        {
          id: 2, type: 'message', senderName: 'Mrs. Banda', senderRole: 'HOD',
          subject: 'New Chemistry Standards',
          preview: 'ECZ has released an updated rubric for titration grading. Please review the attached audio.',
          fullBody: 'All science staff, ECZ has pushed an update. Listen to the voice note summary.',
          time: 'Yesterday', read: true, tags: ['Chemistry'], hasVoice: true
        }
      ]);
    } else if (activeWorkspace === 'announcements') {
      setItems([
        {
          id: 3, type: 'announcement', title: 'System Maintenance Window',
          preview: 'The Virtual Lab database will be offline for backups tonight at 23:00 CAT.',
          author: 'SysAdmin', date: 'Today, 08:00 AM', typeLabel: 'admin'
        },
        {
          id: 4, type: 'announcement', title: 'Start of Term SBA Submissions',
          preview: 'HODs are reminded that all term 1 SBA reports must be logged via the app.',
          author: 'Head Teacher', date: 'Oct 12', typeLabel: 'urgent'
        }
      ]);
    } else if (activeWorkspace === 'reports') {
      setItems([
        {
          id: 5, type: 'report', teacherName: 'Mr. Tembo', class: 'Form 4B', subject: 'Physics', experiments: 8, date: 'October 2026'
        },
        {
          id: 6, type: 'report', teacherName: 'Miss Kalaba', class: 'Form 2A', subject: 'Biology', experiments: 12, date: 'October 2026'
        }
      ]);
    } else {
      setItems([]);
    }
  }, [activeWorkspace]);

  return (
    <div className="h-full flex flex-col bg-gray-50/50">
      <div className="flex-1 flex overflow-hidden">
        {/* Leftmost nav */}
        <div className="w-64 shrink-0 bg-white shadow-[1px_0_10px_rgba(0,0,0,0.02)] z-10 hidden md:block">
          <SidebarWorkspaces 
             activeWorkspace={activeWorkspace} 
             setActiveWorkspace={setActiveWorkspace} 
             badges={{messages: 1, announcements: 0, reports: 0, priority: 2}}
          />
        </div>

        {/* Middle Panel (List) */}
        <div className="w-full md:w-[350px] shrink-0 border-r border-gray-200 bg-gray-50/30 flex flex-col items-stretch">
          <div className="px-4 py-4 border-b border-gray-200 bg-white/50 backdrop-blur-md sticky top-0 flex justify-between items-center z-10">
            <h2 className="font-bold text-lg text-gray-800 capitalize">{activeWorkspace}</h2>
            <button 
              onClick={() => setIsComposeOpen(true)}
              className="p-2 bg-primary-vibrant text-white rounded-lg shadow-sm hover:shadow-md hover:bg-blue-700 transition-all flex items-center"
            >
              <PenSquare className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {items.length === 0 ? (
              <p className="text-sm text-gray-400 text-center mt-10 font-medium">No items found.</p>
            ) : items.map((item) => {
              if (activeWorkspace === 'messages') {
                return <MessageCard key={item.id} message={item} isSelected={activeItem?.id === item.id} onClick={() => { setActiveItem(item); item.read = true; }} />
              } else if (activeWorkspace === 'announcements') {
                return <AnnouncementCard key={item.id} announcement={{...item, type: item.typeLabel}} isSelected={activeItem?.id === item.id} onClick={() => setActiveItem(item)} />
              } else if (activeWorkspace === 'reports') {
                return <ReportCard key={item.id} report={item} isSelected={activeItem?.id === item.id} onClick={() => setActiveItem(item)} />
              }
              return null;
            })}
          </div>
        </div>

        {/* Right Panel (Viewer) */}
        <div className="flex-1 hidden md:flex min-w-0 bg-white">
          {activeWorkspace === 'reports' ? (
            <ReportViewer activeItem={activeItem} onArchive={() => {}} />
          ) : activeWorkspace === 'announcements' ? (
             <MessageViewer activeItem={{...activeItem, senderName: activeItem?.author || '', senderRole: activeItem?.typeLabel || '', fullBody: activeItem?.preview}} onArchive={() => {}} onTrash={() => {}} />
          ) : (
            <MessageViewer activeItem={activeItem} onArchive={() => {}} onTrash={() => {}} />
          )}
        </div>
      </div>

      <ComposeModal isOpen={isComposeOpen} onClose={() => setIsComposeOpen(false)} />
    </div>
  );
}

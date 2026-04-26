import React, { useState, useEffect, useRef } from 'react';
import { Send, Bell, Megaphone, MessageSquare, Calendar } from 'lucide-react';

const MOCK_MESSAGES = [
  { id: 1, from: 'Mr. Kelvin Chanda', type: 'teacher', message: 'Please complete the pendulum lab report before Friday.', time: '10:42 AM', date: 'Today' },
  { id: 2, from: 'Mrs. Mutale Banda', type: 'teacher', message: 'Your Cell Structure assignment has been graded. Check your feedback!', time: '9:15 AM', date: 'Today' },
  { id: 3, from: 'System', type: 'announcement', message: '📅 Reminder: End of Term Science Fair is scheduled for 2nd May 2026. All students must participate.', time: '8:00 AM', date: 'Today' },
  { id: 4, from: 'Mr. Kelvin Chanda', type: 'teacher', message: 'The new Biology simulations are now available in the Virtual Lab. Explore the Ecosystem module.', time: '3:30 PM', date: 'Yesterday' },
  { id: 5, from: 'System', type: 'announcement', message: '🔬 System Update: 9 new Biology simulations have been added to the Lab Library.', time: '1:00 PM', date: 'Yesterday' },
];

const typeConfig = {
  teacher: { icon: MessageSquare, color: 'bg-blue-50 border-blue-100', iconColor: 'text-blue-500 bg-blue-100' },
  announcement: { icon: Megaphone, color: 'bg-amber-50 border-amber-100', iconColor: 'text-amber-500 bg-amber-100' },
};

function MessageCard({ msg }) {
  const config = typeConfig[msg.type];
  const Icon = config.icon;
  return (
    <div className={`flex space-x-4 p-4 rounded-xl border ${config.color}`}>
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${config.iconColor}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-gray-900">{msg.from}</p>
          <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{msg.date} · {msg.time}</span>
        </div>
        <p className="text-sm text-gray-600 mt-1">{msg.message}</p>
      </div>
    </div>
  );
}

// Notification badge (live polling simulation)
function NotificationBadge({ count }) {
  return count > 0 ? (
    <span className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{count}</span>
  ) : null;
}

export default function Messages() {
  const [tab, setTab] = useState('all');
  const [newMsgCount, setNewMsgCount] = useState(2);
  const [announcementCount, setAnnouncementCount] = useState(1);

  // Simulate real-time notification polling
  useEffect(() => {
    const interval = setInterval(() => {
      // In production, this would call the notifications API
      // For demo, counts stay stable
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const filtered = tab === 'all'
    ? MOCK_MESSAGES
    : MOCK_MESSAGES.filter(m => m.type === tab);

  const groups = filtered.reduce((acc, msg) => {
    if (!acc[msg.date]) acc[msg.date] = [];
    acc[msg.date].push(msg);
    return acc;
  }, {});

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">💬 Messages</h1>
          <p className="text-gray-500 mt-1">Communications from teachers and the school.</p>
        </div>
        <div className="flex items-center space-x-2 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm">
          <Bell className="w-4 h-4" />
          <span>{newMsgCount + announcementCount} new</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2">
        {[
          { key: 'all', label: 'All', count: newMsgCount + announcementCount },
          { key: 'teacher', label: 'Teacher Messages', count: newMsgCount },
          { key: 'announcement', label: 'Announcements', count: announcementCount },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              tab === t.key ? 'bg-primary-vibrant text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {t.label}
            <NotificationBadge count={t.count} />
          </button>
        ))}
      </div>

      {/* Message Groups by Date */}
      {Object.entries(groups).map(([date, msgs]) => (
        <div key={date}>
          <div className="flex items-center space-x-3 mb-3">
            <hr className="flex-1 border-gray-200" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center">
              <Calendar className="w-3 h-3 mr-1" />{date}
            </span>
            <hr className="flex-1 border-gray-200" />
          </div>
          <div className="space-y-3">
            {msgs.map(m => <MessageCard key={m.id} msg={m} />)}
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="font-medium">No messages here yet.</p>
        </div>
      )}

      {/* Coming Soon AI Section */}
      <div className="bg-gradient-to-br from-slate-700 to-slate-900 text-white rounded-2xl p-6 text-center">
        <p className="text-2xl mb-2">🤖</p>
        <h3 className="font-bold text-lg mb-1">Ask Sayansi AI</h3>
        <p className="text-sm text-white/60 mb-3">Your personal AI study assistant is coming soon.</p>
        <span className="px-4 py-1.5 bg-white/10 border border-white/20 text-sm rounded-full font-medium">Coming Soon</span>
      </div>
    </div>
  );
}

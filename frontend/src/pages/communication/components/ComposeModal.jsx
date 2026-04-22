import React, { useState } from 'react';
import { X, Send, Paperclip, Mic } from 'lucide-react';
import axios from 'axios';

export default function ComposeModal({ isOpen, onClose }) {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [recipient, setRecipient] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  if (!isOpen) return null;

  const handleSend = () => {
    // We would hit the backend POST /api/chat/send here
    console.log("Sending:", { recipient, subject, body });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col animate-fade-in-up">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-800">New Academic Correspondence</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4 flex-1">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">To</label>
            <input 
              type="text" 
              className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-primary-vibrant transition-colors text-gray-800"
              placeholder="Select Staff, Role, or Class..."
              value={recipient}
              onChange={e => setRecipient(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 mt-4">Subject</label>
            <input 
              type="text" 
              className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-primary-vibrant transition-colors text-gray-800 font-medium"
              placeholder="e.g., Performance Review - Form 3"
              value={subject}
              onChange={e => setSubject(e.target.value)}
            />
          </div>
          <div className="mt-6">
            <textarea
              className="w-full h-48 border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-primary-vibrant/20 focus:border-primary-vibrant transition-all resize-none text-gray-700"
              placeholder="Write your message here..."
              value={body}
              onChange={e => setBody(e.target.value)}
            ></textarea>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
          <div className="flex space-x-2">
            <button className="p-2 text-gray-500 hover:text-primary-vibrant hover:bg-blue-50 rounded-lg transition-colors">
              <Paperclip className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsRecording(!isRecording)}
              className={`p-2 rounded-lg transition-colors ${isRecording ? 'text-red-500 bg-red-50 animate-pulse' : 'text-gray-500 hover:text-primary-vibrant hover:bg-blue-50'}`}
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={onClose}
              className="px-6 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Save Draft
            </button>
            <button 
              onClick={handleSend}
              disabled={!subject || !body || !recipient}
              className="px-6 py-2 bg-primary-vibrant text-white text-sm font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 flex items-center shadow-lg shadow-blue-500/30 transition-all"
            >
              Send <Send className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

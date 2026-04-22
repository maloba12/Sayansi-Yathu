import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Reply, Archive, Trash2, Mic, Paperclip, CheckCircle2, User, Play, Download } from 'lucide-react';
import axios from 'axios';

export default function MessageViewer({ activeItem, onArchive, onTrash }) {
  const [insight, setInsight] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [replyText, setReplyText] = useState('');
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    if (!activeItem) return;
    
    // Simulate AI insight via existing local tutor or fallback
    setInsight(null);
    setIsTranslating(true);
    
    const fetchInsight = async () => {
      try {
        const query = `Provide a very short 1-sentence insight categorizing the following message subject: ${activeItem.subject}. The message is: ${activeItem.preview}`;
        const res = await axios.post('http://localhost:5000/api/ai/tutor', {
          question: query,
          context: { subject: 'general', level: 'admin' },
          session_id: 'auto_insight_worker'
        });
        if (res.data.response) {
          setInsight(res.data.response);
        } else {
          setInsight("This message relates to recent school activities.");
        }
      } catch (err) {
         setInsight("AI Insights temporarily unavailable offline.");
      } finally {
        setIsTranslating(false);
      }
    };
    
    fetchInsight();
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeItem]);

  if (!activeItem) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50/50 text-gray-400">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <User className="w-8 h-8 text-gray-300" />
        </div>
        <p className="font-medium">Select a conversation or report to view</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white h-full overflow-hidden">
      
      {/* 1. Header & Actions */}
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white z-10 shrink-0">
        <div className="flex space-x-2">
          {activeItem.tags?.map((tag, idx) => (
            <span key={idx} className="bg-primary-vibrant/10 text-primary-vibrant text-xs px-3 py-1 rounded-full font-bold">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex space-x-2">
          <button onClick={onArchive} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-transparent hover:border-indigo-100">
            <Archive className="w-4 h-4" />
          </button>
          <button onClick={onTrash} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Scrollable Thread Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        
        {/* AI Insight Bar */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 shadow-sm flex items-start space-x-3 animate-fade-in-up">
          <div className="p-1.5 bg-blue-100 rounded-lg shrink-0">
            <Sparkles className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h5 className="text-[10px] font-bold uppercase tracking-widest text-blue-800 mb-1">AI Assistant Insight</h5>
            <p className="text-sm text-blue-900 leading-relaxed font-medium">
              {isTranslating ? (
                <span className="flex items-center space-x-1">
                   <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></span>
                   <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                   <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                </span>
              ) : insight}
            </p>
          </div>
        </div>

        {/* The Initial Message */}
        <h2 className="text-2xl font-bold text-gray-900 mt-6">{activeItem.subject}</h2>
        
        <div className="flex items-center justify-between mt-6 pb-6 border-b border-gray-100">
          <div className="flex items-center space-x-4">
             <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600 text-lg border border-gray-200">
               {activeItem.senderName.split(' ').map(n=>n[0]).join('')}
             </div>
             <div>
               <p className="font-bold text-gray-900 flex items-center space-x-2">
                 <span>{activeItem.senderName}</span>
                 <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded uppercase">{activeItem.senderRole}</span>
               </p>
               <p className="text-xs text-gray-500 mt-0.5">To: School Administration</p>
             </div>
          </div>
          <p className="text-xs font-semibold text-gray-400">{activeItem.time}</p>
        </div>

        <div className="text-gray-700 leading-relaxed space-y-4 pt-4 whitespace-pre-wrap text-[15px]">
          {activeItem.fullBody || activeItem.preview}
        </div>

        {/* Media Attachments */}
        {(activeItem.hasVoice || activeItem.hasFile) && (
          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-50">
            {activeItem.hasVoice && (
              <div className="flex items-center space-x-3 bg-gray-50 border border-gray-200 rounded-lg p-3 w-64 hover:border-blue-300 transition-colors cursor-pointer">
                <button className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Play className="w-4 h-4 ml-0.5" />
                </button>
                <div className="flex-1">
                   <div className="h-1.5 bg-gray-200 rounded-full w-full overflow-hidden">
                     <div className="h-full bg-blue-500 w-1/3"></div>
                   </div>
                   <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase">Voice Note (0:45)</p>
                </div>
              </div>
            )}
            
            {activeItem.hasFile && (
              <div className="flex items-center space-x-3 bg-gray-50 border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors cursor-pointer group">
                <div className="p-2 bg-gray-200 text-gray-600 rounded-lg group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                  <Paperclip className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 group-hover:text-blue-700 transition-colors">Lab_Results.pdf</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">1.2 MB PDF</p>
                </div>
                <button className="ml-4 opacity-50 hover:opacity-100">
                  <Download className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            )}
          </div>
        )}
        
        <div ref={endOfMessagesRef} />
      </div>

      {/* 3. Reply Section */}
      <div className="p-4 bg-gray-50 border-t border-gray-200 shrink-0">
        <div className="bg-white border border-gray-300 rounded-2xl shadow-sm focus-within:border-primary-vibrant focus-within:ring-2 focus-within:ring-blue-100 transition-all flex flex-col overflow-hidden">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={`Reply to ${activeItem.senderName.split(' ')[0]}...`}
            className="w-full max-h-32 p-4 text-sm resize-none focus:outline-none"
            rows={1}
            onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
          />
          <div className="px-4 py-3 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
            <div className="flex space-x-1">
               <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"><Paperclip className="w-4 h-4" /></button>
               <button className="p-2 text-gray-400 hover:text-red-500 rounded-lg transition-colors"><Mic className="w-4 h-4" /></button>
            </div>
            <button 
              disabled={!replyText.trim()}
              className="px-4 py-1.5 bg-primary-vibrant text-white text-sm font-bold rounded-lg flex items-center hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              Reply <Reply className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

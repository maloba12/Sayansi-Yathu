import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Mic, Paperclip, File } from 'lucide-react';
import axios from 'axios';

export default function ChatPanel({ isOpen, onClose, currentUserId, role }) {
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
      // Simple polling for new messages every 5 seconds
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/chat/messages?user_id=${currentUserId}`);
      if (res.data.success) {
        setMessages(res.data.messages);
      }
    } catch (e) {
      console.error('Fetch messages error:', e);
    }
  };

  const sendMessage = async (text, mediaUrl = null, fileUrl = null, fileType = null) => {
    if (!text && !mediaUrl && !fileUrl) return;
    
    try {
      await axios.post('http://localhost:5000/api/chat/send', {
        sender_id: currentUserId,
        receiver_id: null, // Broadcast or set specific ID if implementing 1-1
        message_text: text || '',
        role: role,
        media_url: mediaUrl,
        file_url: fileUrl,
        file_type: fileType
      });
      setInputMsg('');
      fetchMessages();
    } catch (e) {
      console.error('Send message error:', e);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('audio', audioBlob, 'voice_note.webm');
        
        try {
          const res = await axios.post('http://localhost:5000/api/chat/upload-audio', formData);
          if (res.data.success) {
            sendMessage('🎤 Voice Note', res.data.url, null, null);
          }
        } catch (e) {
          console.error('Audio upload error:', e);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access denied:", err);
      alert("Microphone access is required for voice notes.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024) {
      alert("File is too large. Max size is 2MB.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:5000/api/chat/upload-file', formData);
      if (res.data.success) {
        sendMessage(`📄 Shared File: ${file.name}`, null, res.data.url, res.data.type);
      }
    } catch (e) {
      console.error('File upload error:', e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl border-l border-gray-200 z-50 flex flex-col">
      <div className="p-4 bg-primary-vibrant text-white flex justify-between items-center">
        <h3 className="font-bold">Collaboration Chat</h3>
        <button onClick={onClose}><X className="w-5 h-5" /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg, i) => {
          const isMe = msg.sender_id === currentUserId;
          return (
            <div key={i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              <span className="text-[10px] text-gray-400 mb-1">{isMe ? 'You' : `User ${msg.sender_id} (${msg.role})`}</span>
              <div className={`p-3 rounded-lg max-w-[80%] ${isMe ? 'bg-primary-vibrant text-white rounded-br-none' : 'bg-white border text-gray-800 rounded-bl-none shadow-sm'}`}>
                {msg.message_text && <p className="text-sm whitespace-pre-wrap">{msg.message_text}</p>}
                
                {msg.media_url && (
                  <audio controls src={`http://localhost:5000${msg.media_url}`} className="max-w-[200px] h-8 mt-2" />
                )}
                
                {msg.file_url && (
                  <a href={`http://localhost:5000${msg.file_url}`} target="_blank" rel="noreferrer" className={`flex items-center space-x-2 mt-2 text-xs p-2 rounded ${isMe ? 'bg-black/10' : 'bg-gray-100 text-primary-vibrant'}`}>
                    <File className="w-4 h-4" />
                    <span className="truncate max-w-[150px]">View Attachment</span>
                  </a>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-200">
        {isRecording && <p className="text-xs text-red-500 mb-2 animate-pulse text-center">Recording voice note...</p>}
        <div className="flex items-center space-x-2">
          {/* File Upload */}
          <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" />
          <button onClick={() => fileInputRef.current.click()} className="p-2 text-gray-500 hover:text-primary-vibrant transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>
          
          <input 
            type="text" 
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-primary-vibrant"
            placeholder="Type message..." 
            value={inputMsg}
            onChange={e => setInputMsg(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && sendMessage(inputMsg)}
          />
          
          <button 
            onMouseDown={startRecording} 
            onMouseUp={stopRecording} 
            onTouchStart={startRecording} 
            onTouchEnd={stopRecording}
            className={`p-2 rounded-full transition-colors ${isRecording ? 'bg-red-500 text-white' : 'text-gray-500 hover:bg-gray-100 mr-1'}`}
            title="Hold to record audio"
          >
            <Mic className="w-5 h-5" />
          </button>

          <button onClick={() => sendMessage(inputMsg)} className="p-2 bg-primary-vibrant text-white rounded-full hover:bg-primary-dark transition-colors">
            <Send className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

// Generate a stable session ID from user_id (if available) or a random fallback.
// This persists for the browser tab lifetime so conversation memory works.
function getSessionId() {
  const stored = localStorage.getItem('user_data');
  if (stored) {
    try {
      const user = JSON.parse(stored);
      if (user.id) return `user_${user.id}`;
    } catch (_) {}
  }
  // Fallback: random id kept in sessionStorage for the browser tab
  let sid = sessionStorage.getItem('ai_session_id');
  if (!sid) {
    sid = `anon_${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem('ai_session_id', sid);
  }
  return sid;
}

const SESSION_ID = getSessionId();

export default function AITutorPanel({ isOpen, onClose, context }) {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hello! I'm your Sayansi AI Science Tutor. How can I help you with this experiment today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('english');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/ai/tutor', {
        question: input,
        context: context || { subject: 'general', level: 'secondary' },
        session_id: SESSION_ID   // enables conversation memory (REC-02)
      });

      let aiResponseText = response.data.response || "I'm sorry, I couldn't process that. Please try again.";

      // Zambian Context Translation Fallback
      if (language !== 'english') {
        try {
          const transRes = await axios.post('http://localhost:5000/api/ai/translate', { text: aiResponseText, language });
          if (transRes.data.success) {
            aiResponseText = transRes.data.translated;
          }
        } catch (error) {
          console.error("Translation error", error);
        }
      }

      const aiResponse = {
        role: 'ai',
        text: aiResponseText
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('AI Tutor Error:', error);
      setMessages(prev => [...prev, {
        role: 'ai',
        text: "Connection error. Please make sure the AI backend is running on port 5000."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear session memory on the backend and reset the local chat
  const handleNewChat = async () => {
    try {
      await axios.post('http://localhost:5000/api/ai/tutor/clear', { session_id: SESSION_ID });
    } catch (_) {}
    setMessages([{
      role: 'ai',
      text: "Hello! I'm your Sayansi AI Science Tutor. How can I help you with this experiment today?"
    }]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          style={{
            position: 'absolute',
            right: 20,
            top: 80,
            bottom: 20,
            width: '320px',
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 40,
            overflow: 'hidden',
            border: '1px solid #e2e8f0',
            backdropFilter: 'blur(10px)'
          }}
        >
          <div style={{
            padding: '16px',
            background: '#3b82f6',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 'bold' }}>🧪 Science AI Tutor</span>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  onClick={handleNewChat}
                  title="Start a new conversation"
                  style={{
                    background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white',
                    cursor: 'pointer', fontSize: '0.7rem', padding: '4px 8px',
                    borderRadius: '6px', fontWeight: '600'
                  }}
                >
                  New Chat
                </button>
                <button
                  onClick={onClose}
                  style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem' }}
                >
                  ✖
                </button>
              </div>
            </div>
            
            {/* Translation Settings */}
            <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.8rem', gap: '8px' }}>
              <span>Language:</span>
              <select 
                 value={language} 
                 onChange={e => setLanguage(e.target.value)}
                 style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', borderRadius: '4px', padding: '2px 4px', fontSize: '0.75rem', outline: 'none' }}
              >
                 <option value="english" style={{color: 'black'}}>English</option>
                 <option value="bemba" style={{color: 'black'}}>Bemba</option>
                 <option value="nyanja" style={{color: 'black'}}>Nyanja</option>
                 <option value="tonga" style={{color: 'black'}}>Tonga</option>
              </select>
            </div>
          </div>


          {/* Messages Area */}
          <div style={{
            flex: 1,
            padding: '16px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                style={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  padding: '10px 14px',
                  borderRadius: '14px',
                  fontSize: '14px',
                  lineHeight: '1.4',
                  background: msg.role === 'user' ? '#3b82f6' : '#f1f5f9',
                  color: msg.role === 'user' ? 'white' : '#1e293b',
                  borderBottomRightRadius: msg.role === 'user' ? '2px' : '14px',
                  borderBottomLeftRadius: msg.role === 'ai' ? '2px' : '14px',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}
              >
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div style={{ alignSelf: 'flex-start', color: '#64748b', fontSize: '12px' }}>
                AI is thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={{
            padding: '16px',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            gap: '8px'
          }}>
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask a question..."
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                outline: 'none',
                fontSize: '14px'
              }}
            />
            <button 
              onClick={handleSend}
              disabled={isLoading}
              style={{
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '0 12px',
                cursor: 'pointer',
                opacity: isLoading ? 0.5 : 1
              }}
            >
              ➤
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

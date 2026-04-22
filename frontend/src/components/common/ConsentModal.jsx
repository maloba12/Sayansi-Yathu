import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';

export default function ConsentModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Check if consent has already been addressed locally
    const handled = localStorage.getItem('privacy_consent_handled');
    
    try {
       const userStr = localStorage.getItem('user_data');
       if (userStr) {
           const user = JSON.parse(userStr);
           setUserId(user.id);
           
           // If logged in and not handled, show modal
           if (!handled) {
               setIsOpen(true);
           }
       }
    } catch(e) {}
  }, []);

  const handleConsent = async (granted) => {
    try {
      if (userId) {
         await axios.post('http://localhost:5000/api/user/consent', {
           user_id: userId,
           consent: granted
         });
      }
      localStorage.setItem('privacy_consent_handled', 'true');
      setIsOpen(false);
    } catch (e) {
      console.error("Failed to register consent.", e);
      // Fallback close so user isn't stuck
      localStorage.setItem('privacy_consent_handled', 'true');
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
            <ShieldAlert className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Data Privacy Consent</h2>
        </div>
        
        <div className="p-8 text-center">
          <p className="text-gray-600 leading-relaxed mb-6">
            Sayansi Yathu is participating in a national analytics pilot with the Ministry of Education.
            To improve science outcomes across Zambia, we collect anonymized interaction data (such as experiments completed).
          </p>
          <p className="text-sm font-bold text-gray-800 mb-8 bg-blue-50 p-4 rounded-xl border border-blue-100">
            We will never share your personal identity, name, or exact location with third parties.
          </p>
          
          <div className="flex flex-col space-y-3">
             <button 
                onClick={() => handleConsent(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center space-x-2"
             >
                <CheckCircle className="w-5 h-5" />
                <span>I Agree to Anonymous Tracking</span>
             </button>
             
             <button 
                onClick={() => handleConsent(false)}
                className="w-full bg-white border-2 border-gray-200 hover:bg-gray-50 text-gray-600 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center space-x-2"
             >
                <XCircle className="w-5 h-5 text-gray-400" />
                <span>Opt-out of Ministry Analytics</span>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}

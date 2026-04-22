import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { queueOfflineRequest } from '../../utils/offlineSync';
import { Microscope, ArrowRight, Lightbulb, CheckCircle2, ChevronRight } from 'lucide-react';

const STAGES = {
  PREPARATION: 'preparation',
  HYPOTHESIS: 'hypothesis',
  EXPERIMENT: 'experiment',
  CONCLUSION: 'conclusion'
};

export default function ExperimentShell({ simType, children }) {
  const [stage, setStage] = useState(STAGES.PREPARATION);
  const [contextData, setContextData] = useState(null);
  
  // Scaffolding inputs
  const [hypothesis, setHypothesis] = useState('');
  const [conclusion, setConclusion] = useState('');
  
  // Feedback
  const [feedback, setFeedback] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [language, setLanguage] = useState('english'); // Multilingual Support

  useEffect(() => {
    fetchContext();
  }, [simType]);

  const fetchContext = async () => {
    try {
      // Direct local fetch for MVP offline mapping
      const res = await axios.get(`http://localhost:5000/api/context/${simType}`);
      if (res.data.success && res.data.data) {
        setContextData(res.data.data);
      } else {
        setContextData({ context: "Standard inquiry-based experiment.", theme: "General Science" });
      }
    } catch (e) {
      console.log("Using fallback context. Server unreachable.");
      setContextData({ context: "Standard inquiry-based experiment. Analyze the physics of the environment.", theme: "General Science" });
    }
  };

  const getTranslatedFeedback = async (text, lang) => {
    if (lang === 'english') return text;
    try {
      setIsTranslating(true);
      const res = await axios.post('http://localhost:5000/api/ai/translate', { text, language: lang });
      return res.data.success ? res.data.translated : text;
    } catch (e) {
      // Offline fallback: use English if translate API is unreachable
      return text;
    } finally {
      setIsTranslating(false);
    }
  };

  const logInteraction = (query, response) => {
    const payload = {
      student_id: 2, // Example fixed student ID for MVP
      experiment_id: simType,
      query: query,
      response: response
    };
    
    // Attempt real-time logging, fail over to offline queue
    axios.post('http://localhost:5000/api/ai/log_interaction', payload)
      .catch((e) => {
        queueOfflineRequest('http://localhost:5000/api/ai/log_interaction', 'POST', payload);
      });
  };

  const handleHypothesisSubmit = async () => {
    // Generate AI response
    const aiResponse = `Great hypothesis! Now conduct the experiment to see if "${hypothesis}" holds true.`;
    const finalResp = await getTranslatedFeedback(aiResponse, language);
    setFeedback(finalResp);
    
    // Log
    logInteraction(`Hypothesis: ${hypothesis}`, aiResponse);
    setStage(STAGES.EXPERIMENT);
  };

  const handleConclusionSubmit = async () => {
    const aiResponse = `Excellent conclusion! You successfully summarized the experiment.`;
    const finalResp = await getTranslatedFeedback(aiResponse, language);
    setFeedback(finalResp);
    
    logInteraction(`Conclusion: ${conclusion}`, aiResponse);
    // Finished state doesn't block experiment, but marks as done
  };

  const translateUI = (text) => {
    // In a full PWA, we'd cache these standard UI labels to local storage.
    return text;
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-gray-50">
      
      {/* HUD Header */}
      <div className="flex-none bg-slate-900 text-white shadow-md z-10 px-6 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Microscope className="w-5 h-5 text-blue-400" />
          <h2 className="font-bold text-lg uppercase tracking-wider">{simType.replace('_', ' ')} LAB</h2>
          
          {/* Progress Indicators */}
          <div className="flex items-center space-x-2 ml-8 text-sm">
            <span className={stage !== STAGES.PREPARATION ? "text-emerald-400" : "text-white"}>Hypothesis</span>
            <ChevronRight className="w-4 h-4 text-gray-500" />
            <span className={stage === STAGES.EXPERIMENT || stage === STAGES.CONCLUSION ? "text-emerald-400" : "text-gray-400"}>Experiment</span>
            <ChevronRight className="w-4 h-4 text-gray-500" />
            <span className={stage === STAGES.CONCLUSION ? "text-emerald-400" : "text-gray-400"}>Conclusion</span>
          </div>
        </div>

        {/* Translation Toggle */}
        <select 
          className="bg-slate-800 border border-slate-700 text-white rounded px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="english">English</option>
          <option value="bemba">Bemba (AI)</option>
          <option value="nyanja">Nyanja (AI)</option>
          <option value="tonga">Tonga (AI)</option>
        </select>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Simulation (Children) */}
        <div className="flex-1 relative border-r border-gray-200">
          {(stage === STAGES.EXPERIMENT || stage === STAGES.CONCLUSION) ? (
             <div className="absolute inset-0 bg-white shadow-inner">
               {children}
             </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-500">
              <Microscope className="w-16 h-16 mb-4 opacity-50" />
              <p>Formulate your hypothesis first to unlock the simulation equipment.</p>
            </div>
          )}
        </div>

        {/* Right Side: Inquiry Scaffolding Panel */}
        <div className="w-96 bg-white overflow-y-auto flex flex-col shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)]">
          {/* Global Context Banner */}
          {contextData && (
            <div className="p-4 bg-amber-50 border-b border-amber-100 text-sm">
              <span className="flex items-center font-bold text-amber-900 mb-2">
                <Lightbulb className="w-4 h-4 mr-2 text-amber-600" /> 
                Zambian Context: {contextData.theme}
              </span>
              <p className="text-amber-800 leading-relaxed">{contextData.context}</p>
            </div>
          )}

          <div className="p-6 flex-1 space-y-6">
            
            {/* Step 1: Hypothesis */}
            {stage === STAGES.PREPARATION && (
              <div className="animate-fade-in-up">
                <h3 className="font-bold text-lg text-gray-900 mb-2 border-b pb-2">1. Formulate Hypothesis</h3>
                <p className="text-sm text-gray-600 mb-4">Based on the local context provided, what do you think will happen during the experiment?</p>
                <textarea 
                  className="w-full border rounded-lg p-3 text-sm min-h-[100px] mb-4 focus:ring-2 focus:ring-primary-vibrant"
                  placeholder="I hypothesize that..."
                  value={hypothesis}
                  onChange={e => setHypothesis(e.target.value)}
                />
                <button 
                  onClick={handleHypothesisSubmit}
                  disabled={!hypothesis.trim()}
                  className="w-full flex items-center justify-center px-4 py-2 bg-primary-vibrant text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 transition-colors"
                >
                  Start Experiment <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            )}

            {/* Step 2: Active Experiment */}
            {(stage === STAGES.EXPERIMENT || stage === STAGES.CONCLUSION) && (
              <>
                <div className="bg-emerald-50 text-emerald-800 p-4 rounded-lg flex items-start text-sm mb-6">
                  <CheckCircle2 className="w-5 h-5 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-bold">Hypothesis Recorded</h4>
                    <p className="italic mt-1">"{hypothesis}"</p>
                  </div>
                </div>

                {stage === STAGES.EXPERIMENT && (
                  <div className="animate-fade-in-up">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 border-b pb-2">2. Analyze & Conclude</h3>
                    <p className="text-sm text-gray-600 mb-4">Interact with the simulation. What did you observe, and was your hypothesis correct?</p>
                    <textarea 
                      className="w-full border rounded-lg p-3 text-sm min-h-[150px] mb-4 focus:ring-2 focus:ring-primary-vibrant"
                      placeholder="My conclusion is..."
                      value={conclusion}
                      onChange={e => setConclusion(e.target.value)}
                    />
                    <button 
                      onClick={handleConclusionSubmit}
                      disabled={!conclusion.trim()}
                      className="w-full flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                    >
                      Submit Findings <CheckCircle2 className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Ongoing AI Feedback Display */}
            {feedback && (
               <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-inner">
                 <h4 className="flex items-center text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                   Virtual Assistant
                 </h4>
                 {isTranslating ? (
                    <div className="animate-pulse flex space-x-2">
                      <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                      <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                      <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                    </div>
                 ) : (
                    <p className="text-sm text-slate-800">{feedback}</p>
                 )}
               </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

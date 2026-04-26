import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Play, 
  BookOpen, 
  HelpCircle, 
  ShieldAlert, 
  ClipboardList,
  GraduationCap,
  ChevronRight,
  Beaker,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { getExperimentById } from '../../data/physicsExperiments';

export default function PhysicsExperimentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const experiment = getExperimentById(id);
  
  const [activeTab, setActiveTab] = useState('overview');

  if (!experiment) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold bg-white p-12 rounded-3xl border border-gray-100 shadow-sm inline-block">
           ⚠️ Experiment Not Found
        </h2>
      </div>
    );
  }

  const startSimulation = () => {
    // Determine the URL based on simType
    // For now, redirect to the 3D index
    window.location.href = `/index_3d.html?type=${experiment.simType}`;
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
      {/* Header & Quick Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <div className="flex items-center space-x-3 mb-1">
               <span className="text-xs font-black text-primary-vibrant uppercase tracking-widest">{experiment.grade} • {experiment.topic}</span>
               <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  experiment.difficulty === 'Beginner' ? 'bg-emerald-100 text-emerald-700' : 
                  experiment.difficulty === 'Intermediate' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
               }`}>
                  {experiment.difficulty}
               </span>
            </div>
            <h1 className="text-4xl font-black text-gray-900 leading-tight">{experiment.title}</h1>
          </div>
        </div>
        
        <button 
          onClick={startSimulation}
          className="flex items-center justify-center space-x-3 px-8 py-4 bg-primary-vibrant text-white rounded-2xl font-black text-lg shadow-xl shadow-primary-vibrant/20 hover:bg-primary-blue hover:-translate-y-1 transition-all"
        >
          <Play className="w-6 h-6 fill-current" />
          <span>Launch Virtual Lab</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 p-1.5 rounded-2xl">
            {[
              { id: 'overview', label: 'Overview', icon: BookOpen },
              { id: 'procedure', label: 'Procedure', icon: ClipboardList },
              { id: 'safety', label: 'Safety', icon: ShieldAlert },
              { id: 'quiz', label: 'Quiz Me', icon: HelpCircle },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab.id 
                    ? 'bg-white text-primary-vibrant shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-primary-vibrant' : 'text-gray-400'}`} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 min-h-[400px]">
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <section>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                    <Beaker className="w-5 h-5 mr-3 text-primary-vibrant" />
                    Objective
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg italic">
                    "{experiment.objective}"
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                    <CheckCircle2 className="w-5 h-5 mr-3 text-emerald-500" />
                    Expected Outcome
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {experiment.expectedOutcome}
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                    <ClipboardList className="w-5 h-5 mr-3 text-indigo-500" />
                    Apparatus / Materials
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {experiment.apparatus.split(', ').map((item, idx) => (
                      <li key={idx} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl border border-gray-100 text-sm font-semibold text-gray-700">
                         <div className="w-2 h-2 rounded-full bg-indigo-400 shrink-0" />
                         <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            )}

            {activeTab === 'procedure' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Activity className="w-6 h-6 mr-3 text-primary-vibrant" />
                  Step-by-Step Procedure
                </h3>
                <div className="space-y-4">
                  {experiment.procedure.split('\n').map((step, idx) => (
                    <div key={idx} className="flex space-x-4 p-5 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-primary-vibrant/30 transition-colors">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xs font-black text-primary-vibrant shadow-sm group-hover:scale-110 transition-transform">
                        {idx + 1}
                      </span>
                      <p className="text-gray-700 font-medium pt-1">{step.replace(/^\d+\.\s*/, '')}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'safety' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex items-start space-x-4">
                  <ShieldAlert className="w-10 h-10 text-red-500 shrink-0" />
                  <div>
                    <h3 className="text-lg font-bold text-red-900 mb-1">Safety First</h3>
                    <p className="text-red-700 text-sm">Please follow these precautions carefully both in the virtual lab and especially in a real-world setting.</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {experiment.safety.map((rule, idx) => (
                    <div key={idx} className="flex items-center space-x-4 p-4 border border-gray-100 rounded-2xl hover:bg-red-50/30 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                         <AlertCircle className="w-5 h-5 text-orange-600" />
                      </div>
                      <p className="text-gray-700 font-bold text-sm">{rule}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'quiz' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="text-center space-y-4 py-12">
                   <div className="w-20 h-20 bg-primary-vibrant/10 rounded-full flex items-center justify-center mx-auto">
                      <GraduationCap className="w-10 h-10 text-primary-vibrant" />
                   </div>
                   <h3 className="text-2xl font-black text-gray-900">Knowledge Check</h3>
                   <p className="text-gray-500 max-w-sm mx-auto">Test your understanding of {experiment.title} before or after the experiment.</p>
                   <button className="px-8 py-3 bg-primary-vibrant text-white rounded-xl font-bold shadow-lg hover:shadow-primary-vibrant/40 transition-all">
                      Start Quiz
                   </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar / Teacher Notes / Viva */}
        <div className="space-y-8">
          {/* Teacher Info Card */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-vibrant/5 rounded-full -mr-16 -mt-16" />
            <div className="relative">
              <h4 className="text-sm font-black text-primary-dark uppercase tracking-widest mb-4 flex items-center">
                <GraduationCap className="w-4 h-4 mr-2" /> Teacher Notes
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100">
                {experiment.teacherNotes}
              </p>
            </div>
          </div>

          {/* Viva Questions Card */}
          <div className="bg-slate-900 rounded-3xl p-6 text-white overflow-hidden relative">
             <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24 blur-3xl" />
             <div className="relative">
                <h4 className="text-sm font-black text-indigo-400 uppercase tracking-widest mb-4 flex items-center">
                  <HelpCircle className="w-4 h-4 mr-2" /> Viva Preparation
                </h4>
                <div className="space-y-4">
                  {experiment.vivaQuestions.map((q, idx) => (
                    <div key={idx} className="flex space-x-3 group cursor-help">
                       <ChevronRight className="w-4 h-4 text-indigo-500 mt-1 shrink-0 group-hover:translate-x-1 transition-transform" />
                       <p className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{q}</p>
                    </div>
                  ))}
                </div>
             </div>
          </div>

          {/* Stats Link */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 text-center">
             <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Performance Data</p>
             <button 
               onClick={() => navigate('/student/progress')}
               className="w-full py-3 border-2 border-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-50 hover:text-primary-vibrant hover:border-primary-vibrant/20 transition-all text-sm"
             >
                View Mastery Analysis
             </button>
          </div>
        </div>
      </div>

      <div className="text-center pt-8">
        <p className="text-xs text-gray-400 font-medium">Sayansi Yathu • Virtual Lab • {experiment.id} • Zambian Secondary Curriculum</p>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  BookOpen, 
  FlaskConical, 
  Play, 
  FileText,
  Target,
  Trophy,
  Zap,
  MoreHorizontal
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const SUBJECTS = [
  {
    id: 'physics',
    name: 'Physics',
    color: 'from-violet-500 to-purple-600',
    icon: '⚛️',
    description: 'The study of matter, motion, energy, and force through space and time.',
    topics: [
      { name: 'Measurements & Scientific Method', done: true },
      { name: 'Forces & Motion', done: true },
      { name: 'Pressure & Density', done: false },
      { name: 'Simple Machines', done: false },
    ],
    experiments: ['Pendulum Motion', 'Hooke\'s Law', 'Free Fall'],
    materials: ['Introduction to Physics (PDF)', 'Measurement Techniques (Video)'],
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    color: 'from-amber-500 to-orange-600',
    icon: '🧪',
    description: 'Investigation of substances, their properties, and how they react with each other.',
    topics: [
      { name: 'Lab Safety & Apparatus', done: true },
      { name: 'States of Matter', done: true },
      { name: 'Separation Techniques', done: false },
      { name: 'Acids & Bases', done: false },
    ],
    experiments: ['Titration', 'Crystallisation', 'CO₂ Test'],
    materials: ['Lab Safety Guide (PDF)', 'Periodic Table (Reference)'],
  },
  {
    id: 'biology',
    name: 'Biology',
    color: 'from-emerald-500 to-green-600',
    icon: '🧬',
    description: 'Scientific study of life and living organisms, their structure and function.',
    topics: [
      { name: 'Living Things & Their Characteristics', done: true },
      { name: 'Cell Structure & Function', done: true },
      { name: 'Nutrition & Digestion', done: false },
      { name: 'Ecosystems', done: false },
    ],
    experiments: ['Microscope Use', 'Cell Types', 'Soil Composition'],
    materials: ['Cell Biology Notes (PDF)', 'Ecosystem Overview (Video)'],
  },
];

function SubjectCard({ subject }) {
  const [expanded, setExpanded] = useState(false);
  const progress = Math.round((subject.topics.filter(t => t.done).length / subject.topics.length) * 100);

  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden transition-all duration-500 hover:shadow-premium group">
      {/* Header */}
      <div className={`bg-gradient-to-br ${subject.color} p-8 text-white relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl opacity-50 transition-transform duration-1000 group-hover:scale-125" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center space-x-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-4xl shadow-inner border border-white/20">
               {subject.icon}
            </div>
            <div>
              <h3 className="text-3xl font-black italic tracking-tight">{subject.name}</h3>
              <p className="text-white/70 text-sm font-medium mt-1 max-w-sm line-clamp-1">{subject.description}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-8 w-full md:w-auto">
             <div className="flex-1 md:flex-none">
                <div className="flex justify-between items-center mb-2">
                   <p className="text-[10px] font-black uppercase tracking-widest text-white/60">Syllabus Progress</p>
                   <p className="text-xs font-black">{progress}%</p>
                </div>
                <div className="h-2 w-full md:w-48 bg-white/20 rounded-full overflow-hidden">
                   <div className="h-full bg-white rounded-full" style={{ width: `${progress}%` }} />
                </div>
             </div>
             <button 
               onClick={() => setExpanded(!expanded)} 
               className="bg-white/10 hover:bg-white text-white hover:text-slate-900 rounded-full p-4 transition-all active:scale-95 border border-white/10"
             >
               {expanded ? <ChevronDown className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
             </button>
          </div>
        </div>
      </div>

      {/* Expandable Body */}
      {expanded && (
        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-10 bg-white animate-in slide-in-from-top-4 duration-500">
          {/* Topics */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
               <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center">
                 <BookOpen className="w-4 h-4 mr-2 text-primary-vibrant" /> Syllabus Topics
               </h4>
               <span className="text-[10px] font-bold text-gray-300">CURRICULUM v2.1</span>
            </div>
            <div className="space-y-3">
              {subject.topics.map(t => (
                <div key={t.name} className="flex items-center p-3 rounded-xl bg-gray-50/50 border border-transparent hover:border-gray-100 hover:bg-white transition-all group/topic cursor-default">
                  <div className={`w-3 h-3 rounded-full mr-4 flex-shrink-0 transition-transform group-hover/topic:scale-125 ${t.done ? 'bg-emerald-500 shadow-lg shadow-emerald-200' : 'bg-gray-200'}`} />
                  <span className={`text-sm font-bold ${t.done ? 'text-gray-900' : 'text-gray-400'}`}>{t.name}</span>
                  {t.done && <Zap className="w-3 h-3 text-amber-500 ml-auto opacity-0 group-hover/topic:opacity-100 transition-opacity" />}
                </div>
              ))}
            </div>
          </div>

          {/* Experiments */}
          <div className="space-y-6 lg:border-x lg:border-gray-100 lg:px-10">
            <div className="flex items-center justify-between">
               <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center">
                 <FlaskConical className="w-4 h-4 mr-2 text-primary-vibrant" /> Virtual Experiments
               </h4>
               <span className="text-[10px] font-bold text-emerald-500">READY TO LAUNCH</span>
            </div>
            <div className="space-y-3">
              {subject.experiments.map(e => (
                <NavLink 
                  key={e} 
                  to="/student/lab" 
                  className="flex items-center p-3 rounded-xl border border-gray-100 hover:border-primary-vibrant hover:shadow-sm transition-all group/exp"
                >
                  <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center mr-4 group-hover/exp:bg-primary-vibrant/10 transition-colors">
                     <Play className="w-3 h-3 text-gray-400 group-hover/exp:text-primary-vibrant group-hover/exp:fill-current" />
                  </div>
                  <span className="text-sm font-bold text-gray-700">{e}</span>
                </NavLink>
              ))}
            </div>
          </div>

          {/* Materials */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
               <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center">
                 <FileText className="w-4 h-4 mr-2 text-primary-vibrant" /> Learning Resources
               </h4>
               <button className="text-gray-300 hover:text-gray-500 transition-colors"><MoreHorizontal className="w-4 h-4" /></button>
            </div>
            <div className="space-y-3">
              {subject.materials.map(m => (
                <div key={m} className="flex items-center p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-slate-900 hover:text-white transition-all group/item">
                  <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center mr-4 text-gray-500 group-hover/item:bg-white/10 group-hover/item:text-white transition-colors">
                     <FileText className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold truncate">{m}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MySubjects() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
           <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 bg-primary-vibrant/10 text-primary-vibrant text-[10px] font-black uppercase tracking-widest rounded">Academic Center</span>
           </div>
           <h1 className="text-4xl font-black text-gray-900 tracking-tight italic">My Subjects</h1>
           <p className="text-gray-500 font-medium">Tracking {SUBJECTS.length} active curricula and experiments.</p>
        </div>
        
        <div className="flex items-center space-x-4 bg-white border border-gray-100 p-4 rounded-3xl shadow-sm">
           <div className="bg-emerald-50 p-3 rounded-2xl">
              <Target className="w-6 h-6 text-emerald-500" />
           </div>
           <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Overall Goals</p>
              <p className="text-lg font-black text-gray-900">7/12 Topics Done</p>
           </div>
        </div>
      </div>

      <div className="space-y-8">
        {SUBJECTS.map(subject => (
          <SubjectCard key={subject.id} subject={subject} />
        ))}
      </div>
      
      {/* Footer Achievement Hint */}
      <div className="bg-amber-50 border border-amber-100 rounded-3xl p-8 flex items-center space-x-6">
         <div className="w-14 h-14 bg-amber-400 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-200">
            <Trophy className="w-7 h-7 text-white" />
         </div>
         <div>
            <h4 className="text-lg font-black text-amber-900 italic">Unlock "Science Master" Badge</h4>
            <p className="text-amber-700 text-sm font-medium">Complete 3 more topics in Biology to reach the next milestone!</p>
         </div>
      </div>
    </div>
  );
}

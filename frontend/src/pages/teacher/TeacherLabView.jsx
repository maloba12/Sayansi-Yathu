import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ArrowLeft, 
  FlaskConical, 
  PlusCircle, 
  Eye, 
  GraduationCap,
  ClipboardCheck,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ExperimentCard from '../../components/common/ExperimentCard';
import { PHYSICS_EXPERIMENTS, TOPICS_BY_GRADE } from '../../data/physicsExperiments';

export default function TeacherLabView() {
  const navigate = useNavigate();
  const [activeGrade, setActiveGrade] = useState('Grade 10');
  const [activeTopic, setActiveTopic] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLabs = PHYSICS_EXPERIMENTS.filter(lab => {
    const matchGrade = lab.grade === activeGrade;
    const matchTopic = activeTopic === 'All' || lab.topic === activeTopic;
    const matchSearch = lab.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchGrade && matchTopic && matchSearch;
  });

  const topics = TOPICS_BY_GRADE[activeGrade] || ['All'];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <div className="flex items-center space-x-2 mb-1">
              <span className="px-2 py-0.5 bg-primary-vibrant/10 text-primary-vibrant text-[10px] font-black uppercase tracking-widest rounded">Curriculum Manager</span>
           </div>
           <h1 className="text-4xl font-black text-gray-900 tracking-tight italic">Virtual Lab Library</h1>
           <p className="text-gray-500 font-medium">Review, preview, and assign virtual practicals to your students.</p>
        </div>
        <div className="flex items-center space-x-3">
           <button className="px-6 py-3 bg-white border border-gray-100 text-gray-600 font-black uppercase tracking-widest text-xs rounded-2xl shadow-sm hover:bg-gray-50 transition-all">
              Manage Classes
           </button>
           <button className="px-6 py-3 bg-primary-vibrant text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-primary-vibrant/20 hover:-translate-y-1 transition-all">
              Assign All Grade {activeGrade.split(' ')[1]}
           </button>
        </div>
      </div>

      {/* Grade & Topic Controls */}
      <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-8">
        <div className="flex flex-wrap gap-4">
          {['Grade 10', 'Grade 11', 'Grade 12'].map(grade => (
            <button
              key={grade}
              onClick={() => { setActiveGrade(grade); setActiveTopic('All'); }}
              className={`px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${
                activeGrade === grade 
                  ? 'bg-primary-dark text-white shadow-2xl shadow-primary-dark/30' 
                  : 'bg-gray-50 text-gray-400 hover:bg-gray-100 border border-transparent hover:border-gray-200'
              }`}
            >
              {grade}
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
           <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
              <input 
                type="text" 
                placeholder="Search experiments by title or concept..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary-vibrant"
              />
           </div>
           <div className="flex flex-wrap items-center gap-3">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">Topic Filter:</span>
              {topics.map(topic => (
                <button
                  key={topic}
                  onClick={() => setActiveTopic(topic)}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    activeTopic === topic 
                      ? 'bg-primary-vibrant text-white shadow-lg shadow-primary-vibrant/20' 
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {topic}
                </button>
              ))}
           </div>
        </div>
      </div>

      {/* Experiment List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredLabs.map((lab) => (
          <ExperimentCard 
            key={lab.id} 
            experiment={lab} 
            onStart={() => navigate(`/student/lab/physics/experiment/${lab.id}`)}
            onPreview={() => navigate(`/student/lab/physics/experiment/${lab.id}`)}
          />
        ))}
        {filteredLabs.length === 0 && (
          <div className="col-span-full py-20 text-center">
             <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-gray-200">
                <FlaskConical className="w-8 h-8 text-gray-300" />
             </div>
             <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No experiments match your search criteria</p>
          </div>
        )}
      </div>

      {/* Curriculum Summary Notification */}
      <div className="bg-slate-900 text-white rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 w-96 h-96 bg-primary-vibrant/10 rounded-full -mr-48 -mt-48 blur-3xl opacity-50" />
         <div className="relative flex items-center space-x-8">
            <div className="w-20 h-20 bg-white/5 backdrop-blur-md rounded-[1.5rem] flex items-center justify-center border border-white/10 shadow-inner">
               <BookOpen className="w-10 h-10 text-primary-vibrant" />
            </div>
            <div>
               <h3 className="text-3xl font-black italic tracking-tight">Academic Integrity & Alignment</h3>
               <p className="text-slate-400 mt-2 max-w-xl leading-relaxed text-sm">
                  These virtual practicals are 100% aligned with the Zambian Secondary School Curriculum (Grades 10–12). Assigning these allows for AI-driven tracking of student mastery across all science core competencies.
               </p>
            </div>
         </div>
         <button className="relative z-10 px-8 py-4 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all">
            Download Curriculum Map
         </button>
      </div>
    </div>
  );
}

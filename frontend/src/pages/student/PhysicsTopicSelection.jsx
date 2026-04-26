import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  ArrowLeft, 
  Play, 
  Info, 
  HelpCircle, 
  GraduationCap,
  FlaskConical,
  Activity,
  History,
  Trophy
} from 'lucide-react';
import ExperimentCard from '../../components/common/ExperimentCard';
import { 
  PHYSICS_EXPERIMENTS, 
  TOPICS_BY_GRADE, 
  DIFFICULTIES 
} from '../../data/physicsExperiments';

export default function PhysicsTopicSelection() {
  const { grade } = useParams();
  const navigate = useNavigate();
  const formattedGrade = grade.replace('Grade', 'Grade ');
  
  const [activeTopic, setActiveTopic] = useState('All');
  const [activeDifficulty, setActiveDifficulty] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const gradeTopics = TOPICS_BY_GRADE[formattedGrade] || ['All'];

  const filteredExperiments = useMemo(() => {
    return PHYSICS_EXPERIMENTS.filter(exp => {
      const matchGrade = exp.grade === formattedGrade;
      const matchTopic = activeTopic === 'All' || exp.topic === activeTopic || exp.topic_group === activeTopic;
      const matchDifficulty = activeDifficulty === 'All' || exp.difficulty === activeDifficulty;
      const matchSearch = exp.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          exp.topic.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchGrade && matchTopic && matchDifficulty && matchSearch;
    });
  }, [formattedGrade, activeTopic, activeDifficulty, searchQuery]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/student/lab/physics')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{formattedGrade} Physics Library</h1>
            <p className="text-gray-500 mt-1">Found {filteredExperiments.length} experiments and simulations.</p>
          </div>
        </div>
        
        {/* Quick Stats/History Hint */}
        <div className="hidden md:flex items-center space-x-6 text-primary-dark">
           <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Your Mastery</p>
              <p className="text-xl font-black">74%</p>
           </div>
           <div className="w-12 h-12 rounded-2xl bg-primary-vibrant/10 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-primary-vibrant" />
           </div>
        </div>
      </div>

      {/* Control Bar: Search & Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text"
            placeholder="Search experiment title or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary-vibrant outline-none"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <select 
            value={activeTopic}
            onChange={(e) => setActiveTopic(e.target.value)}
            className="px-4 py-3 bg-gray-100 border-none rounded-2xl text-xs font-black text-gray-600 outline-none focus:ring-2 focus:ring-primary-vibrant"
          >
            {gradeTopics.map(topic => (
              <option key={topic} value={topic}>{topic}</option>
            ))}
          </select>

          <select 
            value={activeDifficulty}
            onChange={(e) => setActiveDifficulty(e.target.value)}
            className="px-4 py-3 bg-gray-100 border-none rounded-2xl text-xs font-black text-gray-600 outline-none focus:ring-2 focus:ring-primary-vibrant"
          >
            {DIFFICULTIES.map(diff => (
              <option key={diff} value={diff}>{diff}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Experiments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredExperiments.map((exp) => (
          <ExperimentCard 
            key={exp.id} 
            experiment={exp} 
            onStart={() => navigate(`/student/lab/physics/experiment/${exp.id}`)}
            onPreview={() => navigate(`/student/lab/physics/experiment/${exp.id}`)}
          />
        ))}

        {filteredExperiments.length === 0 && (
          <div className="col-span-full py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
              <FlaskConical className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No experiments found</h3>
            <p className="text-sm text-gray-500 max-w-xs mt-1">
              Try adjusting your filters or search query to find what you're looking for.
            </p>
            <button 
              onClick={() => { setActiveTopic('All'); setActiveDifficulty('All'); setSearchQuery(''); }}
              className="mt-6 text-primary-vibrant font-bold text-sm hover:underline"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>

      <div className="pt-8 flex flex-col md:flex-row items-center justify-between border-t border-gray-100 gap-4">
        <p className="text-xs text-gray-400 font-medium">Virtual Lab • Physics • {formattedGrade} • Experiment Library</p>
        <div className="flex items-center space-x-4">
           <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider underline underline-offset-4 decoration-emerald-500/30">System Ready</span>
           </div>
           <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-primary-vibrant"></span>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider underline underline-offset-4 decoration-primary-vibrant/30">Zambian Curriculum Aligned</span>
           </div>
        </div>
      </div>
    </div>
  );
}

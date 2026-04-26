import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  MoreVertical, 
  FlaskConical, 
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  FileText
} from 'lucide-react';
import axios from 'axios';

export default function AdminLabManagement() {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchLabs();
  }, []);

  const fetchLabs = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/simulations/list.php');
      if (response.data && response.data.success) {
        setLabs(response.data.simulations);
      }
    } catch (error) {
      console.error('Failed to fetch simulations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLabs = labs.filter(lab => {
    const matchFilter = filter === 'All' || lab.subject.toLowerCase() === filter.toLowerCase();
    const matchSearch = lab.title.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Virtual Lab Management</h1>
          <p className="text-gray-500 mt-1">Add, edit, or configure interactive simulations and experiments.</p>
        </div>
        <button className="flex items-center justify-center space-x-2 px-6 py-3 bg-primary-vibrant text-white rounded-xl font-bold shadow-lg shadow-primary-vibrant/20 hover:bg-primary-blue hover:-translate-y-0.5 transition-all">
          <Plus className="w-5 h-5" />
          <span>Add New Experiment</span>
        </button>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search experiments..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-vibrant outline-none"
          />
        </div>
        <div className="flex items-center space-x-2">
          {['All', 'Physics', 'Chemistry', 'Biology'].map(subj => (
            <button
              key={subj}
              onClick={() => setFilter(subj)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                filter === subj 
                  ? 'bg-primary-dark text-white shadow-md' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {subj}
            </button>
          ))}
        </div>
      </div>

      {/* Lab List Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Experiment</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Subject</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Grade</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Difficulty</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Type</th>
                <th className="px-6 py-4 text-center text-xs font-black text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredLabs.map((lab) => (
                <tr key={lab.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-primary-vibrant/10 group-hover:text-primary-vibrant transition-colors">
                        <FlaskConical className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-gray-900 line-clamp-1">{lab.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 capitalize font-semibold text-gray-600">{lab.subject}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-500">{lab.grade_or_form}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-tight ${
                      lab.difficulty_level === 'beginner' ? 'bg-emerald-100 text-emerald-700' : 
                      lab.difficulty_level === 'intermediate' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {lab.difficulty_level}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-gray-400 font-mono">{lab.simulation_type}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                       <button className="p-2 text-gray-400 hover:text-primary-vibrant hover:bg-white rounded-lg transition-all shadow-sm">
                          <Edit2 className="w-4 h-4" />
                       </button>
                       <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg transition-all shadow-sm">
                          <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredLabs.length === 0 && !loading && (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center text-gray-400 font-medium italic">
                     No experiments matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Integrity Notification */}
      <div className="bg-amber-50 border-2 border-amber-100 rounded-2xl p-6 flex items-start space-x-4">
         <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6 text-amber-600" />
         </div>
         <div>
            <h3 className="font-bold text-amber-900">Lab Data Consistency</h3>
            <p className="text-sm text-amber-800 mt-1 max-w-2xl leading-relaxed">
               Modifying experiment identifiers or simulation types may break existing classroom assignments and student progress records. Always verify simulation package availability before deploying updates.
            </p>
         </div>
         <div className="ml-auto flex items-center space-x-3 self-center">
            <button className="px-4 py-2 bg-white border border-amber-200 text-amber-700 font-bold rounded-lg text-xs hover:bg-amber-100 transition-all">
               Run Health Check
            </button>
         </div>
      </div>
    </div>
  );
}

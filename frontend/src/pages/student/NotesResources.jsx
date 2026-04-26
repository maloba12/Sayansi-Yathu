import React, { useState } from 'react';
import { FileDown, Search, StickyNote, BookOpen, Video, Lock, PencilLine } from 'lucide-react';

const RESOURCES = [
  { id: 1, title: 'Introduction to Physics – Form 1', type: 'pdf', subject: 'Physics', size: '2.4 MB', uploaded: '2026-03-12' },
  { id: 2, title: 'Periodic Table Reference Sheet', type: 'pdf', subject: 'Chemistry', size: '1.1 MB', uploaded: '2026-03-15' },
  { id: 3, title: 'Cell Biology Overview', type: 'video', subject: 'Biology', size: null, uploaded: '2026-03-20' },
  { id: 4, title: 'Lab Safety & Apparatus Guide', type: 'pdf', subject: 'Chemistry', size: '3.2 MB', uploaded: '2026-04-01' },
  { id: 5, title: 'Pendulum Experiment Notes', type: 'pdf', subject: 'Physics', size: '0.8 MB', uploaded: '2026-04-05' },
  { id: 6, title: 'Ecosystem Dynamics Video Lesson', type: 'video', subject: 'Biology', size: null, uploaded: '2026-04-10' },
];

const subjectColors = {
  Physics: 'bg-purple-100 text-purple-800',
  Chemistry: 'bg-amber-100 text-amber-800',
  Biology: 'bg-emerald-100 text-emerald-800',
};

export default function NotesResources() {
  const [search, setSearch] = useState('');
  const [filterSubject, setFilterSubject] = useState('All');
  const [personalNotes, setPersonalNotes] = useState('');

  const filtered = RESOURCES.filter(r =>
    (filterSubject === 'All' || r.subject === filterSubject) &&
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">📒 Notes & Resources</h1>
        <p className="text-gray-500 mt-1">Download materials, watch lessons, and keep personal notes.</p>
      </div>

      {/* Teacher Materials */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <BookOpen className="w-5 h-5 mr-2 text-primary-vibrant" /> Teacher Materials
        </h2>

        {/* Search & Filter */}
        <div className="flex flex-wrap gap-3 mb-5">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search materials..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-vibrant outline-none"
            />
          </div>
          <div className="flex space-x-2">
            {['All', 'Physics', 'Chemistry', 'Biology'].map(s => (
              <button
                key={s}
                onClick={() => setFilterSubject(s)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterSubject === s ? 'bg-primary-vibrant text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map(res => (
            <div key={res.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${res.type === 'pdf' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                  {res.type === 'pdf' ? <FileDown className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{res.title}</p>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${subjectColors[res.subject]}`}>{res.subject}</span>
                    {res.size && <span className="text-xs text-gray-400">{res.size}</span>}
                  </div>
                </div>
              </div>
              <button className="text-primary-vibrant hover:text-primary-blue">
                {res.type === 'pdf' ? <FileDown className="w-5 h-5" /> : <Video className="w-5 h-5" />}
              </button>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-2 text-center text-gray-400 py-8">No materials found.</p>
          )}
        </div>
      </div>

      {/* Personal Notes */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <PencilLine className="w-5 h-5 mr-2 text-amber-500" /> My Personal Notes
        </h2>
        <p className="text-sm text-gray-500 mb-3">Write your own study notes here. They are saved automatically to your browser.</p>
        <textarea
          value={personalNotes}
          onChange={e => setPersonalNotes(e.target.value)}
          placeholder="Start typing your notes..."
          className="w-full h-48 p-4 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-vibrant resize-none leading-relaxed"
        />
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-gray-400">{personalNotes.length} characters</p>
          <button
            onClick={() => localStorage.setItem('student_personal_notes', personalNotes)}
            className="text-sm font-semibold text-primary-vibrant hover:underline"
          >
            Save Notes
          </button>
        </div>
      </div>
    </div>
  );
}

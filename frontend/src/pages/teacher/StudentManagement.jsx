import React from 'react';
import { Search, GraduationCap, Filter, ExternalLink } from 'lucide-react';

export default function StudentManagement() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <GraduationCap className="w-8 h-8 mr-3 text-primary-vibrant" />
            Student Management
          </h1>
          <p className="text-gray-500 mt-2">View and manage students across your assigned classes.</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name or ID..." 
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-vibrant outline-none min-w-[240px]"
            />
          </div>
          <button className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-4">Full Name</th>
              <th className="px-6 py-4">Student ID</th>
              <th className="px-6 py-4">Class</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Last Activity</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 italic">
            {[
              { name: 'Chanda Mwansa', id: 'SY-2026-0042', class: 'Grade 10A', status: 'Active', activity: '2h ago' },
              { name: 'Mwila Banda', id: 'SY-2026-0158', class: 'Grade 10A', status: 'Active', activity: '12m ago' },
              { name: 'John Tembo', id: 'SY-2026-0012', class: 'Grade 11B', status: 'Active', activity: '5m ago' }
            ].map((student) => (
              <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{student.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{student.class}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">{student.status}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.activity}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="text-primary-vibrant hover:text-primary-blue text-sm font-semibold flex items-center">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Profile
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Search, Filter, MoreVertical, Edit, Trash2 } from 'lucide-react';

const mockUsers = [
  { id: 1, name: 'Chanda Bwalya', role: 'Student', email: 'chanda@example.com', status: 'Active', joined: '2025-01-15' },
  { id: 2, name: 'Kondwani Phiri', role: 'Teacher', email: 'kondwani@example.com', status: 'Active', joined: '2024-11-02' },
  { id: 3, name: 'Mutinta Moomba', role: 'Admin', email: 'mutinta@example.com', status: 'Active', joined: '2023-08-10' },
  { id: 4, name: 'Lubasi Musonda', role: 'Student', email: 'lubasi@example.com', status: 'Inactive', joined: '2025-02-01' },
];

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 mt-1">Manage platform users, roles, and access.</p>
        </div>
        <button className="btn-premium">
          + Add New User
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center">
        <div className="relative w-96">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="w-5 h-5 text-gray-400" />
          </span>
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-light transition-all"
          />
        </div>
        <button className="flex items-center text-gray-600 hover:text-primary-vibrant border border-gray-200 px-4 py-2 rounded-lg bg-gray-50 transition-colors">
          <Filter className="w-4 h-4 mr-2" /> Filters
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-primary-vibrant/10 flex items-center justify-center text-primary-vibrant font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${user.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 
                      user.role === 'Teacher' ? 'bg-blue-100 text-blue-800' : 
                      'bg-gray-100 text-gray-800'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${user.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.joined}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-primary-vibrant hover:text-primary-blue mr-3"><Edit className="w-4 h-4 inline" /></button>
                  <button className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4 inline" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
